from fastapi import APIRouter,Depends,HTTPException
from database import get_db
from sqlalchemy.orm import Session
from models import Message
from models import User,Contact
from datetime import datetime
from core.oauth2 import get_current_user
from sqlalchemy import or_,and_
router=APIRouter()



@router.get("/chats")
def my_chats(current_user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    msgs=db.query(Message).filter(((Message.sender_id== current_user.id) | (Message.recipient_id==current_user.id)) & (Message.sender_id != Message.recipient_id) ).order_by(Message.timestamp.desc()).all()
    
    
    unique_contacts={}
    print(msgs)
    for msg in msgs:
        if msg.sender_id != current_user.id:
            peer_user=msg.sender
        else:
            peer_user=msg.recipient


        contact=db.query(Contact).filter(Contact.owner_id==current_user.id,Contact.contact_id==peer_user.id).first()

        if not contact:
            contact = Contact(
                owner_id=current_user.id,
                contact_id=peer_user.id,
                saved_name=peer_user.phone,
                created_at=datetime.utcnow()
            )
            db.add(contact)
            db.commit()
            db.refresh(contact)

        person_msg=db.query(Message).filter(or_(and_(Message.sender_id==current_user.id,Message.recipient_id==peer_user.id),and_(Message.sender_id==peer_user.id,Message.recipient_id==current_user.id)) ).order_by(Message.timestamp.desc()).first()

        unique_contacts[peer_user.id]={"id":peer_user.id,"saved_name":contact.saved_name if contact else None,"phone":peer_user.phone,"profile_pic":peer_user.profile_pic,"last_msg":person_msg.content}
        
        
    return list(unique_contacts.values()) 


@router.get("/my-contacts")
def my_contact(current_user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    contacts=db.query(Contact).filter(Contact.owner_id==current_user.id).all()
    if not contacts:
        raise HTTPException(status_code=404,detail="no contacts")
    all_contacts=[]
    print(contacts)
    for con in contacts:
        all_contacts.append(
            {
                "id":con.contact_id,
                "phone":con.saved_contact.phone,
                "saved_name":con.saved_name if con.saved_name else None
            }
        )
    
    return all_contacts

