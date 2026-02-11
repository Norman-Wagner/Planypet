
import { useState, useEffect, useRef } from "react";
import { ScrollView, Text, View, Pressable, StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { PetAvatar } from "@/components/ui/pet-avatar";
import { usePetStore, Pet } from "@/lib/pet-store";

export default function WalkScreen() {
  const insets = useSafeAreaInsets();
  const { pets, walks, addWalk } = usePetStore();

  const [isWalking, setIsWalking] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [walkTime, setWalkTime] = useState(0);
  const [walkDistance, setWalkDistance] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const dogs = pets.filter((p) => p.type === "dog");

  useEffect(() => {
    if (isWalking) {
      timerRef.current = setInterval(() => {
        setWalkTime((prev) => prev + 1);
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
        coordinates: [],
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
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 40,
          paddingHorizontal: 20,
        }}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <Pressable
            onPress={() => {
              if (isWalking) {
                handleEndWalk();
              }
              router.back();
            }}
            style={({ pressed }) => [styles.backButton, { opacity: pressed ? 0.7 : 1 }]}
          >
            <IconSymbol name="chevron.left" size={22} color="#D4A843" />
          </Pressable>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>
              {isWalking ? "Gassi läuft..." : "Gassi gehen"}
            </Text>
            <Text style={styles.headerSubtitle}>
              {isWalking ? `Mit ${selectedPet?.name}` : "Spaziergänge planen & tracken"}
            </Text>
            <View style={styles.headerDivider} />
          </View>
        </View>

        {/* Active Walk Display */}
        {isWalking && selectedPet && (
          <View style={[styles.card, { padding: 24, alignItems: 'center' }]}>
            <PetAvatar name={selectedPet.name} type={selectedPet.type} size="xl" />
            <Text style={styles.activeWalkPetName}>{selectedPet.name}</Text>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{formatTime(walkTime)}</Text>
                <Text style={styles.statLabel}>Dauer</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{Math.round(walkDistance)}</Text>
                <Text style={styles.statLabel}>Meter</Text>
              </View>
            </View>

            <Pressable
              onPress={handleEndWalk}
              style={({ pressed }) => [styles.endWalkButton, { opacity: pressed ? 0.8 : 1 }]}
            >
              <Text style={styles.endWalkButtonText}>Gassi beenden</Text>
            </Pressable>
          </View>
        )}

        {/* Dog Selection (when not walking) */}
        {!isWalking && (
          <>
            <Text style={styles.sectionTitle}>Gassi starten</Text>

            {dogs.length === 0 ? (
              <View style={[styles.card, styles.emptyStateCard]}>
                <IconSymbol name="pawprint.fill" size={32} color="#6B6B6B" />
                <Text style={styles.emptyStateText}>Keine Hunde</Text>
                <Text style={styles.emptyStateSubtext}>
                  Füge einen Hund hinzu, um Gassi-Runden zu tracken
                </Text>
              </View>
            ) : (
              <View style={{ gap: 12, marginBottom: 24 }}>
                {dogs.map((dog) => (
                  <Pressable
                    key={dog.id}
                    onPress={() => handleStartWalk(dog)}
                    style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
                  >
                    <View style={[styles.card, styles.dogCard]}>
                      <PetAvatar name={dog.name} type={dog.type} size="lg" />
                      <View style={styles.dogInfoContainer}>
                        <Text style={styles.dogName}>{dog.name}</Text>
                        <Text style={styles.dogBreed}>{dog.breed || "Hund"}</Text>
                      </View>
                      <View style={styles.startButton}>
                        <IconSymbol name="figure.walk" size={16} color="#0A0A0F" />
                        <Text style={styles.startButtonText}>Starten</Text>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            )}

            {/* Today's Walks */}
            {todayWalks.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Heute ({todayWalks.length})</Text>
                <View style={{ gap: 12 }}>
                  {todayWalks.map((walk) => {
                    const pet = pets.find((p) => p.id === walk.petId);
                    return (
                      <View key={walk.id} style={[styles.card, styles.walkHistoryCard]}>
                        {pet && <PetAvatar name={pet.name} type={pet.type} size="md" />}
                        <View style={styles.walkHistoryInfo}>
                          <Text style={styles.walkHistoryPetName}>{pet?.name}</Text>
                          <Text style={styles.walkHistoryStats}>
                            {formatTime(walk.route?.duration || 0)} • {walk.route?.distance || 0}m
                          </Text>
                        </View>
                        <IconSymbol name="checkmark.circle.fill" size={24} color="#D4A843" />
                      </View>
                    );
                  })}
                </View>
              </>
            )}

            {/* GPS Info */}
            <View style={[styles.card, { marginTop: 24, flexDirection: 'row', alignItems: 'flex-start' }]}>
              <IconSymbol name="location.fill" size={18} color="#D4A843" style={{ marginTop: 2 }} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.gpsInfoTitle}>GPS-Tracking</Text>
                <Text style={styles.gpsInfoText}>
                  Während des Spaziergangs wird deine Route aufgezeichnet und in der History gespeichert.
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0F",
  },
  // Header
  headerContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 32,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(212,168,67,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
    paddingTop: 5,
  },
  headerTitle: {
    color: "#FAFAF8",
    fontSize: 24,
    fontWeight: "300",
    letterSpacing: 2,
  },
  headerSubtitle: {
    color: "#6B6B6B",
    fontSize: 15,
    marginTop: 4,
  },
  headerDivider: {
    width: 40,
    height: 1,
    backgroundColor: "#D4A843",
    marginTop: 12,
  },
  // Card
  card: {
    backgroundColor: "#141418",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(212,168,67,0.08)",
    padding: 16,
  },
  // Active Walk
  activeWalkPetName: {
    color: "#FAFAF8",
    fontSize: 22,
    fontWeight: "500",
    marginTop: 16,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 32,
    marginTop: 24,
    marginBottom: 32,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    color: "#FAFAF8",
    fontSize: 36,
    fontWeight: "600",
  },
  statLabel: {
    color: "#8B8B80",
    fontSize: 12,
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  endWalkButton: {
    backgroundColor: "#D4A843",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    width: '100%'
  },
  endWalkButtonText: {
    color: "#0A0A0F",
    fontSize: 16,
    fontWeight: "700",
  },
  // Section
  sectionTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: "#D4A843",
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 16,
    paddingLeft: 4,
  },
  // Empty State
  emptyStateCard: {
    alignItems: "center",
    paddingVertical: 32,
    marginBottom: 24,
  },
  emptyStateText: {
    color: "#FAFAF8",
    fontSize: 16,
    fontWeight: "500",
    marginTop: 12,
  },
  emptyStateSubtext: {
    color: "#8B8B80",
    fontSize: 14,
    textAlign: "center",
    marginTop: 4,
  },
  // Dog List
  dogCard: {
    flexDirection: "row",
    alignItems: "center",
  },
  dogInfoContainer: {
    flex: 1,
    marginLeft: 16,
  },
  dogName: {
    color: "#FAFAF8",
    fontSize: 18,
    fontWeight: "600",
  },
  dogBreed: {
    color: "#8B8B80",
    fontSize: 14,
    marginTop: 2,
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D4A843",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  startButtonText: {
    color: "#0A0A0F",
    fontWeight: "700",
    marginLeft: 6,
    fontSize: 14,
  },
  // Walk History
  walkHistoryCard: {
    flexDirection: "row",
    alignItems: "center",
  },
  walkHistoryInfo: {
    flex: 1,
    marginLeft: 12,
  },
  walkHistoryPetName: {
    color: "#FAFAF8",
    fontWeight: "500",
    fontSize: 16,
  },
  walkHistoryStats: {
    color: "#8B8B80",
    fontSize: 13,
    marginTop: 2,
  },
  // GPS Info
  gpsInfoTitle: {
    color: "#FAFAF8",
    fontWeight: "500",
    fontSize: 14,
  },
  gpsInfoText: {
    color: "#8B8B80",
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18,
  },
});
