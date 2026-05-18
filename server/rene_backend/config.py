import os
from typing import Optional
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Load .env file at application startup
load_dotenv()

class ReneSettings(BaseModel):
    """
    Application configuration for the Réne Portfolio Chatbot Backend.
    Uses Pydantic v2 to enforce types and read defaults safely.
    """
    # Host and port parameters
    host: str = Field(default="127.0.0.1", description="FastAPI host binding")
    port: int = Field(default=8000, description="FastAPI port binding")
    
    # LLM API keys
    groq_api_key_1: Optional[str] = Field(default=None, alias="GROQ_API_KEY_1")
    groq_api_key_2: Optional[str] = Field(default=None, alias="GROQ_API_KEY_2")
    openrouter_api_key: Optional[str] = Field(default=None, alias="OPENROUTER_API_KEY")
    mistral_api_key: Optional[str] = Field(default=None, alias="MISTRAL_API_KEY")
    
    # Model selections
    groq_model: str = Field(default="llama-3.1-8b-instant", description="Model for Groq providers")
    openrouter_model: str = Field(default="meta-llama/llama-3.3-70b-instruct", description="Model for OpenRouter")
    mistral_model: str = Field(default="mistral-large-latest", description="Model for Mistral")
    
    # Failure & timeout boundaries
    provider_timeout_seconds: float = Field(default=6.0, description="Max timeout per provider call")
    max_failover_retries: int = Field(default=2, description="Max individual provider attempts before fallback")
    
    # Security setting
    allow_cors_origins: str = Field(default="*", description="Allowed CORS origins")

# Initialize a global, clean settings instance
settings = ReneSettings(
    GROQ_API_KEY_1=os.getenv("GROQ_API_KEY_1"),
    GROQ_API_KEY_2=os.getenv("GROQ_API_KEY_2"),
    OPENROUTER_API_KEY=os.getenv("OPENROUTER_API_KEY"),
    MISTRAL_API_KEY=os.getenv("MISTRAL_API_KEY")
)
