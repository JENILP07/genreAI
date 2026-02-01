import React, { createContext, useContext, useEffect, useState } from 'react';
import { Prediction } from '@/lib/types';
import { GENRE_THEMES, BASE_THEME, blendColors, ThemeColors } from '@/lib/theme';

interface ThemeContextType {
  setPrediction: (prediction: Prediction | null) => void;
  isLocked: boolean;
  setIsLocked: (locked: boolean) => void;
  currentTheme: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeColors>(BASE_THEME);

  useEffect(() => {
    if (isLocked) return;

    if (!prediction) {
      applyTheme(BASE_THEME);
      setCurrentTheme(BASE_THEME);
      return;
    }

    const { predictedGenre, confidence, allProbabilities } = prediction;
    let theme = GENRE_THEMES[predictedGenre] || BASE_THEME;

    // Confidence blending logic
    // "If prediction confidence < 60%, blend the top two genre colors using a soft gradient"
    if (confidence < 60 && allProbabilities && allProbabilities.length >= 2) {
      // Sort probabilities to find top 2
      const sorted = [...allProbabilities].sort((a, b) => b.probability - a.probability);
      const top1 = sorted[0];
      const top2 = sorted[1];
      
      if (top1 && top2) {
        const theme1 = GENRE_THEMES[top1.genre] || BASE_THEME;
        const theme2 = GENRE_THEMES[top2.genre] || BASE_THEME;

        // Calculate blend ratio. 
        // We want to mix based on how close they are. 
        const total = top1.probability + top2.probability;
        const ratio = total > 0 ? top2.probability / total : 0; 

        theme = {
          primary: blendColors(theme1.primary, theme2.primary, ratio),
          accent: blendColors(theme1.accent, theme2.accent, ratio),
          backgroundTint: blendColors(theme1.backgroundTint, theme2.backgroundTint, ratio),
        };
      }
    }

    applyTheme(theme);
    setCurrentTheme(theme);

  }, [prediction, isLocked]);

  const applyTheme = (theme: ThemeColors) => {
    const root = document.documentElement;
    // We update the CSS variables smoothly
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--genre-bg-tint', theme.backgroundTint);
  };

  return (
    <ThemeContext.Provider value={{ setPrediction, isLocked, setIsLocked, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
