import { View, type ViewProps, StyleSheet } from "react-native";

export interface GlassCardProps extends ViewProps {
  variant?: "default" | "solid" | "accent";
}

/**
 * Premium glass card component with dark luxury styling
 */
export function GlassCard({
  children,
  variant = "default",
  style,
  ...props
}: GlassCardProps) {
  const variantStyle =
    variant === "accent" ? styles.accent :
    variant === "solid" ? styles.solid :
    styles.default;

  return (
    <View
      style={[styles.base, variantStyle, style]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    padding: 16,
    overflow: "hidden",
  },
  default: {
    backgroundColor: "#141418",
    borderWidth: 1,
    borderColor: "rgba(212,168,67,0.08)",
  },
  solid: {
    backgroundColor: "#1A1A20",
    borderWidth: 1,
    borderColor: "rgba(212,168,67,0.12)",
  },
  accent: {
    backgroundColor: "rgba(212,168,67,0.06)",
    borderWidth: 1,
    borderColor: "rgba(212,168,67,0.15)",
  },
});
