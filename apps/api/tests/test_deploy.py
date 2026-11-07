"""M9: what Vercel needs (entrypoint, Python version) and the production settings."""

import importlib
import re
import tomllib
from collections.abc import Callable
from pathlib import Path

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from pydantic import ValidationError

from app.config import Settings
from app.main import create_app
from tests.conftest import VALID, make_settings

API_DIR = Path(__file__).resolve().parents[1]
PYPROJECT = tomllib.loads((API_DIR / "pyproject.toml").read_text(encoding="utf-8"))

# The values docs/DEPLOY.md tells the owner to set on the Vercel API project.
PRODUCTION_ENV = {
    "ENV": "production",
    "RESEND_API_KEY": "re_test_not_real",
    "CONTACT_TO_EMAIL": "muhammadilyas.ai.eng@gmail.com",
    "CONTACT_FROM_EMAIL": "Portfolio Contact <onboarding@resend.dev>",
    "CORS_ALLOW_ORIGINS": "https://muhammad-ilyas.vercel.app",
    "TRUST_PROXY_HEADERS": "true",
}

# The optional preview pattern from docs/DEPLOY.md, with an example scope slug.
PREVIEW_REGEX = (
    r"^https://muhammad-ilyas-(?:[a-z0-9]{9}|git-[a-z0-9-]+)-example-projects\.vercel\.app$"
)


# --- Vercel entrypoint and runtime ---------------------------------------------------


def test_vercel_entrypoint_is_the_fastapi_app() -> None:
    module_name, variable = PYPROJECT["tool"]["vercel"]["entrypoint"].split(":")
    instance = getattr(importlib.import_module(module_name), variable)

    assert isinstance(instance, FastAPI)
    assert TestClient(instance).get("/health").json()["status"] == "ok"


def test_entrypoint_file_is_one_vercel_detects_on_its_own() -> None:
    # https://vercel.com/docs/functions/runtimes/python: app.py, index.py, server.py, main.py,
    # wsgi.py or asgi.py, at the root or inside src/ or app/, exposing `app`.
    module_name, variable = PYPROJECT["tool"]["vercel"]["entrypoint"].split(":")
    path = Path(*module_name.split(".")).with_suffix(".py")

    assert (API_DIR / path).is_file()
    assert path.parent.as_posix() in {".", "src", "app"}
    assert path.name in {"app.py", "index.py", "server.py", "main.py", "wsgi.py", "asgi.py"}
    assert variable == "app"


def test_python_version_is_one_vercel_supports() -> None:
    # Vercel supports 3.12 (default), 3.13 and 3.14; anything else silently falls back to 3.12.
    pinned = (API_DIR / ".python-version").read_text(encoding="utf-8").strip()

    assert pinned in {"3.12", "3.13", "3.14"}
    assert PYPROJECT["project"]["requires-python"] == f">={pinned}"


def test_runtime_dependencies_exclude_dev_tools() -> None:
    runtime = " ".join(PYPROJECT["project"]["dependencies"])

    for tool in ("pytest", "ruff", "mypy", "httpx"):
        assert tool not in runtime


# --- production settings -------------------------------------------------------------


def test_production_settings_from_the_deploy_guide(monkeypatch: pytest.MonkeyPatch) -> None:
    for name, value in PRODUCTION_ENV.items():
        monkeypatch.setenv(name, value)
    monkeypatch.delenv("CORS_ALLOW_ORIGIN_REGEX", raising=False)

    settings = make_settings()
    client = TestClient(create_app(settings))

    assert settings.is_production
    assert settings.trust_proxy_headers is True
    assert settings.cors_allow_origin_regex is None
    assert client.get("/health").status_code == 200
    for path in ("/docs", "/redoc", "/openapi.json"):
        assert client.get(path).status_code == 404

    site = "https://muhammad-ilyas.vercel.app"
    allowed = client.get("/health", headers={"Origin": site})
    assert allowed.headers["access-control-allow-origin"] == site
    for origin in ("http://localhost:3000", "https://muhammad-ilyas-api.vercel.app"):
        refused = client.get("/health", headers={"Origin": origin})
        assert "access-control-allow-origin" not in refused.headers


