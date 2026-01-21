import { ScrollView, Text, View, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useEffect } from "react";

import { ScreenContainer } from "@/components/screen-container";
import { GlassCard } from "@/components/ui/glass-card";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { PetAvatar } from "@/components/ui/pet-avatar";
import { useColors } from "@/hooks/use-colors";
import { usePetStore } from "@/lib/pet-store";

export default function DashboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { userName, pets, feedings, walks, onboardingComplete, loadData } = usePetStore();

  useEffect(() => {
    loadData();
  }, []);

  // Check if onboarding is needed
  useEffect(() => {
    if (!onboardingComplete && pets.length === 0) {
      // Small delay to ensure navigation is ready
      const timer = setTimeout(() => {
        router.push("/onboarding");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [onboardingComplete, pets.length]);

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Guten Morgen" : currentHour < 18 ? "Guten Tag" : "Guten Abend";
  const displayName = userName || "Tierfreund";

  // Get pending feedings and walks
  const pendingFeedings = feedings.filter((f) => !f.completed);
  const pendingWalks = walks.filter((w) => !w.completed);

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
        <View className="mb-6">
          <Text className="text-white text-lg opacity-80">{greeting},</Text>
          <Text className="text-white text-3xl font-bold">{displayName}</Text>
          <Text className="text-white text-base opacity-70 mt-1">
            {pets.length > 0 
              ? `So geht es deinen ${pets.length} Lieblingen heute`
              : "Füge dein erstes Haustier hinzu"
            }
          </Text>
        </View>

        {/* Quick Stats */}
        <View className="flex-row gap-3 mb-6">
          <GlassCard className="flex-1 items-center py-4">
            <Text className="text-3xl font-bold text-primary">{pets.length}</Text>
            <Text className="text-muted text-sm">Haustiere</Text>
          </GlassCard>
          <GlassCard className="flex-1 items-center py-4">
            <Text className="text-3xl font-bold text-warning">{pendingFeedings.length}</Text>
            <Text className="text-muted text-sm">Fütterungen</Text>
          </GlassCard>
          <GlassCard className="flex-1 items-center py-4">
            <Text className="text-3xl font-bold text-success">{pendingWalks.length}</Text>
            <Text className="text-muted text-sm">Gassi</Text>
          </GlassCard>
        </View>

        {/* My Pets Quick View */}
        {pets.length > 0 && (
          <>
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-foreground text-lg font-semibold">
                Meine Tiere
              </Text>
              <Pressable
                onPress={() => router.push("/(tabs)/pets")}
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                <Text className="text-primary font-medium">Alle anzeigen</Text>
              </Pressable>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              className="mb-6"
              contentContainerStyle={{ gap: 12 }}
            >
              {pets.slice(0, 4).map((pet) => (
                <Pressable
                  key={pet.id}
                  style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] })}
                >
                  <GlassCard className="w-28 items-center py-4">
                    <PetAvatar name={pet.name} type={pet.type} size="lg" />
                    <Text className="text-foreground font-medium mt-2" numberOfLines={1}>
                      {pet.name}
                    </Text>
                  </GlassCard>
                </Pressable>
              ))}
              
              {/* Add Pet Button */}
              <Pressable
                onPress={() => router.push("/onboarding")}
                style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] })}
              >
                <GlassCard className="w-28 items-center py-4 border-dashed border-2 border-primary/30">
                  <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center">
                    <IconSymbol name="plus.circle.fill" size={32} color={colors.primary} />
                  </View>
                  <Text className="text-primary font-medium mt-2">Hinzufügen</Text>
                </GlassCard>
              </Pressable>
            </ScrollView>
          </>
        )}

        {/* Next Actions */}
        <Text className="text-foreground text-lg font-semibold mb-3">
          Nächste Aktionen
        </Text>
        
        {pets.length === 0 ? (
          <Pressable
            onPress={() => router.push("/onboarding")}
            style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] })}
          >
            <GlassCard className="items-center py-8 border-dashed border-2 border-primary/30">
              <View className="w-20 h-20 rounded-full bg-primary/10 items-center justify-center mb-4">
                <Text className="text-4xl">🐾</Text>
              </View>
              <Text className="text-foreground font-semibold text-lg">Erstes Haustier hinzufügen</Text>
              <Text className="text-muted text-sm mt-1">Tippe hier, um loszulegen</Text>
            </GlassCard>
          </Pressable>
        ) : (
          <>
            {/* Demo feeding action */}
            <GlassCard className="mb-4">
              <View className="flex-row items-center">
                <View className="w-12 h-12 rounded-full bg-warning/20 items-center justify-center mr-3">
                  <IconSymbol name="fork.knife" size={24} color={colors.warning} />
                </View>
                <View className="flex-1">
                  <Text className="text-foreground font-semibold">{pets[0]?.name || "Tier"} füttern</Text>
                  <Text className="text-muted text-sm">In 30 Minuten • Nassfutter</Text>
                </View>
                <Pressable 
                  className="bg-warning/20 px-3 py-1.5 rounded-full"
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                >
                  <Text className="text-warning font-medium text-sm">Erledigt</Text>
                </Pressable>
              </View>
            </GlassCard>

            {/* Demo walk action for dogs */}
            {pets.some((p) => p.type === "dog") && (
              <GlassCard className="mb-4">
                <View className="flex-row items-center">
                  <View className="w-12 h-12 rounded-full bg-primary/20 items-center justify-center mr-3">
                    <IconSymbol name="figure.walk" size={24} color={colors.primary} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-foreground font-semibold">
                      {pets.find((p) => p.type === "dog")?.name || "Hund"} Gassi gehen
                    </Text>
                    <Text className="text-muted text-sm">17:30 Uhr • 45 Min geplant</Text>
                  </View>
                  <Pressable 
                    className="bg-primary/20 px-3 py-1.5 rounded-full"
                    style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                  >
                    <Text className="text-primary font-medium text-sm">Starten</Text>
                  </Pressable>
                </View>
              </GlassCard>
            )}
          </>
        )}

        {/* Hints Section */}
        {pets.length > 0 && (
          <>
            <Text className="text-foreground text-lg font-semibold mb-3 mt-4">
              Hinweise
            </Text>
            
            <GlassCard className="mb-4 border-warning/50">
              <View className="flex-row items-center">
                <View className="w-12 h-12 rounded-full bg-warning/20 items-center justify-center mr-3">
                  <IconSymbol name="exclamationmark.triangle.fill" size={24} color={colors.warning} />
                </View>
                <View className="flex-1">
                  <Text className="text-foreground font-semibold">Niedriger Vorrat</Text>
                  <Text className="text-muted text-sm">Premium Futter • Noch 2 kg</Text>
                </View>
                <Pressable 
                  className="bg-warning/20 px-3 py-1.5 rounded-full"
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                >
                  <Text className="text-warning font-medium text-sm">Bestellen</Text>
                </Pressable>
              </View>
            </GlassCard>
          </>
        )}

        {/* Emergency Card */}
        <Pressable
          onPress={() => router.push("/emergency")}
          style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] })}
        >
          <GlassCard className="border-error/30 mt-4">
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-error/20 items-center justify-center mr-3">
                <IconSymbol name="exclamationmark.triangle.fill" size={24} color={colors.error} />
              </View>
              <View className="flex-1">
                <Text className="text-foreground font-semibold">Notfall-Hilfe</Text>
                <Text className="text-muted text-sm">Tier vermisst oder Notfall?</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.muted} />
            </View>
          </GlassCard>
        </Pressable>
      </ScrollView>
    </View>
  );
}
