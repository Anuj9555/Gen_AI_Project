from fastapi import APIRouter, Depends
from app.schemas.user_schema import UserProfileResponse, UserProfileUpdate
from app.schemas.response_schema import ApiResponse
from app.api.v1.controllers.user_controller import user_controller
from app.api.dependencies import get_current_user_id

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=ApiResponse[UserProfileResponse])
def get_current_user(user_id: str = Depends(get_current_user_id)):
    return user_controller.get_me(user_id)


@router.put("/me", response_model=ApiResponse[UserProfileResponse])
def update_current_user(update: UserProfileUpdate, user_id: str = Depends(get_current_user_id)):
    return user_controller.update_me(user_id, update)
