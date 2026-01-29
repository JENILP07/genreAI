import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Prediction, Genre } from '@/lib/types';
import { Button } from '@/components/ui/button'; // Assuming these exist
import { Textarea } from '@/components/ui/textarea'; // Assuming these exist
import { Card } from '@/components/ui/card';
import { Sparkles, Play, RotateCcw } from 'lucide-react';

// Default JSON from Data/features_30_sec.csv (row 1, Blues)
const DEFAULT_JSON = {
  "length": 661794, "chroma_stft_mean": 0.3500881195068359, "chroma_stft_var": 0.0887565687298774, 
  "rms_mean": 0.1302279233932495, "rms_var": 0.0028266964945942, "spectral_centroid_mean": 1784.165849538755, 
  "spectral_centroid_var": 129774.06452515082, "spectral_bandwidth_mean": 2002.4490601176965, 
  "spectral_bandwidth_var": 85882.76131549841, "rolloff_mean": 3805.8396058403423, "rolloff_var": 901505.425532842, 
  "zero_crossing_rate_mean": 0.0830448206689868, "zero_crossing_rate_var": 0.000766945654594, 
  "harmony_mean": -4.5297241740627214e-05, "harmony_var": 0.0081722820177674, "perceptr_mean": 7.783231922076084e-06, 
  "perceptr_var": 0.0056981821544468, "tempo": 123.046875, "mfcc1_mean": -113.57064819335938, "mfcc1_var": 2564.20751953125, 
  "mfcc2_mean": 121.57179260253906, "mfcc2_var": 295.913818359375, "mfcc3_mean": -19.168142318725582, 
  "mfcc3_var": 235.57443237304688, "mfcc4_mean": 42.36642074584961, "mfcc4_var": 151.10687255859375, 
  "mfcc5_mean": -6.364664077758789, "mfcc5_var": 167.93479919433594, "mfcc6_mean": 18.623498916625977, 
  "mfcc6_var": 89.18083953857422, "mfcc7_mean": -13.704891204833984, "mfcc7_var": 67.66049194335938, 
  "mfcc8_mean": 15.34315013885498, "mfcc8_var": 68.93257904052734, "mfcc9_mean": -12.274109840393066, 
  "mfcc9_var": 82.2042007446289, "mfcc10_mean": 10.976572036743164, "mfcc10_var": 63.38631057739258, 
  "mfcc11_mean": -8.326573371887207, "mfcc11_var": 61.773094177246094, "mfcc12_mean": 8.803791999816895, 
  "mfcc12_var": 51.24412536621094, "mfcc13_mean": -3.672300100326538, "mfcc13_var": 41.21741485595703, 
  "mfcc14_mean": 5.747994899749756, "mfcc14_var": 40.55447769165039, "mfcc15_mean": -5.162881851196289, 
  "mfcc15_var": 49.775421142578125, "mfcc16_mean": 0.752740204334259, "mfcc16_var": 52.4209098815918, 
  "mfcc17_mean": -1.6902146339416504, "mfcc17_var": 36.524070739746094, "mfcc18_mean": -0.4089791774749756, 
  "mfcc18_var": 41.59710311889648, "mfcc19_mean": -2.3035225868225098, "mfcc19_var": 55.06292343139648, 
  "mfcc20_mean": 1.2212907075881958, "mfcc20_var": 46.93603515625
};

interface GenrePredictorProps {
  onPredictionComplete: (prediction: Prediction) => void;
  isLoading: boolean;
}

export const GenrePredictor = ({ onPredictionComplete, isLoading }: GenrePredictorProps) => {
  const [jsonInput, setJsonInput] = useState('');

  const loadExample = () => {
    setJsonInput(JSON.stringify(DEFAULT_JSON, null, 2));
    toast.info("Loaded example 'Blues' data");
  };

  const handlePredict = async () => {
    try {
      if (!jsonInput.trim()) {
        toast.error("Please enter JSON data");
        return;
      }

      const features = JSON.parse(jsonInput);
      
      // Call Backend
      // NOTE: Ensure backend is running on port 8000
      const response = await axios.post('http://localhost:8000/predict', { features });
      
      const { predicted_genre, confidence } = response.data;
      
      // Map to Prediction type
      const prediction: Prediction = {
        id: crypto.randomUUID(),
        filename: 'manual_input.json',
        predictedGenre: predicted_genre as Genre,
        confidence: confidence === 'N/A' ? 0.99 : parseFloat(confidence), // Fallback if N/A
        allProbabilities: [], // Not returned by simple predict
        timestamp: new Date(),
        duration: 30, // Mock
        fileSize: 1024
      };

      onPredictionComplete(prediction);
      toast.success(`Predicted: ${predicted_genre.toUpperCase()}`);

    } catch (error: any) {
      console.error(error);
      if (error instanceof SyntaxError) {
        toast.error("Invalid JSON format");
      } else {
        toast.error(error.response?.data?.detail || "Prediction failed. Is backend running?");
      }
    }
  };

  return (
    <Card className="p-6 glass-card space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Raw Feature Input
        </h3>
        <Button variant="outline" size="sm" onClick={loadExample} className="text-xs">
          <RotateCcw className="w-3 h-3 mr-2" />
          Load Example
        </Button>
      </div>

      <Textarea 
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder="Paste feature JSON here..."
        className="font-mono text-xs h-64 bg-background/50"
      />

      <Button 
        onClick={handlePredict} 
        disabled={isLoading} 
        className="w-full"
      >
        {isLoading ? "Analyzing..." : (
          <>
            <Play className="w-4 h-4 mr-2" />
            Predict Genre
          </>
        )}
      </Button>
    </Card>
  );
};
