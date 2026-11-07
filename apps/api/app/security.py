"""Request-size limit and the rate-limit key."""

import json
from collections.abc import Callable

from slowapi import Limiter
from starlette.requests import Request
from starlette.types import ASGIApp, Message, Receive, Scope, Send

# 32 KB: a 5,000-character message at 4 bytes per character (emoji) still fits.
MAX_BODY_BYTES = 32 * 1024


class BodySizeLimitMiddleware:
    """Rejects bodies over `max_bytes` with 413 before anything parses them."""

    def __init__(self, app: ASGIApp, max_bytes: int = MAX_BODY_BYTES) -> None:
        self.app = app
        self.max_bytes = max_bytes

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        declared = dict(scope["headers"]).get(b"content-length")
        if declared is not None and declared.isdigit() and int(declared) > self.max_bytes:
            await _too_large(send)
            return

        # Read the body (never more than max_bytes) up front, then replay it to the app.
        chunks: list[bytes] = []
        size = 0
        more = True
        while more:
            message = await receive()
            if message["type"] != "http.request":
                break
            chunk = message.get("body", b"")
            size += len(chunk)
            if size > self.max_bytes:
                await _too_large(send)
                return
            chunks.append(chunk)
            more = message.get("more_body", False)

        body = b"".join(chunks)
        replayed = False

        async def replay() -> Message:
            nonlocal replayed
            if not replayed:
                replayed = True
                return {"type": "http.request", "body": body, "more_body": False}
            return await receive()

        await self.app(scope, replay, send)


async def _too_large(send: Send) -> None:
    payload = json.dumps({"ok": False, "error": "payload_too_large"}).encode()
    await send(
        {
            "type": "http.response.start",
            "status": 413,
            "headers": [
                (b"content-type", b"application/json"),
                (b"content-length", str(len(payload)).encode()),
                (b"connection", b"close"),
            ],
        }
    )
    await send({"type": "http.response.body", "body": payload})


def client_ip_key(trust_proxy_headers: bool) -> Callable[[Request], str]:
    """Key by client IP; behind a trusted proxy, by the first X-Forwarded-For address.

    On Vercel, set TRUST_PROXY_HEADERS=true. Vercel documents `X-Forwarded-For` as "the public
    IP address of the client" and overwrites any value the client sends, "to prevent IP
    spoofing" (https://vercel.com/docs/headers/request-headers). `X-Real-IP` and
    `X-Vercel-Forwarded-For` carry the same address, but no Vercel page says a client-sent
    copy of those is replaced, so they are never read. Elsewhere, enable it only behind a
    proxy that overwrites X-Forwarded-For in the same way.
    """

    def key(request: Request) -> str:
        if trust_proxy_headers:
            first = request.headers.get("x-forwarded-for", "").split(",")[0].strip()
            if first:
                return first
        return request.client.host if request.client else "unknown"

    return key


def create_limiter(trust_proxy_headers: bool) -> Limiter:
    # In-memory storage: counts are per process and reset on restart. On Vercel each function
    # instance keeps its own counts, so the limit is per instance, not global (accepted for v1:
    # the honeypot and Resend's daily quota back it up; see docs/DEPLOY.md).
    return Limiter(
        key_func=client_ip_key(trust_proxy_headers),
        storage_uri="memory://",
        headers_enabled=False,
    )
