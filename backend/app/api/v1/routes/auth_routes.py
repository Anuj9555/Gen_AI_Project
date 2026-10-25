from fastapi import APIRouter, Depends
from app.schemas.auth_schema import RegisterRequest, LoginRequest, AuthTokenResponse
from app.schemas.response_schema import ApiResponse
from app.api.v1.controllers.auth_controller import auth_controller
from app.api.dependencies import get_current_user_id

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=ApiResponse[AuthTokenResponse])
def register(req: RegisterRequest):
    return auth_controller.register(req)


@router.post("/login", response_model=ApiResponse[AuthTokenResponse])
def login(req: LoginRequest):
    return auth_controller.login(req)


@router.post("/logout", response_model=ApiResponse[None])
def logout():
    return auth_controller.logout()


@router.post("/refresh", response_model=ApiResponse[AuthTokenResponse])
def refresh(user_id: str = Depends(get_current_user_id)):
    return auth_controller.refresh(user_id)
