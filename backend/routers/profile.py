from fastapi import APIRouter,HTTPException,Depends,Form,File,UploadFile
from sqlalchemy.orm import Session
from models import User
from schemas.user_schemas import UserOut,UserUpdate
from database import get_db
from core.oauth2 import get_current_user
from datetime import date
import os
import shutil
router=APIRouter()
UPLOAD_DIR="static/"
@router.get("/get-profile",response_model=UserOut)
def get_profile(current_user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    user=db.query(User).filter(User.id==current_user.id).first()
    if not user:
        raise HTTPException(status_code=404,detail="user not found")
    
    profile_pic=user.profile_pic if user.profile_pic else None
   
    
    return {
        "id": user.id,
        "fullname": user.fullname,
        
        "phone": user.phone,
        "gender": user.gender,
        "dob": user.dob,
        "profile_pic": user.profile_pic if user.profile_pic else None
    }

@router.put("/update-profile/{id}")
def update_profile(id:int,
                   fullname:str=Form(None),
                   gender:str=Form(None),
                   dob:date=Form(None),
                   profile_pic:UploadFile=File(None),
                   current_user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    user=db.query(User).filter(User.id==id).first()
    if not user:
        return HTTPException(status_code=404,detail="user not found")
    user.fullname=fullname if fullname else user.fullname
    user.gender=gender if gender else user.gender
    user.dob=dob if dob else user.dob

    file_path = None
    if profile_pic:
        file_ext = profile_pic.filename.split(".")[-1]
        file_name = f"{user.phone}_profile_pic.{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, file_name)
        if user.profile_pic:

            os.remove(user.profile_pic)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(profile_pic.file, buffer)
    user.profile_pic=file_path if profile_pic else user.profile_pic

    db.commit()
    db.refresh(user)

    return "user updated successfully"
    
    