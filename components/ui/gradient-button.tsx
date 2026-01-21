import { Text, Pressable, type PressableProps, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { cn } from "@/lib/utils";

export interface GradientButtonProps extends Omit<PressableProps, "style"> {
  title: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

/**
 * Gradient button with glassmorphism style
 */
export function GradientButton({
  title,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  className,
  onPress,
  disabled,
  ...props
}: GradientButtonProps) {
  const sizeStyles = {
    sm: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 14 },
    md: { paddingVertical: 14, paddingHorizontal: 24, fontSize: 16 },
    lg: { paddingVertical: 18, paddingHorizontal: 32, fontSize: 18 },
  };

  const handlePress = (e: any) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.(e);
  };

  if (variant === "outline") {
    return (
      <Pressable
        onPress={handlePress}
        disabled={disabled || loading}
        style={({ pressed }) => [
          {
            borderRadius: 16,
            borderWidth: 2,
            borderColor: "#0066CC",
            paddingVertical: sizeStyles[size].paddingVertical,
            paddingHorizontal: sizeStyles[size].paddingHorizontal,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            opacity: pressed ? 0.7 : disabled ? 0.5 : 1,
            transform: [{ scale: pressed ? 0.97 : 1 }],
          },
        ]}
        {...props}
      >
        {loading ? (
          <ActivityIndicator color="#0066CC" size="small" />
        ) : (
          <>
            {icon}
            <Text
              style={{
                color: "#0066CC",
                fontSize: sizeStyles[size].fontSize,
                fontWeight: "600",
              }}
            >
              {title}
            </Text>
          </>
        )}
      </Pressable>
    );
  }

  const gradientColors = variant === "primary" 
    ? ["#0066CC", "#00A3FF"] as const
    : ["#64748B", "#94A3B8"] as const;

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        {
          borderRadius: 16,
          overflow: "hidden",
          opacity: disabled ? 0.5 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
      ]}
      {...props}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingVertical: sizeStyles[size].paddingVertical,
          paddingHorizontal: sizeStyles[size].paddingHorizontal,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <>
            {icon}
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: sizeStyles[size].fontSize,
                fontWeight: "600",
              }}
            >
              {title}
            </Text>
          </>
        )}
      </LinearGradient>
    </Pressable>
  );
}
