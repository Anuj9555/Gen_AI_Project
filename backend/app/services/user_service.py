from app.repositories.user_repository import user_repository
from app.schemas.user_schema import UserProfileResponse, UserProfileUpdate
from app.exceptions.base_exception import NotFoundError


class UserService:
    def get_profile(self, user_id: str) -> UserProfileResponse:
        user = user_repository.get_by_id(user_id)
        if not user:
            raise NotFoundError("User profile not found")
        return UserProfileResponse(
            id=user.id,
            user_id=user.user_id,
            email=user.email,
            full_name=user.full_name,
            avatar_url=user.avatar_url,
            travel_preferences=user.travel_preferences,
            created_at=user.created_at,
            updated_at=user.updated_at,
        )

    def update_profile(self, user_id: str, update: UserProfileUpdate) -> UserProfileResponse:
        user = user_repository.get_by_id(user_id)
        if not user:
            raise NotFoundError("User profile not found")

        if update.full_name is not None:
            user.full_name = update.full_name
        if update.avatar_url is not None:
            user.avatar_url = update.avatar_url
        if update.travel_preferences is not None:
            user.travel_preferences = update.travel_preferences

        user_repository.save(user)
        return self.get_profile(user_id)


user_service = UserService()
