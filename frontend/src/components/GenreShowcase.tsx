import { motion } from 'framer-motion';
import { GENRES, GENRE_ICONS, GENRE_COLORS } from '@/lib/types';

export const GenreShowcase = () => {
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
            Supported <span className="text-gradient">Genres</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our model is trained on the GTZAN dataset to classify 10 distinct music genres
          </p>
        </motion.div>

        {/* Genres Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {GENRES.map((genre, index) => (
            <motion.div
              key={genre}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass-card p-6 text-center cursor-pointer group"
              style={{
                borderColor: `${GENRE_COLORS[genre]}20`,
              }}
            >
              <div 
                className="text-4xl mb-3 transition-transform group-hover:scale-110"
              >
                {GENRE_ICONS[genre]}
              </div>
              <div 
                className="font-semibold capitalize"
                style={{ color: GENRE_COLORS[genre] }}
              >
                {genre}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
