# GenreAI

GenreAI is a professional-grade music genre classification system that leverages machine learning to identify the musical genre of audio files. The application provides an intuitive interface for users to upload audio tracks and receive real-time predictions with high confidence scores.

## Features

- **High-Accuracy Classification:** Uses an ensemble of models trained on acoustic features.
- **Production-Ready Backend:** Built with FastAPI, featuring asynchronous-safe processing, dependency injection, and structured logging.
- **In-Memory Analysis:** Audio files are processed in-memory for high performance and security (no disk I/O during inference).
- **Reproducible Pipeline:** Includes a complete training script (`train.py`) to regenerate models from raw data.
- **Interactive UI:** Responsive React dashboard with real-time probability visualizations.
- **Robust Validation:** Strict input validation for file types, MIME types, and sizes.

## Project Architecture

The system follows a modern decoupled architecture:

- **Frontend:** A React SPA built with TypeScript and Vite, utilizing Tailwind CSS for styling and Framer Motion for smooth interactions.
- **Backend:** A robust FastAPI service organized into a service-oriented architecture:
    - **API Layer (`main.py`):** Handles routing, validation, and request orchestration.
    - **Service Layer (`services.py`):** Encapsulates model inference and business logic.
    - **Feature Layer (`feature_extractor.py`):** Standardized audio preprocessing using Librosa.
    - **Config Layer (`config.py`):** Environment-aware settings using Pydantic.

## Tech Stack

### Frontend
- React 18, TypeScript, Vite
- Tailwind CSS & Shadcn UI
- Recharts (Visualizations)
- Axios & Framer Motion

### Backend
- Python 3.10+, FastAPI
- Librosa (Audio Analysis)
- Scikit-learn & Joblib (ML)
- Pydantic Settings (Config Management)
- Pytest (Testing Suite)

## Dataset Information

The models are trained using the **GTZAN Music Genre Dataset**, the industry standard for music genre classification.
- **Genres:** 10 (Blues, Classical, Country, Disco, Hip-hop, Jazz, Metal, Pop, Reggae, Rock).
- **Format:** 22050Hz, 16-bit, mono WAV files.

## Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

### 2. Training (Required)
You must train the model or provide artifacts in `backend/models/`:
```bash
# Provide the path to your GTZAN dataset
python3 train.py --dataset "/path/to/gtzan/genres" --version v1
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

## Running the Application

### Start the Backend
```bash
cd backend
python3 main.py
```
The API will be available at `http://localhost:8000`.

### Start the Frontend
```bash
cd frontend
npm run dev
```
The UI will be accessible at `http://localhost:5173`.

## Testing
The project includes a comprehensive test suite for both feature extraction and API endpoints:
```bash
cd backend
pytest
```

## API Overview

### `GET /`
Returns the API health status, version, and model readiness.

### `POST /predict`
Accepts a multipart/form-data audio file and returns the predicted genre.
- **Constraints:** Max 10MB; Allowed: `.wav`, `.mp3`, `.ogg`, `.flac`.
- **Response:**
  ```json
  {
    "predicted_genre": "Jazz",
    "confidence": 0.85,
    "all_probabilities": {
      "Jazz": 0.85,
      "Blues": 0.10,
      ...
    }
  }
  ```

## Folder Structure

```text
/
├── backend/
│   ├── main.py                # API Entry point
│   ├── services.py            # Inference & Model logic
│   ├── config.py              # Settings management
│   ├── train.py               # Training pipeline
│   ├── feature_extractor.py   # Audio processing logic
│   ├── models/                # ML artifacts (v1, v2, etc.)
│   └── tests/                 # Pytest suite
└── frontend/
    ├── src/
    │   ├── components/        # UI elements
    │   ├── pages/             # App views
    │   └── lib/               # Types & Utils
```

## Author
Jenil Patel