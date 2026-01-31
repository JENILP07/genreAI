import pytest
import numpy as np
import io
import soundfile as sf

@pytest.fixture
def mock_audio_file():
    """
    Generates a 3-second sine wave audio file in-memory (BytesIO).
    """
    sr = 22050
    duration = 3
    t = np.linspace(0, duration, int(sr * duration))
    y = 0.5 * np.sin(2 * np.pi * 440 * t) # 440Hz sine wave
    
    buffer = io.BytesIO()
    sf.write(buffer, y, sr, format='WAV')
    buffer.seek(0)
    return buffer

@pytest.fixture
def mock_feature_columns():
    return [
        "length", "chroma_stft_mean", "chroma_stft_var", "rms_mean", "rms_var",
        "spectral_centroid_mean", "spectral_centroid_var", "spectral_bandwidth_mean",
        "spectral_bandwidth_var", "rolloff_mean", "rolloff_var",
        "zero_crossing_rate_mean", "zero_crossing_rate_var", "harmony_mean",
        "harmony_var", "perceptr_mean", "perceptr_var", "tempo"
    ] + [f"mfcc{i+1}_mean" for i in range(20)] + [f"mfcc{i+1}_var" for i in range(20)]
