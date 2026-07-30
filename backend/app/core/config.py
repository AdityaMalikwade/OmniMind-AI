import json
import os
from typing import List
from pydantic import field_validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "OmniMind AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = True

    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"

    @property
    def allowed_origins(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(',') if origin.strip()]

    # AI & Vector DB
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    CHROMA_DB_DIR: str = os.getenv("CHROMA_DB_DIR", "./chroma_data")
    EMBEDDING_MODEL_NAME: str = "all-MiniLM-L6-v2"

    # Supabase
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "")

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
