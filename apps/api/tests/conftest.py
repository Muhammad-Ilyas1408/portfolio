import time
from collections.abc import Callable
from typing import Any

import pytest
from fastapi.testclient import TestClient

from app.config import Settings
from app.main import create_app
from app.schemas import ContactMessage
from app.services.mailer import get_mailer

VALID: dict[str, str] = {
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "reason": "job",
    "message": "Hello, I would like to talk about an engineering role.",
}


class FakeMailer:
    """Records messages instead of sending them; can fail or hang on demand."""

    def __init__(self) -> None:
        self.sent: list[ContactMessage] = []
        self.error: Exception | None = None
        self.delay = 0.0

    def send(self, message: ContactMessage) -> None:
        if self.delay:
            time.sleep(self.delay)
        if self.error is not None:
            raise self.error
        self.sent.append(message)


def make_settings(**overrides: Any) -> Settings:
    """Settings from arguments only, never from a developer's local .env file."""
    return Settings(_env_file=None, **overrides)  # type: ignore[call-arg]


@pytest.fixture
def mailer() -> FakeMailer:
    return FakeMailer()


@pytest.fixture
def make_client(mailer: FakeMailer) -> Callable[..., TestClient]:
    def factory(**overrides: Any) -> TestClient:
        app = create_app(make_settings(**overrides))
        app.dependency_overrides[get_mailer] = lambda: mailer
        return TestClient(app)

    return factory


@pytest.fixture
def client(make_client: Callable[..., TestClient]) -> TestClient:
    return make_client()
