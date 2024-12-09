import os
from dotenv import load_dotenv

load_dotenv()

api_id = os.getenv("API_ID")
api_hash = os.getenv("API_HASH")
database_url = os.getenv("MD_BD")
secret_key = os.getenv("SECRET_KEY")