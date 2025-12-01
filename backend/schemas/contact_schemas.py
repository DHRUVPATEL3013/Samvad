from pydantic import BaseModel

class AddContact(BaseModel):
    contact_phone:str
    saved_name:str