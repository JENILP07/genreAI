import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { 
  Info, 
  Music2, 
  Cpu, 
  Database, 
  Code2,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const techStack = [
  { name: 'React 18', icon: Code2, description: 'Frontend framework with hooks' },
  { name: 'TypeScript', icon: Code2, description: 'Type-safe development' },
  { name: 'Tailwind CSS', icon: Code2, description: 'Utility-first styling' },
  { name: 'Framer Motion', icon: Code2, description: 'Smooth animations' },
  { name: 'Recharts', icon: Code2, description: 'Data visualization' },
];

const genres = [
  { name: 'Blues', emoji: '🎷', description: 'Soulful, expressive music with origins in African American communities' },
  { name: 'Classical', emoji: '🎻', description: 'Formal, traditional compositions from Western art music' },
  { name: 'Country', emoji: '🤠', description: 'American roots music with folk and western influences' },
  { name: 'Disco', emoji: '🪩', description: 'Dance music characterized by four-on-the-floor beats' },
  { name: 'Hip-hop', emoji: '🎤', description: 'Rhythmic music featuring rapping, DJing, and sampling' },
  { name: 'Jazz', emoji: '🎺', description: 'Improvisational music with complex harmonies and rhythms' },
  { name: 'Metal', emoji: '🤘', description: 'Heavy, distorted guitars with aggressive rhythms' },
  { name: 'Pop', emoji: '⭐', description: 'Catchy, mainstream music with broad appeal' },
  { name: 'Reggae', emoji: '🌴', description: 'Jamaican music with offbeat rhythms and social themes' },
  { name: 'Rock', emoji: '🎸', description: 'Guitar-driven music with strong beats and melodies' },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4">
              <Info className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">About GenreAI</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              AI-Powered <span className="text-gradient">Music Classification</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              GenreAI uses advanced machine learning to analyze audio features and 
              accurately classify music into one of 10 genres with detailed confidence scores.
            </p>
          </motion.div>

          {/* How It Works */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
            <div className="glass-card p-8 max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Music2 className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Audio Input</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload WAV, MP3, or OGG files up to 16MB. 30-second clips work best.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <Cpu className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">Feature Extraction</h3>
                  <p className="text-sm text-muted-foreground">
                    ML extracts MFCCs, spectral features, tempo, and rhythm patterns.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Classification</h3>
                  <p className="text-sm text-muted-foreground">
                    Trained model predicts genre with probability scores for all 10 genres.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Genres */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Supported Genres</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
              {genres.map((genre, index) => (
                <motion.div
                  key={genre.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="glass-card p-4 text-center group hover:border-primary/30 transition-all"
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                    {genre.emoji}
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{genre.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {genre.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Tech Stack */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Technology Stack</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {techStack.map((tech, index) => {
                const Icon = tech.icon;
                return (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="glass-card p-4 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{tech.name}</h3>
                      <p className="text-xs text-muted-foreground">{tech.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* Dataset Info */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <div className="glass-card p-8 max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">Training Dataset</h2>
              <p className="text-muted-foreground mb-6">
                Our model is trained on the <strong>GTZAN Genre Collection</strong>, 
                a widely-used benchmark dataset for music genre recognition containing 
                1,000 audio tracks (100 per genre) of 30-second clips.
              </p>
              <div className="flex justify-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gradient">1,000</div>
                  <div className="text-sm text-muted-foreground">Audio Tracks</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gradient">10</div>
                  <div className="text-sm text-muted-foreground">Genres</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gradient">30s</div>
                  <div className="text-sm text-muted-foreground">Clip Length</div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <Link to="/predict">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold px-8"
              >
                Try It Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
