from pydantic import BaseModel

class SendCodeRequest(BaseModel):
    phone_number: str

class ConfirmCodeRequest(BaseModel):
    phone_number: str
    code: str
