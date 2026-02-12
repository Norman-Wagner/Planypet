import { useState, useMemo } from "react";
import {
  ScrollView, Text, View, Pressable, StyleSheet, TextInput,
  Platform, Alert, FlatList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { PetAvatar } from "@/components/ui/pet-avatar";
import { usePetStore, type Pet, type FeedingEntry } from "@/lib/pet-store";

const QUICK_FOODS = [
  { label: "Trockenfutter", icon: "cube.fill" },
  { label: "Nassfutter", icon: "drop.fill" },
  { label: "Leckerli", icon: "star.fill" },
  { label: "Wasser", icon: "drop.fill" },
  { label: "Frischfutter", icon: "leaf.fill" },
  { label: "Medikament", icon: "cross.case.fill" },
];

export default function FeedingLogScreen() {
  const insets = useSafeAreaInsets();
  const { pets, feedings, addFeeding, completeFeeding } = usePetStore();

  const [selectedPet, setSelectedPet] = useState<Pet | null>(pets[0] || null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formFood, setFormFood] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [viewMode, setViewMode] = useState<"today" | "week" | "all">("today");

  const now = new Date();
  const todayStr = now.toDateString();

  const petFeedings = useMemo(() => {
    if (!selectedPet) return [];
    return feedings
      .filter((f) => f.petId === selectedPet.id)
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  }, [feedings, selectedPet]);

  const filteredFeedings = useMemo(() => {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return petFeedings.filter((f) => {
      if (viewMode === "today") return new Date(f.time).toDateString() === todayStr;
      if (viewMode === "week") return new Date(f.time) >= weekAgo;
      return true;
    });
  }, [petFeedings, viewMode, todayStr]);

  const todayCompleted = petFeedings.filter(
    (f) => f.completed && new Date(f.time).toDateString() === todayStr
  ).length;

  const todayPending = petFeedings.filter(
    (f) => !f.completed && new Date(f.time).toDateString() === todayStr
  ).length;

  const handleQuickFeed = (food: string) => {
    if (!selectedPet) return;

    addFeeding({
      petId: selectedPet.id,
      time: new Date().toISOString(),
      food,
      amount: "1 Portion",
      completed: true,
      completedAt: new Date().toISOString(),
    });

    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleAddCustom = () => {
    if (!selectedPet || !formFood.trim()) {
      Alert.alert("Fehler", "Bitte waehle ein Tier und gib das Futter an.");
      return;
    }

    addFeeding({
      petId: selectedPet.id,
      time: new Date().toISOString(),
      food: formFood.trim(),
      amount: formAmount.trim() || "1 Portion",
      completed: true,
      completedAt: new Date().toISOString(),
    });

    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    setFormFood("");
    setFormAmount("");
    setShowAddForm(false);
  };

  const handleComplete = (id: string) => {
    completeFeeding(id);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (d.toDateString() === todayStr) return "Heute";
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return "Gestern";
    return d.toLocaleDateString("de-DE", { weekday: "short", day: "numeric", month: "short" });
  };

  // Group feedings by date
  const groupedFeedings = useMemo(() => {
    const groups: { date: string; items: FeedingEntry[] }[] = [];
    filteredFeedings.forEach((f) => {
      const dateKey = new Date(f.time).toDateString();
      const existing = groups.find((g) => g.date === dateKey);
      if (existing) {
        existing.items.push(f);
      } else {
        groups.push({ date: dateKey, items: [f] });
      }
    });
    return groups;
  }, [filteredFeedings]);

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
            onPress={() => router.back()}
            style={({ pressed }) => [st.backBtn, pressed && { opacity: 0.6 }]}
          >
            <IconSymbol name="chevron.left" size={20} color="#D4A843" />
          </Pressable>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={st.headerTitle}>Fuetterung</Text>
            <Text style={st.headerSub}>Mahlzeiten protokollieren & planen</Text>
            <View style={st.goldDivider} />
          </View>
        </View>

        {/* Pet Selector */}
        {pets.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: "row", gap: 10 }}>
              {pets.map((pet) => (
                <Pressable
                  key={pet.id}
                  onPress={() => setSelectedPet(pet)}
                  style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
                >
                  <View style={[st.petChip, selectedPet?.id === pet.id && st.petChipActive]}>
                    <PetAvatar name={pet.name} type={pet.type} size="sm" />
                    <Text style={[st.petChipText, selectedPet?.id === pet.id && st.petChipTextActive]}>
                      {pet.name}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        )}

        {/* Today Stats */}
        <View style={st.statsRow}>
          <View style={st.statCard}>
            <Text style={st.statValue}>{todayCompleted}</Text>
            <Text style={st.statLabel}>Erledigt</Text>
          </View>
          <View style={st.statCard}>
            <Text style={[st.statValue, { color: todayPending > 0 ? "#FFB74D" : "#66BB6A" }]}>
              {todayPending}
            </Text>
            <Text style={st.statLabel}>Offen</Text>
          </View>
          <View style={st.statCard}>
            <Text style={st.statValue}>{todayCompleted + todayPending}</Text>
            <Text style={st.statLabel}>Gesamt</Text>
          </View>
        </View>

        {/* Quick Feed */}
        <Text style={st.sectionTitle}>Schnell-Fuetterung</Text>
        <View style={st.quickGrid}>
          {QUICK_FOODS.map((food) => (
            <Pressable
              key={food.label}
              onPress={() => handleQuickFeed(food.label)}
              style={({ pressed }) => [st.quickBtn, pressed && { opacity: 0.7, transform: [{ scale: 0.97 }] }]}
            >
              <IconSymbol name={food.icon as any} size={20} color="#D4A843" />
              <Text style={st.quickBtnText}>{food.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Custom Entry */}
        {!showAddForm ? (
          <Pressable
            onPress={() => setShowAddForm(true)}
            style={({ pressed }) => [st.addCustomBtn, pressed && { opacity: 0.7 }]}
          >
            <IconSymbol name="plus" size={16} color="#D4A843" />
            <Text style={st.addCustomText}>Eigenes Futter eintragen</Text>
          </Pressable>
        ) : (
          <View style={st.formCard}>
            <Text style={st.formTitle}>Eigener Eintrag</Text>
            <TextInput
              style={st.input}
              value={formFood}
              onChangeText={setFormFood}
              placeholder="Was wurde gefuettert?"
              placeholderTextColor="#4A4A4A"
              returnKeyType="done"
            />
            <TextInput
              style={st.input}
              value={formAmount}
              onChangeText={setFormAmount}
              placeholder="Menge (z.B. 200g, 1 Dose)"
              placeholderTextColor="#4A4A4A"
              returnKeyType="done"
            />
            <View style={{ flexDirection: "row", gap: 12 }}>
              <Pressable
                onPress={() => { setShowAddForm(false); setFormFood(""); setFormAmount(""); }}
                style={({ pressed }) => [st.cancelBtn, pressed && { opacity: 0.7 }]}
              >
                <Text style={st.cancelBtnText}>Abbrechen</Text>
              </Pressable>
              <Pressable
                onPress={handleAddCustom}
                style={({ pressed }) => [st.saveBtn, pressed && { opacity: 0.8 }]}
              >
                <Text style={st.saveBtnText}>Eintragen</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Time Filter */}
        <View style={{ flexDirection: "row", gap: 8, marginTop: 24, marginBottom: 16 }}>
          {(["today", "week", "all"] as const).map((mode) => (
            <Pressable
              key={mode}
              onPress={() => setViewMode(mode)}
              style={({ pressed }) => ({ flex: 1, opacity: pressed ? 0.8 : 1 })}
            >
              <View style={[st.filterChip, viewMode === mode && st.filterChipActive]}>
                <Text style={[st.filterChipText, viewMode === mode && st.filterChipTextActive]}>
                  {mode === "today" ? "Heute" : mode === "week" ? "Woche" : "Alle"}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Feeding History */}
        <Text style={st.sectionTitle}>Verlauf</Text>

        {groupedFeedings.length === 0 ? (
          <View style={st.emptyCard}>
            <IconSymbol name="fork.knife" size={32} color="#2A2A30" />
            <Text style={st.emptyText}>Noch keine Eintraege</Text>
            <Text style={st.emptySub}>Nutze die Schnell-Fuetterung oben, um Mahlzeiten zu protokollieren</Text>
          </View>
        ) : (
          groupedFeedings.map((group) => (
            <View key={group.date} style={{ marginBottom: 16 }}>
              <Text style={st.dateHeader}>{formatDate(group.items[0].time)}</Text>
              <View style={{ gap: 6 }}>
                {group.items.map((feeding) => (
                  <View key={feeding.id} style={st.feedingCard}>
                    <View style={[st.feedingDot, feeding.completed && st.feedingDotCompleted]} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={st.feedingFood}>{feeding.food}</Text>
                      <Text style={st.feedingMeta}>
                        {formatTime(feeding.time)} | {feeding.amount}
                      </Text>
                    </View>
                    {!feeding.completed ? (
                      <Pressable
                        onPress={() => handleComplete(feeding.id)}
                        style={({ pressed }) => [st.completeBtn, pressed && { opacity: 0.7 }]}
                      >
                        <Text style={st.completeBtnText}>Erledigt</Text>
                      </Pressable>
                    ) : (
                      <IconSymbol name="checkmark.circle.fill" size={18} color="#66BB6A" />
                    )}
                  </View>
                ))}
              </View>
            </View>
          ))
        )}

        {/* Weekly Stats */}
        {petFeedings.length > 0 && (
          <>
            <Text style={[st.sectionTitle, { marginTop: 12 }]}>Statistik (7 Tage)</Text>
            <View style={st.weekStatsCard}>
              <View style={st.weekStat}>
                <Text style={st.weekStatValue}>
                  {petFeedings.filter((f) => {
                    const d = new Date(f.time);
                    return d >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) && f.completed;
                  }).length}
                </Text>
                <Text style={st.weekStatLabel}>Mahlzeiten</Text>
              </View>
              <View style={st.weekStat}>
                <Text style={st.weekStatValue}>
                  {(petFeedings.filter((f) => {
                    const d = new Date(f.time);
                    return d >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) && f.completed;
                  }).length / 7).toFixed(1)}
                </Text>
                <Text style={st.weekStatLabel}>pro Tag</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0F" },

  headerRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 24 },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "rgba(212,168,67,0.1)",
    alignItems: "center", justifyContent: "center",
  },
  headerTitle: { fontSize: 24, fontWeight: "300", color: "#FAFAF8", letterSpacing: 2 },
  headerSub: { fontSize: 13, color: "#6B6B6B", marginTop: 4 },
  goldDivider: { width: 40, height: 1, backgroundColor: "#D4A843", marginTop: 12 },

  sectionTitle: {
    fontSize: 11, fontWeight: "600", color: "#D4A843",
    letterSpacing: 3, textTransform: "uppercase", marginBottom: 12,
  },

  // Pet Selector
  petChip: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "#141418", borderWidth: 1,
    borderColor: "rgba(212,168,67,0.08)", paddingHorizontal: 14, paddingVertical: 8,
  },
  petChipActive: { borderColor: "#D4A843", backgroundColor: "rgba(212,168,67,0.08)" },
  petChipText: { fontSize: 13, color: "#8B8B80" },
  petChipTextActive: { color: "#D4A843", fontWeight: "600" },

  // Stats
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 24 },
  statCard: {
    flex: 1, alignItems: "center", paddingVertical: 14,
    backgroundColor: "#141418", borderWidth: 1,
    borderColor: "rgba(212,168,67,0.08)",
  },
  statValue: { fontSize: 24, fontWeight: "300", color: "#FAFAF8", letterSpacing: 1 },
  statLabel: { fontSize: 10, fontWeight: "600", color: "#6B6B6B", letterSpacing: 2, textTransform: "uppercase", marginTop: 2 },

  // Quick Feed
  quickGrid: {
    flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16,
  },
  quickBtn: {
    width: "31%" as any, alignItems: "center", paddingVertical: 16,
    backgroundColor: "#141418", borderWidth: 1,
    borderColor: "rgba(212,168,67,0.08)",
  },
  quickBtnText: { fontSize: 11, color: "#FAFAF8", marginTop: 6, fontWeight: "400" },

  // Add Custom
  addCustomBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    paddingVertical: 14, borderWidth: 1, borderColor: "rgba(212,168,67,0.15)",
    borderStyle: "dashed",
  },
  addCustomText: { fontSize: 13, color: "#D4A843" },

  // Form
  formCard: {
    backgroundColor: "#141418", borderWidth: 1,
    borderColor: "rgba(212,168,67,0.1)", padding: 20,
  },
  formTitle: { fontSize: 14, fontWeight: "300", color: "#FAFAF8", letterSpacing: 1, marginBottom: 16 },
  input: {
    backgroundColor: "#0A0A0F", borderWidth: 1, borderColor: "rgba(212,168,67,0.1)",
    padding: 14, color: "#FAFAF8", fontSize: 15, marginBottom: 12,
  },
  cancelBtn: {
    flex: 1, paddingVertical: 12, alignItems: "center",
    borderWidth: 1, borderColor: "rgba(212,168,67,0.15)",
  },
  cancelBtnText: { fontSize: 13, color: "#8B8B80" },
  saveBtn: {
    flex: 1, paddingVertical: 12, alignItems: "center",
    backgroundColor: "#D4A843",
  },
  saveBtnText: { fontSize: 13, fontWeight: "700", color: "#0A0A0F" },

  // Filter
  filterChip: {
    paddingVertical: 10, alignItems: "center",
    backgroundColor: "#141418", borderWidth: 1,
    borderColor: "rgba(212,168,67,0.08)",
  },
  filterChipActive: { backgroundColor: "#D4A843", borderColor: "#D4A843" },
  filterChipText: { fontSize: 12, color: "#8B8B80", fontWeight: "500" },
  filterChipTextActive: { color: "#0A0A0F" },

  // Date Header
  dateHeader: {
    fontSize: 12, fontWeight: "500", color: "#8B8B80", marginBottom: 8, letterSpacing: 0.5,
  },

  // Feeding Card
  feedingCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#141418", borderWidth: 1,
    borderColor: "rgba(212,168,67,0.08)", padding: 14,
  },
  feedingDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#4A4A4A" },
  feedingDotCompleted: { backgroundColor: "#66BB6A" },
  feedingFood: { fontSize: 14, fontWeight: "500", color: "#FAFAF8" },
  feedingMeta: { fontSize: 11, color: "#6B6B6B", marginTop: 2 },

  completeBtn: {
    backgroundColor: "rgba(212,168,67,0.15)", paddingHorizontal: 12, paddingVertical: 6,
  },
  completeBtnText: { fontSize: 11, fontWeight: "600", color: "#D4A843" },

  // Empty
  emptyCard: {
    backgroundColor: "#141418", padding: 32, alignItems: "center",
    borderWidth: 1, borderColor: "rgba(212,168,67,0.08)",
  },
  emptyText: { fontSize: 16, fontWeight: "300", color: "#6B6B6B", marginTop: 12 },
  emptySub: { fontSize: 12, color: "#4A4A4A", textAlign: "center", marginTop: 4, lineHeight: 18 },

  // Week Stats
  weekStatsCard: {
    flexDirection: "row",
    backgroundColor: "#141418", borderWidth: 1,
    borderColor: "rgba(212,168,67,0.08)", padding: 16,
  },
  weekStat: { flex: 1, alignItems: "center" },
  weekStatValue: { fontSize: 22, fontWeight: "300", color: "#D4A843", letterSpacing: 1 },
  weekStatLabel: { fontSize: 10, fontWeight: "600", color: "#6B6B6B", letterSpacing: 2, textTransform: "uppercase", marginTop: 4 },
});
