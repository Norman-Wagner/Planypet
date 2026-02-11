
import { useState } from "react";
import { ScrollView, Text, View, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { PetAvatar } from "@/components/ui/pet-avatar";
import { usePetStore } from "@/lib/pet-store";

export default function GPSHistoryScreen() {
  const insets = useSafeAreaInsets();
  const { pets, walks } = usePetStore();

  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<"week" | "month" | "all">("week");

  const dogs = pets.filter((p) => p.type === "dog");

  const filteredWalks = walks
    .filter((w) => {
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
    })
    .sort(
      (a, b) =>
        new Date(b.completedAt || "").getTime() - new Date(a.completedAt || "").getTime()
    );

  const totalDistance = filteredWalks.reduce(
    (sum, w) => sum + (w.route?.distance || 0),
    0
  );
  const totalDuration = filteredWalks.reduce(
    (sum, w) => sum + (w.route?.duration || 0),
    0
  );
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
      month: "short",
    });
  };

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
            onPress={() => router.back()}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <IconSymbol name="chevron.left" size={28} color="#D4A843" />
          </Pressable>
          <View style={{ marginLeft: 16 }}>
            <Text style={styles.headerTitle}>GPS HISTORY</Text>
            <Text style={styles.headerSubtitle}>Alle Spaziergänge im Überblick</Text>
          </View>
        </View>
        <View style={styles.headerDivider} />

        {/* Stats Overview */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{filteredWalks.length}</Text>
            <Text style={styles.statLabel}>Spaziergänge</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {(totalDistance / 1000).toFixed(1)}
            </Text>
            <Text style={styles.statLabel}>km gesamt</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{formatTime(totalDuration)}</Text>
            <Text style={styles.statLabel}>Gesamtzeit</Text>
          </View>
        </View>

        {/* Pet Filter */}
        {dogs.length > 1 && (
          <View style={{ marginBottom: 24 }}>
            <Text style={styles.sectionTitle}>Nach Hund filtern</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, marginTop: 8 }}
            >
              <Pressable
                onPress={() => setSelectedPetId(null)}
                style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
              >
                <View
                  style={[
                    styles.filterChip,
                    !selectedPetId && styles.activeFilterChip,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      !selectedPetId && styles.activeFilterChipText,
                    ]}
                  >
                    Alle
                  </Text>
                </View>
              </Pressable>
              {dogs.map((dog) => (
                <Pressable
                  key={dog.id}
                  onPress={() => setSelectedPetId(dog.id)}
                  style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
                >
                  <View
                    style={[
                      styles.filterChip,
                      selectedPetId === dog.id && styles.activeFilterChip,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        selectedPetId === dog.id &&
                          styles.activeFilterChipText,
                      ]}
                    >
                      {dog.name}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Time Filter */}
        <View style={{ marginBottom: 24 }}>
          <Text style={styles.sectionTitle}>Zeitraum</Text>
          <View style={styles.timeFilterContainer}>
            {[
              { key: "week", label: "Woche" },
              { key: "month", label: "Monat" },
              { key: "all", label: "Alle" },
            ].map(({ key, label }) => (
              <Pressable
                key={key}
                onPress={() => setTimeFilter(key as typeof timeFilter)}
                style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1, flex: 1 })}
              >
                <View
                  style={[
                    styles.filterChip,
                    timeFilter === key && styles.activeFilterChip,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      timeFilter === key && styles.activeFilterChipText,
                    ]}
                  >
                    {label}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Walk History */}
        <Text style={styles.sectionTitle}>Verlauf</Text>

        {filteredWalks.length === 0 ? (
          <View style={[styles.card, styles.emptyStateCard]}>
            <IconSymbol name="map.fill" size={48} color="#6B6B6B" />
            <Text style={styles.emptyStateText}>Keine Spaziergänge</Text>
            <Text style={styles.emptyStateSubText}>
              Starte einen Spaziergang, um deine Routen hier zu sehen
            </Text>
          </View>
        ) : (
          filteredWalks.map((walk) => {
            const pet = pets.find((p) => p.id === walk.petId);
            return (
              <Pressable
                key={walk.id}
                style={({ pressed }) => ({ 
                  opacity: pressed ? 0.9 : 1, 
                  transform: [{ scale: pressed ? 0.99 : 1 }],
                  marginTop: 12,
                })}
              >
                <View style={styles.card}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {pet && <PetAvatar name={pet.name} type={pet.type} size="md" />}
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.primaryText}>{pet?.name}</Text>
                      <Text style={styles.secondaryText}>
                        {formatDate(walk.completedAt || "")}
                      </Text>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                      <Text style={styles.primaryText}>
                        {walk.route?.distance || 0}m
                      </Text>
                      <Text style={styles.secondaryText}>
                        {formatTime(walk.route?.duration || 0)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.mapPlaceholder}>
                    <IconSymbol name="map.fill" size={32} color="#6B6B6B" />
                    <Text style={styles.mapPlaceholderText}>Route anzeigen</Text>
                  </View>
                </View>
              </Pressable>
            );
          })
        )}

        {/* Average Stats */}
        {filteredWalks.length > 0 && (
          <View style={[styles.card, { marginTop: 24 }]}>
            <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>Durchschnitt</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
              <View style={{ alignItems: "center" }}>
                <Text style={styles.avgStatValue}>{Math.round(avgDistance)}m</Text>
                <Text style={styles.statLabel}>pro Spaziergang</Text>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={styles.avgStatValue}>
                  {formatTime(Math.round(totalDuration / filteredWalks.length))}
                </Text>
                <Text style={styles.statLabel}>Durchschnittsdauer</Text>
              </View>
            </View>
          </View>
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
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: {
    color: "#FAFAF8",
    fontSize: 24,
    fontWeight: "300",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  headerSubtitle: {
    color: "#6B6B6B",
    fontSize: 14,
    marginTop: 2,
  },
  headerDivider: {
    width: 40,
    height: 1,
    backgroundColor: "#D4A843",
    marginBottom: 24,
    marginLeft: 16 + 28, // Icon size + margin
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    backgroundColor: "#141418",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(212,168,67,0.08)",
  },
  statValue: {
    color: "#FAFAF8",
    fontSize: 22,
    fontWeight: "600",
  },
  statLabel: {
    color: "#8B8B80",
    fontSize: 11,
    marginTop: 4,
    textTransform: "uppercase",
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: "#D4A843",
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  timeFilterContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  filterChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#141418",
    borderWidth: 1,
    borderColor: "rgba(212,168,67,0.08)",
    alignItems: 'center',
  },
  activeFilterChip: {
    backgroundColor: "#D4A843",
    borderColor: "#D4A843",
  },
  filterChipText: {
    color: "#FAFAF8",
    fontWeight: "500",
  },
  activeFilterChipText: {
    color: "#0A0A0F",
  },
  card: {
    backgroundColor: "#141418",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(212,168,67,0.08)",
  },
  emptyStateCard: {
    alignItems: "center",
    paddingVertical: 32,
    marginTop: 12,
  },
  emptyStateText: {
    color: "#FAFAF8",
    fontWeight: "600",
    fontSize: 16,
    marginTop: 12,
  },
  emptyStateSubText: {
    color: "#8B8B80",
    fontSize: 14,
    textAlign: "center",
    marginTop: 4,
  },
  primaryText: {
    color: "#FAFAF8",
    fontWeight: "600",
    fontSize: 16,
  },
  secondaryText: {
    color: "#8B8B80",
    fontSize: 13,
    marginTop: 2,
  },
  mapPlaceholder: {
    marginTop: 12,
    height: 100,
    borderRadius: 12,
    backgroundColor: "rgba(10,10,15,0.5)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(212,168,67,0.05)",
  },
  mapPlaceholderText: {
    color: "#6B6B6B",
    fontSize: 12,
    marginTop: 4,
  },
  avgStatValue: {
    color: "#D4A843",
    fontSize: 20,
    fontWeight: "700",
  },
});
