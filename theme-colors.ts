/**
 * Planypet Color Themes - 4 Varianten
 * 1. Dunkel (aktuell)
 * 2. Blauer Farbverlauf (wie Icon)
 * 3. Hellerer blauer Farbverlauf
 * 4. Natur: Hellgrün zu Dunkelgrün
 */

export type ThemeName = 'dark' | 'blue-gradient' | 'light-blue-gradient' | 'nature-green';

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  background: string;
  surface: string;
  surfaceLight: string;
  foreground: string;
  muted: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  gradient1: string;
  gradient2: string;
}

export const THEMES: Record<ThemeName, ThemeColors> = {
  // Theme 1: Dunkel (aktuell)
  dark: {
    primary: '#D4A843',
    primaryLight: '#E8C86A',
    primaryDark: '#B8941F',
    secondary: '#0A7EA4',
    background: '#0A0A0F',
    surface: '#1A1A22',
    surfaceLight: '#2A2A32',
    foreground: '#FFFFFF',
    muted: '#8B8B95',
    border: '#3A3A42',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    gradient1: '#D4A843',
    gradient2: '#8B6914',
  },

  // Theme 2: Blauer Farbverlauf (wie Icon)
  'blue-gradient': {
    primary: '#003D82',
    primaryLight: '#0066CC',
    primaryDark: '#001F4D',
    secondary: '#00A3FF',
    background: '#001F4D',
    surface: '#003366',
    surfaceLight: '#004D99',
    foreground: '#FFFFFF',
    muted: '#99CCFF',
    border: '#0066CC',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    gradient1: '#003D82',
    gradient2: '#00A3FF',
  },

  // Theme 3: Hellerer blauer Farbverlauf
  'light-blue-gradient': {
    primary: '#0099FF',
    primaryLight: '#33B3FF',
    primaryDark: '#0066CC',
    secondary: '#66D9FF',
    background: '#E6F4FE',
    surface: '#CCE5F7',
    surfaceLight: '#B3D9F2',
    foreground: '#003366',
    muted: '#0066CC',
    border: '#0099FF',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    gradient1: '#0099FF',
    gradient2: '#66D9FF',
  },

  // Theme 4: Natur - Hellgrün zu Dunkelgrün
  'nature-green': {
    primary: '#10B981',
    primaryLight: '#34D399',
    primaryDark: '#059669',
    secondary: '#047857',
    background: '#064E3B',
    surface: '#0F766E',
    surfaceLight: '#14B8A6',
    foreground: '#FFFFFF',
    muted: '#A7F3D0',
    border: '#10B981',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    gradient1: '#34D399',
    gradient2: '#047857',
  },
};

export const THEME_NAMES: Record<ThemeName, string> = {
  dark: 'Dunkel',
  'blue-gradient': 'Blauer Farbverlauf',
  'light-blue-gradient': 'Heller Blauer Farbverlauf',
  'nature-green': 'Natur - Grün',
};
