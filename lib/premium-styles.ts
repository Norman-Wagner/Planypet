import { StyleSheet } from "react-native";

/**
 * Shared premium design styles used across all sub-screens.
 * Dark luxury design with gold accents - consistent throughout the app.
 */
export const premiumStyles = StyleSheet.create({
  // Screen container
  screen: { flex: 1, backgroundColor: "#0A0A0F" },

  // Navigation
  backBtn: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 },
  backText: { fontSize: 14, fontWeight: "500", color: "#D4A843", letterSpacing: 0.5 },

  // Header
  header: { marginBottom: 32 },
  headerTitle: { fontSize: 28, fontWeight: "300", color: "#FAFAF8", letterSpacing: 2 },
  headerSub: { fontSize: 12, fontWeight: "400", color: "#6B6B6B", letterSpacing: 1, marginTop: 4 },
  goldDivider: { width: 40, height: 1, backgroundColor: "#D4A843", marginTop: 16 },

  // Section title
  sectionTitle: {
    fontSize: 11, fontWeight: "600", color: "#D4A843",
    letterSpacing: 3, textTransform: "uppercase", marginBottom: 12, marginTop: 24,
  },

  // Card
  card: {
    backgroundColor: "#141418", padding: 16,
    borderWidth: 1, borderColor: "rgba(212,168,67,0.08)",
  },

  // Row
  row: { flexDirection: "row", alignItems: "center", gap: 14 },

  // Icon circle
  iconCircle: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: "center", justifyContent: "center",
  },

  // Text
  cardTitle: { fontSize: 15, fontWeight: "500", color: "#FAFAF8", letterSpacing: 0.3 },
  cardSub: { fontSize: 12, fontWeight: "400", color: "#6B6B6B", marginTop: 2 },

  // Divider
  divider: { height: 1, backgroundColor: "rgba(212,168,67,0.05)", marginVertical: 14 },

  // Disclaimer
  disclaimer: {
    flexDirection: "row", gap: 10, marginTop: 24,
    backgroundColor: "rgba(212,168,67,0.05)", padding: 16,
    borderWidth: 1, borderColor: "rgba(212,168,67,0.1)",
  },
  disclaimerText: { flex: 1, fontSize: 12, fontWeight: "400", color: "#6B6B6B", lineHeight: 18 },

  // Form field label
  fieldLabel: {
    fontSize: 11, fontWeight: "600", color: "#D4A843",
    letterSpacing: 2, textTransform: "uppercase", marginBottom: 8,
  },
  fieldInput: {
    backgroundColor: "#141418",
    borderWidth: 1, borderColor: "rgba(212,168,67,0.1)",
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 15, fontWeight: "400", color: "#FAFAF8", letterSpacing: 0.3,
  },

  // Button
  premiumBtn: {
    backgroundColor: "rgba(212,168,67,0.1)",
    borderWidth: 1, borderColor: "rgba(212,168,67,0.2)",
    paddingVertical: 18, alignItems: "center",
  },
  premiumBtnText: {
    fontSize: 14, fontWeight: "600", color: "#D4A843",
    letterSpacing: 3, textTransform: "uppercase",
  },

  // Empty state
  emptyCard: {
    backgroundColor: "#141418", padding: 40, alignItems: "center",
    borderWidth: 1, borderColor: "rgba(212,168,67,0.08)",
  },
  emptyText: { fontSize: 13, fontWeight: "400", color: "#6B6B6B", marginTop: 12, textAlign: "center" },
});

// Color constants
export const COLORS = {
  bg: "#0A0A0F",
  surface: "#141418",
  gold: "#D4A843",
  goldDark: "#B8860B",
  white: "#FAFAF8",
  muted: "#8B8B80",
  dim: "#6B6B6B",
  dimmer: "#4A4A4A",
  red: "#EF5350",
  green: "#66BB6A",
  blue: "#42A5F5",
  orange: "#FFB74D",
  purple: "#A78BFA",
  goldBorder: "rgba(212,168,67,0.08)",
  goldBorderLight: "rgba(212,168,67,0.15)",
} as const;
