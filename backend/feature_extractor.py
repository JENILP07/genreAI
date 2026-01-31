import librosa
import numpy as np
import warnings
import io

def extract_features(audio_input, duration=3):
    """
    Extracts 58 features from an audio file (path or file-like object).
    Matches the structure of the training data.
    
    Args:
        audio_input (str or file-like): Path to audio file or file-like object (BytesIO).
        duration (int): Duration in seconds to analyze.
        
    Returns:
        dict: Dictionary of extracted features, or None if extraction fails.
    """
    try:
        # Load audio
        # librosa.load accepts file paths or file-like objects
        target_sr = 22050
        
        # If input is BytesIO, we might need to reset pointer if reused, 
        # but here it's consumed once.
        y, sr = librosa.load(audio_input, duration=duration, sr=target_sr)
        
        # Ensure consistent length (pad if too short)
        target_length = int(duration * target_sr)
        if len(y) < target_length:
            y = np.pad(y, (0, target_length - len(y)), 'constant')
        elif len(y) > target_length:
            y = y[:target_length]
        
        # Features to extract
        # 1. length (number of samples)
        length = len(y)
        
        # 2. Chroma STFT
        chroma_stft = librosa.feature.chroma_stft(y=y, sr=sr)
        chroma_stft_mean = np.mean(chroma_stft)
        chroma_stft_var = np.var(chroma_stft)
        
        # 3. RMS
        rms = librosa.feature.rms(y=y)
        rms_mean = np.mean(rms)
        rms_var = np.var(rms)
        
        # 4. Spectral Centroid
        spec_cent = librosa.feature.spectral_centroid(y=y, sr=sr)
        spec_cent_mean = np.mean(spec_cent)
        spec_cent_var = np.var(spec_cent)
        
        # 5. Spectral Bandwidth
        spec_bw = librosa.feature.spectral_bandwidth(y=y, sr=sr)
        spec_bw_mean = np.mean(spec_bw)
        spec_bw_var = np.var(spec_bw)
        
        # 6. Rolloff
        rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)
        rolloff_mean = np.mean(rolloff)
        rolloff_var = np.var(rolloff)
        
        # 7. Zero Crossing Rate
        zcr = librosa.feature.zero_crossing_rate(y)
        zcr_mean = np.mean(zcr)
        zcr_var = np.var(zcr)
        
        # 8. Harmony and Perceptrual
        y_harm, y_perc = librosa.effects.hpss(y)
        harmony_mean = np.mean(y_harm)
        harmony_var = np.var(y_harm)
        perceptr_mean = np.mean(y_perc)
        perceptr_var = np.var(y_perc)
        
        # 9. Tempo
        tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
        if isinstance(tempo, np.ndarray):
             tempo = tempo[0]
        
        # 10. MFCCs (20)
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=20)
        
        features = {
            "length": length,
            "chroma_stft_mean": chroma_stft_mean,
            "chroma_stft_var": chroma_stft_var,
            "rms_mean": rms_mean,
            "rms_var": rms_var,
            "spectral_centroid_mean": spec_cent_mean,
            "spectral_centroid_var": spec_cent_var,
            "spectral_bandwidth_mean": spec_bw_mean,
            "spectral_bandwidth_var": spec_bw_var,
            "rolloff_mean": rolloff_mean,
            "rolloff_var": rolloff_var,
            "zero_crossing_rate_mean": zcr_mean,
            "zero_crossing_rate_var": zcr_var,
            "harmony_mean": harmony_mean,
            "harmony_var": harmony_var,
            "perceptr_mean": perceptr_mean,
            "perceptr_var": perceptr_var,
            "tempo": tempo,
        }
        
        for i in range(20):
            features[f"mfcc{i+1}_mean"] = np.mean(mfccs[i])
            features[f"mfcc{i+1}_var"] = np.var(mfccs[i])
            
        return features

    except Exception as e:
        # We will let the caller handle logging, or print here for now 
        # (Fix 6 will update this to proper logging)
        print(f"Error extracting features: {e}")
        return None