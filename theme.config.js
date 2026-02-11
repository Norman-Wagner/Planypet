/** @type {const} */
const themeColors = {
  // ULTRA-PREMIUM: Tiefes Schwarz mit Gold-Akzenten
  primary: { light: '#B8860B', dark: '#D4A843' },        // Dark Gold / Antik-Gold
  primaryLight: { light: '#DAA520', dark: '#E8C547' },    // Goldenrod

  // Dunkle, edle Hintergründe - wie schwarzer Samt
  background: { light: '#FAFAF8', dark: '#0A0A0F' },     // Fast Schwarz
  surface: { light: '#F5F5F0', dark: '#141418' },         // Leicht heller

  // Glasmorphism mit Gold-Schimmer
  glass: { light: 'rgba(255, 255, 255, 0.6)', dark: 'rgba(212, 168, 67, 0.08)' },
  glassBorder: { light: 'rgba(184, 134, 11, 0.2)', dark: 'rgba(212, 168, 67, 0.15)' },

  // MAXIMALER KONTRAST: Reinweiß auf Tiefschwarz
  foreground: { light: '#0A0A0F', dark: '#FAFAF8' },     // Reinweiß
  muted: { light: '#6B6B6B', dark: '#C8C8C0' },          // Warmes Grau

  // Gold-Borders
  border: { light: 'rgba(184, 134, 11, 0.15)', dark: 'rgba(212, 168, 67, 0.12)' },

  // Status Farben - Edel & gedämpft
  success: { light: '#2E7D32', dark: '#66BB6A' },
  warning: { light: '#E65100', dark: '#FFB74D' },
  error: { light: '#C62828', dark: '#EF5350' },

  // Premium Akzente
  accent: { light: '#B8860B', dark: '#D4A843' },          // Gold
  accentSecondary: { light: '#1A237E', dark: '#5C6BC0' }, // Tiefblau
};

module.exports = { themeColors };
