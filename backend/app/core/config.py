"""
Configuration settings for the MyFlix backend API.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Backend application settings."""

    # Security
    ACCESS_TOKEN_SECRET_KEY: str
    ACCESS_TOKEN_ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_HOURS: int

    # CORS - will be parsed from comma-separated string in .env
    ALLOWED_ORIGINS: str

    # Misc
    MIN_PASSWORD_LENGTH: int = 6

    @property
    def allowed_origins_list(self) -> list[str]:
        """Convert comma-separated ALLOWED_ORIGINS to list."""
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        env_parse_none_str="",
    )


# Create global settings instance
settings = Settings()
