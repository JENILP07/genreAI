import os
import pickle
import pandas as pd
import numpy as np
import shutil
from fastapi import FastAPI, HTTPException, UploadFile, File, Request
from pydantic import BaseModel
from typing import Dict, Any
from fastapi.middleware.cors import CORSMiddleware
from feature_extractor import extract_features

app = FastAPI(title="Music Genre Predictor")

# Allow CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

@app.middleware("http")
async def limit_upload_size(request: Request, call_next):
    if request.method == "POST" and request.url.path == "/predict":
        content_length = request.headers.get("content-length")
        if not content_length:
            return await call_next(request) # Fallback if header missing but usually required for files
        if int(content_length) > MAX_FILE_SIZE:
            raise HTTPException(status_code=413, detail="File too large (Max 10MB)")
    return await call_next(request)

# Global variables for models
model = None
scaler = None
label_encoder = None
feature_columns = None

# Load models on startup
@app.on_event("startup")
def load_artifacts():
    global model, scaler, label_encoder, feature_columns
    try:
        base_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "models"))
        
        with open(os.path.join(base_path, "best_model.pkl"), "rb") as f:
            model = pickle.load(f)
        
        with open(os.path.join(base_path, "scaler.pkl"), "rb") as f:
            scaler = pickle.load(f)
            
        with open(os.path.join(base_path, "label_encoder.pkl"), "rb") as f:
            label_encoder = pickle.load(f)
            
        with open(os.path.join(base_path, "feature_columns.pkl"), "rb") as f:
            feature_columns = pickle.load(f)
            
        print("All artifacts loaded successfully.")
        
    except Exception as e:
        print(f"Error loading artifacts: {e}")
        pass

@app.get("/")
def home():
    return {"status": "healthy", "message": "Genre Prediction API is running."}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not model or not scaler or not feature_columns:
        raise HTTPException(status_code=500, detail="Models not loaded properly.")
    
    # Save temp file
    temp_filename = f"temp_{file.filename}"
    try:
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        features = extract_features(temp_filename, duration=3)
        
        if features is None:
             raise HTTPException(status_code=400, detail="Could not process audio file.")

        ordered_data = []
        for col in feature_columns:
            ordered_data.append(features.get(col, 0))

        data_array = np.array([ordered_data])
        scaled_data = scaler.transform(data_array)
        
        prediction_idx = model.predict(scaled_data)[0]
        prediction_label = label_encoder.inverse_transform([prediction_idx])[0] if label_encoder else str(prediction_idx)

        all_probabilities = {}
        confidence = 0.0
        
        if hasattr(model, "predict_proba"):
            probs = model.predict_proba(scaled_data)[0]
            if label_encoder:
                classes = label_encoder.classes_
                for i, prob in enumerate(probs):
                    all_probabilities[str(classes[i])] = float(prob)
                confidence = all_probabilities.get(prediction_label, 0.0)
        
        if not all_probabilities:
            confidence = 1.0
            all_probabilities = {prediction_label: 1.0}
            
        return {
            "predicted_genre": prediction_label,
            "confidence": confidence,
            "all_probabilities": all_probabilities
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
    finally:
        if os.path.exists(temp_filename):
            os.remove(temp_filename)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)