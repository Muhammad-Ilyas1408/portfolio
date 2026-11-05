"""POST /contact: validate, rate-limit, drop spam, send one email."""

import logging
from functools import partial
from typing import Annotated

import anyio
from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse
from slowapi import Limiter

from app.schemas import ContactRequest
from app.services import mailer as mailer_service
from app.services.mailer import Mailer, get_mailer

# Log lines carry the request id (added by the handler), the outcome and a reason only:
# never the message, the sender's name or their email.
logger = logging.getLogger(__name__)

ACCEPTED = {"ok": True}
UNAVAILABLE = {"ok": False, "error": "email_unavailable"}


def create_contact_router(limiter: Limiter, rate_limit: str) -> APIRouter:
    router = APIRouter()

    async def contact(
        request: Request,
        payload: ContactRequest,
        mailer: Annotated[Mailer, Depends(get_mailer)],
    ) -> JSONResponse:
        if payload.is_spam:
            logger.info("contact outcome=dropped reason=honeypot")
            return JSONResponse(ACCEPTED, status_code=202)

        try:
            # Runs the blocking SDK call in a worker thread. abandon_on_cancel lets the
            # timeout return at once even if that call hangs; Starlette's
            # run_in_threadpool (the same anyio call without it) would wait for the thread.
            with anyio.fail_after(mailer_service.SEND_TIMEOUT_SECONDS):
                await anyio.to_thread.run_sync(
                    partial(mailer.send, payload.to_message()), abandon_on_cancel=True
                )
        except TimeoutError:
            logger.error("contact outcome=failed reason=timeout")
            return JSONResponse(UNAVAILABLE, status_code=503)
        except Exception as exc:  # any mailer error means "email unavailable"
            logger.error(
                "contact outcome=failed reason=provider_error error_type=%s",
                type(exc).__name__,
            )
            return JSONResponse(UNAVAILABLE, status_code=503)

        logger.info("contact outcome=sent reason=%s", payload.reason)
        return JSONResponse(ACCEPTED, status_code=202)

    router.add_api_route(
        "/contact",
        limiter.limit(rate_limit)(contact),
        methods=["POST"],
        status_code=202,
        response_model=None,
    )
    return router
