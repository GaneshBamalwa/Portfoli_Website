import time
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from server.rene_backend.config import settings
from server.rene_backend.routers import chat
from server.rene_backend.utils.logging import setup_logger

logger = setup_logger("main")

# Initialize production-grade FastAPI App
app = FastAPI(
    title="Réne Portfolio Chatbot Service",
    description="Recruiter-grade conversational AI assistant integrated into Ganesh's portfolio",
    version="1.0.0"
)

# Configure Cross-Origin Resource Sharing (CORS)
# Supports direct AJAX calls from Vite dev server and local Express configurations
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allow_cors_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom performance tracking and structured logging middleware
@app.middleware("http")
async def log_requests_and_latency(request: Request, call_next):
    start_time = time.time()
    
    # Extract client IP safely
    client_host = request.client.host if request.client else "unknown"
    logger.info(f"Incoming Request: {request.method} {request.url.path} from client IP: {client_host}")
    
    try:
        response: Response = await call_next(request)
        duration = time.time() - start_time
        logger.info(f"Completed Request: {request.method} {request.url.path} -> Status {response.status_code} (took {duration:.4f}s)")
        return response
    except Exception as ex:
        duration = time.time() - start_time
        logger.error(f"Failed Request: {request.method} {request.url.path} -> Raised exception: {str(ex)} (took {duration:.4f}s)", exc_info=True)
        # Prevent stack trace leakage in case of middleware failures
        return Response(
            content='{"response": "Réne is temporarily unavailable right now."}',
            status_code=500,
            media_type="application/json"
        )

# Register chatbot router
app.include_router(chat.router, tags=["chat"])

@app.get("/health")
async def health_check():
    """
    Standard health check monitoring endpoint.
    Used by host runtimes or Docker containers to verify system status.
    """
    return {
        "status": "healthy",
        "service": "Réne Chatbot Backend",
        "timestamp": time.time()
    }

if __name__ == "__main__":
    import uvicorn
    logger.info(f"Starting Réne backend on {settings.host}:{settings.port}...")
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=True
    )
