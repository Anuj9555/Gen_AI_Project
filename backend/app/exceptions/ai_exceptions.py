from app.exceptions.base_exception import AppException


class AIServiceError(AppException):
    def __init__(self, message: str = "AI service encountered an unexpected error"):
        super().__init__(message=message, code="AI_SERVICE_ERROR", status_code=502)


class InvalidAIResponseError(AppException):
    def __init__(self, message: str = "AI returned an invalid or unparseable response schema"):
        super().__init__(message=message, code="INVALID_AI_RESPONSE", status_code=502)


class AITimeoutError(AppException):
    def __init__(self, message: str = "AI generation request timed out"):
        super().__init__(message=message, code="AI_TIMEOUT", status_code=504)
