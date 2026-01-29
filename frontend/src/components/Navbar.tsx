import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, Menu, X, Home, Mic2, History, BarChart3, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/predict', label: 'Predict', icon: Mic2 },
  { path: '/history', label: 'History', icon: History },
  { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { path: '/about', label: 'About', icon: Info },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-lg group-hover:bg-primary/50 transition-colors" />
              <Headphones className="w-8 h-8 text-primary relative" />
            </div>
            <span className="font-bold text-xl text-gradient">GenreAI</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant="ghost"
                    className={`relative px-4 py-2 transition-all duration-300 ${
                      isActive 
                        ? 'text-primary' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent"
                      />
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link to="/predict">
              <Button className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold px-6 hover:opacity-90 transition-opacity">
                Try Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-card border-t border-white/5"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${
                        isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
              <Link to="/predict" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold mt-4">
                  Try Now
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
