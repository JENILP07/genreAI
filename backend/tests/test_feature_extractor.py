import pytest
from feature_extractor import extract_features
import numpy as np

def test_extract_features_valid_audio(mock_audio_file):
    """
    Test that features are correctly extracted from a valid audio buffer.
    """
    features = extract_features(mock_audio_file, duration=3)
    
    assert features is not None
    assert isinstance(features, dict)
    assert features["length"] == 22050 * 3  # Should match target length (padded/trimmed)
    
    # Check for some specific keys
    assert "mfcc1_mean" in features
    assert "spectral_centroid_mean" in features
    assert "tempo" in features
    
    # Check for NaN values
    for key, value in features.items():
        assert not np.isnan(value), f"Feature {key} is NaN"

def test_extract_features_structure(mock_audio_file):
    """
    Test that the output dictionary has the expected number of keys (58 features).
    """
    features = extract_features(mock_audio_file, duration=3)
    # 1 (length) + 8*2 (mean/var spectral) + 1 (tempo) + 20*2 (mfcc) = 1 + 16 + 1 + 40 = 58
    assert len(features) == 58 
