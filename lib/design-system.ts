/**
 * Planypet Design System
 * Premium UI with Gray Background + Colored Gradients
 */

export const DesignSystem = {
  // Base Colors
  colors: {
    // Gray Background (Dark)
    background: '#0f1419',
    backgroundLight: '#1a1f26',
    backgroundLighter: '#252d38',

    // Text Colors (High Contrast)
    text: '#f8fafc',
    textSecondary: '#cbd5e1',
    textTertiary: '#94a3b8',

    // Blue Primary
    blue: '#0ea5e9',
    blueDark: '#0284c7',
    blueLight: '#38bdf8',

    // Gradients (Feature-Specific)
    gradients: {
      dashboard: ['#0f172a', '#1e40af'], // Navy to Blue
      aiSymptom: ['#6b21a8', '#9333ea'], // Purple
      gpsTracking: ['#065f46', '#10b981'], // Green
      health: ['#7f1d1d', '#dc2626'], // Red
      breed: ['#581c87', '#a855f7'], // Purple
      social: ['#0c4a6e', '#0284c7'], // Blue
      marketplace: ['#92400e', '#f59e0b'], // Orange
      devices: ['#1e3a8a', '#3b82f6'], // Blue
    },

    // Semantic Colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#0ea5e9',

    // Borders & Dividers
    border: '#334155',
    borderLight: '#475569',
  },

  // Typography
  typography: {
    fontFamily: {
      primary: 'System',
      mono: 'Courier New',
    },
    sizes: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
    },
    weights: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    '2xl': 32,
    '3xl': 48,
  },

  // Border Radius
  radius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    full: 999,
  },

  // Shadows (Glasmorphism)
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  },

  // Animations
  animations: {
    duration: {
      fast: 150,
      normal: 250,
      slow: 350,
      slower: 500,
    },
    easing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
  },

  // Breakpoints (Responsive)
  breakpoints: {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },

  // Z-Index
  zIndex: {
    hide: -1,
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    modalBackdrop: 1300,
    modal: 1400,
    popover: 1500,
    tooltip: 1600,
  },
};

// Gradient Helper
export const getGradient = (feature: keyof typeof DesignSystem.colors.gradients) => {
  const gradient = DesignSystem.colors.gradients[feature];
  return {
    start: gradient[0],
    end: gradient[1],
    colors: gradient,
  };
};

// Spacing Helper
export const getSpacing = (multiplier: number = 1) => {
  return DesignSystem.spacing.md * multiplier;
};

// Typography Helper
export const getTypography = (size: keyof typeof DesignSystem.typography.sizes, weight: keyof typeof DesignSystem.typography.weights = 'normal') => {
  return {
    fontSize: DesignSystem.typography.sizes[size],
    fontWeight: DesignSystem.typography.weights[weight],
    lineHeight: DesignSystem.typography.lineHeights.normal,
  };
};

export default DesignSystem;
