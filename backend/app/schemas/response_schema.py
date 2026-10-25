from typing import Generic, TypeVar, Optional, Any
from pydantic import BaseModel

T = TypeVar("T")


class ErrorDetail(BaseModel):
    code: str
    message: str
    details: Optional[Any] = None


class ApiResponse(BaseModel, Generic[T]):
    success: bool = True
    data: Optional[T] = None
    message: Optional[str] = None
    error: Optional[ErrorDetail] = None

    @classmethod
    def success_response(cls, data: T = None, message: str = "Operation successful") -> "ApiResponse[T]":
        return cls(success=True, data=data, message=message, error=None)

    @classmethod
    def error_response(cls, code: str, message: str, details: Any = None) -> "ApiResponse[None]":
        return cls(success=False, data=None, error=ErrorDetail(code=code, message=message, details=details))
