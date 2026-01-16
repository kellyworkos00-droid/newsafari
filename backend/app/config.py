from pydantic_settings import BaseSettings
from functools import lru_cache
from pathlib import Path

# Get the backend directory
BACKEND_DIR = Path(__file__).resolve().parent.parent
ENV_FILE = BACKEND_DIR / ".env"


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    
    # JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS - Support multiple origins for development and production
    FRONTEND_URL: str = "http://localhost:3000"
    ALLOWED_ORIGINS: str = "http://localhost:3000"  # Comma-separated list
    
    # Backend URL (for M-PESA callbacks)
    BACKEND_URL: str = "http://localhost:8000"
    
    # M-PESA
    MPESA_CONSUMER_KEY: str = ""
    MPESA_CONSUMER_SECRET: str = ""
    MPESA_SHORTCODE: str = ""
    MPESA_PASSKEY: str = ""
    MPESA_ENVIRONMENT: str = "sandbox"
    
    # Email
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    
    def get_allowed_origins(self):
        """Parse comma-separated origins into a list"""
        origins = self.ALLOWED_ORIGINS.split(",")
        return [origin.strip() for origin in origins if origin.strip()]
    
    class Config:
        env_file = str(ENV_FILE)
        case_sensitive = True


@lru_cache()
def get_settings():
    return Settings()
