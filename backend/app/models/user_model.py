from typing import Optional, Dict, Any
from datetime import datetime, timezone
from pydantic import BaseModel, Field


class UserModel(BaseModel):
    id: str
    user_id: str
    email: str
    full_name: str
    avatar_url: Optional[str] = None
    hashed_password: Optional[str] = None
    travel_preferences: Dict[str, Any] = Field(default_factory=dict)
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
