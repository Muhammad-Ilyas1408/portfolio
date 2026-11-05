"""Request ids: one per request, echoed in X-Request-ID and added to every app log line."""

import logging
import re
import time
import uuid
from contextvars import ContextVar

from starlette.datastructures import Headers, MutableHeaders
from starlette.types import ASGIApp, Message, Receive, Scope, Send

HEADER = "X-Request-ID"
_VALID = re.compile(r"^[A-Za-z0-9._-]{1,64}$")
_MARKER = "_portfolio_request_id"

request_id_var: ContextVar[str] = ContextVar("request_id", default="-")
logger = logging.getLogger("app.access")


class RequestIdFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        record.request_id = request_id_var.get()
        return True


def configure_logging() -> None:
    """Give the `app` loggers one handler whose lines carry the request id."""
    app_logger = logging.getLogger("app")
    app_logger.setLevel(logging.INFO)
    if any(getattr(handler, _MARKER, False) for handler in app_logger.handlers):
        return
    handler = logging.StreamHandler()
    handler.addFilter(RequestIdFilter())
    handler.setFormatter(
        logging.Formatter("%(asctime)s %(levelname)s %(name)s [%(request_id)s] %(message)s")
    )
    setattr(handler, _MARKER, True)
    app_logger.addHandler(handler)


class RequestIdMiddleware:
    def __init__(self, app: ASGIApp) -> None:
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        incoming = Headers(scope=scope).get(HEADER, "")
        request_id = incoming if _VALID.match(incoming) else uuid.uuid4().hex
        token = request_id_var.set(request_id)
        started = time.perf_counter()
        status = 500

        async def send_with_id(message: Message) -> None:
            nonlocal status
            if message["type"] == "http.response.start":
                status = message["status"]
                MutableHeaders(scope=message)[HEADER] = request_id
            await send(message)

        try:
            await self.app(scope, receive, send_with_id)
        finally:
            logger.info(
                "%s %s %s %.0fms",
                scope["method"],
                scope["path"],
                status,
                (time.perf_counter() - started) * 1000,
            )
            request_id_var.reset(token)
