import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { usePetStore } from "@/lib/pet-store";

function FadeInView({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(10);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) })
    );
    translateY.value = withDelay(
      delay,
      withTiming(0, { duration: 400, easing: Easing.out(Easing.cubic) })
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={animStyle}>{children}</Animated.View>;
}

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { userName, pets, feedings, walks } = usePetStore();
  const [gamificationLevel, setGamificationLevel] = useState(4);
  const [gamificationTitle, setGamificationTitle] = useState("Abenteurer");

  const activePet = pets[0];

  const feedingProgress = feedings.length > 0 ? 2 : 0;
  const feedingTarget = 3;
  const walksDuration = 45;
  const walksTarget = 60;

  const navigateTo = (screen: string) => {
    router.push(screen as any);
  };

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
        {/* Header with Logo */}
        <FadeInView delay={0}>
          <View className="flex-row items-center justify-between mb-8">
            <View>
              <Text className="text-white text-sm font-medium opacity-80">
                Willkommen zurück,
              </Text>
              <Text className="text-white text-2xl font-bold">
                {userName || "Tierfreund"}
              </Text>
            </View>
            <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
              <IconSymbol size={24} name="pawprint.fill" color="#FFFFFF" />
            </View>
          </View>
        </FadeInView>

        {/* Pet Profile Card */}
        {activePet && (
          <FadeInView delay={100}>
            <Pressable
              onPress={() => navigateTo("pets")}
              className="mb-6 rounded-3xl overflow-hidden"
            >
              <LinearGradient
                colors={["rgba(255,255,255,0.15)", "rgba(255,255,255,0.05)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View className="p-6 flex-row items-center gap-4">
                  <View className="w-20 h-20 bg-white/20 rounded-2xl items-center justify-center">
                    <IconSymbol size={40} name="pawprint.fill" color="#FFFFFF" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white text-xl font-bold">
                      {activePet.name}
                    </Text>
                    <Text className="text-white/70 text-sm">
                      {(activePet as any).species || "Haustier"}
                    </Text>
                    <View className="mt-2 flex-row items-center gap-2">
                      <View className="px-3 py-1 bg-white/20 rounded-full">
                        <Text className="text-white text-xs font-semibold">
                          Level {gamificationLevel}
                        </Text>
                      </View>
                      <Text className="text-white/80 text-xs">
                        {gamificationTitle}
                      </Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </Pressable>
          </FadeInView>
        )}

        {/* Quick Stats Grid */}
        <FadeInView delay={200}>
          <View className="gap-4 mb-6">
            {/* Feeding Stats */}
            <Pressable
              onPress={() => navigateTo("feeding")}
              className="rounded-2xl overflow-hidden"
            >
              <LinearGradient
                colors={["rgba(255,255,255,0.12)", "rgba(255,255,255,0.03)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View className="p-4">
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center gap-2">
                      <View className="w-10 h-10 bg-white/20 rounded-lg items-center justify-center">
                        <IconSymbol
                          size={20}
                          name="fork.knife"
                          color="#FFFFFF"
                        />
                      </View>
                      <Text className="text-white font-semibold">Fütterung</Text>
                    </View>
                    <Text className="text-white/70 text-xs">
                      {feedingProgress}/{feedingTarget}
                    </Text>
                  </View>
                  <View className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <View
                      className="h-full bg-white/60 rounded-full"
                      style={{
                        width: `${(feedingProgress / feedingTarget) * 100}%`,
                      }}
                    />
                  </View>
                </View>
              </LinearGradient>
            </Pressable>

            {/* Walks Stats */}
            <Pressable
              onPress={() => navigateTo("gps-tracking")}
              className="rounded-2xl overflow-hidden"
            >
              <LinearGradient
                colors={["rgba(255,255,255,0.12)", "rgba(255,255,255,0.03)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View className="p-4">
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center gap-2">
                      <View className="w-10 h-10 bg-white/20 rounded-lg items-center justify-center">
                        <IconSymbol
                          size={20}
                          name="figure.walk"
                          color="#FFFFFF"
                        />
                      </View>
                      <Text className="text-white font-semibold">Gassi</Text>
                    </View>
                    <Text className="text-white/70 text-xs">
                      {walksDuration}/{walksTarget} min
                    </Text>
                  </View>
                  <View className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <View
                      className="h-full bg-white/60 rounded-full"
                      style={{
                        width: `${(walksDuration / walksTarget) * 100}%`,
                      }}
                    />
                  </View>
                </View>
              </LinearGradient>
            </Pressable>

            {/* Health Status */}
            <Pressable
              onPress={() => navigateTo("health")}
              className="rounded-2xl overflow-hidden"
            >
              <LinearGradient
                colors={["rgba(255,255,255,0.12)", "rgba(255,255,255,0.03)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View className="p-4 flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 bg-white/20 rounded-lg items-center justify-center">
                      <IconSymbol size={20} name="heart.fill" color="#FFFFFF" />
                    </View>
                    <View>
                      <Text className="text-white font-semibold">
                        Gesundheit
                      </Text>
                      <Text className="text-white/60 text-xs">Alles OK</Text>
                    </View>
                  </View>
                  <View className="w-6 h-6 bg-green-500/40 rounded-full items-center justify-center">
                    <Text className="text-green-300 text-lg">✓</Text>
                  </View>
                </View>
              </LinearGradient>
            </Pressable>
          </View>
        </FadeInView>

        {/* Feature Navigation Grid */}
        <FadeInView delay={300}>
          <Text className="text-white text-lg font-bold mb-4">Features</Text>
          <View className="gap-3">
            {/* Row 1 */}
            <View className="flex-row gap-3">
              {/* KI-Symptom */}
              <Pressable
                onPress={() => navigateTo("add-symptom")}
                className="flex-1 rounded-2xl overflow-hidden"
              >
                <LinearGradient
                  colors={["#7B3FF2", "#5B1FD2"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View className="p-4 items-center justify-center h-28">
                    <View className="w-12 h-12 bg-white/20 rounded-xl items-center justify-center mb-2">
                      <IconSymbol
                        size={24}
                        name="stethoscope"
                        color="#FFFFFF"
                      />
                    </View>
                    <Text className="text-white text-xs font-semibold text-center">
                      KI-Symptom
                    </Text>
                  </View>
                </LinearGradient>
              </Pressable>

              {/* GPS Tracking */}
              <Pressable
                onPress={() => navigateTo("gps-tracking")}
                className="flex-1 rounded-2xl overflow-hidden"
              >
                <LinearGradient
                  colors={["#2ECC71", "#1BA85C"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View className="p-4 items-center justify-center h-28">
                    <View className="w-12 h-12 bg-white/20 rounded-xl items-center justify-center mb-2">
                      <IconSymbol
                        size={24}
                        name="location.fill"
                        color="#FFFFFF"
                      />
                    </View>
                    <Text className="text-white text-xs font-semibold text-center">
                      GPS-Route
                    </Text>
                  </View>
                </LinearGradient>
              </Pressable>
            </View>

            {/* Row 2 */}
            <View className="flex-row gap-3">
              {/* Breed Scanner */}
              <Pressable
                onPress={() => navigateTo("breed-scanner")}
                className="flex-1 rounded-2xl overflow-hidden"
              >
                <LinearGradient
                  colors={["#7B3FF2", "#5B1FD2"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View className="p-4 items-center justify-center h-28">
                    <View className="w-12 h-12 bg-white/20 rounded-xl items-center justify-center mb-2">
                      <IconSymbol size={24} name="camera.fill" color="#FFFFFF" />
                    </View>
                    <Text className="text-white text-xs font-semibold text-center">
                      Rasse-Scanner
                    </Text>
                  </View>
                </LinearGradient>
              </Pressable>

              {/* Marketplace */}
              <Pressable
                onPress={() => navigateTo("marketplace")}
                className="flex-1 rounded-2xl overflow-hidden"
              >
                <LinearGradient
                  colors={["#F39C12", "#D68910"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View className="p-4 items-center justify-center h-28">
                    <View className="w-12 h-12 bg-white/20 rounded-xl items-center justify-center mb-2">
                      <IconSymbol
                        size={24}
                        name="bag.fill"
                        color="#FFFFFF"
                      />
                    </View>
                    <Text className="text-white text-xs font-semibold text-center">
                      Marktplatz
                    </Text>
                  </View>
                </LinearGradient>
              </Pressable>
            </View>

            {/* Row 3 */}
            <View className="flex-row gap-3">
              {/* Community */}
              <Pressable
                onPress={() => navigateTo("community")}
                className="flex-1 rounded-2xl overflow-hidden"
              >
                <LinearGradient
                  colors={["#3498DB", "#2980B9"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View className="p-4 items-center justify-center h-28">
                    <View className="w-12 h-12 bg-white/20 rounded-xl items-center justify-center mb-2">
                      <IconSymbol
                        size={24}
                        name="person.2.fill"
                        color="#FFFFFF"
                      />
                    </View>
                    <Text className="text-white text-xs font-semibold text-center">
                      Community
                    </Text>
                  </View>
                </LinearGradient>
              </Pressable>

              {/* Smart Devices */}
              <Pressable
                onPress={() => navigateTo("devices")}
                className="flex-1 rounded-2xl overflow-hidden"
              >
                <LinearGradient
                  colors={["#1A3A52", "#0F2438"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View className="p-4 items-center justify-center h-28">
                    <View className="w-12 h-12 bg-white/20 rounded-xl items-center justify-center mb-2">
                      <IconSymbol
                        size={24}
                        name="wifi"
                        color="#FFFFFF"
                      />
                    </View>
                    <Text className="text-white text-xs font-semibold text-center">
                      Geräte
                    </Text>
                  </View>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </FadeInView>

        {/* Liability Disclaimer */}
        <FadeInView delay={400}>
          <View className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10">
            <Text className="text-white/60 text-xs leading-relaxed">
              <Text className="font-semibold">Haftungsausschluss:</Text> Die
              Informationen in dieser App ersetzen nicht den Besuch beim
              Tierarzt. Bei Gesundheitsproblemen konsultieren Sie bitte einen
              Fachmann.
            </Text>
          </View>
        </FadeInView>
      </ScrollView>
    </LinearGradient>
  );
}
