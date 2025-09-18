"""
Authentication service for user login and validation.

This service handles user authentication logic including credential validation
and token generation.
"""

from typing import Optional

from app.core.security import (
    create_access_token,
    verify_password,
    get_password_hash,
)
from app.models.auth import LoginRequest, LoginResponse, UserResponse


class AuthService:
    """Service class for handling authentication operations."""
    dummy_users: dict[str, dict]

    def __init__(self):
        """Initialize the authentication service with dummy users."""
        # Dummy users for testing (passwords are 'demo123' and 'admin123' hashed)
        self.dummy_users = {
            "demo@myflix.com": {
                "id": "user_01",
                "email": "demo@myflix.com",
                "hashed_password": get_password_hash("demo123")
            },
            "admin@myflix.com": {
                "id": "user_02",
                "email": "admin@myflix.com",
                "hashed_password": get_password_hash("admin123")
            }
        }

    def authenticate_user(self, email: str, password: str) -> Optional[dict]:
        """
        Authenticate a user with email and password.

        Args:
            email: User's email address
            password: User's password

        Returns:
            User data if authentication successful, None otherwise
        """
        # Check if user exists in dummy users
        user = self.dummy_users.get(email)
        if not user:
            return None

        # Verify password for known users
        if not verify_password(password, user["hashed_password"]):
            return None

        return user

    async def login(
        self, login_request: LoginRequest
    ) -> Optional[LoginResponse]:
        """
        Process user login.

        Args:
            login_request: The login request data

        Returns:
            LoginResponse if successful, None if failed
        """
        user = self.authenticate_user(
            login_request.email,
            login_request.password
        )

        if not user:
            return None

        # Create access token
        access_token = create_access_token(
            user_id=user["id"],
            email=user["email"]
        )

        # Create response
        return LoginResponse(
            token=access_token,
            user=UserResponse(
                id=user["id"],
                email=user["email"]
            )
        )


# Create global auth service instance
auth_service = AuthService()
