"""Email delivery behind a small protocol, so tests can swap in a fake."""

import html
import logging
import re
from dataclasses import dataclass
from typing import Protocol

import resend
from fastapi import Request
from pydantic import SecretStr
from resend.http_client_requests import RequestsClient

from app.schemas import ContactMessage

SEND_TIMEOUT_SECONDS = 10.0

logger = logging.getLogger(__name__)

_LINE_BREAKS = re.compile(r"[\r\n  ]+")


class Mailer(Protocol):
    def send(self, message: ContactMessage) -> None: ...


@dataclass(frozen=True)
class Email:
    subject: str
    text: str
    html: str
    reply_to: str


def _one_line(value: str) -> str:
    """Strip CR/LF (and Unicode line breaks) so a value cannot add header lines."""
    return _LINE_BREAKS.sub(" ", value).strip()


def build_email(message: ContactMessage) -> Email:
    subject = f"Portfolio contact: {_one_line(message.reason)} — {_one_line(message.name)}"
    text = (
        "New message from the portfolio contact form.\n\n"
        f"Name: {message.name}\n"
        f"Email: {message.email}\n"
        f"Reason: {message.reason}\n\n"
        f"{message.message}\n"
    )
    esc = html.escape
    body = esc(message.message).replace("\r\n", "\n").replace("\n", "<br>\n")
    html_body = (
        "<p>New message from the portfolio contact form.</p>\n"
        "<p>"
        f"<strong>Name:</strong> {esc(message.name)}<br>\n"
        f"<strong>Email:</strong> {esc(message.email)}<br>\n"
        f"<strong>Reason:</strong> {esc(message.reason)}"
        "</p>\n"
        f"<p>{body}</p>\n"
    )
    return Email(subject=subject, text=text, html=html_body, reply_to=_one_line(message.email))


class ResendMailer:
    """Sends the notification to the owner through Resend. No auto-reply in v1."""

    def __init__(self, api_key: SecretStr, to_email: str, from_email: str) -> None:
        resend.api_key = api_key.get_secret_value()
        # The SDK's own HTTP timeout; the router also caps the whole send at this value.
        resend.default_http_client = RequestsClient(timeout=int(SEND_TIMEOUT_SECONDS))
        self._to = to_email
        self._from = from_email

    def send(self, message: ContactMessage) -> None:
        email = build_email(message)
        params: resend.Emails.SendParams = {
            "from": self._from,
            "to": [self._to],
            "subject": email.subject,
            "text": email.text,
            "html": email.html,
            "reply_to": email.reply_to,
        }
        resend.Emails.send(params)


class DisabledMailer:
    """Development only, when RESEND_API_KEY is unset: accepts and drops the message."""

    def send(self, message: ContactMessage) -> None:
        logger.warning("email delivery disabled (RESEND_API_KEY not set); message dropped")


def get_mailer(request: Request) -> Mailer:
    mailer: Mailer = request.app.state.mailer
    return mailer
