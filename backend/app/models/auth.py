"""
Authentication models for the MyFlix backend API.
Defines Pydantic models for authentication requests and responses.
"""
from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.core.config import settings


class LoginRequest(BaseModel):
    """Login request model."""
    email: EmailStr = Field(default="", description="User's email address")
    password: str = Field(
        default="",
        min_length=settings.MIN_PASSWORD_LENGTH,
        description="User's password",
    )

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "email": "demo@myflix.com",
                "password": "demo123"
            }
        }
    )


class UserResponse(BaseModel):
    """User information in responses."""
    id: str = Field(default="", description="User's unique identifier")
    email: str = Field(default="", description="User's email address")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": "user_01",
                "email": "demo@myflix.com"
            }
        }
    )


class LoginResponse(BaseModel):
    """Login response model."""
    token: str = Field(default="", description="JWT access token")
    user: UserResponse = Field(default=None, description="User information")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "user": {
                    "id": "user_01",
                    "email": "demo@myflix.com"
                }
            }
        }
    )
