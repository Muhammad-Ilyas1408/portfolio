import json
import logging
import re
import time
from collections.abc import Callable, Iterator
from typing import Any

import pytest
from fastapi.testclient import TestClient

from app.request_id import RequestIdFilter
from app.services import mailer as mailer_service
from app.services.mailer import build_email
from tests.conftest import VALID, FakeMailer


def post(client: TestClient, **changes: Any) -> Any:
    return client.post("/contact", json={**VALID, **changes})


# --- success -------------------------------------------------------------------------


def test_valid_submission_sends_exactly_one_escaped_email(
    client: TestClient, mailer: FakeMailer
) -> None:
    response = post(
        client,
        name="Ada <b>Lovelace</b>",
        message="<script>alert('x')</script> & a long enough message body.",
    )

    assert response.status_code == 202
    assert response.json() == {"ok": True}
    assert len(mailer.sent) == 1

    email = build_email(mailer.sent[0])
    assert email.reply_to == "ada@example.com"
    assert email.subject == "Portfolio contact: job — Ada <b>Lovelace</b>"
    assert "<script>" not in email.html
    assert "<b>Lovelace" not in email.html
    assert "&lt;script&gt;alert(&#x27;x&#x27;)&lt;/script&gt; &amp; a long" in email.html
    assert "Ada &lt;b&gt;Lovelace&lt;/b&gt;" in email.html
    assert "<script>alert('x')</script>" in email.text


def test_whitespace_is_trimmed(client: TestClient, mailer: FakeMailer) -> None:
    response = post(client, name="  Ada  ", email=" ada@example.com ", message=f"  {'m' * 20}  ")

    assert response.status_code == 202
    sent = mailer.sent[0]
    assert (sent.name, sent.email, sent.message) == ("Ada", "ada@example.com", "m" * 20)


def test_every_reason_is_accepted(make_client: Callable[..., TestClient]) -> None:
    client = make_client(rate_limit="100/minute")
    for reason in ("job", "collaboration", "speaking", "other"):
        assert post(client, reason=reason).status_code == 202


# --- validation ----------------------------------------------------------------------


@pytest.mark.parametrize(
    ("field", "value"),
    [
        ("name", "A"),
        ("name", "   A   "),
        ("name", "x" * 81),
        ("name", "Ada\x07Lovelace"),
        ("name", "Ada\r\nBcc: victim@example.com"),
        ("email", "not-an-email"),
        ("email", ""),
        ("reason", "spam"),
        ("message", "too short"),
        ("message", " " * 30),
        ("message", "x" * 5001),
    ],
)
def test_invalid_field_returns_422_with_that_field(
    client: TestClient, mailer: FakeMailer, field: str, value: str
) -> None:
    response = post(client, **{field: value})

    assert response.status_code == 422
    body = response.json()
    assert body["ok"] is False
    assert set(body) == {"ok", "errors"}
    assert field in body["errors"]
    assert isinstance(body["errors"][field], str)
    assert mailer.sent == []


@pytest.mark.parametrize("field", ["name", "email", "reason", "message"])
def test_missing_field_returns_422(client: TestClient, field: str) -> None:
    payload = {k: v for k, v in VALID.items() if k != field}

    response = client.post("/contact", json=payload)

    assert response.status_code == 422
    assert response.json()["errors"] == {field: "This field is required."}


def test_invalid_json_returns_422_on_body(client: TestClient) -> None:
    response = client.post(
        "/contact", content=b"{not json", headers={"Content-Type": "application/json"}
    )

    assert response.status_code == 422
    assert list(response.json()["errors"]) == ["body"]
    assert "Traceback" not in response.text


def test_non_object_body_returns_422_on_body(client: TestClient) -> None:
    response = client.post("/contact", json=["a", "b"])

    assert response.status_code == 422
    assert list(response.json()["errors"]) == ["body"]


# --- honeypot ------------------------------------------------------------------------


def test_honeypot_returns_202_and_sends_nothing(client: TestClient, mailer: FakeMailer) -> None:
    response = post(client, website="https://spam.example")

    assert response.status_code == 202
    assert response.json() == {"ok": True}
    assert mailer.sent == []


def test_honeypot_wins_over_validation_errors(client: TestClient, mailer: FakeMailer) -> None:
    response = client.post("/contact", json={"website": "x", "email": "nope"})

    assert response.status_code == 202
    assert mailer.sent == []


