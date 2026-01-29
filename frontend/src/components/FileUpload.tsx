import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileAudio, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onFileAccepted: (file: File) => void;
  isProcessing?: boolean;
}

const MAX_FILE_SIZE = 16 * 1024 * 1024; // 16MB
const ACCEPTED_TYPES = {
  'audio/wav': ['.wav'],
  'audio/mpeg': ['.mp3'],
  'audio/ogg': ['.ogg'],
  'audio/x-wav': ['.wav'],
};

export const FileUpload = ({ onFileAccepted, isProcessing = false }: FileUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);

    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError('File too large. Maximum size is 16MB.');
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setError('Invalid file type. Please upload WAV, MP3, or OGG files.');
      } else {
        setError('Invalid file. Please try again.');
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setFile(file);
      onFileAccepted(file);
    }
  }, [onFileAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    disabled: isProcessing,
  });

  const removeFile = () => {
    setFile(null);
    setError(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const dropzoneProps = getRootProps();

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              {...dropzoneProps}
              className={`
                relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
                transition-all duration-300
                ${isDragActive 
                  ? 'border-primary bg-primary/10 scale-[1.02]' 
                  : 'border-white/20 hover:border-primary/50 hover:bg-white/5'
                }
                ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <input {...getInputProps()} />
              
              <div className={`flex flex-col items-center gap-4 transition-transform ${isDragActive ? 'scale-110 -translate-y-2' : ''}`}>
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="w-10 h-10 text-primary" />
                </div>
                
                <div>
                  <p className="text-lg font-semibold mb-1">
                    {isDragActive ? 'Drop your audio file here' : 'Drag & drop your audio file'}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    or click to browse
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {['.wav', '.mp3', '.ogg'].map((format) => (
                    <span
                      key={format}
                      className="px-3 py-1 rounded-full bg-white/5 text-xs text-muted-foreground"
                    >
                      {format}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground">
                  Max file size: 16MB
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="file-preview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileAudio className="w-8 h-8 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>

              {!isProcessing && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={removeFile}
                  className="shrink-0"
                >
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
