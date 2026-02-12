import { useState, useEffect, useRef, useCallback } from "react";
import { ScrollView, Text, View, Pressable, StyleSheet, Platform, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import * as Location from "expo-location";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { PetAvatar } from "@/components/ui/pet-avatar";
import { usePetStore, type Pet } from "@/lib/pet-store";
import { useConsent } from "@/lib/consent-store";

interface GpsPoint {
  lat: number;
  lng: number;
  timestamp: number;
}

export default function WalkScreen() {
  const insets = useSafeAreaInsets();
  const { pets, walks, addWalk } = usePetStore();
  const { locationTracking } = useConsent();

  const [isWalking, setIsWalking] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [walkTime, setWalkTime] = useState(0);
  const [walkDistance, setWalkDistance] = useState(0);
  const [gpsPoints, setGpsPoints] = useState<GpsPoint[]>([]);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const locationSubRef = useRef<Location.LocationSubscription | null>(null);

  const dogs = pets.filter((p) => p.type === "dog");
  const allPets = pets; // Allow walking any pet

  useEffect(() => {
    if (isWalking) {
      timerRef.current = setInterval(() => {
        setWalkTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isWalking]);

  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth radius in meters
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(deltaPhi / 2) ** 2 + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, []);

  const startLocationTracking = useCallback(async () => {
    if (Platform.OS === "web") {
      // Web fallback: simulate GPS
      return;
    }

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Standort-Berechtigung", "Bitte erlaube den Standortzugriff fuer GPS-Tracking.");
        return;
      }
      setHasLocationPermission(true);

      const sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 3000,
          distanceInterval: 5,
        },
        (location) => {
          const newPoint: GpsPoint = {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
            timestamp: location.timestamp,
          };

          setGpsPoints((prev) => {
            if (prev.length > 0) {
              const lastPoint = prev[prev.length - 1];
              const dist = calculateDistance(lastPoint.lat, lastPoint.lng, newPoint.lat, newPoint.lng);
              if (dist > 2) { // Only add if moved more than 2m
                setWalkDistance((d) => d + dist);
              }
            }
            return [...prev, newPoint];
          });

          if (location.coords.speed && location.coords.speed > 0) {
            setCurrentSpeed(location.coords.speed * 3.6); // m/s to km/h
          }
        }
      );
      locationSubRef.current = sub;
    } catch (e) {
      console.error("Location tracking error:", e);
    }
  }, [calculateDistance]);

  const stopLocationTracking = useCallback(() => {
    if (locationSubRef.current) {
      locationSubRef.current.remove();
      locationSubRef.current = null;
    }
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartWalk = async (pet: Pet) => {
    if (!locationTracking) {
      Alert.alert(
        "Einwilligung erforderlich",
        "Bitte aktiviere den Standortzugriff im Datenschutz-Center, um GPS-Tracking zu nutzen.",
        [
          { text: "Ohne GPS starten", onPress: () => startWalkWithoutGps(pet) },
          { text: "Zu Einstellungen", onPress: () => router.push("/privacy-center") },
        ]
      );
      return;
    }

    setSelectedPet(pet);
    setIsWalking(true);
    setWalkTime(0);
    setWalkDistance(0);
    setGpsPoints([]);
    setCurrentSpeed(0);
    await startLocationTracking();

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const startWalkWithoutGps = (pet: Pet) => {
    setSelectedPet(pet);
    setIsWalking(true);
    setWalkTime(0);
    setWalkDistance(0);
    setGpsPoints([]);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleEndWalk = () => {
    if (!selectedPet) return;

    stopLocationTracking();

    addWalk({
      petId: selectedPet.id,
      scheduledTime: new Date().toISOString(),
      duration: walkTime,
      completed: true,
      completedAt: new Date().toISOString(),
      route: {
        coordinates: gpsPoints.map((p) => ({ lat: p.lat, lng: p.lng })),
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

  const todayTotalDistance = todayWalks.reduce((sum, w) => sum + (w.route?.distance || 0), 0);
  const todayTotalDuration = todayWalks.reduce((sum, w) => sum + (w.route?.duration || 0), 0);

  return (
    <View style={st.container}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 40,
          paddingHorizontal: 20,
        }}
      >
        {/* Header */}
        <View style={st.headerRow}>
          <Pressable
            onPress={() => {
              if (isWalking) handleEndWalk();
              router.back();
            }}
            style={({ pressed }) => [st.backBtn, pressed && { opacity: 0.6 }]}
          >
            <IconSymbol name="chevron.left" size={20} color="#D4A843" />
          </Pressable>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={st.headerTitle}>{isWalking ? "Gassi laeuft..." : "Gassi gehen"}</Text>
            <Text style={st.headerSub}>{isWalking ? `Mit ${selectedPet?.name}` : "Spaziergaenge planen & tracken"}</Text>
            <View style={st.goldDivider} />
          </View>
        </View>

        {/* Active Walk */}
        {isWalking && selectedPet && (
          <View style={st.activeCard}>
            <PetAvatar name={selectedPet.name} type={selectedPet.type} size="xl" />
            <Text style={st.activePetName}>{selectedPet.name}</Text>

            {/* Live Stats */}
            <View style={st.liveStats}>
              <View style={st.liveStat}>
                <Text style={st.liveStatValue}>{formatTime(walkTime)}</Text>
                <Text style={st.liveStatLabel}>Dauer</Text>
              </View>
              <View style={st.liveStatDivider} />
              <View style={st.liveStat}>
                <Text style={st.liveStatValue}>
                  {walkDistance >= 1000 ? `${(walkDistance / 1000).toFixed(2)}` : Math.round(walkDistance).toString()}
                </Text>
                <Text style={st.liveStatLabel}>{walkDistance >= 1000 ? "km" : "Meter"}</Text>
              </View>
              <View style={st.liveStatDivider} />
              <View style={st.liveStat}>
                <Text style={st.liveStatValue}>{currentSpeed.toFixed(1)}</Text>
                <Text style={st.liveStatLabel}>km/h</Text>
              </View>
            </View>

            {/* GPS Status */}
            <View style={st.gpsStatus}>
              <View style={[st.gpsDot, gpsPoints.length > 0 && st.gpsDotActive]} />
              <Text style={st.gpsText}>
                {gpsPoints.length > 0 ? `GPS aktiv (${gpsPoints.length} Punkte)` : "GPS wird gesucht..."}
              </Text>
            </View>

            {/* End Walk Button */}
            <Pressable
              onPress={handleEndWalk}
              style={({ pressed }) => [st.endBtn, pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }]}
            >
              <Text style={st.endBtnText}>Gassi beenden</Text>
            </Pressable>
          </View>
        )}

        {/* Pet Selection */}
        {!isWalking && (
          <>
            <Text style={st.sectionTitle}>Gassi starten</Text>

            {allPets.length === 0 ? (
              <View style={st.emptyCard}>
                <IconSymbol name="pawprint.fill" size={32} color="#2A2A30" />
                <Text style={st.emptyText}>Keine Tiere</Text>
                <Text style={st.emptySub}>Fuege ein Tier hinzu, um Gassi-Runden zu tracken</Text>
              </View>
            ) : (
              <View style={{ gap: 10, marginBottom: 24 }}>
                {allPets.map((pet) => (
                  <Pressable
                    key={pet.id}
                    onPress={() => handleStartWalk(pet)}
                    style={({ pressed }) => [st.petCard, pressed && { opacity: 0.8, transform: [{ scale: 0.99 }] }]}
                  >
                    <PetAvatar name={pet.name} type={pet.type} size="lg" />
                    <View style={{ flex: 1, marginLeft: 14 }}>
                      <Text style={st.petName}>{pet.name}</Text>
                      <Text style={st.petBreed}>{pet.breed || pet.type}</Text>
                    </View>
                    <View style={st.startBtn}>
                      <IconSymbol name="figure.walk" size={14} color="#0A0A0F" />
                      <Text style={st.startBtnText}>Starten</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            )}

            {/* Today's Summary */}
            {todayWalks.length > 0 && (
              <>
                <Text style={st.sectionTitle}>Heute ({todayWalks.length} Spaziergaenge)</Text>
                <View style={st.todaySummary}>
                  <View style={st.todayStat}>
                    <Text style={st.todayStatValue}>{(todayTotalDistance / 1000).toFixed(1)}</Text>
                    <Text style={st.todayStatLabel}>km</Text>
                  </View>
                  <View style={st.todayStat}>
                    <Text style={st.todayStatValue}>{Math.round(todayTotalDuration / 60)}</Text>
                    <Text style={st.todayStatLabel}>min</Text>
                  </View>
                  <View style={st.todayStat}>
                    <Text style={st.todayStatValue}>{todayWalks.length}</Text>
                    <Text style={st.todayStatLabel}>Runden</Text>
                  </View>
                </View>

                <View style={{ gap: 8 }}>
                  {todayWalks.map((walk) => {
                    const pet = pets.find((p) => p.id === walk.petId);
                    return (
                      <View key={walk.id} style={st.historyCard}>
                        {pet && <PetAvatar name={pet.name} type={pet.type} size="md" />}
                        <View style={{ flex: 1, marginLeft: 12 }}>
                          <Text style={st.historyPetName}>{pet?.name}</Text>
                          <Text style={st.historyStats}>
                            {formatTime(walk.route?.duration || 0)} | {walk.route?.distance || 0}m
                          </Text>
                        </View>
                        <IconSymbol name="checkmark.circle.fill" size={20} color="#66BB6A" />
                      </View>
                    );
                  })}
                </View>
              </>
            )}

            {/* GPS History Link */}
            <Pressable
              onPress={() => router.push("/gps-history")}
              style={({ pressed }) => [st.historyLink, pressed && { opacity: 0.7 }]}
            >
              <IconSymbol name="map.fill" size={18} color="#D4A843" />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={st.historyLinkTitle}>GPS-Verlauf</Text>
                <Text style={st.historyLinkSub}>Alle Spaziergaenge und Statistiken</Text>
              </View>
              <IconSymbol name="chevron.right" size={16} color="#4A4A4A" />
            </Pressable>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0F" },

  headerRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 28 },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "rgba(212,168,67,0.1)",
    alignItems: "center", justifyContent: "center",
  },
  headerTitle: { fontSize: 24, fontWeight: "300", color: "#FAFAF8", letterSpacing: 2 },
  headerSub: { fontSize: 13, fontWeight: "400", color: "#6B6B6B", marginTop: 4 },
  goldDivider: { width: 40, height: 1, backgroundColor: "#D4A843", marginTop: 12 },

  sectionTitle: {
    fontSize: 11, fontWeight: "600", color: "#D4A843",
    letterSpacing: 3, textTransform: "uppercase", marginBottom: 14,
  },

  // Active Walk
  activeCard: {
    backgroundColor: "#141418", borderWidth: 1,
    borderColor: "rgba(212,168,67,0.1)", padding: 24, alignItems: "center",
  },
  activePetName: { fontSize: 22, fontWeight: "300", color: "#FAFAF8", letterSpacing: 1, marginTop: 14 },

  liveStats: {
    flexDirection: "row", alignItems: "center", marginTop: 24, marginBottom: 20,
    backgroundColor: "#0A0A0F", padding: 16, width: "100%",
    borderWidth: 1, borderColor: "rgba(212,168,67,0.05)",
  },
  liveStat: { flex: 1, alignItems: "center" },
  liveStatValue: { fontSize: 28, fontWeight: "300", color: "#FAFAF8", letterSpacing: 1 },
  liveStatLabel: { fontSize: 10, fontWeight: "600", color: "#6B6B6B", letterSpacing: 2, textTransform: "uppercase", marginTop: 4 },
  liveStatDivider: { width: 1, height: 40, backgroundColor: "rgba(212,168,67,0.1)" },

  gpsStatus: {
    flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 20,
  },
  gpsDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#4A4A4A" },
  gpsDotActive: { backgroundColor: "#66BB6A" },
  gpsText: { fontSize: 11, fontWeight: "400", color: "#6B6B6B", letterSpacing: 0.5 },

  endBtn: {
    backgroundColor: "#D4A843", paddingVertical: 16, width: "100%", alignItems: "center",
  },
  endBtnText: { fontSize: 14, fontWeight: "700", color: "#0A0A0F", letterSpacing: 2, textTransform: "uppercase" },

  // Pet Selection
  emptyCard: {
    backgroundColor: "#141418", padding: 32, alignItems: "center",
    borderWidth: 1, borderColor: "rgba(212,168,67,0.08)", marginBottom: 24,
  },
  emptyText: { fontSize: 16, fontWeight: "300", color: "#6B6B6B", marginTop: 12 },
  emptySub: { fontSize: 12, fontWeight: "400", color: "#4A4A4A", textAlign: "center", marginTop: 4 },

  petCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#141418", borderWidth: 1,
    borderColor: "rgba(212,168,67,0.08)", padding: 14,
  },
  petName: { fontSize: 16, fontWeight: "500", color: "#FAFAF8", letterSpacing: 0.3 },
  petBreed: { fontSize: 12, fontWeight: "400", color: "#6B6B6B", marginTop: 2 },

  startBtn: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "#D4A843", paddingHorizontal: 14, paddingVertical: 8,
  },
  startBtnText: { fontSize: 12, fontWeight: "700", color: "#0A0A0F" },

  // Today Summary
  todaySummary: {
    flexDirection: "row", marginBottom: 16,
    backgroundColor: "#141418", borderWidth: 1,
    borderColor: "rgba(212,168,67,0.08)", padding: 16,
  },
  todayStat: { flex: 1, alignItems: "center" },
  todayStatValue: { fontSize: 24, fontWeight: "300", color: "#D4A843", letterSpacing: 1 },
  todayStatLabel: { fontSize: 10, fontWeight: "600", color: "#6B6B6B", letterSpacing: 2, textTransform: "uppercase", marginTop: 2 },

  // History
  historyCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#141418", borderWidth: 1,
    borderColor: "rgba(212,168,67,0.08)", padding: 14,
  },
  historyPetName: { fontSize: 14, fontWeight: "500", color: "#FAFAF8" },
  historyStats: { fontSize: 11, fontWeight: "400", color: "#6B6B6B", marginTop: 2 },

  historyLink: {
    flexDirection: "row", alignItems: "center", marginTop: 24,
    backgroundColor: "#141418", borderWidth: 1,
    borderColor: "rgba(212,168,67,0.08)", padding: 16,
  },
  historyLinkTitle: { fontSize: 14, fontWeight: "500", color: "#FAFAF8", letterSpacing: 0.3 },
  historyLinkSub: { fontSize: 11, fontWeight: "400", color: "#6B6B6B", marginTop: 2 },
});
