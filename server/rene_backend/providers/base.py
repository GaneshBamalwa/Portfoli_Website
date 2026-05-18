import abc

class BaseLLMProvider(abc.ABC):
    """
    Abstract Base Class for LLM providers.
    Enforces unified async calling patterns to support seamless failovers.
    """
    @abc.abstractmethod
    def get_name(self) -> str:
        """Returns the human-readable identifier of the provider."""
        pass

    @abc.abstractmethod
    async def chat_completion(self, system_prompt: str, user_message: str, timeout: float) -> str:
        """
        Executes a chat completion query to the provider endpoint.
        
        Args:
            system_prompt: System boundaries and profile data.
            user_message: Active query from user/recruiter.
            timeout: Max duration in seconds to wait before terminating.
            
        Returns:
            The raw text string of the model response.
        """
        pass
