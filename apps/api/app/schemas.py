"""Request and message models for POST /contact."""

from typing import Annotated, Any, Literal

from pydantic import BaseModel, ConfigDict, EmailStr, StringConstraints, field_validator
from pydantic_core import PydanticCustomError

Reason = Literal["job", "collaboration", "speaking", "other"]

Name = Annotated[str, StringConstraints(min_length=2, max_length=80)]
MessageText = Annotated[str, StringConstraints(min_length=20, max_length=5000)]


def _is_control(char: str) -> bool:
    code = ord(char)
    # C0 and C1 control characters, DEL, and the Unicode line/paragraph separators.
    return code < 0x20 or 0x7F <= code <= 0x9F or code in (0x2028, 0x2029)


class ContactMessage(BaseModel):
    """A validated message, as handed to the mailer."""

    model_config = ConfigDict(frozen=True)

    name: str
    email: str
    reason: Reason
    message: str


class ContactRequest(BaseModel):
    """The JSON body of POST /contact."""

    model_config = ConfigDict(extra="ignore")

    name: Name
    email: EmailStr
    reason: Reason
    message: MessageText
    # Honeypot: hidden from people, so it must stay empty.
    website: str = ""

    @field_validator("name", "email", "message", "website", mode="before")
    @classmethod
    def _strip(cls, value: Any) -> Any:
        return value.strip() if isinstance(value, str) else value

    @field_validator("name")
    @classmethod
    def _no_control_characters(cls, value: str) -> str:
        if any(_is_control(char) for char in value):
            raise PydanticCustomError(
                "control_characters", "Name must not contain control characters."
            )
        return value

    @property
    def is_spam(self) -> bool:
        return self.website != ""

    def to_message(self) -> ContactMessage:
        return ContactMessage(
            name=self.name, email=str(self.email), reason=self.reason, message=self.message
        )
