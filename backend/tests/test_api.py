import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock
import sys
import os
import io

# Ensure backend is in path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from main import app
from services import get_model_service, ModelService

client = TestClient(app)

# Mock ModelService
mock_service = MagicMock(spec=ModelService)

def override_get_model_service():
    return mock_service

# Apply dependency override
app.dependency_overrides[get_model_service] = override_get_model_service

@pytest.fixture(autouse=True)
def setup_mock_service():
    # Reset mock before each test
    mock_service.reset_mock()
    mock_service.is_ready.return_value = True
    
    # Default successful prediction
    mock_service.predict.return_value = {
        "predicted_genre": "rock",
        "confidence": 0.9,
        "all_probabilities": {"rock": 0.9, "jazz": 0.1}
    }
    
    return mock_service

def test_home_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_health_check_degraded():
    mock_service.is_ready.return_value = False
    response = client.get("/")
    assert response.json()["status"] == "degraded"

def test_predict_endpoint(mock_audio_file):
    """
    Test the /predict endpoint with a valid mocked audio file.
    """
    files = {"file": ("test.wav", mock_audio_file, "audio/wav")}
    response = client.post("/predict", files=files)
    
    assert response.status_code == 200
    data = response.json()
    
    assert data["predicted_genre"] == "rock"
    assert data["confidence"] == 0.9
    
    # Verify service was called
    mock_service.predict.assert_called_once()

def test_predict_endpoint_invalid_file_type(mock_audio_file):
    """
    Test validation for invalid file type.
    """
    files = {"file": ("test.txt", mock_audio_file, "text/plain")}
    response = client.post("/predict", files=files)
    
    # Should fail due to MIME type or extension validation
    assert response.status_code == 400
    detail = response.json()["detail"]
    assert "Invalid file type" in detail or "Invalid file extension" in detail

def test_predict_features_endpoint():
    """
    Test the /predict/features endpoint.
    """
    mock_service.predict_from_features.return_value = {
        "predicted_genre": "jazz",
        "confidence": 0.85,
        "all_probabilities": {"jazz": 0.85}
    }
    
    features = {"tempo": 120, "chroma_stft_mean": 0.5} # Dummy features
    response = client.post("/predict/features", json={"features": features})
    
    assert response.status_code == 200
    assert response.json()["predicted_genre"] == "jazz"
    mock_service.predict_from_features.assert_called_once()