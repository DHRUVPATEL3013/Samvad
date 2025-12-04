from sqlalchemy import Column, String, DateTime, Boolean, Enum, ForeignKey,Integer,Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
from database import Base

import enum

class MessageStatus(str, enum.Enum):
    sent = "sent"
    delivered = "delivered"
    read = "read"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    fullname=Column(String,nullable=False)
    phone=Column(String,unique=True,nullable=False)
    gender=Column(String,nullable=False)
    dob=Column(Date,nullable=False,index=True)
    profile_pic=Column(String)
    created_at = Column(DateTime,nullable=False)

    contacts=relationship("Contact",foreign_keys="Contact.owner_id",back_populates="owner",cascade="all,delete-orphan")
    saved_by=relationship("Contact",foreign_keys="Contact.contact_id",back_populates="saved_contact",cascade="all,delete-orphan")
    sent_messages=relationship("Message",foreign_keys="Message.sender_id",back_populates="sender",cascade="all,delete-orphan")
    received_messages=relationship("Message",foreign_keys="Message.recipient_id",back_populates="recipient",cascade="all,delete-orphan")
    


class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True)
    sender_id= Column(Integer,ForeignKey("users.id",ondelete="CASCADE"),nullable=False,index=True)   
    recipient_id = Column(Integer,ForeignKey("users.id",ondelete="CASCADE"),nullable=False,index=True)  
    content = Column(String, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(Enum(MessageStatus), default=MessageStatus.sent)
    is_bot_response = Column(Boolean, default=False)


    sender=relationship("User",foreign_keys=[sender_id],back_populates="sent_messages")
    recipient=relationship("User",foreign_keys=[recipient_id],back_populates="received_messages")

class Contact(Base):
    __tablename__ = "contacts"
    
    id = Column(Integer, primary_key=True,index=True)
    owner_id = Column(Integer,ForeignKey("users.id",ondelete="CASCADE"), nullable=False,index=True)  
    contact_id = Column(Integer,ForeignKey("users.id",ondelete="CASCADE"),nullable=True,index=True) 
    saved_name = Column(String, nullable=False)   
    created_at = Column(DateTime)

    owner=relationship("User",foreign_keys=[owner_id],back_populates="contacts")
    saved_contact=relationship("User",foreign_keys=[contact_id],back_populates="saved_by")
