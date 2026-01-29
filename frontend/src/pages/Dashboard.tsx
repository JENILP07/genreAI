import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { DashboardCharts } from '@/components/DashboardCharts';
import { getMockHistory } from '@/lib/mockPrediction';
import { Prediction } from '@/lib/types';
import { BarChart3 } from 'lucide-react';

const Dashboard = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  useEffect(() => {
    setPredictions(getMockHistory());
  }, []);

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
              <BarChart3 className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Analytics</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Your <span className="text-gradient">Dashboard</span>
            </h1>
            <p className="text-muted-foreground">
              Insights and analytics from your prediction history
            </p>
          </motion.div>

          {/* Charts */}
          <DashboardCharts predictions={predictions} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
