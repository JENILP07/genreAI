import { motion } from 'framer-motion';
import { 
  Prediction, 
  GENRE_ICONS, 
  GENRE_COLORS,
} from '@/lib/types';
import { CheckCircle2, Clock, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PredictionResultsProps {
  prediction: Prediction;
  onSave: () => void;
  onTryAnother: () => void;
  isSaved?: boolean;
}

export const PredictionResults = ({ 
  prediction, 
  onSave, 
  onTryAnother,
  isSaved = false
}: PredictionResultsProps) => {
  const { predictedGenre, confidence, allProbabilities, filename, timestamp } = prediction;
  const top3 = allProbabilities.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Main Result Card */}
      <div className="glass-card p-8 text-center relative overflow-hidden">
        {/* Background glow */}
        <div 
          className="absolute inset-0 opacity-20 blur-3xl"
          style={{ 
            background: `radial-gradient(circle at center, ${GENRE_COLORS[predictedGenre]}, transparent 70%)` 
          }}
        />
        
        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="text-7xl mb-4"
          >
            {GENRE_ICONS[predictedGenre]}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold capitalize mb-2" style={{ color: GENRE_COLORS[predictedGenre] }}>
              {predictedGenre}
            </h2>
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="text-lg">
                <span className="font-bold text-foreground">{confidence.toFixed(1)}%</span> confidence
              </span>
            </div>
          </motion.div>

          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="truncate max-w-[200px]">{filename}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {new Date(timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* Probability Bars */}
      <div className="glass-card p-6">
        <h3 className="font-semibold mb-4">Genre Probabilities</h3>
        <div className="space-y-3">
          {allProbabilities.map((item, index) => (
            <motion.div
              key={item.genre}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="space-y-1"
            >
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span>{GENRE_ICONS[item.genre]}</span>
                  <span className="capitalize">{item.genre}</span>
                </div>
                <span className="font-mono">{item.probability.toFixed(1)}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.probability}%` }}
                  transition={{ delay: 0.2 + 0.05 * index, duration: 0.5 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: GENRE_COLORS[item.genre] }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Top 3 Genres */}
      <div className="grid grid-cols-3 gap-4">
        {top3.map((item, index) => (
          <motion.div
            key={item.genre}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + 0.1 * index }}
            className={`glass-card p-4 text-center ${index === 0 ? 'ring-2 ring-primary/50' : ''}`}
          >
            <div className="text-2xl mb-1">{GENRE_ICONS[item.genre]}</div>
            <div className="text-sm font-semibold capitalize" style={{ color: GENRE_COLORS[item.genre] }}>
              {item.genre}
            </div>
            <div className="text-xs text-muted-foreground">{item.probability.toFixed(1)}%</div>
            {index === 0 && (
              <div className="text-xs text-primary mt-1">Top Pick</div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={onSave}
          disabled={isSaved}
          className="flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaved ? 'Saved to History' : 'Save to History'}
        </Button>
        <Button
          onClick={onTryAnother}
          variant="outline"
          className="flex-1 border-white/20"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Try Another
        </Button>
      </div>
    </motion.div>
  );
};
