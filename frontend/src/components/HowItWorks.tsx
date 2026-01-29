import { motion } from 'framer-motion';
import { Upload, Cpu, BarChart3, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    step: '01',
    title: 'Upload Audio',
    description: 'Drag and drop or select your audio file (WAV, MP3, OGG). Max 16MB file size.',
  },
  {
    icon: Cpu,
    step: '02',
    title: 'AI Analysis',
    description: 'Our ML model extracts audio features using librosa and analyzes patterns.',
  },
  {
    icon: BarChart3,
    step: '03',
    title: 'Get Results',
    description: 'View the predicted genre with confidence scores and probability charts.',
  },
  {
    icon: CheckCircle2,
    step: '04',
    title: 'Save & Track',
    description: 'Save predictions to history and track analytics on your dashboard.',
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Simple 4-step process to classify your music in seconds
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent hidden lg:block" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="glass-card p-6 text-center relative z-10">
                    {/* Step Number */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-6xl font-bold text-primary/10">
                      {step.step}
                    </div>
                    
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 relative z-10">
                      <Icon className="w-8 h-8 text-primary-foreground" />
                    </div>

                    <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
