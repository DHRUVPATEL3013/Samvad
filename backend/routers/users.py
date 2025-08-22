from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from schemas import UserCreate, TokenOut
from auth import hash_password, verify_password, create_access_token
from models import User

router = APIRouter()

@router.post("/signup", response_model=TokenOut)
def signup(data: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = User(email=data.email, password=hash_password(data.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    token = create_access_token(new_user.email)
    return {"access_token": token, "email": new_user.email}

@router.post("/login", response_model=TokenOut)
def login(data: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token(user.email)
    return {"access_token": token, "email": user.email}
