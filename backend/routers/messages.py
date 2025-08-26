from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas import MessageCreate, MessageOut
import asyncio
from models import Message, MessageStatus
from auth import get_current_email
from typing import List
from ws_manager import ConnectionManager
import os
import google.generativeai as genai
from dotenv import load_dotenv

from ws_manager import manager

router = APIRouter()

api_key=os.getenv("GENAI_API_KEY")
genai.configure(api_key=api_key)

model = genai.GenerativeModel('gemini-1.5-flash')

BOT_EMAIL = "bot@whatsease.com"


def serialize_message(msg: Message):
    return {
        "id": str(msg.id),
        "sender": msg.sender,
        "recipient": msg.recipient,
        "content": msg.content,
        "timestamp": msg.timestamp.isoformat() if msg.timestamp else None,
        "status": msg.status.value if msg.status else "Sent",
        "is_bot_response": bool(msg.is_bot_response),
    }

async def bot_reply(text: str) -> str:
    try:
        
        response = await model.generate_content_async(text)
        return response.text
    except Exception as e:
        
        print(f"Error calling Gemini API: {e}")
        return "Sorry, I couldn't connect to my brain. Try again later."
@router.post("/messages", response_model=List[MessageOut])
async def send_message(data: MessageCreate, me: str = Depends(get_current_email), db: Session = Depends(get_db)):
    try:
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
            
            await manager.send_personal(data.recipient, payload)
            new_msg.status = MessageStatus.delivered
            db.commit()
        except Exception as e:
            print(f"Error sending to recipient {data.recipient}: {e}")

        try:
            
            await manager.send_personal(me, payload)
        except Exception as e:
            print(f"Error sending to sender {me}: {e}")

       
        bot_msg = None
        if data.recipient == BOT_EMAIL:
            try:
                reply_text = await bot_reply(data.content)
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
                    await manager.send_personal(me, payload_bot)
                except Exception as e:
                    print(f"Error sending bot response: {e}")
            except Exception as e:
                print(f"Error generating bot response: {e}")

        
        messages_to_return = [serialize_message(new_msg)]
        if bot_msg:
            messages_to_return.append(serialize_message(bot_msg))

        return messages_to_return

    except Exception as e:
        print(f"Unexpected error in send_message: {e}")
        return []


@router.get("/messages/{peer_email}", response_model=List[MessageOut])
def get_conversation(peer_email: str, me: str = Depends(get_current_email), db: Session = Depends(get_db)):
    msgs = db.query(Message).filter(
        ((Message.sender == me) & (Message.recipient == peer_email)) |
        ((Message.sender == peer_email) & (Message.recipient == me))
    ).order_by(Message.timestamp.asc()).all()
    return [serialize_message(m) for m in msgs]
