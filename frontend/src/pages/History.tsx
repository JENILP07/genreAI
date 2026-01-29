import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HistoryTable } from '@/components/HistoryTable';
import { getMockHistory, deletePrediction, clearHistory } from '@/lib/mockPrediction';
import { Prediction } from '@/lib/types';
import { History as HistoryIcon } from 'lucide-react';
import { toast } from 'sonner';

const History = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  useEffect(() => {
    setPredictions(getMockHistory());
  }, []);

  const handleDelete = (id: string) => {
    deletePrediction(id);
    setPredictions(getMockHistory());
    toast.success('Prediction deleted');
  };

  const handleClearAll = () => {
    clearHistory();
    setPredictions([]);
    toast.success('All history cleared');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4">
              <HistoryIcon className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Prediction History</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Your <span className="text-gradient">History</span>
            </h1>
            <p className="text-muted-foreground">
              View and manage all your past genre predictions
            </p>
          </motion.div>

          {/* History Table */}
          <HistoryTable
            predictions={predictions}
            onDelete={handleDelete}
            onClearAll={handleClearAll}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default History;
