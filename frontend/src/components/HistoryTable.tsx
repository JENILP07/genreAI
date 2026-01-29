import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Prediction, 
  GENRE_ICONS, 
  GENRE_COLORS,
  Genre 
} from '@/lib/types';
import { 
  Search, 
  Trash2, 
  FileAudio, 
  ChevronLeft, 
  ChevronRight,
  Trash,
  Download,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface HistoryTableProps {
  predictions: Prediction[];
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

const ITEMS_PER_PAGE = 10;

export const HistoryTable = ({ predictions, onDelete, onClearAll }: HistoryTableProps) => {
  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPredictions = useMemo(() => {
    return predictions.filter((p) => {
      const matchesSearch = p.filename.toLowerCase().includes(search.toLowerCase());
      const matchesGenre = genreFilter === 'all' || p.predictedGenre === genreFilter;
      return matchesSearch && matchesGenre;
    });
  }, [predictions, search, genreFilter]);

  const totalPages = Math.ceil(filteredPredictions.length / ITEMS_PER_PAGE);
  const paginatedPredictions = filteredPredictions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const exportToCSV = () => {
    const headers = ['Filename', 'Predicted Genre', 'Confidence', 'Date'];
    const rows = predictions.map(p => [
      p.filename,
      p.predictedGenre,
      `${p.confidence.toFixed(1)}%`,
      new Date(p.timestamp).toLocaleString()
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'genre-predictions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (predictions.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <FileAudio className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Predictions Yet</h3>
        <p className="text-muted-foreground">
          Start by uploading an audio file to classify its genre.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by filename..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 bg-card border-white/10"
          />
        </div>
        
        <Select value={genreFilter} onValueChange={(v) => { setGenreFilter(v); setCurrentPage(1); }}>
          <SelectTrigger className="w-full sm:w-48 bg-card border-white/10">
            <SelectValue placeholder="Filter by genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genres</SelectItem>
            {Object.keys(GENRE_ICONS).map((genre) => (
              <SelectItem key={genre} value={genre}>
                {GENRE_ICONS[genre as Genre]} {genre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={exportToCSV}
          className="border-white/10"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="glass-card border-white/10">
            <AlertDialogHeader>
              <AlertDialogTitle>Clear All History?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete all {predictions.length} predictions from your history. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-white/10">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onClearAll} className="bg-destructive text-destructive-foreground">
                Delete All
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Filename</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Genre</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Confidence</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Date</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPredictions.map((prediction, index) => (
                <motion.tr
                  key={prediction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FileAudio className="w-5 h-5 text-primary shrink-0" />
                      <span className="truncate max-w-[200px]">{prediction.filename}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span>{GENRE_ICONS[prediction.predictedGenre]}</span>
                      <span 
                        className="capitalize font-medium"
                        style={{ color: GENRE_COLORS[prediction.predictedGenre] }}
                      >
                        {prediction.predictedGenre}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ 
                            width: `${prediction.confidence}%`,
                            backgroundColor: GENRE_COLORS[prediction.predictedGenre]
                          }}
                        />
                      </div>
                      <span className="text-sm font-mono">{prediction.confidence.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(prediction.timestamp).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(prediction.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredPredictions.length)} of {filteredPredictions.length} results
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="border-white/10"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="border-white/10"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
