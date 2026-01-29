import { useEffect, useState } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { motion } from 'framer-motion';
import { Music2 } from 'lucide-react';

interface AudioPlayerProps {
  file: File | null;
}

export const AudioPlayerComponent = ({ file }: AudioPlayerProps) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [file]);

  if (!file || !audioUrl) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 rounded-xl"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Music2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-sm">Now Playing</p>
          <p className="text-xs text-muted-foreground truncate max-w-[200px]">{file.name}</p>
        </div>
      </div>
      
      <AudioPlayer
        src={audioUrl}
        showJumpControls={false}
        customAdditionalControls={[]}
        customVolumeControls={[]}
        layout="horizontal"
        className="rounded-lg"
      />
    </motion.div>
  );
};
