"""App factory: `create_app(settings)`. `app` is the instance uvicorn / `fastapi` serve."""

import logging
import math
import time
from typing import Any

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded

from app import __version__
from app.config import Settings, get_settings
from app.request_id import HEADER as REQUEST_ID_HEADER
from app.request_id import RequestIdMiddleware, configure_logging
from app.routers import health
from app.routers.contact import ACCEPTED, create_contact_router
from app.security import MAX_BODY_BYTES, BodySizeLimitMiddleware, create_limiter
from app.services.mailer import DisabledMailer, Mailer, ResendMailer

logger = logging.getLogger("app.errors")
contact_logger = logging.getLogger("app.routers.contact")

FIELD_MESSAGES = {
    "name": "Enter your name (2–80 characters).",
    "email": "Enter a valid email address.",
    "reason": "Choose one of: job, collaboration, speaking, other.",
    "message": "Write a message of 20–5000 characters.",
}


def field_errors(exc: RequestValidationError) -> dict[str, str]:
    """One message per field; `body` when the body itself is not a valid JSON object."""
    errors: dict[str, str] = {}
    for error in exc.errors():
        loc = error.get("loc", ())
        field = str(loc[1]) if len(loc) > 1 and isinstance(loc[1], str) else "body"
        if field in errors:
            continue
        kind = error.get("type")
        if kind == "missing":
            errors[field] = "This field is required."
        elif kind == "control_characters":
            errors[field] = str(error.get("msg"))
        elif kind == "json_invalid":
            errors[field] = "The request body must be valid JSON."
        else:
            errors[field] = FIELD_MESSAGES.get(field, "The request body must be a JSON object.")
    return errors


def _honeypot_filled(body: Any) -> bool:
    if not isinstance(body, dict):
        return False
    website = body.get("website")
    return website is not None and str(website).strip() != ""


def create_app(settings: Settings | None = None, mailer: Mailer | None = None) -> FastAPI:
    settings = settings or get_settings()
    configure_logging()

    production = settings.is_production
    app = FastAPI(
        title="Portfolio contact API",
        version=__version__,
        docs_url=None if production else "/docs",
        redoc_url=None if production else "/redoc",
        openapi_url=None if production else "/openapi.json",
    )

    if mailer is None:
        if settings.resend_api_key is not None:
            mailer = ResendMailer(
                settings.resend_api_key, settings.contact_to_email, settings.contact_from_email
            )
        else:  # development only: Settings refuses production without a key
            mailer = DisabledMailer()
    app.state.mailer = mailer

    limiter = create_limiter(settings.trust_proxy_headers)
    app.state.limiter = limiter

    # Starlette runs the last-added middleware first:
    # request id -> CORS -> body-size limit -> routes.
    app.add_middleware(BodySizeLimitMiddleware, max_bytes=MAX_BODY_BYTES)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_origin_regex=settings.cors_allow_origin_regex,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["Content-Type"],
        allow_credentials=False,
        expose_headers=["Retry-After", REQUEST_ID_HEADER],
        max_age=600,
    )
    app.add_middleware(RequestIdMiddleware)

    @app.exception_handler(RequestValidationError)
    async def validation_error(request: Request, exc: RequestValidationError) -> JSONResponse:
        if _honeypot_filled(exc.body):
            # Bots get the same answer as people, even when other fields are invalid.
            contact_logger.info("contact outcome=dropped reason=honeypot")
            return JSONResponse(ACCEPTED, status_code=202)
        errors = field_errors(exc)
        logger.info("contact outcome=rejected reason=validation fields=%s", ",".join(errors))
        return JSONResponse({"ok": False, "errors": errors}, status_code=422)

    @app.exception_handler(RateLimitExceeded)
    async def rate_limited(request: Request, exc: RateLimitExceeded) -> JSONResponse:
        retry_after = exc.limit.limit.get_expiry() if exc.limit else 60
        view = getattr(request.state, "view_rate_limit", None)
        if view is not None:
            stats = limiter.limiter.get_window_stats(view[0], *view[1])
            retry_after = max(1, math.ceil(stats.reset_time - time.time()))
        logger.info("contact outcome=rejected reason=rate_limited")
        return JSONResponse(
            {"ok": False, "error": "rate_limited"},
            status_code=429,
            headers={"Retry-After": str(retry_after)},
        )

    app.include_router(health.router)
    app.include_router(create_contact_router(limiter, settings.rate_limit))
    return app


app = create_app()
