/**
 * Planypet Blue Gradient Theme Colors
 * Based on the premium blue 3D icon
 * Primary color: Navy Blue to Light Blue gradient
 */

export const blueGradientTheme = {
  // Primary gradient colors (Navy to Light Blue)
  primary: { light: '#1E3A8A', dark: '#1E40AF' }, // Navy Blue
  primaryLight: { light: '#3B82F6', dark: '#60A5FA' }, // Sky Blue
  primaryLighter: { light: '#93C5FD', dark: '#BFDBFE' }, // Light Blue

  // Background colors
  background: { light: '#0F172A', dark: '#0F172A' }, // Very Dark Blue (almost black)
  surface: { light: '#1E293B', dark: '#1E293B' }, // Dark Slate Blue
  surfaceLight: { light: '#334155', dark: '#334155' }, // Slate Blue

  // Text colors
  foreground: { light: '#F8FAFC', dark: '#F8FAFC' }, // Almost White
  muted: { light: '#94A3B8', dark: '#CBD5E1' }, // Light Slate

  // Accent colors
  accent: { light: '#3B82F6', dark: '#60A5FA' }, // Bright Blue
  accentLight: { light: '#60A5FA', dark: '#93C5FD' }, // Light Blue

  // Border colors
  border: { light: '#1E40AF', dark: '#1E40AF' }, // Navy Blue Border
  borderLight: { light: '#3B82F6', dark: '#3B82F6' }, // Blue Border

  // Status colors
  success: { light: '#10B981', dark: '#34D399' }, // Green
  warning: { light: '#F59E0B', dark: '#FBBF24' }, // Amber
  error: { light: '#EF4444', dark: '#F87171' }, // Red

  // Gradient definitions
  gradients: {
    primary: {
      start: '#001F3F', // Very Dark Navy
      end: '#1E90FF', // Dodger Blue
      angle: '135deg',
    },
    secondary: {
      start: '#1E40AF', // Navy
      end: '#60A5FA', // Sky Blue
      angle: '135deg',
    },
    light: {
      start: '#3B82F6', // Blue
      end: '#93C5FD', // Light Blue
      angle: '135deg',
    },
  },
};

export const blueThemeConfig = {
  name: 'Planypet Blue Gradient',
  description: 'Premium blue gradient theme matching the app icon',
  colors: blueGradientTheme,
  isDark: true,
  supportsGradient: true,
};
