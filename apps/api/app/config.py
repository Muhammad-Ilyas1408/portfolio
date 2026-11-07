"""Settings, read from environment variables or a local `.env` file."""

import re
from functools import lru_cache
from typing import Literal, Self

from limits import parse as parse_rate_limit
from pydantic import EmailStr, SecretStr, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        env_ignore_empty=True,
        extra="ignore",
    )

    env: Literal["development", "production"] = "development"
    resend_api_key: SecretStr | None = None
    contact_to_email: EmailStr = "muhammadilyas.ai.eng@gmail.com"
    contact_from_email: str = "Portfolio Contact <onboarding@resend.dev>"
    cors_allow_origins: str = "http://localhost:3000"
    cors_allow_origin_regex: str | None = None
    rate_limit: str = "5/10minutes"
    trust_proxy_headers: bool = False

    @field_validator("rate_limit")
    @classmethod
    def _valid_rate_limit(cls, value: str) -> str:
        try:
            parse_rate_limit(value)
        except ValueError as exc:
            raise ValueError(f"RATE_LIMIT is not a valid rate limit: {value!r}") from exc
        return value

    @field_validator("cors_allow_origin_regex")
    @classmethod
    def _valid_origin_regex(cls, value: str | None) -> str | None:
        # Starlette matches the whole origin (re.fullmatch), so the pattern is anchored even
        # without ^ and $. A typo should stop the app at startup, not silently block CORS.
        if value is None:
            return None
        try:
            re.compile(value)
        except re.error as exc:
            raise ValueError(f"CORS_ALLOW_ORIGIN_REGEX is not a valid regex: {exc}") from exc
        return value

    @model_validator(mode="after")
    def _require_key_in_production(self) -> Self:
        key = self.resend_api_key.get_secret_value().strip() if self.resend_api_key else ""
        if self.is_production and not key:
            raise ValueError("RESEND_API_KEY is required when ENV=production")
        return self

    @property
    def is_production(self) -> bool:
        return self.env == "production"

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_allow_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
