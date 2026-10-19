from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "INF-Learning"
    APP_ENV: str = "development"
    APP_PORT: int = 8000

    # Terima DATABASE_URL atau MYSQL_URL (mana saja yang ada)
    DATABASE_URL: str = Field(
        validation_alias=AliasChoices("DATABASE_URL", "MYSQL_URL")
    )

    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()