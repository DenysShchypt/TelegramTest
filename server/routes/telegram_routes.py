from fastapi import APIRouter, Header, HTTPException
from telethon import TelegramClient
from models.telegram import SendCodeRequest
from services.telegram_service import initialize_telegram_client, send_code_to_phone,confirm_code, get_all_chats, get_chat_messages
from utils.helpers import validate_authorization
from models.telegram import ConfirmCodeRequest
from config import api_id,api_hash
import os


router = APIRouter()
telegram_client= TelegramClient("session_name", api_id, api_hash)

@router.post("/send-code")
async def send_code(request: SendCodeRequest, Authorization: str = Header(None)):
    global telegram_client
    try:
        validate_authorization(Authorization)
        if telegram_client is None or not telegram_client.is_connected():
            telegram_client = await initialize_telegram_client()
        response = await send_code_to_phone(request.phone_number, telegram_client)
        return response
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
    
    
@router.post("/confirm-code")
async def confirm_code_api(request: ConfirmCodeRequest,Authorization: str = Header(None)):
    try:
        validate_authorization(Authorization)          
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
    
@router.get("/chats")
async def get_chats(Authorization: str = Header(None)):
    try:
        validate_authorization(Authorization)      
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
    
@router.get("/chats/{chat_id}/messages")
async def get_messages(chat_id: int, limit: int = 50,Authorization: str = Header(None)):
    try:
        validate_authorization(Authorization) 
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
    
@router.post("/logout-telegram")
async def logout_telegram(Authorization: str = Header(None)):
    global telegram_client
    try:
        validate_authorization(Authorization) 
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