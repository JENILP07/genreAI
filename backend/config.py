from typing import Any
import os
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """
    Application settings using Pydantic Settings for environment variable support.
    """
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # API Metadata
    PROJECT_NAME: str = "Music Genre Predictor"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # CORS
    ALLOWED_ORIGINS: Any = ["*"]

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def parse_allowed_origins(cls, v):
        if isinstance(v, str):
            if v.strip().startswith("["):  # It's likely a JSON array string
                import json
                try:
                    return json.loads(v)
                except json.JSONDecodeError:
                    pass # Fallback to split if json fails
            return [origin.strip() for origin in v.split(",")]
        return v

    # Audio Parameters
    SAMPLE_RATE: int = 22050
    DURATION: int = 3
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS: list[str] = [".wav", ".mp3", ".ogg", ".flac"]
    ALLOWED_MIME_TYPES: list[str] = ["audio/wav", "audio/mpeg", "audio/ogg", "audio/flac", "audio/x-wav"]

    # Model Configuration
    MODEL_VERSION: str = "v1"  # e.g., "v1", "prod", "experimental"
    
    BASE_DIR: str = os.path.dirname(os.path.abspath(__file__))
    MODELS_DIR: str = os.path.join(BASE_DIR, "models")
    
    @property
    def MODEL_PATH(self) -> str:
        # Tries 'best_model_v1.pkl', falls back to 'best_model.pkl' if version is empty
        filename = f"best_model_{self.MODEL_VERSION}.pkl" if self.MODEL_VERSION else "best_model.pkl"
        return os.path.join(self.MODELS_DIR, filename)

    @property
    def SCALER_PATH(self) -> str:
        filename = f"scaler_{self.MODEL_VERSION}.pkl" if self.MODEL_VERSION else "scaler.pkl"
        return os.path.join(self.MODELS_DIR, filename)

    @property
    def LABEL_ENCODER_PATH(self) -> str:
        filename = f"label_encoder_{self.MODEL_VERSION}.pkl" if self.MODEL_VERSION else "label_encoder.pkl"
        return os.path.join(self.MODELS_DIR, filename)
    
    @property
    def FEATURE_COLUMNS_PATH(self) -> str:
        filename = f"feature_columns_{self.MODEL_VERSION}.pkl" if self.MODEL_VERSION else "feature_columns.pkl"
        return os.path.join(self.MODELS_DIR, filename)

settings = Settings()