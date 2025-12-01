from fastapi import HTTPException,status,Depends
from typing import Annotated
from sqlalchemy.orm import Session
from database import get_db
from .create_token import verify_token
from fastapi.security import OAuth2PasswordBearer,HTTPBearer,HTTPAuthorizationCredentials

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
security = HTTPBearer()


async def get_current_user(token: HTTPAuthorizationCredentials = Depends(security),db:Session=Depends(get_db)):
    token=token.credentials
    print(token)
    print("dshf")
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    user=verify_token(token,credentials_exception,db)
    return user