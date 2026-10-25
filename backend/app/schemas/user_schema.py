from typing import Optional, Dict, Any
from pydantic import BaseModel, EmailStr


class UserProfileResponse(BaseModel):
    id: str
    user_id: str
    email: EmailStr
    full_name: str
    avatar_url: Optional[str] = None
    travel_preferences: Optional[Dict[str, Any]] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    travel_preferences: Optional[Dict[str, Any]] = None
