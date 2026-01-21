import { useState, useEffect, useRef } from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { PetAvatar } from "@/components/ui/pet-avatar";
import { useColors } from "@/hooks/use-colors";
import { usePetStore, Pet } from "@/lib/pet-store";

export default function WalkScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { pets, walks, addWalk, completeWalk } = usePetStore();
  
  const [isWalking, setIsWalking] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [walkTime, setWalkTime] = useState(0);
  const [walkDistance, setWalkDistance] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Filter dogs only for walks
  const dogs = pets.filter((p) => p.type === "dog");

  useEffect(() => {
    if (isWalking) {
      timerRef.current = setInterval(() => {
        setWalkTime((prev) => prev + 1);
        // Simulate distance (in real app, this would use GPS)
        setWalkDistance((prev) => prev + Math.random() * 5);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isWalking]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartWalk = (pet: Pet) => {
    setSelectedPet(pet);
    setIsWalking(true);
    setWalkTime(0);
    setWalkDistance(0);
    
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleEndWalk = () => {
    if (!selectedPet) return;
    
    addWalk({
      petId: selectedPet.id,
      scheduledTime: new Date().toISOString(),
      duration: walkTime,
      completed: true,
      completedAt: new Date().toISOString(),
      route: {
        coordinates: [], // Would be filled by GPS
        distance: Math.round(walkDistance),
        duration: walkTime,
      },
    });
    
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    setIsWalking(false);
    setSelectedPet(null);
  };

  const todayWalks = walks.filter(
    (w) => w.completed && new Date(w.completedAt || "").toDateString() === new Date().toDateString()
  );

  return (
    <View className="flex-1">
      {/* Gradient Background */}
      <LinearGradient
        colors={isWalking ? ["#10B981", "#34D399", "#F0F7FF"] : ["#0066CC", "#00A3FF", "#F0F7FF"]}
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
            onPress={() => {
              if (isWalking) {
                // Confirm before leaving during walk
                handleEndWalk();
              }
              router.back();
            }}
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-3"
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <IconSymbol name="chevron.left" size={24} color="#FFFFFF" />
          </Pressable>
          <View className="flex-1">
            <Text className="text-white text-2xl font-bold">
              {isWalking ? "Gassi läuft..." : "Gassi gehen"}
            </Text>
            <Text className="text-white/70 text-base">
              {isWalking ? `Mit ${selectedPet?.name}` : "Spaziergänge planen & tracken"}
            </Text>
          </View>
        </View>

        {/* Active Walk Display */}
        {isWalking && selectedPet && (
          <GlassCard className="mb-6">
            <View className="items-center py-6">
              <PetAvatar name={selectedPet.name} type={selectedPet.type} size="xl" />
              <Text className="text-foreground text-xl font-bold mt-4">{selectedPet.name}</Text>
              
              <View className="flex-row gap-8 mt-6">
                <View className="items-center">
                  <Text className="text-4xl font-bold text-primary">{formatTime(walkTime)}</Text>
                  <Text className="text-muted text-sm">Dauer</Text>
                </View>
                <View className="items-center">
                  <Text className="text-4xl font-bold text-success">{Math.round(walkDistance)}</Text>
                  <Text className="text-muted text-sm">Meter</Text>
                </View>
              </View>
              
              <View className="mt-8 w-full">
                <Pressable
                  onPress={handleEndWalk}
                  style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] })}
                >
                  <LinearGradient
                    colors={["#EF4444", "#F87171"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ borderRadius: 16, padding: 16, alignItems: "center" }}
                  >
                    <Text className="text-white text-lg font-bold">Gassi beenden</Text>
                  </LinearGradient>
                </Pressable>
              </View>
            </View>
          </GlassCard>
        )}

        {/* Dog Selection (when not walking) */}
        {!isWalking && (
          <>
            <Text className="text-foreground text-lg font-semibold mb-3">
              Gassi starten
            </Text>
            
            {dogs.length === 0 ? (
              <GlassCard className="items-center py-6 mb-6">
                <IconSymbol name="pawprint.fill" size={40} color={colors.muted} />
                <Text className="text-foreground font-medium mt-2">Keine Hunde</Text>
                <Text className="text-muted text-sm text-center">
                  Füge einen Hund hinzu, um Gassi-Runden zu tracken
                </Text>
              </GlassCard>
            ) : (
              <View className="gap-3 mb-6">
                {dogs.map((dog) => (
                  <Pressable
                    key={dog.id}
                    onPress={() => handleStartWalk(dog)}
                    style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] })}
                  >
                    <GlassCard>
                      <View className="flex-row items-center">
                        <PetAvatar name={dog.name} type={dog.type} size="lg" />
                        <View className="flex-1 ml-4">
                          <Text className="text-foreground text-lg font-bold">{dog.name}</Text>
                          <Text className="text-muted text-sm">{dog.breed || "Hund"}</Text>
                        </View>
                        <LinearGradient
                          colors={["#10B981", "#34D399"]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={{ borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10 }}
                        >
                          <View className="flex-row items-center">
                            <IconSymbol name="figure.walk" size={18} color="#FFFFFF" />
                            <Text className="text-white font-semibold ml-2">Starten</Text>
                          </View>
                        </LinearGradient>
                      </View>
                    </GlassCard>
                  </Pressable>
                ))}
              </View>
            )}

            {/* Today's Walks */}
            {todayWalks.length > 0 && (
              <>
                <Text className="text-foreground text-lg font-semibold mb-3">
                  Heute ({todayWalks.length} Spaziergänge)
                </Text>
                {todayWalks.map((walk) => {
                  const pet = pets.find((p) => p.id === walk.petId);
                  return (
                    <GlassCard key={walk.id} className="mb-3">
                      <View className="flex-row items-center">
                        {pet && <PetAvatar name={pet.name} type={pet.type} size="md" />}
                        <View className="flex-1 ml-3">
                          <Text className="text-foreground font-semibold">{pet?.name}</Text>
                          <Text className="text-muted text-sm">
                            {formatTime(walk.route?.duration || 0)} • {walk.route?.distance || 0}m
                          </Text>
                        </View>
                        <IconSymbol name="checkmark.circle.fill" size={24} color={colors.success} />
                      </View>
                    </GlassCard>
                  );
                })}
              </>
            )}

            {/* GPS Info */}
            <GlassCard className="mt-4 border-primary/30">
              <View className="flex-row items-start">
                <IconSymbol name="location.fill" size={20} color={colors.primary} />
                <View className="flex-1 ml-3">
                  <Text className="text-foreground font-medium text-sm">GPS-Tracking</Text>
                  <Text className="text-muted text-xs mt-1">
                    Während des Spaziergangs wird deine Route aufgezeichnet und in der History gespeichert.
                  </Text>
                </View>
              </View>
            </GlassCard>
          </>
        )}
      </ScrollView>
    </View>
  );
}
