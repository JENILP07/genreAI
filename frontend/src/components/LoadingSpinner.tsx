import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner = ({ message = 'Analyzing audio...' }: LoadingSpinnerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="glass-card p-8 text-center"
    >
      {/* Animated waveform */}
      <div className="flex justify-center items-end gap-1 mb-6 h-12">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              height: ['16px', '48px', '24px', '40px', '16px'],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.08,
              ease: 'easeInOut',
            }}
            className="w-2 bg-gradient-to-t from-primary to-accent rounded-full"
          />
        ))}
      </div>

      {/* Icon */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"
      >
        <Cpu className="w-8 h-8 text-primary" />
      </motion.div>

      <h3 className="text-xl font-semibold mb-2">{message}</h3>
      <p className="text-muted-foreground text-sm">
        Extracting audio features and running ML prediction...
      </p>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mt-6">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
            className="w-2 h-2 rounded-full bg-primary"
          />
        ))}
      </div>
    </motion.div>
  );
};
