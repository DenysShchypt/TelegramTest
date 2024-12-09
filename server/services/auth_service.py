from fastapi import HTTPException
from utils.helpers import hash_password,serialize_user,verify_password
from utils.jwt_token import create_access_token,decode_access_token
from database import users_collection
from temp_storage import temp_storage
async def register_user(user):
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    hashed_password = hash_password(user.password)
    user_dict = user.dict()
    user_dict["password"] = hashed_password

    result = await users_collection.insert_one(user_dict)
    new_user = await users_collection.find_one({"_id": result.inserted_id})

    del new_user["password"]

    access_token = create_access_token({"user_id": str(new_user["_id"])})
    temp_storage[str(new_user["_id"])] = access_token

    return {"user": serialize_user(new_user), "access_token": access_token}

async def login_user(user):
    db_user = await users_collection.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid username or password")
    
    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid username or password")

    access_token = create_access_token({"user_id": str(db_user["_id"])})
    temp_storage[str(db_user["_id"])] = access_token
    del db_user["password"]

    return {"user": serialize_user(db_user), "access_token": access_token}

def logout_user_service(authorization: str):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=400, detail="Authorization header missing or invalid")
    
    access_token = authorization.split(" ")[1]

    try:
        decoded_token = decode_access_token(access_token)
        user_id = decoded_token.get("user_id")

        if user_id in temp_storage and temp_storage[user_id] == access_token:
            del temp_storage[user_id]
            return {"message": "Logout successful"}
        
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    except HTTPException as e:
        raise e