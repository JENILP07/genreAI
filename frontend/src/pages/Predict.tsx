import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FileUpload } from '@/components/FileUpload';
import { AudioPlayerComponent } from '@/components/AudioPlayer';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { PredictionResults } from '@/components/PredictionResults';
import { GenrePredictor } from '@/components/GenrePredictor';
import { savePrediction } from '@/lib/mockPrediction';
import { Prediction, Genre } from '@/lib/types';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

type Stage = 'upload' | 'processing' | 'results';
type InputMode = 'file' | 'json';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const Predict = () => {
  const [stage, setStage] = useState<Stage>('upload');
  const [inputMode, setInputMode] = useState<InputMode>('file');
  const [file, setFile] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileAccepted = async (acceptedFile: File) => {
    setFile(acceptedFile);
    setIsUploading(true);
    setStage('processing');

    const formData = new FormData();
    formData.append('file', acceptedFile);

    try {
      const response = await axios.post(`${API_BASE_URL}/predict`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = response.data;
      
      const result: Prediction = {
        id: crypto.randomUUID(),
        filename: acceptedFile.name,
        predictedGenre: data.predicted_genre as Genre,
        confidence: data.confidence,
        allProbabilities: Object.entries(data.all_probabilities).map(([genre, prob]) => ({
          genre: genre as Genre,
          probability: prob as number,
        })),
        timestamp: new Date(),
        duration: 30,
        fileSize: acceptedFile.size
      };

      setPrediction(result);
      setStage('results');
    } catch (error: any) {
      console.error('Upload error:', error);
      const message = error.response?.data?.detail || 'Failed to analyze audio. Please try again.';
      toast.error(message);
      setStage('upload');
    } finally {
      setIsUploading(false);
    }
  };

  const handleJsonPrediction = (result: Prediction) => {
    setPrediction(result);
    setStage('results');
  };

  const handleSave = () => {
    if (prediction) {
      savePrediction(prediction);
      setIsSaved(true);
      toast.success('Prediction saved to history!');
    }
  };

  const handleTryAnother = () => {
    setStage('upload');
    setFile(null);
    setPrediction(null);
    setIsSaved(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">AI Genre Prediction</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Upload & <span className="text-gradient">Analyze</span>
              </h1>
              <p className="text-muted-foreground">
                Upload an audio file or enter features to classify genre
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              {stage === 'upload' && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="flex justify-center gap-4 mb-8">
                    <Button 
                      variant={inputMode === 'file' ? 'default' : 'outline'} 
                      onClick={() => setInputMode('file')}
                      disabled={isUploading}
                    >
                      Audio File
                    </Button>
                    <Button 
                      variant={inputMode === 'json' ? 'default' : 'outline'} 
                      onClick={() => setInputMode('json')}
                      disabled={isUploading}
                    >
                      JSON Features
                    </Button>
                  </div>

                  {inputMode === 'file' ? (
                    <FileUpload 
                      onFileAccepted={handleFileAccepted}
                      isProcessing={isUploading}
                    />
                  ) : (
                    <GenrePredictor 
                      onPredictionComplete={handleJsonPrediction}
                      isLoading={isUploading}
                    />
                  )}
                </motion.div>
              )}

              {stage === 'processing' && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {file && <AudioPlayerComponent file={file} />}
                  <LoadingSpinner />
                  <p className="text-center text-muted-foreground animate-pulse">Uploading and analyzing your track...</p>
                </motion.div>
              )}

              {stage === 'results' && prediction && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {file && <AudioPlayerComponent file={file} />}
                  <PredictionResults 
                    prediction={prediction}
                    onSave={handleSave}
                    onTryAnother={handleTryAnother}
                    isSaved={isSaved}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Predict;