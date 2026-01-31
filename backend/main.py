import logging
import io
from fastapi import FastAPI, HTTPException, UploadFile, File, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict
from config import settings
from services import ModelService, get_model_service

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION
)

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FeatureInput(BaseModel):
    features: Dict[str, float]

@app.middleware("http")
async def limit_upload_size(request: Request, call_next):
    if request.method == "POST" and request.url.path == "/predict":
        content_length = request.headers.get("content-length")
        if content_length and int(content_length) > settings.MAX_FILE_SIZE:
            logger.warning(f"File upload attempt exceeded max size: {content_length}")
            raise HTTPException(status_code=413, detail=f"File too large (Max {settings.MAX_FILE_SIZE // (1024*1024)}MB)")
    return await call_next(request)

@app.get("/")
def health_check(service: ModelService = Depends(get_model_service)):
    """
    Enhanced health check (Fix #12)
    """
    if not service.is_ready():
        return {
            "status": "degraded", 
            "message": "Model artifacts not loaded.",
            "version": settings.VERSION
        }
    return {
        "status": "healthy", 
        "message": "Genre Prediction API is fully operational.",
        "version": settings.VERSION
    }

@app.post("/predict")
def predict(
    file: UploadFile = File(...),
    service: ModelService = Depends(get_model_service)
):
    """
    Predicts genre from uploaded audio file.
    """
    # FIX 7: Input Validation
    # 1. Check File Extension
    file_ext = "".join(file.filename.split(".")[-1:]).lower()
    if f".{file_ext}" not in settings.ALLOWED_EXTENSIONS:
        logger.warning(f"Invalid file extension: {file_ext}")
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid file extension. Allowed: {', '.join(settings.ALLOWED_EXTENSIONS)}"
        )

    # 2. Check MIME Type
    if file.content_type not in settings.ALLOWED_MIME_TYPES:
        logger.warning(f"Invalid MIME type: {file.content_type}")
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid file type ({file.content_type}). Please upload a valid audio file."
        )

    if not service.is_ready():
        raise HTTPException(status_code=503, detail="Model service is not ready.")
    
    logger.info(f"Processing prediction for: {file.filename} ({file.content_type})")

    try:
        # Read file in-memory
        content = file.file.read()
        audio_stream = io.BytesIO(content)
        
        # Delegate to service
        result = service.predict(audio_stream, file.filename)
        return result
        
    except ValueError as e:
        logger.error(f"Validation error during prediction: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Prediction error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="An error occurred during audio analysis.")
    finally:
        file.file.close()

@app.post("/predict/features")
def predict_features(
    input_data: FeatureInput,
    service: ModelService = Depends(get_model_service)
):
    """
    Predicts genre from raw feature JSON.
    """
    if not service.is_ready():
        raise HTTPException(status_code=503, detail="Model service is not ready.")
        
    logger.info("Processing feature-based prediction")
    
    try:
        result = service.predict_from_features(input_data.features)
        return result
    except Exception as e:
        logger.error(f"Feature prediction error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="An error occurred during feature analysis.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)