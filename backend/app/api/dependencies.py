from typing import Optional
from fastapi import Header, HTTPException, status
from app.security.jwt import decode_access_token
from app.exceptions.base_exception import AuthenticationError


def get_current_user_id(authorization: Optional[str] = Header(None)) -> str:
    """
    Extracts user ID from Authorization: Bearer <token>.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or malformed Authorization header. Expected 'Bearer <token>'.",
        )

    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload or not payload.get("sub"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token.",
        )

    return payload["sub"]
