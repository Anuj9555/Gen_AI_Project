import uuid
from typing import Optional
from app.repositories.user_repository import user_repository
from app.models.user_model import UserModel
from app.schemas.auth_schema import RegisterRequest, LoginRequest, AuthTokenResponse
from app.security.jwt import get_password_hash, verify_password, create_access_token
from app.exceptions.base_exception import AuthenticationError, ValidationError
from app.config.database import get_supabase_client


class AuthService:
    def register(self, req: RegisterRequest) -> AuthTokenResponse:
        existing = user_repository.get_by_email(req.email)
        if existing:
            raise ValidationError("An account with this email already exists")

        user_id = str(uuid.uuid4())
        hashed = get_password_hash(req.password)

        # Attempt Supabase Auth sign up if enabled
        supabase = get_supabase_client()
        if supabase:
            try:
                res = supabase.auth.sign_up({"email": req.email, "password": req.password})
                if res.user:
                    user_id = res.user.id
            except Exception:
                pass

        user = UserModel(
            id=str(uuid.uuid4()),
            user_id=user_id,
            email=req.email.lower(),
            full_name=req.full_name,
            hashed_password=hashed,
            travel_preferences={},
        )
        user_repository.save(user)

        token = create_access_token({"sub": user.user_id, "email": user.email, "name": user.full_name})
        return AuthTokenResponse(
            access_token=token,
            user_id=user.user_id,
            email=user.email,
            full_name=user.full_name,
            refresh_token=str(uuid.uuid4()),
        )

    def login(self, req: LoginRequest) -> AuthTokenResponse:
        user = user_repository.get_by_email(req.email)

        # If user not found in local repo, check Supabase
        supabase = get_supabase_client()
        if supabase:
            try:
                auth_res = supabase.auth.sign_in_with_password({"email": req.email, "password": req.password})
                if auth_res.user:
                    if not user:
                        user = UserModel(
                            id=str(uuid.uuid4()),
                            user_id=auth_res.user.id,
                            email=auth_res.user.email or req.email,
                            full_name=auth_res.user.user_metadata.get("full_name", req.email.split("@")[0]),
                        )
                        user_repository.save(user)
                    token = auth_res.session.access_token if auth_res.session else create_access_token(
                        {"sub": user.user_id, "email": user.email, "name": user.full_name}
                    )
                    return AuthTokenResponse(
                        access_token=token,
                        user_id=user.user_id,
                        email=user.email,
                        full_name=user.full_name,
                    )
            except Exception:
                pass

        if not user or not user.hashed_password:
            raise AuthenticationError("Invalid email or password")

        if not verify_password(req.password, user.hashed_password):
            raise AuthenticationError("Invalid email or password")

        token = create_access_token({"sub": user.user_id, "email": user.email, "name": user.full_name})
        return AuthTokenResponse(
            access_token=token,
            user_id=user.user_id,
            email=user.email,
            full_name=user.full_name,
            refresh_token=str(uuid.uuid4()),
        )

    def refresh(self, user_id: str) -> AuthTokenResponse:
        user = user_repository.get_by_id(user_id)
        if not user:
            raise AuthenticationError("User session not found")
        token = create_access_token({"sub": user.user_id, "email": user.email, "name": user.full_name})
        return AuthTokenResponse(
            access_token=token,
            user_id=user.user_id,
            email=user.email,
            full_name=user.full_name,
        )


auth_service = AuthService()
