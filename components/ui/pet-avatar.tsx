import { Image, View, Text, StyleSheet } from "react-native";

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
}

const sizeMap = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
};

const fontSizeMap = {
  sm: 14,
  md: 20,
  lg: 26,
  xl: 40,
};

export function PetAvatar({
  name,
  type,
  imageUrl,
  size = "md",
  showName = false,
}: PetAvatarProps) {
  const pixelSize = sizeMap[size];
  const fontSize = fontSizeMap[size];

  return (
    <View style={{ alignItems: "center", gap: 6 }}>
      <View
        style={[
          styles.avatar,
          {
            width: pixelSize,
            height: pixelSize,
            borderRadius: pixelSize / 2,
          },
        ]}
      >
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={{ width: pixelSize, height: pixelSize, borderRadius: pixelSize / 2 }}
          />
        ) : (
          <Text style={[styles.initial, { fontSize }]}>
            {name.charAt(0).toUpperCase()}
          </Text>
        )}
      </View>
      {showName && <Text style={styles.name}>{name}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: "rgba(212,168,67,0.1)",
    borderWidth: 1,
    borderColor: "rgba(212,168,67,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  initial: {
    fontWeight: "300",
    color: "#D4A843",
    letterSpacing: 1,
  },
  name: {
    fontSize: 13,
    fontWeight: "500",
    color: "#FAFAF8",
    letterSpacing: 0.5,
  },
});
