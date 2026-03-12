/**
 * Modern Blue Gradient Glasmorphism Theme
 * Professional, high-end aesthetic with blue gradients and glass effects
 */

const modernTheme = {
  // Primary gradient colors
  primary: { light: "#0066FF", dark: "#0052CC" },
  primaryGradient: { light: "from-blue-500 to-blue-600", dark: "from-blue-600 to-blue-700" },

  // Background colors
  background: { light: "#F8FAFC", dark: "#0F172A" },
  backgroundGradient: { light: "from-slate-50 to-blue-50", dark: "from-slate-950 to-blue-950" },

  // Surface (glass effect)
  surface: { light: "rgba(255, 255, 255, 0.8)", dark: "rgba(15, 23, 42, 0.8)" },
  surfaceGlass: { light: "backdrop-blur-md bg-white/80", dark: "backdrop-blur-md bg-slate-900/80" },

  // Text colors
  foreground: { light: "#0F172A", dark: "#F1F5F9" },
  muted: { light: "#64748B", dark: "#94A3B8" },

  // Accent colors
  accent: { light: "#0066FF", dark: "#60A5FA" },
  accentGradient: { light: "from-blue-500 to-cyan-500", dark: "from-blue-400 to-cyan-400" },

  // Status colors
  success: { light: "#10B981", dark: "#34D399" },
  warning: { light: "#F59E0B", dark: "#FBBF24" },
  error: { light: "#EF4444", dark: "#F87171" },
  info: { light: "#3B82F6", dark: "#60A5FA" },

  // Borders
  border: { light: "rgba(0, 0, 0, 0.08)", dark: "rgba(255, 255, 255, 0.1)" },
  borderLight: { light: "rgba(0, 0, 0, 0.04)", dark: "rgba(255, 255, 255, 0.05)" },

  // Shadows (subtle, professional)
  shadowSm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  shadowMd: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  shadowLg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  shadowGlass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",

  // Glass effect (for cards, modals)
  glass: {
    light: "backdrop-blur-xl bg-white/70 border border-white/20",
    dark: "backdrop-blur-xl bg-slate-900/70 border border-slate-700/20",
  },

  // Gradients for buttons and interactive elements
  gradients: {
    primary: "linear-gradient(135deg, #0066FF 0%, #0052CC 100%)",
    secondary: "linear-gradient(135deg, #64748B 0%, #475569 100%)",
    success: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    warning: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
    error: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
    accent: "linear-gradient(135deg, #0066FF 0%, #00D4FF 100%)",
  },
};

module.exports = { modernTheme };
