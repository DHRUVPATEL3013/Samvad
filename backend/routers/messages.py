from fastapi import APIRouter, Depends,HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemass import MessageCreate, MessageOut
import asyncio
from core.oauth2 import get_current_user
from models import Message, MessageStatus,User,Contact

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


def serialize_message(msg: Message,db:Session=Depends(get_db)):
    print("hrello")
    

    contact=db.query(Contact).filter(Contact.owner_id==msg.recipient_id,Contact.contact_id==msg.sender_id).first()
    print("DEBUG saved_name:", msg.id, type(contact.saved_name) if contact else None)
    print(msg.recipient_id)
    
    return {
        "id": str(msg.id),
        "sender": msg.sender.phone if msg.sender else None,
        "contact_id":contact.contact_id if contact else msg.recipient_id,
        "sender_saved_name":contact.saved_name if contact else msg.sender.phone,
        "recipient": msg.recipient.phone if msg.recipient else None,
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
async def send_message(data: MessageCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    recipient=db.query(User).filter(User.phone==data.phone).first()
    if not recipient:
        raise HTTPException(status_code=404,detail="User Not Found")
    try:
        new_msg = Message(
            sender_id=current_user.id,
            recipient_id=recipient.id,
            content=data.content,
            is_bot_response=False,
            status=MessageStatus.sent
        )
        db.add(new_msg)
        db.commit()
        db.refresh(new_msg)

        payload = {"type": "message", "data": serialize_message(new_msg,db)}
        if await manager.is_online(data.phone):
            try:
                    await manager.send_personal(data.phone, payload)
                    new_msg.status = MessageStatus.delivered
                    db.commit()

            except Exception as e:
                print(f"Error sending to recipient {data.phone}: {e}")
        else:
            print("recipient is offline")

        try:
            
            await manager.send_personal(current_user.phone, payload)
        except Exception as e:
            print(f"Error sending to sender {current_user.phone}: {e}")

       
        # bot_msg = None
        # if data.phone == BOT_EMAIL:
        #     try:
        #         reply_text = await bot_reply(data.content)
        #         bot_msg = Message(
        #             sender=BOT_EMAIL,
        #             recipient=current_user,
        #             content=reply_text,
        #             is_bot_response=True,
        #             status=MessageStatus.delivered
        #         )
        #         db.add(bot_msg)
        #         db.commit()
        #         db.refresh(bot_msg)

        #         payload_bot = {"type": "message", "data": serialize_message(bot_msg,db)}
        #         try:
        #             await manager.send_personal(current_user.phone, payload_bot)
        #         except Exception as e:
        #             print(f"Error sending bot response: {e}")
        #     except Exception as e:
        #         print(f"Error generating bot response: {e}")

        
        messages_to_return = [serialize_message(new_msg,db)]
        # if bot_msg:
        #     messages_to_return.append(serialize_message(bot_msg,db))

        return messages_to_return

    except Exception as e:
        print(f"Unexpected error in send_message: {e}")
        return []


@router.get("/messages/{peer_phone}", response_model=List[MessageOut])
def get_conversation(peer_phone: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    peer_user=db.query(User).filter(User.phone==peer_phone).first()
    if not peer_user:
        return []
    print(current_user.id)
    msgs = db.query(Message).filter(
        ((Message.sender_id == current_user.id) & (Message.recipient_id == peer_user.id)) |
        ((Message.sender_id == peer_user.id) & (Message.recipient_id == current_user.id))
    ).order_by(Message.timestamp.asc()).all()
    return [serialize_message(m,db) for m in msgs]



