import httpx
from typing import Optional
from server.rene_backend.providers.base import BaseLLMProvider
from server.rene_backend.utils.logging import setup_logger

logger = setup_logger("providers.mistral")

class MistralLLMProvider(BaseLLMProvider):
    """
    Mistral LLM Provider implementation using high-performance HTTPX async calls.
    """
    def __init__(self, api_key: Optional[str], model: str):
        self.api_key = api_key
        self.model = model
        self.url = "https://api.mistral.ai/v1/chat/completions"

    def get_name(self) -> str:
        return "Mistral"

    async def chat_completion(self, system_prompt: str, user_message: str, timeout: float) -> str:
        if not self.api_key:
            raise ValueError("API Key for Mistral provider is not configured.")

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

        logger.info(f"Initiating request to Mistral using model '{self.model}'...")
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                self.url,
                headers=headers,
                json=payload,
                timeout=timeout
            )
            
            if response.status_code != 200:
                logger.warning(f"Mistral returned status {response.status_code}: {response.text}")
                raise httpx.HTTPStatusError(
                    f"Mistral returned error status {response.status_code}",
                    request=response.request,
                    response=response
                )
                
            data = response.json()
            try:
                content = data["choices"][0]["message"]["content"]
                return content.strip()
            except (KeyError, IndexError) as e:
                logger.error(f"Failed to parse choices from Mistral response payload: {data}")
                raise ValueError("Malformed response payload from Mistral API.")
