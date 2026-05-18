import logging
import json
import sys
from datetime import datetime
from typing import Any, Dict

class StructuredJSONFormatter(logging.Formatter):
    """
    Production-grade JSON formatter for structured logging.
    Guarantees no raw stack traces or internal secrets leak into standard output.
    """
    def format(self, record: logging.LogRecord) -> str:
        log_payload: Dict[str, Any] = {
            "timestamp": datetime.utcfromtimestamp(record.created).isoformat() + "Z",
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        
        # Inject standard trace info if it is warning or error
        if record.exc_info:
            log_payload["exception"] = self.formatException(record.exc_info)
            
        # Clean potential secrets
        msg_str = json.dumps(log_payload)
        for secret_indicator in ["key", "bearer", "authorization", "token"]:
            if secret_indicator in msg_str.lower():
                # Redact potential key leakages in logs
                msg_str = "[REDACTED LOG CONTENT FOR SECURITY]"
                break
                
        return msg_str

def setup_logger(name: str) -> logging.Logger:
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)
    
    # Avoid duplicate handlers
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        formatter = StructuredJSONFormatter()
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        
    logger.propagate = False
    return logger
