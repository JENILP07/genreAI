import { Link } from 'react-router-dom';
import { Music, Github, Twitter, Linkedin, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-white/5 bg-card/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Music className="w-6 h-6 text-primary" />
              <span className="font-bold text-xl text-gradient">GenreAI</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              AI-powered music genre classification using advanced machine learning models.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/predict" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Predict Genre
                </Link>
              </li>
              <li>
                <Link to="/history" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  History
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Supported Genres */}
          <div>
            <h3 className="font-semibold mb-4">Supported Genres</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>🎷 Blues</li>
              <li>🎻 Classical</li>
              <li>🤠 Country</li>
              <li>🪩 Disco</li>
              <li>🎤 Hip-hop</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 opacity-0">More</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>🎺 Jazz</li>
              <li>🤘 Metal</li>
              <li>⭐ Pop</li>
              <li>🌴 Reggae</li>
              <li>🎸 Rock</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2026 GenreAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
