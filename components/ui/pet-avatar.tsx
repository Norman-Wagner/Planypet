import { View, Text, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { cn } from "@/lib/utils";

export type PetType = "cat" | "dog" | "fish" | "bird" | "reptile" | "horse" | "smallPet";

export interface PetAvatarProps {
  name: string;
  type: PetType;
  imageUrl?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showName?: boolean;
  className?: string;
}

const petEmojis: Record<PetType, string> = {
  cat: "🐱",
  dog: "🐕",
  fish: "🐠",
  bird: "🦜",
  reptile: "🦎",
  horse: "🐴",
  smallPet: "🐹",
};

const petGradients: Record<PetType, readonly [string, string]> = {
  cat: ["#EC4899", "#F472B6"] as const,
  dog: ["#8B5CF6", "#A78BFA"] as const,
  fish: ["#06B6D4", "#22D3EE"] as const,
  bird: ["#F59E0B", "#FBBF24"] as const,
  reptile: ["#84CC16", "#A3E635"] as const,
  horse: ["#A16207", "#CA8A04"] as const,
  smallPet: ["#FB923C", "#FDBA74"] as const,
};

const sizeStyles = {
  sm: { container: 40, emoji: 20, text: 10 },
  md: { container: 56, emoji: 28, text: 12 },
  lg: { container: 80, emoji: 40, text: 14 },
  xl: { container: 120, emoji: 60, text: 16 },
};

/**
 * Pet avatar with gradient background and emoji or image
 */
export function PetAvatar({
  name,
  type,
  imageUrl,
  size = "md",
  showName = false,
  className,
}: PetAvatarProps) {
  const styles = sizeStyles[size];
  const gradient = petGradients[type];

  return (
    <View className={cn("items-center", className)}>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={{
            width: styles.container,
            height: styles.container,
            borderRadius: styles.container / 2,
          }}
        />
      ) : (
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: styles.container,
            height: styles.container,
            borderRadius: styles.container / 2,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: styles.emoji }}>{petEmojis[type]}</Text>
        </LinearGradient>
      )}
      {showName && (
        <Text
          className="text-foreground font-medium mt-1"
          style={{ fontSize: styles.text }}
          numberOfLines={1}
        >
          {name}
        </Text>
      )}
    </View>
  );
}
