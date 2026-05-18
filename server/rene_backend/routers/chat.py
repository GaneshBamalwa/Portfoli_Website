from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from server.rene_backend.prompts.system import RENE_SYSTEM_PROMPT
from server.rene_backend.services.failover import ProviderFailoverService
from server.rene_backend.utils.logging import setup_logger

logger = setup_logger("routers.chat")
router = APIRouter()

# Single persistent failover service coordinator
failover_service = ProviderFailoverService()

class ChatRequest(BaseModel):
    """
    Schema for incoming chat query validation.
    Enforces min_length and reasonable max_length limit for recruiter inquiries.
    """
    message: str = Field(
        ...,
        description="The recruiter's conversational message",
        min_length=1,
        max_length=2000
    )

class ChatResponse(BaseModel):
    """
    Schema for safe chatbot frontend replies.
    Only returns a clean response string, never leaked keys or providers.
    """
    response: str = Field(
        ...,
        description="Clean, secure recruiter-friendly response from Réne"
    )

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Primary POST /chat endpoint.
    Retrieves system prompt and routes through failover provider stack.
    Handles any internal provider errors cleanly without leaking traces.
    """
    user_query = request.message.strip()
    logger.info(f"Received query request (length: {len(user_query)} chars)")
    
    try:
        # Run chat execution through prioritized provider failovers
        answer = await failover_service.execute_chat(
            system_prompt=RENE_SYSTEM_PROMPT,
            user_message=user_query
        )
        return ChatResponse(response=answer)
    except Exception as ex:
        # Catch-all exception handling. Avoids leaking raw Python errors or key status to client.
        logger.critical(f"All LLM providers exhausted or collapsed! Error trace: {str(ex)}", exc_info=True)
        # Return elegant, user-friendly custom fallback message
        return ChatResponse(response="Réne is temporarily unavailable right now.")
