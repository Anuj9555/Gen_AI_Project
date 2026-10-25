import pytest
from app.services.auth_service import auth_service
from app.schemas.auth_schema import RegisterRequest, LoginRequest
from app.exceptions.base_exception import ValidationError, AuthenticationError


def test_user_registration_and_login():
    reg_req = RegisterRequest(
        email="traveler@example.com",
        password="secretpassword123",
        full_name="Sarah Walker",
    )
    reg_res = auth_service.register(reg_req)
    assert reg_res.access_token is not None
    assert reg_res.email == "traveler@example.com"
    assert reg_res.full_name == "Sarah Walker"

    # Duplicate registration should raise ValidationError
    with pytest.raises(ValidationError):
        auth_service.register(reg_req)

    # Valid Login
    login_req = LoginRequest(
        email="traveler@example.com",
        password="secretpassword123",
    )
    login_res = auth_service.login(login_req)
    assert login_res.access_token is not None
    assert login_res.user_id == reg_res.user_id

    # Invalid password login
    bad_login = LoginRequest(
        email="traveler@example.com",
        password="wrongpassword",
    )
    with pytest.raises(AuthenticationError):
        auth_service.login(bad_login)
