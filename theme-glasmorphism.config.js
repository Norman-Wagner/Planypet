/**
 * Glasmorphism Theme Configuration
 * 4 Modern 3D Themes with Blur, Gradients, and Shadows
 */

const themes = {
  // Theme 1: Blue Gradient (Default)
  blue: {
    name: "Blue Gradient",
    primary: "#1E5A96",
    secondary: "#0A7EA4",
    accent: "#3498DB",
    background: {
      light: "#F0F7FF",
      dark: "#0A1428",
    },
    glass: {
      light: "rgba(255, 255, 255, 0.7)",
      dark: "rgba(15, 23, 42, 0.7)",
    },
    gradient: ["#1E5A96", "#0A7EA4", "#3498DB"],
    blur: 20,
    shadow: "rgba(30, 90, 150, 0.3)",
  },

  // Theme 2: Nature/Forest Green
  nature: {
    name: "Natur & Wald",
    primary: "#2ECC71",
    secondary: "#27AE60",
    accent: "#16A085",
    background: {
      light: "#F0FFF4",
      dark: "#0B3D1F",
    },
    glass: {
      light: "rgba(46, 204, 113, 0.1)",
      dark: "rgba(46, 204, 113, 0.15)",
    },
    gradient: ["#2ECC71", "#27AE60", "#16A085"],
    blur: 20,
    shadow: "rgba(46, 204, 113, 0.2)",
  },

  // Theme 3: Sand/Desert Beige
  sand: {
    name: "Sand & Wüste",
    primary: "#D4A574",
    secondary: "#C19A6B",
    accent: "#B8860B",
    background: {
      light: "#FFF8F0",
      dark: "#3D2817",
    },
    glass: {
      light: "rgba(212, 165, 116, 0.1)",
      dark: "rgba(212, 165, 116, 0.15)",
    },
    gradient: ["#D4A574", "#C19A6B", "#B8860B"],
    blur: 20,
    shadow: "rgba(212, 165, 116, 0.2)",
  },

  // Theme 4: Pastel Playful
  pastel: {
    name: "Pastell Verspielt",
    primary: "#FF69B4",
    secondary: "#FFB6C1",
    accent: "#DDA0DD",
    background: {
      light: "#FFF0F5",
      dark: "#3D1F2D",
    },
    glass: {
      light: "rgba(255, 105, 180, 0.1)",
      dark: "rgba(255, 105, 180, 0.15)",
    },
    gradient: ["#FF69B4", "#FFB6C1", "#DDA0DD"],
    blur: 20,
    shadow: "rgba(255, 105, 180, 0.2)",
  },
};

module.exports = { themes };
