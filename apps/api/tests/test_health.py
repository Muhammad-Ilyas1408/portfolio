import re

from fastapi.testclient import TestClient


def test_health_returns_ok_and_version(client: TestClient) -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "version": "1.0.0"}


def test_module_app_serves_health() -> None:
    from app.main import app

    assert TestClient(app).get("/health").json()["version"] == "1.0.0"


def test_request_id_is_generated_when_absent(client: TestClient) -> None:
    request_id = client.get("/health").headers["X-Request-ID"]

    assert re.fullmatch(r"[0-9a-f]{32}", request_id)


def test_request_id_is_echoed_when_valid(client: TestClient) -> None:
    response = client.get("/health", headers={"X-Request-ID": "abc-123"})

    assert response.headers["X-Request-ID"] == "abc-123"


def test_invalid_request_id_is_replaced(client: TestClient) -> None:
    response = client.get("/health", headers={"X-Request-ID": "bad id\twith spaces"})

    assert re.fullmatch(r"[0-9a-f]{32}", response.headers["X-Request-ID"])
