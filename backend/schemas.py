from pydantic import BaseModel, EmailStr
from pydantic import BaseModel, EmailStr
from datetime import datetime

from enum import Enum

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    email: EmailStr

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    email: EmailStr


class MessageStatus(str, Enum):
    Sent = "Sent"
    Delivered = "Delivered"
    Read = "Read"

class MessageCreate(BaseModel):
    recipient: EmailStr
    content: str

class MessageOut(BaseModel):
    id: str
    sender: EmailStr
    recipient: EmailStr
    content: str
    timestamp: datetime
    status: MessageStatus
    is_bot_response: bool
