import motor.motor_asyncio
from config import database_url

client = motor.motor_asyncio.AsyncIOMotorClient(database_url)
db = client.mydatabase
users_collection = db["users"]
