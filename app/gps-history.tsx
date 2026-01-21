import { useState } from "react";
import { ScrollView, Text, View, Pressable, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

import { GlassCard } from "@/components/ui/glass-card";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { PetAvatar } from "@/components/ui/pet-avatar";
import { useColors } from "@/hooks/use-colors";
import { usePetStore } from "@/lib/pet-store";

const { width } = Dimensions.get("window");

export default function GPSHistoryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { pets, walks } = usePetStore();
  
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<"week" | "month" | "all">("week");

  // Filter dogs
  const dogs = pets.filter((p) => p.type === "dog");

  // Filter walks
  const filteredWalks = walks.filter((w) => {
    if (!w.completed) return false;
    if (selectedPetId && w.petId !== selectedPetId) return false;
    
    const walkDate = new Date(w.completedAt || "");
    const now = new Date();
    
    if (timeFilter === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return walkDate >= weekAgo;
    } else if (timeFilter === "month") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return walkDate >= monthAgo;
    }
    return true;
  }).sort((a, b) => new Date(b.completedAt || "").getTime() - new Date(a.completedAt || "").getTime());

  // Calculate stats
  const totalDistance = filteredWalks.reduce((sum, w) => sum + (w.route?.distance || 0), 0);
  const totalDuration = filteredWalks.reduce((sum, w) => sum + (w.route?.duration || 0), 0);
  const avgDistance = filteredWalks.length > 0 ? totalDistance / filteredWalks.length : 0;

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins} min`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("de-DE", { 
      weekday: "short", 
      day: "numeric", 
      month: "short" 
    });
  };

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
          paddingBottom: insets.bottom + 40,
          paddingHorizontal: 20,
        }}
      >
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-3"
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <IconSymbol name="chevron.left" size={24} color="#FFFFFF" />
          </Pressable>
          <View className="flex-1">
            <Text className="text-white text-2xl font-bold">GPS-History</Text>
            <Text className="text-white/70 text-base">Alle Spaziergänge im Überblick</Text>
          </View>
        </View>

        {/* Stats Overview */}
        <View className="flex-row gap-3 mb-6">
          <GlassCard className="flex-1 items-center py-4">
            <Text className="text-2xl font-bold text-primary">{filteredWalks.length}</Text>
            <Text className="text-muted text-xs">Spaziergänge</Text>
          </GlassCard>
          <GlassCard className="flex-1 items-center py-4">
            <Text className="text-2xl font-bold text-success">{(totalDistance / 1000).toFixed(1)}</Text>
            <Text className="text-muted text-xs">km gesamt</Text>
          </GlassCard>
          <GlassCard className="flex-1 items-center py-4">
            <Text className="text-2xl font-bold text-warning">{formatTime(totalDuration)}</Text>
            <Text className="text-muted text-xs">Gesamtzeit</Text>
          </GlassCard>
        </View>

        {/* Pet Filter */}
        {dogs.length > 1 && (
          <>
            <Text className="text-foreground text-sm font-medium mb-2">Nach Hund filtern</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              className="mb-4"
              contentContainerStyle={{ gap: 8 }}
            >
              <Pressable
                onPress={() => setSelectedPetId(null)}
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                <View 
                  className={`px-4 py-2 rounded-full ${
                    !selectedPetId ? "bg-primary" : "bg-surface border border-border"
                  }`}
                >
                  <Text className={!selectedPetId ? "text-white font-medium" : "text-foreground"}>
                    Alle
                  </Text>
                </View>
              </Pressable>
              {dogs.map((dog) => (
                <Pressable
                  key={dog.id}
                  onPress={() => setSelectedPetId(dog.id)}
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                >
                  <View 
                    className={`px-4 py-2 rounded-full flex-row items-center ${
                      selectedPetId === dog.id ? "bg-primary" : "bg-surface border border-border"
                    }`}
                  >
                    <Text className={selectedPetId === dog.id ? "text-white font-medium" : "text-foreground"}>
                      {dog.name}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </>
        )}

        {/* Time Filter */}
        <Text className="text-foreground text-sm font-medium mb-2">Zeitraum</Text>
        <View className="flex-row gap-2 mb-6">
          {[
            { key: "week", label: "Woche" },
            { key: "month", label: "Monat" },
            { key: "all", label: "Alle" },
          ].map(({ key, label }) => (
            <Pressable
              key={key}
              onPress={() => setTimeFilter(key as typeof timeFilter)}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <View 
                className={`px-4 py-2 rounded-full ${
                  timeFilter === key ? "bg-primary" : "bg-surface border border-border"
                }`}
              >
                <Text className={timeFilter === key ? "text-white font-medium" : "text-foreground"}>
                  {label}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Walk History */}
        <Text className="text-foreground text-lg font-semibold mb-3">
          Verlauf
        </Text>

        {filteredWalks.length === 0 ? (
          <GlassCard className="items-center py-8">
            <IconSymbol name="map.fill" size={48} color={colors.muted} />
            <Text className="text-foreground font-medium mt-3">Keine Spaziergänge</Text>
            <Text className="text-muted text-sm text-center mt-1">
              Starte einen Spaziergang, um deine Routen hier zu sehen
            </Text>
          </GlassCard>
        ) : (
          filteredWalks.map((walk) => {
            const pet = pets.find((p) => p.id === walk.petId);
            return (
              <Pressable
                key={walk.id}
                style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] })}
              >
                <GlassCard className="mb-3">
                  <View className="flex-row items-center">
                    {pet && <PetAvatar name={pet.name} type={pet.type} size="md" />}
                    <View className="flex-1 ml-3">
                      <Text className="text-foreground font-semibold">{pet?.name}</Text>
                      <Text className="text-muted text-sm">
                        {formatDate(walk.completedAt || "")}
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-foreground font-semibold">
                        {walk.route?.distance || 0}m
                      </Text>
                      <Text className="text-muted text-sm">
                        {formatTime(walk.route?.duration || 0)}
                      </Text>
                    </View>
                  </View>
                  
                  {/* Mini Map Placeholder */}
                  <View className="mt-3 h-24 rounded-xl bg-surface/50 items-center justify-center border border-border">
                    <IconSymbol name="map.fill" size={32} color={colors.muted} />
                    <Text className="text-muted text-xs mt-1">Route anzeigen</Text>
                  </View>
                </GlassCard>
              </Pressable>
            );
          })
        )}

        {/* Average Stats */}
        {filteredWalks.length > 0 && (
          <GlassCard className="mt-4">
            <Text className="text-foreground font-semibold mb-3">Durchschnitt</Text>
            <View className="flex-row justify-around">
              <View className="items-center">
                <Text className="text-xl font-bold text-primary">{Math.round(avgDistance)}m</Text>
                <Text className="text-muted text-xs">pro Spaziergang</Text>
              </View>
              <View className="items-center">
                <Text className="text-xl font-bold text-success">
                  {formatTime(Math.round(totalDuration / filteredWalks.length))}
                </Text>
                <Text className="text-muted text-xs">Durchschnittsdauer</Text>
              </View>
            </View>
          </GlassCard>
        )}
      </ScrollView>
    </View>
  );
}
