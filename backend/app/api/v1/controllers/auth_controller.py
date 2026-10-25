from app.schemas.auth_schema import RegisterRequest, LoginRequest, AuthTokenResponse
from app.schemas.response_schema import ApiResponse
from app.services.auth_service import auth_service


class AuthController:
    @staticmethod
    def register(req: RegisterRequest) -> ApiResponse[AuthTokenResponse]:
        data = auth_service.register(req)
        return ApiResponse.success_response(data=data, message="Registration successful")

    @staticmethod
    def login(req: LoginRequest) -> ApiResponse[AuthTokenResponse]:
        data = auth_service.login(req)
        return ApiResponse.success_response(data=data, message="Login successful")

    @staticmethod
    def logout() -> ApiResponse[None]:
        return ApiResponse.success_response(data=None, message="Logout successful")

    @staticmethod
    def refresh(user_id: str) -> ApiResponse[AuthTokenResponse]:
        data = auth_service.refresh(user_id)
        return ApiResponse.success_response(data=data, message="Token refreshed")


auth_controller = AuthController()
