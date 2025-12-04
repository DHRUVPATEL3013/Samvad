
from pydantic import EmailStr,BaseModel

from enum import Enum 
from datetime import datetime
# class MessageStatus(str, Enum):
#     Sent = "sent"
#     Delivered = "delivered"
#     Read = "read"

class MessageCreate(BaseModel):
    recipient: EmailStr
    content: str

# class MessageOut(BaseModel):
#     id: str
#     sender: EmailStr
#     recipient: EmailStr
#     content: str
#     timestamp: datetime
#     status: MessageStatus
#     is_bot_response: bool