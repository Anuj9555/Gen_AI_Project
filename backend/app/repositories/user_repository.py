from typing import Optional, Dict
import uuid
from app.config.database import get_supabase_client
from app.models.user_model import UserModel


class UserRepository:
    def __init__(self):
        # In-memory storage cache / fallback
        self._users_by_email: Dict[str, UserModel] = {}
        self._users_by_id: Dict[str, UserModel] = {}

    def get_by_email(self, email: str) -> Optional[UserModel]:
        supabase = get_supabase_client()
        if supabase:
            try:
                res = supabase.table("profiles").select("*").eq("email", email.lower()).execute()
                if res.data and len(res.data) > 0:
                    d = res.data[0]
                    return UserModel(
                        id=d.get("id"),
                        user_id=d.get("user_id", d.get("id")),
                        email=d.get("email", email),
                        full_name=d.get("full_name", ""),
                        avatar_url=d.get("avatar_url"),
                        travel_preferences=d.get("travel_preferences") or {},
                        created_at=d.get("created_at"),
                        updated_at=d.get("updated_at")
                    )
            except Exception:
                pass
        return self._users_by_email.get(email.lower())

    def get_by_id(self, user_id: str) -> Optional[UserModel]:
        supabase = get_supabase_client()
        if supabase:
            try:
                res = supabase.table("profiles").select("*").eq("user_id", user_id).execute()
                if res.data and len(res.data) > 0:
                    d = res.data[0]
                    return UserModel(
                        id=d.get("id"),
                        user_id=d.get("user_id", d.get("id")),
                        email=d.get("email", ""),
                        full_name=d.get("full_name", ""),
                        avatar_url=d.get("avatar_url"),
                        travel_preferences=d.get("travel_preferences") or {},
                        created_at=d.get("created_at"),
                        updated_at=d.get("updated_at")
                    )
            except Exception:
                pass
        return self._users_by_id.get(user_id)

    def save(self, user: UserModel) -> UserModel:
        supabase = get_supabase_client()
        if supabase:
            try:
                data = {
                    "id": user.id,
                    "user_id": user.user_id,
                    "email": user.email.lower(),
                    "full_name": user.full_name,
                    "avatar_url": user.avatar_url,
                    "travel_preferences": user.travel_preferences,
                    "created_at": user.created_at,
                    "updated_at": user.updated_at,
                }
                supabase.table("profiles").upsert(data).execute()
            except Exception:
                pass
        self._users_by_email[user.email.lower()] = user
        self._users_by_id[user.user_id] = user
        return user


user_repository = UserRepository()
