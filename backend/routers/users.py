from fastapi import APIRouter, Depends, HTTPException, status,UploadFile,Form,File
from sqlalchemy.orm import Session
from database import get_db
from core.create_token import create_access_token
from schemas.user_schemas import UserCreate,UserOut,UserLogin
from schemas.jwt_schemas import TokenOut,TokenData
from datetime import datetime,date
from models import User
import os
import shutil
router = APIRouter()
UPLOAD_DIR="static/"
@router.post("/signup")
def signup(
    fullname:str=Form(...),
    phone:str=Form(...),
    gender:str=Form(...),
    dob:date=Form(...),
    profile_pic:UploadFile=File(None),
    db: Session = Depends(get_db)):
    user = db.query(User).filter(User.phone == phone).first()
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")
    file_path = None
    if profile_pic:
        file_ext = profile_pic.filename.split(".")[-1]
        file_name = f"{phone}_profile_pic.{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, file_name)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(profile_pic.file, buffer)
    new_user = User(fullname=fullname,phone=phone,gender=gender,dob=dob,profile_pic=file_path,created_at=datetime.utcnow())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    # token = create_access_token(new_user.email)
    # return {"access_token": token, "email": new_user.email}
    return "user registered successfully"



@router.post("/login", response_model=TokenOut)
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.phone == data.phone).first()
    if not user:
        raise HTTPException(status_code=404,detail="user not found")
    
    token = create_access_token({"sub":user.phone})
    return {"access_token": token, "token_type": "Bearer"}
