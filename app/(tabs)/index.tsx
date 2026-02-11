import { ScrollView, Text, View, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useEffect, useState } from "react";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { usePetStore } from "@/lib/pet-store";

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { userName, pets, feedings, walks, onboardingComplete, loadData } = usePetStore();
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [isLoadingTip, setIsLoadingTip] = useState(false);

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    if (!onboardingComplete && pets.length === 0) {
      const timer = setTimeout(() => router.push("/onboarding"), 100);
      return () => clearTimeout(timer);
    }
  }, [onboardingComplete, pets.length]);

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Guten Morgen" : currentHour < 18 ? "Guten Tag" : "Guten Abend";
  const displayName = userName || "Tierfreund";

  useEffect(() => {
    if (pets.length > 0) {
      setIsLoadingTip(true);
      const timer = setTimeout(() => {
        const pet = pets[0];
        const tips = [
          `${pet.name} sollte heute frisches Wasser bekommen.`,
          `Denke an die naechste Impfung fuer ${pet.name}.`,
          `${pet.name} braucht regelmaessige Bewegung fuer ein gesundes Leben.`,
          `Vorrat pruefen: Ist noch genug Futter fuer ${pet.name} da?`,
        ];
        setAiTip(tips[Math.floor(Math.random() * tips.length)]);
        setIsLoadingTip(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [pets.length]);

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0F" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 100,
          paddingHorizontal: 20,
        }}
      >
        {/* Header */}
        <View style={s.header}>
          <Text style={s.greeting}>{greeting},</Text>
          <Text style={s.userName}>{displayName}</Text>
          <View style={s.goldDivider} />
        </View>

        {/* Stats Row */}
        <View style={s.statsRow}>
          <View style={s.statCard}>
            <Text style={s.statNumber}>{pets.length}</Text>
            <Text style={s.statLabel}>Tiere</Text>
          </View>
          <View style={[s.statCard, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: "rgba(212,168,67,0.1)" }]}>
            <Text style={s.statNumber}>{feedings.filter((f) => !f.completed).length}</Text>
            <Text style={s.statLabel}>Offen</Text>
          </View>
          <View style={s.statCard}>
            <Text style={s.statNumber}>{walks.filter((w) => !w.completed).length}</Text>
            <Text style={s.statLabel}>Gassi</Text>
          </View>
        </View>

        {/* KI-Assistent - PROMINENT */}
        <Pressable
          style={({ pressed }) => [s.aiCard, pressed && { opacity: 0.9 }]}
        >
          <LinearGradient
            colors={["rgba(212,168,67,0.12)", "rgba(212,168,67,0.04)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={s.aiCardGradient}
          >
            <View style={s.aiIconContainer}>
              <LinearGradient
                colors={["#D4A843", "#B8860B"]}
                style={s.aiIconGradient}
              >
                <IconSymbol name="crown.fill" size={20} color="#0A0A0F" />
              </LinearGradient>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.aiTitle}>KI-Assistent</Text>
              {isLoadingTip ? (
                <ActivityIndicator color="#D4A843" size="small" style={{ alignSelf: "flex-start", marginTop: 4 }} />
              ) : (
                <Text style={s.aiText}>{aiTip || "Bereit, dir zu helfen."}</Text>
              )}
            </View>
            <IconSymbol name="chevron.right" size={16} color="#D4A843" />
          </LinearGradient>
        </Pressable>

        {/* Meine Tiere */}
        {pets.length > 0 && (
          <>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>Meine Tiere</Text>
              <Pressable
                onPress={() => router.push("/(tabs)/pets")}
                style={({ pressed }) => [pressed && { opacity: 0.6 }]}
              >
                <Text style={s.sectionLink}>Alle</Text>
              </Pressable>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12, paddingRight: 20 }}
              style={{ marginBottom: 32 }}
            >
              {pets.slice(0, 5).map((pet) => (
                <Pressable
                  key={pet.id}
                  onPress={() => router.push({ pathname: "/pet-detail", params: { petId: pet.id } })}
                  style={({ pressed }) => [s.petCard, pressed && { transform: [{ scale: 0.97 }] }]}
                >
                  <View style={s.petCardAvatar}>
                    <Text style={s.petCardInitial}>{pet.name.charAt(0).toUpperCase()}</Text>
                  </View>
                  <Text style={s.petCardName} numberOfLines={1}>{pet.name}</Text>
                  <Text style={s.petCardType} numberOfLines={1}>{pet.type}</Text>
                </Pressable>
              ))}

              {/* Add Pet */}
              <Pressable
                onPress={() => router.push("/onboarding")}
                style={({ pressed }) => [s.petCardAdd, pressed && { opacity: 0.7 }]}
              >
                <IconSymbol name="plus.circle.fill" size={28} color="#D4A843" />
                <Text style={s.petCardAddText}>Hinzufuegen</Text>
              </Pressable>
            </ScrollView>
          </>
        )}

        {/* Aktionen */}
        <Text style={s.sectionTitle}>Aktionen</Text>
        <View style={{ gap: 12, marginTop: 16 }}>
          {pets.length === 0 ? (
            <Pressable
              onPress={() => router.push("/onboarding")}
              style={({ pressed }) => [s.actionCard, pressed && { transform: [{ scale: 0.98 }] }]}
            >
              <View style={[s.actionIcon, { backgroundColor: "rgba(212,168,67,0.1)" }]}>
                <IconSymbol name="plus.circle.fill" size={24} color="#D4A843" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.actionTitle}>Erstes Tier registrieren</Text>
                <Text style={s.actionSubtitle}>Beginne mit deinem Liebling</Text>
              </View>
              <IconSymbol name="chevron.right" size={16} color="#6B6B6B" />
            </Pressable>
          ) : (
            <>
              {/* Fuettern */}
              <Pressable style={({ pressed }) => [s.actionCard, pressed && { transform: [{ scale: 0.98 }] }]}>
                <View style={[s.actionIcon, { backgroundColor: "rgba(212,168,67,0.1)" }]}>
                  <IconSymbol name="fork.knife" size={22} color="#D4A843" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.actionTitle}>{pets[0]?.name} fuettern</Text>
                  <Text style={s.actionSubtitle}>Naechste Mahlzeit faellig</Text>
                </View>
                <View style={s.actionBadge}>
                  <Text style={s.actionBadgeText}>Erledigt</Text>
                </View>
              </Pressable>

              {/* Gassi */}
              {pets.some((p) => p.type === "dog") && (
                <Pressable style={({ pressed }) => [s.actionCard, pressed && { transform: [{ scale: 0.98 }] }]}>
                  <View style={[s.actionIcon, { backgroundColor: "rgba(102,187,106,0.1)" }]}>
                    <IconSymbol name="figure.walk" size={22} color="#66BB6A" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.actionTitle}>{pets.find((p) => p.type === "dog")?.name} Gassi</Text>
                    <Text style={s.actionSubtitle}>45 Min geplant</Text>
                  </View>
                  <View style={[s.actionBadge, { backgroundColor: "rgba(102,187,106,0.1)" }]}>
                    <Text style={[s.actionBadgeText, { color: "#66BB6A" }]}>Starten</Text>
                  </View>
                </Pressable>
              )}

              {/* Vorrat */}
              <Pressable style={({ pressed }) => [s.actionCard, pressed && { transform: [{ scale: 0.98 }] }]}>
                <View style={[s.actionIcon, { backgroundColor: "rgba(255,183,77,0.1)" }]}>
                  <IconSymbol name="exclamationmark.triangle.fill" size={22} color="#FFB74D" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.actionTitle}>Vorrat niedrig</Text>
                  <Text style={s.actionSubtitle}>Premium Futter -- Noch 2 kg</Text>
                </View>
                <View style={[s.actionBadge, { backgroundColor: "rgba(255,183,77,0.1)" }]}>
                  <Text style={[s.actionBadgeText, { color: "#FFB74D" }]}>Bestellen</Text>
                </View>
              </Pressable>
            </>
          )}
        </View>

        {/* Notfall */}
        <Pressable
          onPress={() => router.push("/emergency")}
          style={({ pressed }) => [s.emergencyCard, pressed && { transform: [{ scale: 0.98 }] }]}
        >
          <View style={s.emergencyIcon}>
            <IconSymbol name="exclamationmark.triangle.fill" size={22} color="#EF5350" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.emergencyTitle}>Notfall-Hilfe</Text>
            <Text style={s.emergencySubtitle}>Tier vermisst oder medizinischer Notfall</Text>
          </View>
          <IconSymbol name="chevron.right" size={16} color="#EF5350" />
        </Pressable>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  header: { marginBottom: 32 },
  greeting: { fontSize: 15, fontWeight: "400", color: "#8B8B80", letterSpacing: 1 },
  userName: { fontSize: 32, fontWeight: "300", color: "#FAFAF8", letterSpacing: 3, marginTop: 4 },
  goldDivider: { width: 40, height: 1, backgroundColor: "#D4A843", marginTop: 16 },

  statsRow: {
    flexDirection: "row",
    backgroundColor: "#141418",
    borderWidth: 1,
    borderColor: "rgba(212,168,67,0.1)",
    marginBottom: 24,
  },
  statCard: { flex: 1, alignItems: "center", paddingVertical: 20 },
  statNumber: { fontSize: 28, fontWeight: "300", color: "#D4A843", letterSpacing: 1 },
  statLabel: { fontSize: 11, fontWeight: "500", color: "#6B6B6B", letterSpacing: 2, textTransform: "uppercase", marginTop: 4 },

  aiCard: { marginBottom: 32, overflow: "hidden" },
  aiCardGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(212,168,67,0.15)",
    gap: 16,
  },
  aiIconContainer: {},
  aiIconGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  aiTitle: { fontSize: 13, fontWeight: "600", color: "#D4A843", letterSpacing: 2, textTransform: "uppercase" },
  aiText: { fontSize: 14, fontWeight: "400", color: "#C8C8C0", marginTop: 4, lineHeight: 20 },

  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  sectionTitle: { fontSize: 13, fontWeight: "600", color: "#8B8B80", letterSpacing: 3, textTransform: "uppercase" },
  sectionLink: { fontSize: 13, fontWeight: "500", color: "#D4A843", letterSpacing: 1 },

  petCard: {
    width: 110,
    backgroundColor: "#141418",
    borderWidth: 1,
    borderColor: "rgba(212,168,67,0.1)",
    paddingVertical: 20,
    alignItems: "center",
    gap: 8,
  },
  petCardAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(212,168,67,0.1)",
    borderWidth: 1,
    borderColor: "rgba(212,168,67,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  petCardInitial: { fontSize: 22, fontWeight: "300", color: "#D4A843", letterSpacing: 1 },
  petCardName: { fontSize: 14, fontWeight: "500", color: "#FAFAF8", letterSpacing: 0.5 },
  petCardType: { fontSize: 11, fontWeight: "400", color: "#6B6B6B", letterSpacing: 0.5 },

  petCardAdd: {
    width: 110,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(212,168,67,0.15)",
    borderStyle: "dashed",
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  petCardAddText: { fontSize: 12, fontWeight: "500", color: "#D4A843", letterSpacing: 0.5 },

  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#141418",
    borderWidth: 1,
    borderColor: "rgba(212,168,67,0.08)",
    padding: 16,
    gap: 14,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  actionTitle: { fontSize: 15, fontWeight: "500", color: "#FAFAF8", letterSpacing: 0.5 },
  actionSubtitle: { fontSize: 12, fontWeight: "400", color: "#6B6B6B", marginTop: 2 },
  actionBadge: {
    backgroundColor: "rgba(212,168,67,0.1)",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  actionBadgeText: { fontSize: 12, fontWeight: "600", color: "#D4A843", letterSpacing: 1, textTransform: "uppercase" },

  emergencyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(239,83,80,0.05)",
    borderWidth: 1,
    borderColor: "rgba(239,83,80,0.15)",
    padding: 16,
    marginTop: 32,
    gap: 14,
  },
  emergencyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(239,83,80,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  emergencyTitle: { fontSize: 15, fontWeight: "500", color: "#EF5350", letterSpacing: 0.5 },
  emergencySubtitle: { fontSize: 12, fontWeight: "400", color: "#6B6B6B", marginTop: 2 },
});
