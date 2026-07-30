from fastapi import APIRouter, Depends, HTTPException, status, Header
from typing import Optional
from app.models.user import UserProfile, UserLogin, UserRegister
from app.core.supabase import supabase_client

router = APIRouter()

async def get_current_user(authorization: Optional[str] = Header(None)) -> UserProfile:
    """
    FastAPI Dependency to validate Bearer token from Authorization Header.
    In local development without Supabase configured, returns a mock development user.
    """
    if not authorization:
        # Fallback Dev User for local offline testing
        return UserProfile(
            id="00000000-0000-0000-0000-000000000001",
            email="developer@omnimind.ai",
            full_name="OmniMind Developer",
            avatar_url="https://api.dicebear.com/7.x/bottts/svg?seed=OmniMind"
        )
    
    token = authorization.replace("Bearer ", "").strip()
    
    if not supabase_client:
        return UserProfile(
            id="00000000-0000-0000-0000-000000000001",
            email="developer@omnimind.ai",
            full_name="OmniMind Developer"
        )

    try:
        user_response = supabase_client.auth.get_user(token)
        if not user_response or not user_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token"
            )
        
        user_data = user_response.user
        return UserProfile(
            id=user_data.id,
            email=user_data.email or "",
            full_name=user_data.user_metadata.get("full_name"),
            avatar_url=user_data.user_metadata.get("avatar_url")
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}"
        )

@router.post("/register", summary="Register New User")
async def register(user_data: UserRegister):
    """
    Registers a user with email & password in Supabase Auth.
    """
    if not supabase_client:
        return {"message": "Supabase not configured. Mock registration active.", "user": user_data.email}
    
    try:
        res = supabase_client.auth.sign_up({
            "email": user_data.email,
            "password": user_data.password,
            "options": {
                "data": {
                    "full_name": user_data.full_name
                }
            }
        })
        return {"message": "User registered successfully", "user_id": res.user.id if res.user else None}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/me", response_model=UserProfile, summary="Get Current Authenticated User")
async def get_me(current_user: UserProfile = Depends(get_current_user)):
    return current_user
