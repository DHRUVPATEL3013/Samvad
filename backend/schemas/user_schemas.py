from pydantic import BaseModel,EmailStr
from datetime import date,datetime
from typing import Optional
class UserCreate(BaseModel):
    fullname:str
    phone:str
    gender:str
    dob:date

class UserLogin(BaseModel):
    phone:str

class UserOut(BaseModel):
    id:int
    fullname: str
    phone:str
    gender:str
    dob:date
    profile_pic:Optional[str]=None
    

class UserUpdate(BaseModel):
    fullname:str
    gender:str
    dob:date
    