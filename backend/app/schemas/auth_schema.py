from typing import Optional
from pydantic import BaseModel, Field

EMAIL_REGEX = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"


class RegisterRequest(BaseModel):
    email: str = Field(..., pattern=EMAIL_REGEX, description="Valid email address")
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=2)


class LoginRequest(BaseModel):
    email: str = Field(..., pattern=EMAIL_REGEX, description="Valid email address")
    password: str = Field(..., min_length=1)


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int = 3600
    refresh_token: Optional[str] = None
    user_id: str
    email: str
    full_name: Optional[str] = None
