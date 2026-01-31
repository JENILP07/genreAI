import os
import joblib
import logging
import numpy as np
import io
from typing import Dict, Any, List, Optional
from config import settings
from feature_extractor import extract_features

logger = logging.getLogger(__name__)

class ModelService:
    """
    Service class to handle model loading and inference logic.
    Encapsulating this allows for easier testing and dependency injection.
    """
    def __init__(self):
        self.model = None
        self.scaler = None
        self.label_encoder = None
        self.feature_columns = None
        self.load_artifacts()

    def load_artifacts(self):
        try:
            if os.path.exists(settings.MODEL_PATH):
                self.model = joblib.load(settings.MODEL_PATH)
            
            if os.path.exists(settings.SCALER_PATH):
                self.scaler = joblib.load(settings.SCALER_PATH)
                
            if os.path.exists(settings.LABEL_ENCODER_PATH):
                self.label_encoder = joblib.load(settings.LABEL_ENCODER_PATH)
                
            if os.path.exists(settings.FEATURE_COLUMNS_PATH):
                self.feature_columns = joblib.load(settings.FEATURE_COLUMNS_PATH)
            
            if all([self.model, self.scaler, self.label_encoder, self.feature_columns]):
                logger.info("ModelService: All artifacts loaded successfully.")
            else:
                logger.warning("ModelService: Some artifacts are missing.")
                
        except Exception as e:
            logger.error(f"ModelService: Failed to load artifacts: {e}", exc_info=True)

    def is_ready(self) -> bool:
        return all([self.model, self.scaler, self.label_encoder, self.feature_columns])

    def _run_inference(self, features: Dict[str, float]) -> Dict[str, Any]:
        """
        Internal method to run inference on extracted feature dictionary.
        """
        # Prepare for inference
        # Use get(col, 0) to handle missing features gracefully (though 0 might bias)
        ordered_data = [features.get(col, 0) for col in self.feature_columns]
        data_array = np.array([ordered_data])
        scaled_data = self.scaler.transform(data_array)
        
        # Predict
        prediction_idx = self.model.predict(scaled_data)[0]
        prediction_label = self.label_encoder.inverse_transform([prediction_idx])[0]

        # Probabilities
        all_probabilities = {}
        confidence = 0.0
        
        if hasattr(self.model, "predict_proba"):
            probs = self.model.predict_proba(scaled_data)[0]
            classes = self.label_encoder.classes_
            for i, prob in enumerate(probs):
                all_probabilities[str(classes[i])] = float(prob)
            confidence = all_probabilities.get(prediction_label, 0.0)
        else:
            confidence = 1.0
            all_probabilities = {prediction_label: 1.0}
            
        return {
            "predicted_genre": prediction_label,
            "confidence": confidence,
            "all_probabilities": all_probabilities
        }

    def predict(self, audio_data: io.BytesIO, filename: str) -> Dict[str, Any]:
        if not self.is_ready():
            raise RuntimeError("ModelService is not fully initialized.")

        # Extract features
        features = extract_features(audio_data, duration=settings.DURATION)
        if features is None:
            raise ValueError(f"Could not extract features from {filename}")

        return self._run_inference(features)

    def predict_from_features(self, features: Dict[str, float]) -> Dict[str, Any]:
        if not self.is_ready():
            raise RuntimeError("ModelService is not fully initialized.")
            
        return self._run_inference(features)

# Singleton instance
model_service = ModelService()

def get_model_service() -> ModelService:
    return model_service