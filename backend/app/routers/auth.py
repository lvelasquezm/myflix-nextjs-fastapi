"""
Authentication router for the MyFlix backend API.
"""

from fastapi import APIRouter, HTTPException, status

from app.core.config import settings
from app.models.auth import LoginRequest, LoginResponse
from app.services.auth_service import auth_service

router = APIRouter(prefix="/api/auth", tags=["authentication"])


@router.post(
    "/login",
    response_model=LoginResponse,
    status_code=status.HTTP_200_OK,
    responses={
        200: {
            "description": "Login successful",
            "model": LoginResponse
        },
        400: {
            "description": "Invalid request data",
        },
        401: {
            "description": "Invalid credentials",
        },
        422: {
            "description": "Validation error",
        }
    },
    summary="User Login",
    description="""
    Authenticate a user with email and password.

    API Contract:
    - Method: POST
    - Path: /api/auth/login
    - Request: { email: string, password: string }
    - Response 200: { token: string, user: { id, email } }

    Authentication Logic:
    - For demo purposes, accepts any valid email/password
    combination (min 6 chars)
    - Returns JWT token valid for 30 minutes
    - Token includes user ID and email in payload

    Error Handling:
    - 400: Invalid request format
    - 401: Invalid credentials (wrong email/password)
    - 422: Validation errors (invalid email format, missing fields)
    """
)
async def login(login_request: LoginRequest):
    """
    User login endpoint.

    Args:
        `login_request`: Login credentials (email and password)

    Returns:
        `LoginResponse` with JWT token and user information

    Raises:
        `HTTPException`: If authentication fails
    """
    try:
        if not login_request.email or not login_request.password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email and password are required",
            )

        if len(login_request.password) < settings.MIN_PASSWORD_LENGTH:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    f"Password must be at least "
                    f"{settings.MIN_PASSWORD_LENGTH} characters long"
                ),
            )

        # Attempt to authenticate user
        login_response = await auth_service.login(login_request)

        if not login_response:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials",
            )

        return login_response

    except HTTPException:
        raise
    except Exception as e:
        # Handle unexpected errors
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during authentication"
        ) from e


@router.post(
    "/logout",
    summary="User Logout",
    description="Logout current user",
)
async def logout():
    """
    User logout endpoint.

    This is a placeholder endpoint for future implementation.
    In a full implementation with stateful sessions,
    this would invalidate the token.
    For JWT tokens, logout is typically handled client-side
    by removing the token.
    """
    return {
        "message": "To be implemented.",
    }
