from telethon import TelegramClient,sessions
from fastapi import HTTPException
from telethon.tl.types import User, Chat, Channel
from telethon.errors import SessionPasswordNeededError, PhoneCodeInvalidError, PhoneCodeExpiredError
from dotenv import load_dotenv
import os
import asyncio
from time import sleep
from temp_storage import temp_storage
from config import api_id,api_hash

load_dotenv()

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


async def send_code_to_phone(phone_number: str, telegram_client: TelegramClient):
    try:
        if not telegram_client.is_connected():
            await telegram_client.connect()
        
        print(f"Sending code to {phone_number}...")
        result = await telegram_client.send_code_request(phone_number)
        temp_storage[phone_number] = result.phone_code_hash
        
        await telegram_client.disconnect()
        return {"message": "Code sent successfully"}
    except Exception as e:

        if "AuthRestartError" in str(e):
            print("Restarting authorization process...")
            await asyncio.sleep(90) 

            telegram_client = TelegramClient("session_name", api_id, api_hash)
            return await send_code_to_phone(phone_number, telegram_client)
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


async def confirm_code(phone_number: str, code: str, telegram_client: TelegramClient):
    if phone_number not in temp_storage:
        return {"error": "Phone code hash not found. Please request a new code."}

    phone_code_hash = temp_storage[phone_number]

    try:
        if not telegram_client.is_connected():
            await telegram_client.connect()

        result = await telegram_client.sign_in(phone_number, code, phone_code_hash=phone_code_hash)

        if isinstance(result, User): 
            del temp_storage[phone_number] 
            return {"message": f"Successfully logged in as {result.first_name}"}

        return {"message": "Logged in, but response type is unexpected."}

    except PhoneCodeInvalidError:
        return {"error": "Invalid code. Please try again."}
    except PhoneCodeExpiredError:
        return {"error": "Code has expired. Please request a new code."}
    except SessionPasswordNeededError:
        return {"error": "Two-factor authentication is enabled. Please provide your password."}
    except Exception as e:
        return {"error": f"An unexpected error occurred: {str(e)}"}
    finally:
        await telegram_client.disconnect()

async def get_all_chats(telegram_client: TelegramClient):
    try:
        if not telegram_client.is_connected():
            await telegram_client.connect()

        dialogs = await telegram_client.get_dialogs()

        chats = []
        for dialog in dialogs:
            if isinstance(dialog.entity, (User, Chat, Channel)):  
                chats.append({
                    "id": dialog.id,
                    "name": dialog.name,
                    "type": type(dialog.entity).__name__
                })

        return {"chats": chats}

    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}
    finally:
        await telegram_client.disconnect()

async def get_chat_messages(chat_id: int, telegram_client: TelegramClient, limit: int = 50):
    try:

        if not telegram_client.is_connected():
            await telegram_client.connect()

        messages = []
        async for message in telegram_client.iter_messages(chat_id, limit=limit):
            messages.append({
                "id": message.id,
                "text": message.text,
                "date": message.date.isoformat()
            })

        return {"messages": messages}

    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}
async def clean():
    try:
        temp_storage.clear()
        return {"message": "Temporary storage cleared successfully"}
    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}