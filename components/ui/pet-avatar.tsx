import { Image, View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { cn } from "@/lib/utils";

export type PetType = 
  // Haustiere
  | "cat" | "dog" | "rabbit" | "hamster" | "guinea_pig" | "chinchilla" | "degu" | "rat" | "mouse" | "ferret"
  // Vögel
  | "parakeet" | "canary" | "cockatiel" | "parrot" | "finch" | "lovebird"
  // Reptilien
  | "bearded_dragon" | "leopard_gecko" | "corn_snake" | "ball_python" | "iguana" | "chameleon" | "tortoise"
  // Amphibien
  | "axolotl" | "frog" | "newt"
  // Fische
  | "fish" | "goldfish" | "betta"
  // Nutztiere
  | "horse" | "cow" | "sheep" | "goat" | "pig" | "chicken" | "duck";

export interface PetAvatarProps {
  name: string;
  type: PetType;
  imageUrl?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showName?: boolean;
  className?: string;
}

const petGradients: Record<PetType, readonly [string, string]> = {
  // Haustiere
  cat: ["#7C3AED", "#A78BFA"] as const,
  dog: ["#2563EB", "#60A5FA"] as const,
  rabbit: ["#EC4899", "#F472B6"] as const,
  hamster: ["#F97316", "#FDBA74"] as const,
  guinea_pig: ["#8B5CF6", "#C084FC"] as const,
  chinchilla: ["#6B7280", "#D1D5DB"] as const,
  degu: ["#D97706", "#FCD34D"] as const,
  rat: ["#64748B", "#CBD5E1"] as const,
  mouse: ["#A78BFA", "#DDD6FE"] as const,
  ferret: ["#DC2626", "#FCA5A5"] as const,
  // Vögel
  parakeet: ["#10B981", "#6EE7B7"] as const,
  canary: ["#FBBF24", "#FCD34D"] as const,
  cockatiel: ["#F59E0B", "#FCD34D"] as const,
  parrot: ["#06B6D4", "#22D3EE"] as const,
  finch: ["#EC4899", "#F472B6"] as const,
  lovebird: ["#EF4444", "#FCA5A5"] as const,
  // Reptilien
  bearded_dragon: ["#EA580C", "#FDBA74"] as const,
  leopard_gecko: ["#FBBF24", "#FCD34D"] as const,
  corn_snake: ["#EF4444", "#FCA5A5"] as const,
  ball_python: ["#1E293B", "#64748B"] as const,
  iguana: ["#16A34A", "#4ADE80"] as const,
  chameleon: ["#8B5CF6", "#10B981"] as const,
  tortoise: ["#92400E", "#D97706"] as const,
  // Amphibien
  axolotl: ["#EC4899", "#F472B6"] as const,
  frog: ["#16A34A", "#4ADE80"] as const,
  newt: ["#EA580C", "#FDBA74"] as const,
  // Fische
  fish: ["#06B6D4", "#22D3EE"] as const,
  goldfish: ["#F97316", "#FDBA74"] as const,
  betta: ["#7C3AED", "#A78BFA"] as const,
  // Nutztiere
  horse: ["#92400E", "#D97706"] as const,
  cow: ["#1E293B", "#E2E8F0"] as const,
  sheep: ["#F5F5F4", "#D1D5DB"] as const,
  goat: ["#78350F", "#D97706"] as const,
  pig: ["#EC4899", "#F472B6"] as const,
  chicken: ["#FBBF24", "#FCD34D"] as const,
  duck: ["#06B6D4", "#22D3EE"] as const,
};

const sizeMap = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
};

export function PetAvatar({
  name,
  type,
  imageUrl,
  size = "md",
  showName = false,
  className,
}: PetAvatarProps) {
  const pixelSize = sizeMap[size];
  const gradient = petGradients[type] || ["#3B82F6", "#60A5FA"];

  return (
    <View className={cn("items-center gap-2", className)}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className={cn("rounded-full items-center justify-center", {
          "w-8 h-8": size === "sm",
          "w-12 h-12": size === "md",
          "w-16 h-16": size === "lg",
          "w-24 h-24": size === "xl",
        })}
      >
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={{ width: pixelSize, height: pixelSize, borderRadius: pixelSize / 2 }}
          />
        ) : (
          <Text className={cn("font-bold text-white", {
            "text-lg": size === "sm",
            "text-2xl": size === "md",
            "text-3xl": size === "lg",
            "text-5xl": size === "xl",
          })}>
            {name.charAt(0).toUpperCase()}
          </Text>
        )}
      </LinearGradient>
      {showName && <Text className="text-sm font-semibold text-foreground">{name}</Text>}
    </View>
  );
}