def test_whitespace_only_honeypot_counts_as_empty(client: TestClient, mailer: FakeMailer) -> None:
    assert post(client, website="   ").status_code == 202
    assert len(mailer.sent) == 1


# --- rate limit ----------------------------------------------------------------------


def test_sixth_request_in_window_returns_429_with_retry_after(
    client: TestClient, mailer: FakeMailer
) -> None:
    for _ in range(5):
        assert post(client).status_code == 202

    response = post(client)

    assert response.status_code == 429
    assert response.json() == {"ok": False, "error": "rate_limited"}
    retry_after = int(response.headers["Retry-After"])
    assert 1 <= retry_after <= 600
    assert "X-Request-ID" in response.headers
    assert len(mailer.sent) == 5


def test_rate_limit_applies_to_contact_only(client: TestClient) -> None:
    for _ in range(6):
        post(client)

    assert client.get("/health").status_code == 200


def test_validation_failures_do_not_use_up_the_limit(client: TestClient) -> None:
    for _ in range(6):
        assert post(client, email="nope").status_code == 422

    assert post(client).status_code == 202


def test_forwarded_for_is_used_only_when_trusted(make_client: Callable[..., TestClient]) -> None:
    trusted = make_client(trust_proxy_headers=True, rate_limit="1/minute")
    first = {"X-Forwarded-For": "203.0.113.1, 10.0.0.1"}
    second = {"X-Forwarded-For": "203.0.113.2, 10.0.0.1"}
    assert trusted.post("/contact", json=VALID, headers=first).status_code == 202
    assert trusted.post("/contact", json=VALID, headers=first).status_code == 429
    assert trusted.post("/contact", json=VALID, headers=second).status_code == 202

    untrusted = make_client(rate_limit="1/minute")
    assert untrusted.post("/contact", json=VALID, headers=first).status_code == 202
    assert untrusted.post("/contact", json=VALID, headers=second).status_code == 429


# --- request size --------------------------------------------------------------------


def test_oversized_body_returns_413(client: TestClient, mailer: FakeMailer) -> None:
    response = client.post(
        "/contact",
        content=b"x" * (32 * 1024 + 1),
        headers={"Content-Type": "application/json"},
    )

    assert response.status_code == 413
    assert response.json() == {"ok": False, "error": "payload_too_large"}
    assert "X-Request-ID" in response.headers
    assert mailer.sent == []


def test_oversized_body_without_content_length_returns_413(client: TestClient) -> None:
    def chunks() -> Iterator[bytes]:
        yield b"x" * 20_000
        yield b"x" * 20_000

    response = client.post(
        "/contact", content=chunks(), headers={"Content-Type": "application/json"}
    )

    assert response.status_code == 413


def test_longest_emoji_message_is_accepted(client: TestClient, mailer: FakeMailer) -> None:
    message = "😀" * 5000  # 4 bytes each in UTF-8
    # Sent the way browsers send JSON: UTF-8, non-ASCII not escaped.
    body = json.dumps({**VALID, "message": message}, ensure_ascii=False).encode()
    assert len(body) > 20_000

    response = client.post("/contact", content=body, headers={"Content-Type": "application/json"})

    assert response.status_code == 202
    assert mailer.sent[0].message == message


def test_body_at_the_limit_is_parsed(client: TestClient) -> None:
    response = client.post(
        "/contact",
        content=b" " * (32 * 1024 - 2) + b"{}",
        headers={"Content-Type": "application/json"},
    )

    assert response.status_code == 422


# --- CORS ----------------------------------------------------------------------------

PREVIEW_REGEX = r"https://portfolio-[a-z0-9-]+\.vercel\.app"


