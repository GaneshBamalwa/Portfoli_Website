import asyncio
import httpx
from typing import List, Optional
from server.rene_backend.config import settings
from server.rene_backend.providers.base import BaseLLMProvider
from server.rene_backend.providers.groq import GroqLLMProvider
from server.rene_backend.providers.openrouter import OpenRouterLLMProvider
from server.rene_backend.providers.mistral import MistralLLMProvider
from server.rene_backend.utils.logging import setup_logger

logger = setup_logger("services.failover")

class ProviderFailoverService:
    """
    Production-grade Provider Failover and Resilience Coordinator.
    Sequences primary to tertiary LLM provider call chains and handles failovers.
    """
    def __init__(self):
        self.providers: List[BaseLLMProvider] = []
        self._initialize_providers()

    def _initialize_providers(self) -> None:
        """
        Instantiates providers based on priority ranking.
        Skips any provider where the respective API key is missing from environment.
        """
        # 1. Groq Primary
        if settings.groq_api_key_1:
            self.providers.append(
                GroqLLMProvider(
                    name="Groq-Primary",
                    api_key=settings.groq_api_key_1,
                    model=settings.groq_model
                )
            )
            logger.info("Registered LLM Provider: Groq-Primary")
        else:
            logger.warning("Groq-Primary key is missing; provider will be bypassed.")

        # 2. Groq Secondary
        if settings.groq_api_key_2:
            self.providers.append(
                GroqLLMProvider(
                    name="Groq-Secondary",
                    api_key=settings.groq_api_key_2,
                    model=settings.groq_model
                )
            )
            logger.info("Registered LLM Provider: Groq-Secondary")
        else:
            logger.warning("Groq-Secondary key is missing; provider will be bypassed.")

        # 3. OpenRouter
        if settings.openrouter_api_key:
            self.providers.append(
                OpenRouterLLMProvider(
                    api_key=settings.openrouter_api_key,
                    model=settings.openrouter_model
                )
            )
            logger.info("Registered LLM Provider: OpenRouter")
        else:
            logger.warning("OpenRouter key is missing; provider will be bypassed.")

        # 4. Mistral
        if settings.mistral_api_key:
            self.providers.append(
                MistralLLMProvider(
                    api_key=settings.mistral_api_key,
                    model=settings.mistral_model
                )
            )
            logger.info("Registered LLM Provider: Mistral")
        else:
            logger.warning("Mistral key is missing; provider will be bypassed.")

    async def execute_chat(self, system_prompt: str, user_message: str) -> str:
        """
        Loops through active providers in priority sequence.
        Executes internal retry loops and seamlessly falls back on connection/quota exceptions.
        """
        if not self.providers:
            logger.error("No LLM Providers could be registered. All keys are missing or invalid!")
            raise RuntimeError("All LLM providers are misconfigured or uninitialized.")

        last_exception: Optional[Exception] = None

        for provider in self.providers:
            provider_name = provider.get_name()
            logger.info(f"Attempting chat execution via provider: {provider_name}")

            # Internal individual provider retry loop
            for attempt in range(1, settings.max_failover_retries + 1):
                try:
                    # Execute call with isolated timeout boundaries
                    response = await provider.chat_completion(
                        system_prompt=system_prompt,
                        user_message=user_message,
                        timeout=settings.provider_timeout_seconds
                    )
                    logger.info(f"Successfully retrieved response from provider '{provider_name}' on attempt {attempt}.")
                    return response
                except asyncio.TimeoutError as te:
                    logger.warning(f"Provider '{provider_name}' timed out on attempt {attempt}/{settings.max_failover_retries}.")
                    last_exception = te
                except httpx.HTTPStatusError as hse:
                    logger.warning(f"Provider '{provider_name}' returned HTTP status error {hse.response.status_code} on attempt {attempt}/{settings.max_failover_retries}.")
                    last_exception = hse
                except Exception as ex:
                    logger.warning(f"Provider '{provider_name}' encountered unexpected error: {str(ex)} on attempt {attempt}/{settings.max_failover_retries}.")
                    last_exception = ex

                # Add a brief, non-blocking throttle wait between individual retries
                if attempt < settings.max_failover_retries:
                    await asyncio.sleep(0.5)

            logger.error(f"Provider '{provider_name}' failed to respond after {settings.max_failover_retries} attempts. Escalating to next provider...")

        # If we reached here, every provider is exhausted
        raise RuntimeError("All LLM providers failed or returned unresolvable errors.") from last_exception
