
from datetime import datetime,timezone,timedelta
from .config import SECRET_KEY,ALGORITHM
from jose import jwt,JWTError
from sqlalchemy.orm import Session
from schemas.jwt_schemas import TokenData
from models import User
def create_access_token(data: dict):
    to_encode = data.copy()
   
    expire = datetime.now(timezone.utc) + timedelta(minutes=100)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token,credentials_exception,db:Session):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        phone = payload.get("sub")
        if phone is None:
            raise credentials_exception
        token_data = TokenData(phone=phone)
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.phone==token_data.phone).first()
    
    if user is None:
        raise credentials_exception
    return user