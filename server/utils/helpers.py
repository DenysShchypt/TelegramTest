from fastapi import HTTPException
from passlib.context import CryptContext
from utils.jwt_token import decode_access_token
from temp_storage import temp_storage

def serialize_user(user) -> dict:
    user["_id"] = str(user["_id"])
    return user

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

async def get_current_user(access_token: str):
    for user_id, token in temp_storage.items():
        if token == access_token:
            return {"user_id": user_id}
    raise HTTPException(status_code=401, detail="Invalid or expired token")


def validate_authorization(Authorization: str):

    if not Authorization:
        raise HTTPException(status_code=401, detail="Authorization token required")
    
    token = Authorization.split(" ")[1]
    payload = decode_access_token(token)
    
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    if user_id not in temp_storage or temp_storage[user_id] != token:
        raise HTTPException(status_code=401, detail="Token does not match or has expired")
    return