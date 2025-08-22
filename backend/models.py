from sqlalchemy import Column, String, DateTime, Boolean, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from database import Base

import enum

class MessageStatus(str, enum.Enum):
    sent = "Sent"
    delivered = "Delivered"
    read = "Read"

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Message(Base):
    __tablename__ = "messages"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sender = Column(String, nullable=False)   
    recipient = Column(String, nullable=False)  
    content = Column(String, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(Enum(MessageStatus), default=MessageStatus.sent)
    is_bot_response = Column(Boolean, default=False)
