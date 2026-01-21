/** @type {const} */
const themeColors = {
  // Primary blue gradient base
  primary: { light: '#0066CC', dark: '#3B82F6' },
  primaryLight: { light: '#00A3FF', dark: '#60A5FA' },
  
  // Backgrounds with subtle blue tint
  background: { light: '#F0F7FF', dark: '#0A1628' },
  surface: { light: 'rgba(255, 255, 255, 0.7)', dark: 'rgba(30, 41, 59, 0.7)' },
  
  // Glass effect colors
  glass: { light: 'rgba(255, 255, 255, 0.25)', dark: 'rgba(255, 255, 255, 0.1)' },
  glassBorder: { light: 'rgba(255, 255, 255, 0.4)', dark: 'rgba(255, 255, 255, 0.2)' },
  
  // Text colors
  foreground: { light: '#1E293B', dark: '#F1F5F9' },
  muted: { light: '#64748B', dark: '#94A3B8' },
  
  // Borders
  border: { light: 'rgba(148, 163, 184, 0.3)', dark: 'rgba(148, 163, 184, 0.2)' },
  
  // Status colors
  success: { light: '#10B981', dark: '#34D399' },
  warning: { light: '#F59E0B', dark: '#FBBF24' },
  error: { light: '#EF4444', dark: '#F87171' },
  
  // Accent colors for pet types
  catAccent: { light: '#EC4899', dark: '#F472B6' },
  dogAccent: { light: '#8B5CF6', dark: '#A78BFA' },
  fishAccent: { light: '#06B6D4', dark: '#22D3EE' },
  birdAccent: { light: '#F59E0B', dark: '#FBBF24' },
  reptileAccent: { light: '#84CC16', dark: '#A3E635' },
  horseAccent: { light: '#A16207', dark: '#CA8A04' },
  smallPetAccent: { light: '#FB923C', dark: '#FDBA74' },
};

module.exports = { themeColors };
