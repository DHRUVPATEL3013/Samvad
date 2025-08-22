from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas import MessageCreate, MessageOut
import asyncio
from models import Message, MessageStatus
from auth import get_current_email
from typing import List
from ws_manager import ConnectionManager

router = APIRouter()
manager = ConnectionManager()
BOT_EMAIL = "bot@whatsease.com"

def serialize_message(msg: Message):
    return {
        "id": str(msg.id),
        "sender": msg.sender,
        "recipient": msg.recipient,
        "content": msg.content,
        "timestamp": msg.timestamp.isoformat(),
        "status": msg.status.value if msg.status else "Sent",
        "is_bot_response": bool(msg.is_bot_response),
    }

def bot_reply(text: str) -> str:
    t = (text or "").lower()
    if any(w in t for w in ("hi","hello","hey")):
        return "Hello! I'm WhatsEase 🤖 — how can I help?"
    if "help" in t:
        return "You can say 'hi' or ask for assistance."
    return "Sorry, I didn't understand. Try 'help'."

@router.post("/messages", response_model=List[MessageOut])
def send_message(data: MessageCreate, me: str = Depends(get_current_email), db: Session = Depends(get_db)):
    
    new_msg = Message(
        sender=me,
        recipient=data.recipient,
        content=data.content,
        is_bot_response=False,
        status=MessageStatus.sent
    )
    db.add(new_msg)
    db.commit()
    db.refresh(new_msg)

    payload = {"type": "message", "data": serialize_message(new_msg)}
   
    try:
        asyncio.create_task(manager.send_personal(data.recipient, payload))
        new_msg.status = MessageStatus.delivered
        db.commit()
    except Exception:
        pass


    try:
        asyncio.create_task(manager.send_personal(me, payload))
    except Exception:
        pass

   
    bot_msg = None
    if data.recipient == BOT_EMAIL:
        reply_text = bot_reply(data.content)
        bot_msg = Message(
            sender=BOT_EMAIL,
            recipient=me,
            content=reply_text,
            is_bot_response=True,
            status=MessageStatus.delivered
        )
        db.add(bot_msg)
        db.commit()
        db.refresh(bot_msg)

        payload_bot = {"type": "message", "data": serialize_message(bot_msg)}
        try:
            asyncio.create_task(manager.send_personal(me, payload_bot))
        except Exception:
            pass

    messages_to_return = [serialize_message(new_msg)]
    if bot_msg:
        messages_to_return.append(serialize_message(bot_msg))

    return messages_to_return

@router.get("/messages/{peer_email}", response_model=List[MessageOut])
def get_conversation(peer_email: str, me: str = Depends(get_current_email), db: Session = Depends(get_db)):
    msgs = db.query(Message).filter(
        ((Message.sender == me) & (Message.recipient == peer_email)) |
        ((Message.sender == peer_email) & (Message.recipient == me))
    ).order_by(Message.timestamp.asc()).all()
    return [serialize_message(m) for m in msgs]
