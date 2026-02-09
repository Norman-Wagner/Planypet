/** @type {const} */
const themeColors = {
  // Sapphire Blue Gradient - Luxuriös & Premium
  primary: { light: '#0052CC', dark: '#1E40AF' },
  primaryLight: { light: '#0066FF', dark: '#3B82F6' },
  
  // Dunkle Hintergründe für maximalen Kontrast
  background: { light: '#F8FAFC', dark: '#0F172A' },
  surface: { light: 'rgba(255, 255, 255, 0.8)', dark: 'rgba(30, 41, 59, 0.4)' },
  
  // Glasmorphism Sapphire Effect
  glass: { light: 'rgba(255, 255, 255, 0.3)', dark: 'rgba(148, 163, 184, 0.15)' },
  glassBorder: { light: 'rgba(255, 255, 255, 0.5)', dark: 'rgba(203, 213, 225, 0.2)' },
  
  // STARK kontrastreich: Weiß auf Dunkel
  foreground: { light: '#0F172A', dark: '#FFFFFF' },
  muted: { light: '#475569', dark: '#E2E8F0' },
  
  // Borders - subtil aber sichtbar
  border: { light: 'rgba(100, 116, 139, 0.2)', dark: 'rgba(203, 213, 225, 0.15)' },
  
  // Status Farben - Premium Palette
  success: { light: '#059669', dark: '#10B981' },
  warning: { light: '#D97706', dark: '#FBBF24' },
  error: { light: '#DC2626', dark: '#EF4444' },
  
  // Tier-Akzente - Luxuriös
  catAccent: { light: '#7C3AED', dark: '#A78BFA' },
  dogAccent: { light: '#2563EB', dark: '#60A5FA' },
  fishAccent: { light: '#06B6D4', dark: '#22D3EE' },
  birdAccent: { light: '#EA580C', dark: '#FB923C' },
  reptileAccent: { light: '#16A34A', dark: '#4ADE80' },
  horseAccent: { light: '#92400E', dark: '#D97706' },
  smallPetAccent: { light: '#DB2777', dark: '#EC4899' },
};

module.exports = { themeColors };
