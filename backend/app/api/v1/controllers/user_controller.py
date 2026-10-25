from app.schemas.user_schema import UserProfileResponse, UserProfileUpdate
from app.schemas.response_schema import ApiResponse
from app.services.user_service import user_service


class UserController:
    @staticmethod
    def get_me(user_id: str) -> ApiResponse[UserProfileResponse]:
        profile = user_service.get_profile(user_id)
        return ApiResponse.success_response(data=profile)

    @staticmethod
    def update_me(user_id: str, update: UserProfileUpdate) -> ApiResponse[UserProfileResponse]:
        profile = user_service.update_profile(user_id, update)
        return ApiResponse.success_response(data=profile, message="Profile updated")


user_controller = UserController()