def test_invalid_origin_regex_fails_fast() -> None:
    with pytest.raises(ValidationError, match="CORS_ALLOW_ORIGIN_REGEX"):
        make_settings(cors_allow_origin_regex="^https://(unclosed")


def test_preview_regex_matches_only_this_projects_previews(
    make_client: Callable[..., TestClient],
) -> None:
    client = make_client(cors_allow_origin_regex=PREVIEW_REGEX)
    allowed = (
        "https://muhammad-ilyas-a1b2c3d4e-example-projects.vercel.app",
        "https://muhammad-ilyas-git-feature-x-example-projects.vercel.app",
    )
    refused = (
        "https://muhammad-ilyas.vercel.app.evil.example",
        "https://muhammad-ilyas-a1b2c3d4e-someone-else.vercel.app",
        "https://muhammad-ilyas-api-a1b2c3d4e-example-projects.vercel.app",
        "http://muhammad-ilyas-a1b2c3d4e-example-projects.vercel.app",
        "https://evil-muhammad-ilyas-a1b2c3d4e-example-projects.vercel.app",
    )

    for origin in allowed:
        assert re.fullmatch(PREVIEW_REGEX, origin)
        response = client.get("/health", headers={"Origin": origin})
        assert response.headers["access-control-allow-origin"] == origin
    for origin in refused:
        response = client.get("/health", headers={"Origin": origin})
        assert "access-control-allow-origin" not in response.headers


def test_settings_example_file_lists_every_setting() -> None:
    example = (API_DIR / ".env.example").read_text(encoding="utf-8")
    names = {line.split("=")[0] for line in example.splitlines() if re.match(r"[A-Z_]+=", line)}

    assert names == {name.upper() for name in Settings.model_fields}
    assert not re.search(r"re_[A-Za-z0-9_]{8,}", example)


# --- client IP behind Vercel ---------------------------------------------------------


def test_vercel_style_forwarded_for_keys_the_limit(make_client: Callable[..., TestClient]) -> None:
    # Vercel sets X-Forwarded-For to the client's public address (IPv4 or IPv6).
    client = make_client(trust_proxy_headers=True, rate_limit="1/minute")
    ipv4 = {"X-Forwarded-For": "203.0.113.7"}
    ipv6 = {"X-Forwarded-For": "2001:db8::7"}

    assert client.post("/contact", json=VALID, headers=ipv4).status_code == 202
    assert client.post("/contact", json=VALID, headers=ipv4).status_code == 429
    assert client.post("/contact", json=VALID, headers=ipv6).status_code == 202
    assert client.post("/contact", json=VALID, headers=ipv6).status_code == 429


def test_other_ip_headers_are_ignored(make_client: Callable[..., TestClient]) -> None:
    # Only X-Forwarded-For is documented as overwritten by Vercel, so a client cannot dodge
    # the limit by sending its own X-Real-IP or X-Vercel-Forwarded-For.
    client = make_client(trust_proxy_headers=True, rate_limit="1/minute")
    base = {"X-Forwarded-For": "203.0.113.8"}

    assert client.post("/contact", json=VALID, headers=base).status_code == 202
    for spoof in ("X-Real-IP", "X-Vercel-Forwarded-For"):
        headers = {**base, spoof: "198.51.100.99"}
        assert client.post("/contact", json=VALID, headers=headers).status_code == 429


def test_blank_forwarded_for_falls_back_to_the_socket_address(
    make_client: Callable[..., TestClient],
) -> None:
    client = make_client(trust_proxy_headers=True, rate_limit="1/minute")

    assert client.post("/contact", json=VALID, headers={"X-Forwarded-For": " "}).status_code == 202
    assert client.post("/contact", json=VALID).status_code == 429
