import { motion } from 'framer-motion';
import { 
  Music, 
  Zap, 
  BarChart3, 
  PieChart, 
  Target, 
  Database,
  Sparkles,
  FileAudio,
  Clock
} from 'lucide-react';

const features = [
  {
    icon: Music,
    title: '10 Genre Support',
    description: 'Blues, Classical, Country, Disco, Hip-hop, Jazz, Metal, Pop, Reggae, and Rock.',
  },
  {
    icon: Zap,
    title: 'Real-time Analysis',
    description: 'Get instant predictions in under 3 seconds with our optimized ML pipeline.',
  },
  {
    icon: BarChart3,
    title: 'Confidence Scores',
    description: 'Detailed probability breakdown for all genres with visual charts.',
  },
  {
    icon: PieChart,
    title: 'Rich Visualizations',
    description: 'Interactive charts and graphs to understand prediction results.',
  },
  {
    icon: Target,
    title: 'High Accuracy',
    description: 'Trained on the GTZAN dataset with 95%+ classification accuracy.',
  },
  {
    icon: Database,
    title: 'Prediction History',
    description: 'Save and track all your predictions with detailed analytics.',
  },
  {
    icon: FileAudio,
    title: 'Multiple Formats',
    description: 'Supports WAV, MP3, and OGG audio file formats up to 16MB.',
  },
  {
    icon: Clock,
    title: '30-Second Clips',
    description: 'Optimized for 30-second audio clips for quick and accurate results.',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export const Features = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need for{' '}
            <span className="text-gradient">Genre Classification</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our advanced machine learning model provides accurate genre predictions 
            with detailed insights and beautiful visualizations.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={item}
                className="glass-card p-6 hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
