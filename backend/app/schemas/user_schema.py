from typing import Optional, Dict, Any
from pydantic import BaseModel, Field

EMAIL_REGEX = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"


class UserProfileResponse(BaseModel):
    id: str
    user_id: str
    email: str = Field(..., pattern=EMAIL_REGEX)
    full_name: str
    avatar_url: Optional[str] = None
    travel_preferences: Optional[Dict[str, Any]] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    travel_preferences: Optional[Dict[str, Any]] = None
