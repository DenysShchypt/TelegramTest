import os
import asyncio
from time import sleep
from telethon import TelegramClient
from fastapi import HTTPException
from telethon.tl.types import User, Chat, Channel
from telethon.errors import SessionPasswordNeededError, PhoneCodeInvalidError, PhoneCodeExpiredError
from dotenv import load_dotenv

load_dotenv()

api_id = os.getenv("api_id")
api_hash = os.getenv("api_hash")
temp_storage = {}

# Create a Telegram client instance
# client= TelegramClient("session_name", api_id, api_hash)


# async def send_code_to_phone(phone_number: str,telegram_client: TelegramClient):
#     try:

#         if not telegram_client.is_connected():
#             await telegram_client.connect()
#         print(f"Sending code to {phone_number}...")
#         result = await telegram_client.send_code_request(phone_number)
#         temp_storage[phone_number] = result.phone_code_hash
#         await telegram_client.disconnect()
#         return {"message": "Code sent successfully"}
#     except Exception as e:
#         if "AuthRestartError" in str(e):
#             print("Restarting authorization process...")
#             await asyncio.sleep(90)
#             return await send_code_to_phone(phone_number)
#         raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

async def send_code_to_phone(phone_number: str, telegram_client: TelegramClient):
    try:
        # Ensure the client is connected
        if not telegram_client.is_connected():
            await telegram_client.connect()
        
        print(f"Sending code to {phone_number}...")
        result = await telegram_client.send_code_request(phone_number)
        temp_storage[phone_number] = result.phone_code_hash
        
        # Disconnect client after sending the code
        await telegram_client.disconnect()
        return {"message": "Code sent successfully"}
    except Exception as e:
        # Handle specific cases where reauthorization might be needed
        if "AuthRestartError" in str(e):
            print("Restarting authorization process...")
            await asyncio.sleep(90)  # Wait for some time before retrying
            # Reinitialize the client
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

        # Confirm the code
        result = await telegram_client.sign_in(phone_number, code, phone_code_hash=phone_code_hash)

        # Successful login
        if isinstance(result, User):  # Check if the result is a User object
            del temp_storage[phone_number]  # Remove the code hash from storage
            return {"message": f"Successfully logged in as {result.first_name}"}

        # Handle other types of responses if necessary
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

        # Отримання всіх діалогів
        dialogs = await telegram_client.get_dialogs()

        chats = []
        for dialog in dialogs:
            if isinstance(dialog.entity, (User, Chat, Channel)):  # Перевіряємо тип
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

# async def get_chat_messages(chat_id: int, limit: int = 50, telegram_client: TelegramClient):
#     try:
#         if not telegram_client.is_connected():
#             await telegram_client.connect()

#         # Отримання повідомлень
#         messages = []
#         async for message in client.iter_messages(chat_id, limit=limit, telegram_client):
#             messages.append({
#                 "id": message.id,
#                 "text": message.text,
#                 "date": message.date.isoformat()
#             })

#         return {"messages": messages}

#     except Exception as e:
#         return {"error": f"An error occurred: {str(e)}"}
#     finally:
#         await telegram_client.disconnect()

async def get_chat_messages(chat_id: int, telegram_client: TelegramClient, limit: int = 50):
    try:
        # Ensure the client is connected before attempting to use it
        if not telegram_client.is_connected():
            await telegram_client.connect()

        # Get messages from the specified chat
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
        # Clear the temporary storage
        temp_storage.clear()
        return {"message": "Temporary storage cleared successfully"}
    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}






































# async def send_sms_code(phone_number: str):
#     try:
#         await client.connect()
#         print(f"Sending code to {phone_number}...")
#         result = await client.send_code_request(phone_number)
#         temp_storage[phone_number] = result.phone_code_hash
#         await client.disconnect()
#         return {"message": "Code sent successfully"}
#     except Exception as e:
#         if "AuthRestartError" in str(e):
#             print("Restarting authorization process...")
#             await asyncio.sleep(30)  # Wait 30 seconds before retrying
#             return await send_sms_code(phone_number)
#         raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


# async def verify_code(phone_number: str, code: str):
#     try:
#         await client.connect()
#         if phone_number not in temp_storage:
#             raise ValueError("Phone code hash not found. Did you send the code first?")
#         result = await client.sign_in(
#             phone=phone_number,
#             code=code,
#             phone_code_hash=temp_storage[phone_number]
#         )
#         await client.disconnect()
#         return {"message": "Authorization successful", "user": result.to_dict()}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


# async def authorize_user(phone_number: str, code: str = None):
#     global client
#     try:
#         await client.start()

#         # Перевіряємо, чи користувач уже авторизований
#         if not await client.is_user_authorized():
#             if not code:
#                 # Якщо код не надано, відправляємо код для авторизації
#                 await client.send_code_request(phone_number)
#                 return "Code sent to the phone, please enter it."
#             else:
#                 # Якщо код надано, виконуємо авторизацію
#                 await client.sign_in(phone_number, code)
#                 return "User authorized successfully."
#         else:
#             # Якщо вже авторизовано, повертаємо відповідь
#             return "User is already authorized."

#     except Exception as e:
#         if "ResendCodeRequest" in str(e):
#             # Якщо помилка виникає через занадто багато спроб, чекаємо деякий час
#             sleep(30)  # Чекаємо 30 секунд
#             return "Too many requests, please wait and try again later."
#         raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
