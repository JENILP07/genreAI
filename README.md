# GenreAI

GenreAI is a professional-grade music genre classification system that leverages machine learning to identify the musical genre of audio files. The application provides an intuitive interface for users to upload audio tracks and receive real-time predictions with high confidence scores.

## Features

- High-accuracy audio genre classification using ensemble learning.
- Real-time feature extraction from uploaded audio files.
- Detailed prediction breakdown with confidence percentages for all genres.
- Interactive dashboard with visual charts for genre distribution.
- Responsive web interface with support for multiple device types.
- History tracking for past predictions and analysis.
- Support for various audio formats (WAV, MP3, etc.).

## Project Architecture

The system follows a modern decoupled architecture:

- **Frontend:** A React-based Single Page Application (SPA) that handles the user interface, file uploads, and data visualization.
- **Backend:** A FastAPI-driven RESTful service that manages the machine learning pipeline, including audio processing, feature extraction, and model inference.
- **Machine Learning Pipeline:** A robust pipeline that processes raw audio, extracts relevant acoustic features, and utilizes pre-trained Scikit-learn models for classification.

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite (Build Tool)
- Tailwind CSS (Styling)
- Shadcn UI (Component Library)
- Recharts (Data Visualization)
- Axios (API Communication)
- Framer Motion (Animations)

### Backend
- Python 3.10+
- FastAPI (Web Framework)
- Librosa (Audio Analysis)
- Scikit-learn (Machine Learning)
- Pandas & NumPy (Data Processing)
- Uvicorn (ASGI Server)

## Dataset Information

The models were trained using the **GTZAN Music Genre Dataset**, the industry standard for music genre classification.
- **Content:** 1000 audio tracks, each 30 seconds long.
- **Genres:** 10 (Blues, Classical, Country, Disco, Hip-hop, Jazz, Metal, Pop, Reggae, Rock).
- **Format:** 22050Hz, 16-bit, mono WAV files.

## Model Details

- **Feature Extraction:** 50+ acoustic features are extracted, including MFCCs, Spectral Centroid, Chroma STFT, Spectral Rolloff, and Zero Crossing Rate.
- **Random Forest:** Utilized for its robust performance and ability to handle high-dimensional feature sets.
- **Voting Classifier:** A Soft Voting ensemble that combines multiple models to improve overall prediction stability and accuracy.
- **Preprocessing:** Standard scaling and label encoding are applied to ensure consistent input distribution.

## Installation & Setup

### Prerequisites
- Python 3.10 or higher
- Node.js 18 or higher
- Git LFS

### Python Virtual Environment
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

### Backend Setup
1. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Ensure the model artifacts exist in `backend/models/`.

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Start the Backend
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
The API will be available at `http://localhost:8000`.

### Start the Frontend
```bash
cd frontend
npm run dev
```
The application will be accessible at `http://localhost:5173`.

## API Overview

### `GET /`
Returns the API health status and a welcome message.

### `POST /predict`
Accepts a multipart/form-data audio file and returns the predicted genre.
- **Request:** `file` (Audio file, max 10MB)
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

## Git LFS Usage

This project uses Git Large File Storage (LFS) to manage large binary files, specifically the machine learning models (`.pkl` files) located in the `backend/models/` directory.

### Why Git LFS?
Git is not designed to handle large binary files efficiently. Git LFS replaces these files with text pointers inside Git, while storing the actual file content on a remote server, keeping the repository lightweight.

### How to use
If you are cloning this repository for the first time:
```bash
git lfs install
git lfs pull
```

## Folder Structure

```text
/
├── backend/
│   ├── main.py                # FastAPI application entry point
│   ├── feature_extractor.py   # Audio processing logic
│   ├── requirements.txt       # Python dependencies
│   ├── models/                # Pre-trained models and scalers
│   │   ├── best_model.pkl
│   │   ├── scaler.pkl
│   │   └── label_encoder.pkl
│   └── BACKEND_RUN_GUIDE.txt  # Detailed backend instructions
└── frontend/
    ├── src/
    │   ├── components/        # UI components
    │   ├── pages/             # Application pages
    │   ├── lib/               # Utilities and types
    │   └── App.tsx            # Main React component
    ├── package.json           # Frontend dependencies
    └── tailwind.config.ts     # Styling configuration
```

## Future Improvements

- Implementation of Deep Learning architectures (CNNs or Transformers) for improved accuracy.
- Integration of real-time audio stream classification via WebSockets.
- Support for user-defined genre custom labels.
- Mobile application development using React Native.
- Cloud deployment (AWS/GCP) with Docker orchestration.


## Author

Jenil Patel
