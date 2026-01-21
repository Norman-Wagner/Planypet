import { ScrollView, Text, View, Pressable, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { GlassCard } from "@/components/ui/glass-card";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { PetAvatar } from "@/components/ui/pet-avatar";
import { useColors } from "@/hooks/use-colors";

// Demo pets - will be replaced with real data
const demoPets = [
  {
    id: "1",
    name: "Luna",
    type: "cat" as const,
    breed: "Europäisch Kurzhaar",
    age: "2 Jahre",
    weight: "4 kg",
    nextFeeding: "17:30",
  },
  {
    id: "2",
    name: "Max",
    type: "dog" as const,
    breed: "Golden Retriever",
    age: "3 Jahre",
    weight: "28 kg",
    nextWalk: "17:30",
  },
];

export default function PetsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1">
      {/* Gradient Background */}
      <LinearGradient
        colors={["#0066CC", "#00A3FF", "#F0F7FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 0.6 }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />
      
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ 
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 100,
          paddingHorizontal: 20,
        }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-white text-2xl font-bold">Meine Tiere</Text>
            <Text className="text-white/70 text-base">{demoPets.length} Haustiere</Text>
          </View>
          <Pressable 
            className="w-12 h-12 rounded-full bg-white/20 items-center justify-center"
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] })}
          >
            <IconSymbol name="plus.circle.fill" size={28} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Pet Cards */}
        {demoPets.map((pet) => (
          <Pressable 
            key={pet.id}
            style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] })}
          >
            <GlassCard className="mb-4">
              <View className="flex-row items-center">
                <PetAvatar name={pet.name} type={pet.type} size="lg" />
                <View className="flex-1 ml-4">
                  <Text className="text-foreground text-xl font-bold">{pet.name}</Text>
                  <Text className="text-muted text-sm">{pet.breed}</Text>
                  <View className="flex-row mt-2 gap-4">
                    <View className="flex-row items-center">
                      <IconSymbol name="calendar" size={14} color={colors.muted} />
                      <Text className="text-muted text-xs ml-1">{pet.age}</Text>
                    </View>
                    <View className="flex-row items-center">
                      <IconSymbol name="info.circle.fill" size={14} color={colors.muted} />
                      <Text className="text-muted text-xs ml-1">{pet.weight}</Text>
                    </View>
                  </View>
                </View>
                <IconSymbol name="chevron.right" size={24} color={colors.muted} />
              </View>
              
              {/* Quick Actions */}
              <View className="flex-row mt-4 pt-4 border-t border-border gap-2">
                <Pressable 
                  className="flex-1 flex-row items-center justify-center py-2 rounded-xl bg-primary/10"
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                >
                  <IconSymbol name="fork.knife" size={18} color={colors.primary} />
                  <Text className="text-primary font-medium ml-2">Füttern</Text>
                </Pressable>
                {pet.type === "dog" && (
                  <Pressable 
                    className="flex-1 flex-row items-center justify-center py-2 rounded-xl bg-success/10"
                    style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                  >
                    <IconSymbol name="figure.walk" size={18} color={colors.success} />
                    <Text className="text-success font-medium ml-2">Gassi</Text>
                  </Pressable>
                )}
                <Pressable 
                  className="flex-1 flex-row items-center justify-center py-2 rounded-xl bg-warning/10"
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                >
                  <IconSymbol name="camera.fill" size={18} color={colors.warning} />
                  <Text className="text-warning font-medium ml-2">Foto</Text>
                </Pressable>
              </View>
            </GlassCard>
          </Pressable>
        ))}

        {/* Add Pet Button */}
        <Pressable
          style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] })}
        >
          <GlassCard className="items-center py-6 border-dashed border-2 border-primary/30">
            <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-3">
              <IconSymbol name="plus.circle.fill" size={32} color={colors.primary} />
            </View>
            <Text className="text-primary font-semibold text-lg">Neues Haustier hinzufügen</Text>
            <Text className="text-muted text-sm mt-1">Katze, Hund, Fisch, Vogel und mehr</Text>
          </GlassCard>
        </Pressable>
      </ScrollView>
    </View>
  );
}
