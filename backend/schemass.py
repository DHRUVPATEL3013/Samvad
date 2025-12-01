from pydantic import BaseModel, EmailStr

from datetime import datetime
from typing import Optional
from enum import Enum

class UserCreate(BaseModel):
    full_name:str
    mobile_no:str
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
    phone: str
    content: str

class MessageOut(BaseModel):
    id: str
    sender: str
    contact_id:int
    sender_saved_name:str
    recipient: str
    content: str
    timestamp: datetime
    status: MessageStatus
    is_bot_response: bool
class AddContact(BaseModel):
 
    contact_phone:str
    saved_name:str