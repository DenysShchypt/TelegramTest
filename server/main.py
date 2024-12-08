from fastapi import FastAPI, HTTPException,Header
from pydantic import BaseModel, Field
from telethon import TelegramClient,sessions
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from passlib.context import CryptContext
from utils import send_code_to_phone,confirm_code,get_all_chats,get_chat_messages
from jwt_token import create_access_token,decode_access_token
import motor.motor_asyncio
import os
import logging

load_dotenv()
api_id = os.getenv("api_id")
api_hash = os.getenv("api_hash")
database = os.getenv("MD_BD")
secret_key = os.getenv("SECRET_KEY")

# Ініціалізація FastAPI та CORS
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)
 
telegram_client= TelegramClient("session_name", api_id, api_hash)


# Підключення до MongoDB
client = motor.motor_asyncio.AsyncIOMotorClient(database)
db = client.mydatabase  
collection = db.users  
temp_storage = {}

# Ініціалізація CryptContext для хешування паролів
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Створення Pydantic моделі для користувачів
class User(BaseModel):
    username: str
    email: str
    password: str = Field(..., min_length=6) 
    
    
class UserLogin(BaseModel):
    username: str
    password: str
    
class ConnectTelegramRequest(BaseModel):
    user_id: str
    
class SendCodeRequest(BaseModel):
    phone_number: str

class ConfirmCodeRequest(BaseModel):
    phone_number: str
    code: str

async def initialize_telegram_client():
    session_file = "session_name"
    # Create a new session if it doesn't exist
    if os.path.exists(session_file):
        session = sessions.FileSession(session_file)
    else:
        session = sessions.StringSession()
    
    # Initialize the Telegram client
    client = TelegramClient(session, api_id, api_hash)
    
    # Connect to the Telegram client
    await client.connect()
    
    # Return the client instance
    return client


# Створення допоміжної функції для коректного відображення _id як строки
def serialize_user(user) -> dict:
    user["_id"] = str(user["_id"])  # Перетворення ObjectId на string
    return user

def hash_password(password: str) -> str:
    return pwd_context.hash(password)
# Ініціалізація CryptContext для хешування паролів
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Функція для перевірки пароля
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)
# Функція для перевірки токена
async def get_current_user(access_token: str):
    for user_id, token in temp_storage.items():
        if token == access_token:
            return {"user_id": user_id}
    raise HTTPException(status_code=401, detail="Invalid or expired token")

@app.post("/users/register")
async def create_user(user: User):
    existing_user = await collection.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_password = hash_password(user.password)
    user_dict = user.dict()
    user_dict["password"] = hashed_password  # Заміна пароля на хеш у даних користувача

    result = await collection.insert_one(user_dict)
    new_user = await collection.find_one({"_id": result.inserted_id})
    del new_user["password"]
    access_token = create_access_token({"user_id": str(new_user["_id"])})
    temp_storage[str(new_user["_id"])] = access_token

    return {"user": serialize_user(new_user), "access_token": access_token}

@app.post("/users/login")
async def login_user(user: UserLogin):
    db_user = await collection.find_one({"username": user.username})
    
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid username or password")   
    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid username or password")

    access_token = create_access_token({"user_id": str(db_user["_id"])})
    temp_storage[str(db_user["_id"])] = access_token
    del db_user["password"]

    return {"user": serialize_user(db_user), "access_token": access_token}


@app.post("/users/logout")
async def logout_user(Authorization: str = Header(None)):

    if not Authorization or not Authorization.startswith("Bearer "):
        raise HTTPException(status_code=400, detail="Authorization header missing or invalid")

    access_token = Authorization.split(" ")[1]

    try:
        decoded_token = decode_access_token(access_token)
        user_id = decoded_token.get("user_id")

        if user_id in temp_storage and temp_storage[user_id] == access_token:
            del temp_storage[user_id]
            return {"message": "Logout successful"}

        raise HTTPException(status_code=401, detail="Invalid or expired token")
    except HTTPException as e:
        logging.error(f"Logout failed: {e}")
        raise e


@app.post("/send-code")
async def send_code(request: SendCodeRequest,Authorization: str = Header(None)):
    global telegram_client
    try:
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
        
        if telegram_client is None or not telegram_client.is_connected():
            telegram_client = await initialize_telegram_client()  # Function to create a new instance of telegram client
        response = await send_code_to_phone(request.phone_number, telegram_client)
        return response
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@app.post("/confirm-code")
async def confirm_code_api(request: ConfirmCodeRequest,Authorization: str = Header(None)):
    try:
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
          
        response = await confirm_code(
            phone_number=request.phone_number,
            code=request.code,
            telegram_client=telegram_client
        )
        return response
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@app.get("/chats/")
async def get_chats(Authorization: str = Header(None)):
    try:
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
        
        if telegram_client.is_connected():
            response = await get_all_chats(telegram_client)
            return response
        else:
            await telegram_client.start()
            if telegram_client.is_connected():
                response = await get_all_chats(telegram_client)
                return response
            else:
                return {"error": "No active Telegram session found"}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
 
@app.get("/chats/{chat_id}/messages/")
async def get_messages(chat_id: int, limit: int = 50,Authorization: str = Header(None)):
    try:
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
        if telegram_client.is_connected():
            response = await get_chat_messages(chat_id, telegram_client, limit)
            return response
        else:
            await telegram_client.start()
            if telegram_client.is_connected():
                response = await get_chat_messages(chat_id, telegram_client, limit)
                return response
            else:
                return {"error": "No active Telegram session found"}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@app.post("/logout-telegram")
async def logout_telegram(Authorization: str = Header(None)):
    global telegram_client
    try:
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
        if telegram_client.is_connected():
            await telegram_client.log_out()  
            await telegram_client.disconnect() 

            session_file = "session_name"  
            if os.path.exists(session_file):
                os.remove(session_file)
                
            return {"message": "Successfully logged out of Telegram account"}
        else:
            return {"message": "No active Telegram session found"}
    except Exception as e:
        return {"error": f"An error occurred while logging out: {str(e)}"}



































