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
  blues: 'hsl(210, 80%, 55%)',
  classical: 'hsl(45, 85%, 60%)',
  country: 'hsl(30, 75%, 55%)',
  disco: 'hsl(330, 85%, 65%)',
  hiphop: 'hsl(15, 90%, 55%)',
  jazz: 'hsl(200, 70%, 50%)',
  metal: 'hsl(0, 0%, 40%)',
  pop: 'hsl(320, 85%, 60%)',
  reggae: 'hsl(140, 70%, 45%)',
  rock: 'hsl(0, 75%, 55%)',
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
