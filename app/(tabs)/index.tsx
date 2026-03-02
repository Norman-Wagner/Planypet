import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { usePetStore } from "@/lib/pet-store";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { pets } = usePetStore();
  const [activePet, setActivePet] = useState(pets[0] || null);

  if (!activePet) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-foreground text-lg font-bold">
          Kein Haustier hinzugefügt
        </Text>
      </ScreenContainer>
    );
  }

  const features = [
    {
      id: "ai-symptom",
      title: "KI-Symptom-Analyse",
      icon: "stethoscope",
      color: "#7B3FF2",
      route: "/ai-symptom",
    },
    {
      id: "gps-tracking",
      title: "GPS-Tracking",
      icon: "location.fill",
      color: "#2ECC71",
      route: "/gps-tracking-new",
    },
    {
      id: "health",
      title: "Gesundheitsakten",
      icon: "heart.fill",
      color: "#E74C3C",
      route: "/health-records",
    },
    {
      id: "breed",
      title: "Rasse-Scanner",
      icon: "camera.fill",
      color: "#7B3FF2",
      route: "/breed-scanner-ai",
    },
    {
      id: "community",
      title: "Community",
      icon: "person.2.fill",
      color: "#3498DB",
      route: "/community-social",
    },
    {
      id: "marketplace",
      title: "Marktplatz",
      icon: "bag.fill",
      color: "#F39C12",
      route: "/marketplace-services",
    },
    {
      id: "devices",
      title: "Smart-Geräte",
      icon: "wifi",
      color: "#1A3A52",
      route: "/smart-devices",
    },
  ];

  return (
    <LinearGradient
      colors={["#1E5A96", "#0F3A5F"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 100,
          paddingHorizontal: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-8">
          <Text className="text-white text-sm font-medium opacity-80">
            Willkommen zurück
          </Text>
          <Text className="text-white text-3xl font-bold">Dashboard</Text>
        </View>

        {/* Active Pet Card */}
        <View className="bg-white/10 rounded-2xl p-6 border border-white/20 mb-8">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-1">
              <Text className="text-white text-xl font-bold">
                {activePet.name}
              </Text>
              <Text className="text-white/70 text-sm">
                {(activePet as any).species || "Haustier"}
              </Text>
            </View>
            <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center">
              <Text className="text-3xl">🐕</Text>
            </View>
          </View>
        </View>

        {/* Feature Grid */}
        <Text className="text-white font-bold text-lg mb-4">Features</Text>
        <View className="gap-3 mb-6">
          {features.map((feature) => (
            <Pressable
              key={feature.id}
              onPress={() => router.push(feature.route as any)}
              className="bg-white/10 rounded-2xl p-4 border border-white/20 flex-row items-center gap-4"
            >
              <View
                className="w-12 h-12 rounded-lg items-center justify-center"
                style={{ backgroundColor: feature.color + "30" }}
              >
                <IconSymbol
                  size={24}
                  name={feature.icon as any}
                  color={feature.color}
                />
              </View>
              <View className="flex-1">
                <Text className="text-white font-semibold">
                  {feature.title}
                </Text>
              </View>
              <IconSymbol
                size={20}
                name="chevron.right"
                color="rgba(255,255,255,0.5)"
              />
            </Pressable>
          ))}
        </View>

        {/* Pet Selector */}
        <Text className="text-white font-bold text-lg mb-3">Deine Tiere</Text>
        <View className="gap-2">
          {pets.map((pet) => (
            <Pressable
              key={pet.id}
              onPress={() => setActivePet(pet)}
              className={`p-4 rounded-2xl border-2 ${
                activePet.id === pet.id
                  ? "bg-white/20 border-white"
                  : "bg-white/5 border-white/20"
              }`}
            >
              <Text
                className={`font-semibold ${
                  activePet.id === pet.id ? "text-white" : "text-white/70"
                }`}
              >
                {pet.name}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
