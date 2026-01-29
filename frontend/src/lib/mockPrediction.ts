import { Prediction, GenreProbability, GENRES, Genre } from './types';
import axios from 'axios';

// Simulates ML prediction - replace with actual API call when backend is ready
export const mockPredictGenre = async (file: File): Promise<Prediction> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    // Call the backend API
    const response = await axios.post('http://localhost:8000/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const { predicted_genre, confidence, all_probabilities } = response.data;

    // Map backend probabilities to frontend structure
    const mappedProbabilities: GenreProbability[] = GENRES.map(genre => ({
      genre,
      probability: all_probabilities && all_probabilities[genre] !== undefined
        ? all_probabilities[genre] * 100
        : 0
    })).sort((a, b) => b.probability - a.probability);

    return {
      id: crypto.randomUUID(),
      filename: file.name,
      predictedGenre: predicted_genre as Genre,
      confidence: typeof confidence === 'number' ? confidence * 100 : 0,
      allProbabilities: mappedProbabilities,
      timestamp: new Date(),
      duration: 30, // Placeholder as backend doesn't return duration yet
      fileSize: file.size,
    };

  } catch (error) {
    console.error("Prediction failed:", error);
    throw error;
  }
};

// Mock prediction history
export const getMockHistory = (): Prediction[] => {
  const storedHistory = localStorage.getItem('predictionHistory');
  if (storedHistory) {
    return JSON.parse(storedHistory).map((p: Prediction) => ({
      ...p,
      timestamp: new Date(p.timestamp),
    }));
  }
  return [];
};

export const savePrediction = (prediction: Prediction): void => {
  const history = getMockHistory();
  history.unshift(prediction);
  localStorage.setItem('predictionHistory', JSON.stringify(history));
};

export const deletePrediction = (id: string): void => {
  const history = getMockHistory();
  const filtered = history.filter(p => p.id !== id);
  localStorage.setItem('predictionHistory', JSON.stringify(filtered));
};

export const clearHistory = (): void => {
  localStorage.removeItem('predictionHistory');
};
