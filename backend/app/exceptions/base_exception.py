class AppException(Exception):
    def __init__(self, message: str, code: str = "INTERNAL_SERVER_ERROR", status_code: int = 500):
        super().__init__(message)
        self.message = message
        self.code = code
        self.status_code = status_code


class ValidationError(AppException):
    def __init__(self, message: str):
        super().__init__(message=message, code="VALIDATION_ERROR", status_code=400)


class AuthenticationError(AppException):
    def __init__(self, message: str = "Invalid authentication credentials"):
        super().__init__(message=message, code="AUTHENTICATION_ERROR", status_code=401)


class AuthorizationError(AppException):
    def __init__(self, message: str = "You do not have permission to access this resource"):
        super().__init__(message=message, code="AUTHORIZATION_ERROR", status_code=403)


class NotFoundError(AppException):
    def __init__(self, message: str = "Resource not found", code: str = "NOT_FOUND"):
        super().__init__(message=message, code=code, status_code=404)
