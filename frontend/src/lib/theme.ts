import { Genre } from './types';

export interface ThemeColors {
  primary: string; // H S% L%
  accent: string; // H S% L%
  backgroundTint: string; // H S% L%
}

// Helper to convert Hex to HSL (space separated)
export function hexToHsl(hex: string): string {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt("0x" + hex[1] + hex[1]);
    g = parseInt("0x" + hex[2] + hex[2]);
    b = parseInt("0x" + hex[3] + hex[3]);
  } else if (hex.length === 7) {
    r = parseInt("0x" + hex[1] + hex[2]);
    g = parseInt("0x" + hex[3] + hex[4]);
    b = parseInt("0x" + hex[5] + hex[6]);
  }
  r /= 255;
  g /= 255;
  b /= 255;
  const cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin;
  let h = 0, s = 0, l = 0;

  if (delta === 0) h = 0;
  else if (cmax === r) h = ((g - b) / delta) % 6;
  else if (cmax === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);
  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return `${h} ${s}% ${l}%`;
}

// Parse HSL string to object
function parseHsl(hsl: string) {
  const [h, s, l] = hsl.split(' ').map(v => parseFloat(v));
  return { h, s, l };
}

// Blend two HSL colors
export function blendColors(c1: string, c2: string, ratio: number): string {
  const color1 = parseHsl(c1);
  const color2 = parseHsl(c2);

  // Shortest path for hue
  let dH = color2.h - color1.h;
  if (dH > 180) dH -= 360;
  else if (dH < -180) dH += 360;
  
  const h = (color1.h + dH * ratio + 360) % 360;
  const s = color1.s + (color2.s - color1.s) * ratio;
  const l = color1.l + (color2.l - color1.l) * ratio;

  return `${Math.round(h)} ${s.toFixed(1)}% ${l.toFixed(1)}%`;
}

export const GENRE_THEMES: Record<string, ThemeColors> = {
  rock: {
    primary: hexToHsl('#EF4444'),
    accent: hexToHsl('#7F1D1D'),
    backgroundTint: hexToHsl('#0F0A0A')
  },
  hiphop: {
    primary: hexToHsl('#FACC15'),
    accent: hexToHsl('#A16207'),
    backgroundTint: hexToHsl('#14110A')
  },
  classical: {
    primary: hexToHsl('#6366F1'),
    accent: hexToHsl('#312E81'),
    backgroundTint: hexToHsl('#0B1020')
  },
  jazz: {
    primary: hexToHsl('#0D9488'),
    accent: hexToHsl('#064E3B'),
    backgroundTint: hexToHsl('#071A17')
  },
  // Mapping EDM to Disco
  disco: {
    primary: hexToHsl('#EC4899'),
    accent: hexToHsl('#831843'),
    backgroundTint: hexToHsl('#140A12')
  },
  pop: {
    primary: hexToHsl('#22C55E'),
    accent: hexToHsl('#166534'),
    backgroundTint: hexToHsl('#0B140E')
  },
  metal: {
    primary: hexToHsl('#9CA3AF'),
    accent: hexToHsl('#111827'),
    backgroundTint: hexToHsl('#050505')
  },
  // Fallbacks/Others
  blues: {
    primary: hexToHsl('#3B82F6'), // Blue-500
    accent: hexToHsl('#1E3A8A'), // Blue-900
    backgroundTint: hexToHsl('#0B101A')
  },
  country: {
    primary: hexToHsl('#F97316'), // Orange-500
    accent: hexToHsl('#7C2D12'), // Orange-900
    backgroundTint: hexToHsl('#1A0F0B')
  },
  reggae: {
    primary: hexToHsl('#10B981'), // Emerald-500
    accent: hexToHsl('#064E3B'), // Emerald-900
    backgroundTint: hexToHsl('#061510')
  }
};

export const BASE_THEME: ThemeColors = {
  primary: hexToHsl('#E5E7EB'), // Gray-200
  accent: hexToHsl('#9CA3AF'), // Gray-400
  backgroundTint: hexToHsl('#0B0F1A')
};
