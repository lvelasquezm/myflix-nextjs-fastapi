"""
Security utilities for authentication and authorization.

This module handles JWT token creation, verification, and password hashing
for the MyFlix backend API.
"""

from datetime import datetime, timedelta, timezone

from jose import jwt
from passlib.context import CryptContext

from app.core.config import settings

# Password hashing context
crypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against its hash.

    Args:
        plain_password: The plain text password
        hashed_password: The hashed password

    Returns:
        True if password matches, False otherwise
    """
    return crypt_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    Hash a password.

    Args:
        password: The plain text password

    Returns:
        The hashed password
    """
    return crypt_context.hash(password)


def create_access_token(user_id: str, email: str) -> str:
    """
    Create an access token for a user in a format of JWT.

    Args:
        user_id: The user's unique identifier
        email: The user's email address

    Returns:
        The JWT access token
    """
    expire = datetime.now(timezone.utc) + timedelta(
        hours=settings.ACCESS_TOKEN_EXPIRE_HOURS,
    )

    token_data = {
        "sub": email,
        "iat": datetime.now(timezone.utc),
        "exp": expire,
        "user_id": user_id,
    }

    return jwt.encode(
        token_data,
        key=settings.ACCESS_TOKEN_SECRET_KEY,
        algorithm=settings.ACCESS_TOKEN_ALGORITHM
    )
