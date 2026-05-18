import httpx
from typing import Optional
from server.rene_backend.providers.base import BaseLLMProvider
from server.rene_backend.utils.logging import setup_logger

logger = setup_logger("providers.groq")

class GroqLLMProvider(BaseLLMProvider):
    """
    Groq LLM Provider implementation using high-performance HTTPX async calls.
    Can be initialized with a primary or secondary API key.
    """
    def __init__(self, name: str, api_key: Optional[str], model: str):
        self.name = name
        self.api_key = api_key
        self.model = model
        self.url = "https://api.groq.com/openai/v1/chat/completions"

    def get_name(self) -> str:
        return self.name

    async def chat_completion(self, system_prompt: str, user_message: str, timeout: float) -> str:
        if not self.api_key:
            raise ValueError(f"API Key for provider '{self.name}' is not configured.")

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            "temperature": 0.2
        }

        logger.info(f"Initiating request to Groq provider '{self.name}' using model '{self.model}'...")
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                self.url,
                headers=headers,
                json=payload,
                timeout=timeout
            )
            
            if response.status_code != 200:
                logger.warning(f"Groq provider '{self.name}' returned status {response.status_code}: {response.text}")
                raise httpx.HTTPStatusError(
                    f"Groq returned error status {response.status_code}",
                    request=response.request,
                    response=response
                )
                
            data = response.json()
            try:
                content = data["choices"][0]["message"]["content"]
                return content.strip()
            except (KeyError, IndexError) as e:
                logger.error(f"Failed to parse choices from Groq response payload: {data}")
                raise ValueError("Malformed response payload from Groq API.")
