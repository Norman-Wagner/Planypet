import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useRouter } from "expo-router";
import { usePetStore } from "@/lib/pet-store";

export default function DashboardScreen() {
  const colors = useColors();
  const router = useRouter();
  const { pets } = usePetStore();
  const [activePet, setActivePet] = useState(pets[0] || null);

  if (!activePet && pets.length === 0) {
    return (
      <ScreenContainer className="bg-background">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="justify-center pb-6">
          <View className="items-center gap-6">
            <View className="w-24 h-24 bg-primary/20 rounded-full items-center justify-center">
              <IconSymbol name="pawprint.fill" size={48} color={colors.primary} />
            </View>

            <View className="items-center gap-2">
              <Text className="text-2xl font-bold text-foreground">Kein Haustier hinzugefügt</Text>
              <Text className="text-muted text-center">
                Füge dein erstes Haustier hinzu, um zu beginnen
              </Text>
            </View>

            <TouchableOpacity
              className="bg-primary rounded-lg py-3 px-8 items-center"
              onPress={() => router.push("/pet-identification")}
            >
              <View className="flex-row items-center gap-2">
                <IconSymbol name="plus.circle.fill" size={20} color="#ffffff" />
                <Text className="text-background font-semibold">Haustier hinzufügen</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "feeding":
        Alert.alert("Fütterung", "Fütterung protokolliert ✓");
        break;
      case "walk":
        Alert.alert("Gassi", "Gassi-Runde gestartet");
        router.push("/gassi-tracking" as any);
        break;
      case "health":
        Alert.alert("Gesundheit", "Gesundheitsnote hinzugefügt");
        router.push("/health-records" as any);
        break;
      case "ai":
        Alert.alert("KI-Assistent", "Öffne den KI-Assistenten");
        break;
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="pb-6">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground">Dashboard</Text>
          <Text className="text-muted">Übersicht deines Haustieres</Text>
        </View>

        {/* Pet Card */}
        {activePet && (
          <View className="bg-surface rounded-lg border border-border overflow-hidden mb-6 p-4">
            <View className="flex-row justify-between items-start mb-4">
              <View>
                <Text className="text-2xl font-bold text-foreground">{activePet.name}</Text>
                <Text className="text-muted">{(activePet as any).species || "Haustier"}</Text>
              </View>
              <View className="w-12 h-12 bg-primary/20 rounded-lg items-center justify-center">
                <IconSymbol name="pawprint.fill" size={24} color={colors.primary} />
              </View>
            </View>

            {/* Critical Info */}
            <View className="gap-2">
              <View className="flex-row items-center gap-3 bg-background rounded-lg p-3">
                <IconSymbol name="fork.knife" size={20} color={colors.primary} />
                <View className="flex-1">
                  <Text className="text-xs text-muted">Nächste Fütterung</Text>
                  <Text className="text-sm font-semibold text-foreground">18:00 Uhr</Text>
                </View>
              </View>

              <View className="flex-row items-center gap-3 bg-background rounded-lg p-3">
                <IconSymbol name="figure.walk" size={20} color={colors.success} />
                <View className="flex-1">
                  <Text className="text-xs text-muted">Letzte Gassi-Runde</Text>
                  <Text className="text-sm font-semibold text-foreground">Vor 2 Stunden</Text>
                </View>
              </View>

              <View className="flex-row items-center gap-3 bg-warning/10 rounded-lg p-3 border border-warning/30">
                <IconSymbol name="exclamationmark.circle.fill" size={20} color={colors.warning} />
                <View className="flex-1">
                  <Text className="text-xs text-warning">Erinnerung</Text>
                  <Text className="text-xs font-semibold text-warning">Impfung fällig in 30 Tagen</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <Text className="text-lg font-bold text-foreground mb-3">Schnellaktionen</Text>
        <View className="flex-row flex-wrap gap-3 mb-6">
          <TouchableOpacity
            className="flex-1 min-w-[48%] bg-primary/20 rounded-lg p-4 items-center gap-2"
            onPress={() => handleQuickAction("feeding")}
          >
            <IconSymbol name="fork.knife" size={28} color={colors.primary} />
            <Text className="text-xs font-semibold text-foreground text-center">Fütterung</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 min-w-[48%] bg-success/20 rounded-lg p-4 items-center gap-2"
            onPress={() => handleQuickAction("walk")}
          >
            <IconSymbol name="figure.walk" size={28} color={colors.success} />
            <Text className="text-xs font-semibold text-foreground text-center">Gassi</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 min-w-[48%] bg-error/20 rounded-lg p-4 items-center gap-2"
            onPress={() => handleQuickAction("health")}
          >
            <IconSymbol name="heart.fill" size={28} color={colors.error} />
            <Text className="text-xs font-semibold text-foreground text-center">Gesundheit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 min-w-[48%] bg-primary/20 rounded-lg p-4 items-center gap-2"
            onPress={() => handleQuickAction("ai")}
          >
            <IconSymbol name="sparkles" size={28} color={colors.primary} />
            <Text className="text-xs font-semibold text-foreground text-center">KI fragen</Text>
          </TouchableOpacity>
        </View>

        {/* Pet Selector */}
        {pets.length > 1 && (
          <>
            <Text className="text-lg font-bold text-foreground mb-3">Deine Tiere</Text>
            <View className="gap-2">
              {pets.map((pet) => (
                <TouchableOpacity
                  key={pet.id}
                  onPress={() => setActivePet(pet)}
                  className={`p-4 rounded-lg border-2 ${
                    activePet?.id === pet.id
                      ? "bg-primary/20 border-primary"
                      : "bg-surface border-border"
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      activePet?.id === pet.id ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {pet.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
