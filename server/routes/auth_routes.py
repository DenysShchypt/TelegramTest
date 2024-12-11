from fastapi import APIRouter, Header
from models.auth import User, UserLogin
from services.auth_service import register_user, login_user,logout_user_service,get_user_by_token
from utils.helpers import validate_authorization


router = APIRouter()

@router.post("/register")
async def create_user(user: User):
    response = await register_user(user)
    return response

@router.post("/login")
async def login_user_endpoint(user: UserLogin):
    response = await login_user(user)
    return response
@router.get("/refresh")
async def get_current_user_endpoint(Authorization: str = Header(None)):
        response = await get_user_by_token(Authorization)
        return response


@router.post("/logout")
async def logout_user_endpoint(Authorization: str = Header(None)):
    return logout_user_service(Authorization)
