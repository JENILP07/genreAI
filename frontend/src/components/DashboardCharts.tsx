import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import { Prediction, GENRE_COLORS, Genre, GENRES } from '@/lib/types';
import { 
  TrendingUp, 
  Music2, 
  Target, 
  BarChart3 as BarChartIcon
} from 'lucide-react';

interface DashboardChartsProps {
  predictions: Prediction[];
}

export const DashboardCharts = ({ predictions }: DashboardChartsProps) => {
  // Calculate statistics
  const stats = useMemo(() => {
    if (predictions.length === 0) {
      return {
        total: 0,
        avgConfidence: 0,
        mostCommon: 'N/A' as Genre | 'N/A',
        genreDistribution: [] as { genre: string; count: number; color: string }[],
        timelineData: [] as { date: string; count: number }[],
        confidenceByGenre: [] as { genre: string; avgConfidence: number; color: string }[],
      };
    }

    const genreCounts: Record<string, number> = {};
    const genreConfidences: Record<string, number[]> = {};
    const dateCounts: Record<string, number> = {};

    predictions.forEach(p => {
      // Genre distribution
      genreCounts[p.predictedGenre] = (genreCounts[p.predictedGenre] || 0) + 1;
      
      // Confidence by genre
      if (!genreConfidences[p.predictedGenre]) {
        genreConfidences[p.predictedGenre] = [];
      }
      genreConfidences[p.predictedGenre].push(p.confidence);

      // Timeline
      const date = new Date(p.timestamp).toLocaleDateString();
      dateCounts[date] = (dateCounts[date] || 0) + 1;
    });

    const avgConfidence = predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length;
    
    const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);
    const mostCommon = sortedGenres[0]?.[0] as Genre;

    const genreDistribution = GENRES.map(genre => ({
      genre: genre.charAt(0).toUpperCase() + genre.slice(1),
      count: genreCounts[genre] || 0,
      color: GENRE_COLORS[genre],
    })).filter(g => g.count > 0);

    const confidenceByGenre = Object.entries(genreConfidences).map(([genre, confidences]) => ({
      genre: genre.charAt(0).toUpperCase() + genre.slice(1),
      avgConfidence: Math.round(confidences.reduce((a, b) => a + b, 0) / confidences.length),
      color: GENRE_COLORS[genre as Genre],
    }));

    const timelineData = Object.entries(dateCounts)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .slice(-7)
      .map(([date, count]) => ({ date, count }));

    return {
      total: predictions.length,
      avgConfidence,
      mostCommon,
      genreDistribution,
      timelineData,
      confidenceByGenre,
    };
  }, [predictions]);

  if (predictions.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <BarChartIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Analytics Yet</h3>
        <p className="text-muted-foreground">
          Analytics will appear here after you make some predictions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Predictions</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
              <Target className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Confidence</p>
              <p className="text-2xl font-bold">{stats.avgConfidence.toFixed(1)}%</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Music2 className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Most Common</p>
              <p className="text-2xl font-bold capitalize">{stats.mostCommon}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Genre Distribution Pie Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6"
        >
          <h3 className="font-semibold mb-6">Genre Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.genreDistribution}
                dataKey="count"
                nameKey="genre"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ genre, percent }) => `${genre} ${(percent * 100).toFixed(0)}%`}
              >
                {stats.genreDistribution.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(240, 12%, 10%)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Confidence by Genre Bar Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <h3 className="font-semibold mb-6">Average Confidence by Genre</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.confidenceByGenre}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="genre" 
                tick={{ fill: 'hsl(215, 20.2%, 65.1%)', fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fill: 'hsl(215, 20.2%, 65.1%)' }}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(240, 12%, 10%)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`${value}%`, 'Confidence']}
              />
              <Bar dataKey="avgConfidence" radius={[4, 4, 0, 0]}>
                {stats.confidenceByGenre.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Timeline Chart */}
        {stats.timelineData.length > 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 lg:col-span-2"
          >
            <h3 className="font-semibold mb-6">Predictions Over Time</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats.timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: 'hsl(215, 20.2%, 65.1%)', fontSize: 12 }}
                />
                <YAxis tick={{ fill: 'hsl(215, 20.2%, 65.1%)' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(240, 12%, 10%)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="hsl(252, 87%, 67%)" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(252, 87%, 67%)', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </div>
    </div>
  );
};
