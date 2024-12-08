import jwt
from datetime import datetime, timedelta
import os
from fastapi import HTTPException
from dotenv import load_dotenv
import logging

load_dotenv()

secret_key = os.getenv("SECRET_KEY")

def create_access_token(data: dict, expires_delta: timedelta = timedelta(hours=1)):
    """Generate JWT token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, secret_key, algorithm="HS256")
    return encoded_jwt
def decode_access_token(token: str):
    """Decode JWT token"""
    try:
        payload = jwt.decode(token, secret_key, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        logging.error("Token has expired")
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        logging.error("Invalid token")
        raise HTTPException(status_code=401, detail="Invalid token")
