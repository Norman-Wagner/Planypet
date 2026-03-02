import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Location from "expo-location";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { usePetStore } from "@/lib/pet-store";

export default function GpsTrackingScreen() {
  const insets = useSafeAreaInsets();
  const { pets } = usePetStore();
  const [isTracking, setIsTracking] = useState(false);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [weather, setWeather] = useState<any>(null);
  const [selectedPet, setSelectedPet] = useState(pets[0]?.id || "");

  useEffect(() => {
    if (isTracking) {
      const interval = setInterval(() => {
        setDuration((d) => d + 1);
        setDistance((dist) => dist + 0.01); // Simulate distance
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isTracking]);

  const handleStartTracking = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Fehler", "Standortberechtigung erforderlich");
        return;
      }
      setIsTracking(true);
      // Fetch weather
      const location = await Location.getCurrentPositionAsync({});
      // Simulate weather data
      setWeather({
        temp: 15,
        condition: "Leicht bewölkt",
        rainChance: 20,
        humidity: 65,
      });
    } catch (error) {
      Alert.alert("Fehler", "Standort konnte nicht abgerufen werden");
    }
  };

  const handleStopTracking = () => {
    setIsTracking(false);
    Alert.alert("Erfolg", `Route gespeichert: ${distance.toFixed(2)} km`);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const pace = duration > 0 ? ((distance / (duration / 3600)) * 60).toFixed(1) : "0";

  return (
    <LinearGradient
      colors={["#2ECC71", "#1BA85C"]}
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
        <View className="flex-row items-center justify-between mb-8">
          <View>
            <Text className="text-white text-sm font-medium opacity-80">
              Live Tracking
            </Text>
            <Text className="text-white text-2xl font-bold">GPS-Route</Text>
          </View>
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
          >
            <IconSymbol size={20} name="xmark" color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Pet Selector */}
        <View className="mb-6">
          <Text className="text-white font-semibold mb-3">Welches Tier?</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="gap-2"
          >
            {pets.map((pet) => (
              <Pressable
                key={pet.id}
                onPress={() => setSelectedPet(pet.id)}
                disabled={isTracking}
                className={`px-4 py-2 rounded-full ${
                  selectedPet === pet.id
                    ? "bg-white"
                    : "bg-white/20 border border-white/30"
                }`}
              >
                <Text
                  className={`font-semibold ${
                    selectedPet === pet.id ? "text-green-600" : "text-white"
                  }`}
                >
                  {pet.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Weather Card */}
        {weather && (
          <View className="bg-white/10 rounded-2xl p-4 border border-white/20 mb-6">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-white/70 text-sm">Wetter</Text>
                <Text className="text-white font-bold text-lg">
                  {weather.temp}°C
                </Text>
                <Text className="text-white/80 text-xs">{weather.condition}</Text>
              </View>
              <View className="items-center">
                <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center mb-2">
                  <IconSymbol size={24} name="cloud.fill" color="#FFFFFF" />
                </View>
                <Text className="text-white text-xs">
                  {weather.rainChance}% Regen
                </Text>
              </View>
            </View>
            {weather.rainChance > 50 && (
              <View className="mt-3 pt-3 border-t border-white/20">
                <Text className="text-white/80 text-xs">
                  ⚠️ Regenwarnung für Luna (regensensibel)
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Map Placeholder */}
        <View className="bg-white/10 rounded-2xl h-48 items-center justify-center border border-white/20 mb-6">
          <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center mb-3">
            <IconSymbol size={32} name="location.fill" color="#FFFFFF" />
          </View>
          <Text className="text-white/70 text-sm">
            {isTracking ? "Route wird aufgezeichnet..." : "Karte wird geladen"}
          </Text>
        </View>

        {/* Stats Grid */}
        <View className="gap-3 mb-6">
          <View className="flex-row gap-3">
            <View className="flex-1 bg-white/10 rounded-2xl p-4 border border-white/20">
              <Text className="text-white/70 text-xs mb-1">Distanz</Text>
              <Text className="text-white font-bold text-2xl">
                {distance.toFixed(2)}
              </Text>
              <Text className="text-white/60 text-xs">km</Text>
            </View>
            <View className="flex-1 bg-white/10 rounded-2xl p-4 border border-white/20">
              <Text className="text-white/70 text-xs mb-1">Dauer</Text>
              <Text className="text-white font-bold text-lg">
                {formatTime(duration)}
              </Text>
            </View>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1 bg-white/10 rounded-2xl p-4 border border-white/20">
              <Text className="text-white/70 text-xs mb-1">Tempo</Text>
              <Text className="text-white font-bold text-2xl">{pace}</Text>
              <Text className="text-white/60 text-xs">min/km</Text>
            </View>
            <View className="flex-1 bg-white/10 rounded-2xl p-4 border border-white/20">
              <Text className="text-white/70 text-xs mb-1">Luftfeucht.</Text>
              <Text className="text-white font-bold text-2xl">
                {weather?.humidity || "—"}
              </Text>
              <Text className="text-white/60 text-xs">%</Text>
            </View>
          </View>
        </View>

        {/* Control Buttons */}
        <View className="gap-3 mb-6">
          {!isTracking ? (
            <Pressable
              onPress={handleStartTracking}
              className="py-4 rounded-2xl items-center justify-center"
            >
              <LinearGradient
                colors={["rgba(255,255,255,0.3)", "rgba(255,255,255,0.1)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: "100%",
                  paddingVertical: 16,
                  borderRadius: 16,
                  alignItems: "center",
                }}
              >
                <View className="flex-row items-center gap-2">
                  <IconSymbol size={20} name="play.fill" color="#FFFFFF" />
                  <Text className="text-white font-bold text-lg">
                    Tracking starten
                  </Text>
                </View>
              </LinearGradient>
            </Pressable>
          ) : (
            <>
              <Pressable
                onPress={() => setIsTracking(false)}
                className="py-4 rounded-2xl items-center justify-center"
              >
                <LinearGradient
                  colors={["rgba(255,255,255,0.2)", "rgba(255,255,255,0.05)"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: "100%",
                    paddingVertical: 16,
                    borderRadius: 16,
                    alignItems: "center",
                  }}
                >
                  <View className="flex-row items-center gap-2">
                    <IconSymbol size={20} name="pause.fill" color="#FFFFFF" />
                    <Text className="text-white font-bold text-lg">Pausieren</Text>
                  </View>
                </LinearGradient>
              </Pressable>
              <Pressable
                onPress={handleStopTracking}
                className="py-4 rounded-2xl items-center justify-center bg-red-500/30 border border-red-400/50"
              >
                <View className="flex-row items-center gap-2">
                  <IconSymbol size={20} name="stop.fill" color="#FFFFFF" />
                  <Text className="text-white font-bold text-lg">Beenden</Text>
                </View>
              </Pressable>
            </>
          )}
        </View>

        {/* Route History */}
        <View className="bg-white/10 rounded-2xl p-4 border border-white/20">
          <Text className="text-white font-semibold mb-3">Letzte Routen</Text>
          <View className="gap-2">
            {[
              { dist: "2.5", time: "25m", date: "Heute" },
              { dist: "3.1", time: "32m", date: "Gestern" },
              { dist: "1.8", time: "18m", date: "Vor 2 Tagen" },
            ].map((route, idx) => (
              <View
                key={idx}
                className="flex-row items-center justify-between py-2 border-b border-white/10"
              >
                <View>
                  <Text className="text-white font-semibold">{route.dist} km</Text>
                  <Text className="text-white/60 text-xs">{route.date}</Text>
                </View>
                <Text className="text-white/70 text-sm">{route.time}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
