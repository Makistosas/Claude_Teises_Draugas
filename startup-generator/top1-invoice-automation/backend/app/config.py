"""
============================================================
SASKAITA.LT - Configuration
============================================================
"""

from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    # App
    domain: str = "localhost"
    secret_key: str = "development-secret-key-change-in-production"
    environment: str = "development"

    # Database
    postgres_user: str = "saskaita"
    postgres_password: str = "password"
    postgres_db: str = "saskaita_db"
    database_url: str = ""

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    # Paysera
    paysera_project_id: str = ""
    paysera_sign_password: str = ""
    paysera_test_mode: bool = True
    paysera_callback_url: str = ""

    # SMTP
    smtp_host: str = "smtp-relay.brevo.com"
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    email_from: str = "info@saskaita.lt"
    email_from_name: str = "Saskaita.lt"

    # Admin
    admin_email: str = "admin@saskaita.lt"
    admin_password: str = "admin123"

    # Pricing (cents)
    price_starter: int = 1900
    price_pro: int = 3900
    price_business: int = 7900

    # Limits
    free_invoice_limit: int = 5

    # Security
    jwt_expire_minutes: int = 1440
    cors_origins: str = "http://localhost:3000"

    # Monitoring
    sentry_dsn: str = ""

    class Config:
        env_file = ".env"
        extra = "ignore"

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.cors_origins.split(",")]

    @property
    def db_url(self) -> str:
        if self.database_url:
            return self.database_url
        return f"postgresql+asyncpg://{self.postgres_user}:{self.postgres_password}@postgres:5432/{self.postgres_db}"

    @property
    def sync_db_url(self) -> str:
        if self.database_url:
            return self.database_url.replace("+asyncpg", "")
        return f"postgresql://{self.postgres_user}:{self.postgres_password}@postgres:5432/{self.postgres_db}"


settings = Settings()
