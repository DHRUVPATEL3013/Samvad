from fastapi import Depends,APIRouter,HTTPException
from database import get_db
from sqlalchemy import or_
from sqlalchemy.orm import Session
from models import Contact,User
from schemass import AddContact
from auth import get_current_email
from core.oauth2 import get_current_user
from datetime import datetime
router=APIRouter()




@router.post("/add-contact")
def add_contact(data:AddContact,current_user:User=Depends(get_current_user),db:Session=Depends(get_db)):
   

    contact=db.query(User).filter(or_(User.phone==data.contact_phone)).first()
    if not contact:
        raise HTTPException(status_code=404,detail="no user found with this email or phone")
    
    cont=db.query(Contact).filter(Contact.owner_id==current_user.id,Contact.contact_id==contact.id).first()
    if cont:
        raise HTTPException(status_code=400,detail="already added if you want to change the name please update name.")
    new_contact=Contact(
        owner_id=current_user.id,
        contact_id=contact.id,
        saved_name=data.saved_name,
        created_at=datetime.utcnow()
    )
    db.add(new_contact)
    db.commit()
    db.refresh(new_contact)

    return "contact added successfully"



@router.put("/update-contact-name/{id}")
def update_contact_name(id:int,new_name:str,current_user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    contact=db.query(Contact).filter(Contact.owner_id==current_user.id,Contact.contact_id==id).first()
    if not contact:
        raise HTTPException(status_code=404,detail="contact not found")
    contact.saved_name=new_name
    print("hello there")
    
    db.commit()
    db.refresh(contact)

    return "name updatred successfully"
