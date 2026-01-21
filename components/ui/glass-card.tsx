import { View, type ViewProps } from "react-native";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends ViewProps {
  variant?: "default" | "solid" | "gradient";
  className?: string;
}

/**
 * Glassmorphism card component with frosted glass effect
 */
export function GlassCard({
  children,
  variant = "default",
  className,
  style,
  ...props
}: GlassCardProps) {
  const variantStyles = {
    default: "bg-glass border border-glassBorder",
    solid: "bg-surface border border-border",
    gradient: "bg-glass border border-glassBorder",
  };

  return (
    <View
      className={cn(
        "rounded-2xl p-4 overflow-hidden",
        variantStyles[variant],
        className
      )}
      style={[
        {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 4,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