def preflight(client: TestClient, origin: str) -> Any:
    return client.options(
        "/contact",
        headers={
            "Origin": origin,
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
    )


def test_allowed_origin_gets_cors_headers(client: TestClient) -> None:
    pre = preflight(client, "http://localhost:3000")
    assert pre.status_code == 200
    assert pre.headers["access-control-allow-origin"] == "http://localhost:3000"
    assert "POST" in pre.headers["access-control-allow-methods"]
    assert "access-control-allow-credentials" not in pre.headers

    response = client.post("/contact", json=VALID, headers={"Origin": "http://localhost:3000"})
    assert response.headers["access-control-allow-origin"] == "http://localhost:3000"


def test_disallowed_origin_gets_no_cors_headers(client: TestClient) -> None:
    pre = preflight(client, "https://evil.example")
    assert "access-control-allow-origin" not in pre.headers

    response = client.post("/contact", json=VALID, headers={"Origin": "https://evil.example"})
    assert "access-control-allow-origin" not in response.headers


def test_origin_regex_allows_previews_only(make_client: Callable[..., TestClient]) -> None:
    client = make_client(cors_allow_origin_regex=PREVIEW_REGEX)

    allowed = preflight(client, "https://portfolio-git-feature-x.vercel.app")
    assert allowed.headers["access-control-allow-origin"] == (
        "https://portfolio-git-feature-x.vercel.app"
    )
    for origin in ("https://evil.vercel.app", "https://portfolio-x.vercel.app.evil.example"):
        assert "access-control-allow-origin" not in preflight(client, origin).headers


def test_multiple_exact_origins(make_client: Callable[..., TestClient]) -> None:
    client = make_client(cors_allow_origins="https://a.example, https://b.example")

    for origin in ("https://a.example", "https://b.example"):
        assert preflight(client, origin).headers["access-control-allow-origin"] == origin
    assert "access-control-allow-origin" not in preflight(client, "http://localhost:3000").headers


# --- mailer failures -----------------------------------------------------------------


def test_mailer_error_returns_503(client: TestClient, mailer: FakeMailer) -> None:
    mailer.error = RuntimeError("provider down")

    response = post(client)

    assert response.status_code == 503
    assert response.json() == {"ok": False, "error": "email_unavailable"}


def test_mailer_timeout_returns_503(
    client: TestClient, mailer: FakeMailer, monkeypatch: pytest.MonkeyPatch
) -> None:
    monkeypatch.setattr(mailer_service, "SEND_TIMEOUT_SECONDS", 0.1)
    mailer.delay = 2.0

    started = time.perf_counter()
    response = post(client)

    assert response.status_code == 503
    assert response.json() == {"ok": False, "error": "email_unavailable"}
    assert time.perf_counter() - started < 1.5


# --- logs ----------------------------------------------------------------------------

SECRET_NAME = "Zebulon Quixote"
SECRET_EMAIL = "zebulon.secret@example.com"
SECRET_MESSAGE = "This private message text must never appear in any log line."


def test_logs_hold_no_message_name_or_email(
    client: TestClient, mailer: FakeMailer, caplog: pytest.LogCaptureFixture
) -> None:
    caplog.set_level(logging.INFO)
    caplog.handler.addFilter(RequestIdFilter())
    secret = {"name": SECRET_NAME, "email": SECRET_EMAIL, "message": SECRET_MESSAGE}

    sent = post(client, **secret)
    post(client, **secret, website="bot")
    post(client, **{**secret, "reason": "nope"})
    mailer.error = RuntimeError(f"rejected {SECRET_EMAIL}")
    post(client, **secret)

    logged = caplog.text + " ".join(repr(r.args) for r in caplog.records)
    for value in (SECRET_NAME, SECRET_EMAIL, SECRET_MESSAGE, "Zebulon", "private message"):
        assert value not in logged

    outcomes = [r.getMessage() for r in caplog.records if r.getMessage().startswith("contact")]
    assert outcomes == [
        "contact outcome=sent reason=job",
        "contact outcome=dropped reason=honeypot",
        "contact outcome=rejected reason=validation fields=reason",
        "contact outcome=failed reason=provider_error error_type=RuntimeError",
    ]

    sent_record = next(
        r for r in caplog.records if r.getMessage().endswith("outcome=sent reason=job")
    )
    assert getattr(sent_record, "request_id", None) == sent.headers["X-Request-ID"]


# --- subject safety ------------------------------------------------------------------


def test_crlf_never_reaches_the_subject(client: TestClient, mailer: FakeMailer) -> None:
    response = post(client, name="Ada\r\nBcc: victim@example.com")
    assert response.status_code == 422
    assert mailer.sent == []

    # Defence in depth: even a message that skipped validation gets a one-line subject.
    from app.schemas import ContactMessage

    message = ContactMessage.model_construct(
        name="Ada\r\nBcc: victim@example.com X",
        email="ada@example.com\r\n",
        reason="job",
        message="body",
    )
    email = build_email(message)
    assert not re.search(r"[\r\n  ]", email.subject)
    assert not re.search(r"[\r\n]", email.reply_to)
    assert email.subject == "Portfolio contact: job — Ada Bcc: victim@example.com X"
