from typing import Any

import pytest
import resend
from fastapi.testclient import TestClient
from pydantic import SecretStr, ValidationError

from app.main import create_app
from app.schemas import ContactMessage
from app.services.mailer import ResendMailer
from tests.conftest import make_settings


@pytest.fixture(autouse=True)
def _restore_resend_globals(monkeypatch: pytest.MonkeyPatch) -> None:
    """ResendMailer configures the SDK's module globals; undo that after each test."""
    monkeypatch.setattr(resend, "api_key", None)
    monkeypatch.setattr(resend, "default_http_client", resend.default_http_client)


def test_production_requires_resend_api_key() -> None:
    with pytest.raises(ValidationError, match="RESEND_API_KEY is required"):
        make_settings(env="production")
    with pytest.raises(ValidationError, match="RESEND_API_KEY is required"):
        make_settings(env="production", resend_api_key="   ")


def test_production_reads_key_from_environment(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("ENV", "production")
    monkeypatch.setenv("RESEND_API_KEY", "re_test_not_real")
    monkeypatch.setenv("CORS_ALLOW_ORIGINS", "https://a.example,https://b.example")
    monkeypatch.setenv("TRUST_PROXY_HEADERS", "true")

    settings = make_settings()

    assert settings.is_production
    assert settings.cors_origins == ["https://a.example", "https://b.example"]
    assert settings.trust_proxy_headers is True
    assert "re_test_not_real" not in repr(settings)


def test_development_runs_without_key() -> None:
    settings = make_settings()

    assert settings.env == "development"
    assert settings.resend_api_key is None
    assert settings.contact_to_email == "muhammadilyas.ai.eng@gmail.com"
    assert settings.contact_from_email == "Portfolio Contact <onboarding@resend.dev>"
    assert settings.cors_origins == ["http://localhost:3000"]
    assert settings.rate_limit == "5/10minutes"


def test_invalid_rate_limit_fails_fast() -> None:
    with pytest.raises(ValidationError, match="RATE_LIMIT"):
        make_settings(rate_limit="lots")


def test_production_disables_docs() -> None:
    app = create_app(make_settings(env="production", resend_api_key="re_test_not_real"))
    client = TestClient(app)

    for path in ("/docs", "/redoc", "/openapi.json"):
        assert client.get(path).status_code == 404
    assert client.get("/health").status_code == 200


def test_development_serves_docs() -> None:
    client = TestClient(create_app(make_settings()))

    for path in ("/docs", "/redoc", "/openapi.json"):
        assert client.get(path).status_code == 200


def test_resend_mailer_builds_the_request(monkeypatch: pytest.MonkeyPatch) -> None:
    calls: list[dict[str, Any]] = []
    monkeypatch.setattr(resend.Emails, "send", lambda params: calls.append(dict(params)))
    mailer = ResendMailer(
        SecretStr("re_test_not_real"), "owner@example.com", "Portfolio <onboarding@resend.dev>"
    )

    mailer.send(
        ContactMessage(
            name="Ada",
            email="ada@example.com",
            reason="speaking",
            message="<img src=x onerror=alert(1)> please talk at our meetup",
        )
    )

    assert resend.api_key == "re_test_not_real"
    assert len(calls) == 1
    params = calls[0]
    assert params["from"] == "Portfolio <onboarding@resend.dev>"
    assert params["to"] == ["owner@example.com"]
    assert params["reply_to"] == "ada@example.com"
    assert params["subject"] == "Portfolio contact: speaking — Ada"
    assert "<img" not in params["html"]
    assert "&lt;img src=x onerror=alert(1)&gt;" in params["html"]
    assert "<img src=x onerror=alert(1)>" in params["text"]
