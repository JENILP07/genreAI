export type Genre = 
  | 'blues' 
  | 'classical' 
  | 'country' 
  | 'disco' 
  | 'hiphop' 
  | 'jazz' 
  | 'metal' 
  | 'pop' 
  | 'reggae' 
  | 'rock';

export interface GenreProbability {
  genre: Genre;
  probability: number;
}

export interface Prediction {
  id: string;
  filename: string;
  predictedGenre: Genre;
  confidence: number;
  allProbabilities: GenreProbability[];
  timestamp: Date;
  duration?: number;
  fileSize?: number;
}

export interface PredictionStats {
  totalPredictions: number;
  mostCommonGenre: Genre;
  averageConfidence: number;
  genreDistribution: Record<Genre, number>;
}

export const GENRES: Genre[] = [
  'blues',
  'classical',
  'country',
  'disco',
  'hiphop',
  'jazz',
  'metal',
  'pop',
  'reggae',
  'rock',
];

export const GENRE_COLORS: Record<Genre, string> = {
  blues: 'hsl(217, 91%, 60%)',
  classical: 'hsl(239, 84%, 67%)',
  country: 'hsl(24, 95%, 53%)',
  disco: 'hsl(330, 81%, 60%)',
  hiphop: 'hsl(48, 96%, 53%)',
  jazz: 'hsl(175, 84%, 32%)',
  metal: 'hsl(218, 11%, 65%)',
  pop: 'hsl(142, 71%, 45%)',
  reggae: 'hsl(160, 84%, 39%)',
  rock: 'hsl(0, 84%, 60%)',
};

export const GENRE_ICONS: Record<Genre, string> = {
  blues: '🎷',
  classical: '🎻',
  country: '🤠',
  disco: '🪩',
  hiphop: '🎤',
  jazz: '🎺',
  metal: '🤘',
  pop: '⭐',
  reggae: '🌴',
  rock: '🎸',
};
