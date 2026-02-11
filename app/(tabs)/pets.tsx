import { ScrollView, Text, View, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useEffect } from "react";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { usePetStore } from "@/lib/pet-store";

export default function PetsScreen() {
  const insets = useSafeAreaInsets();
  const { pets, loadData } = usePetStore();

  useEffect(() => { loadData(); }, []);

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
          <View>
            <Text style={s.headerTitle}>Meine Tiere</Text>
            <Text style={s.headerSub}>{pets.length} registriert</Text>
          </View>
          <Pressable
            onPress={() => router.push("/onboarding")}
            style={({ pressed }) => [s.addBtn, pressed && { opacity: 0.7 }]}
          >
            <IconSymbol name="plus.circle.fill" size={20} color="#D4A843" />
          </Pressable>
        </View>

        <View style={s.goldDivider} />

        {/* Pet Cards */}
        {pets.length === 0 ? (
          <Pressable
            onPress={() => router.push("/onboarding")}
            style={({ pressed }) => [s.emptyCard, pressed && { transform: [{ scale: 0.98 }] }]}
          >
            <View style={s.emptyIcon}>
              <IconSymbol name="pawprint.fill" size={32} color="#D4A843" />
            </View>
            <Text style={s.emptyTitle}>Noch keine Tiere registriert</Text>
            <Text style={s.emptySubtitle}>Tippe hier, um dein erstes Tier hinzuzufuegen</Text>
          </Pressable>
        ) : (
          pets.map((pet) => (
            <Pressable
              key={pet.id}
              onPress={() => router.push({ pathname: "/pet-detail", params: { petId: pet.id } })}
              style={({ pressed }) => [s.petCard, pressed && { transform: [{ scale: 0.98 }] }]}
            >
              <View style={s.petRow}>
                {/* Avatar */}
                <View style={s.avatar}>
                  <Text style={s.avatarText}>{pet.name.charAt(0).toUpperCase()}</Text>
                </View>

                {/* Info */}
                <View style={{ flex: 1 }}>
                  <Text style={s.petName}>{pet.name}</Text>
                  <Text style={s.petType}>{pet.breed || pet.type}</Text>
                  <View style={s.metaRow}>
                    {pet.weight && (
                      <View style={s.metaItem}>
                        <Text style={s.metaText}>{pet.weight} kg</Text>
                      </View>
                    )}
                    {pet.birthDate && (
                      <View style={s.metaItem}>
                        <Text style={s.metaText}>{pet.birthDate}</Text>
                      </View>
                    )}
                  </View>
                </View>

                <IconSymbol name="chevron.right" size={16} color="#4A4A4A" />
              </View>

              {/* Quick Actions */}
              <View style={s.actionsRow}>
                <Pressable style={({ pressed }) => [s.actionBtn, pressed && { opacity: 0.6 }]}>
                  <IconSymbol name="fork.knife" size={16} color="#D4A843" />
                  <Text style={s.actionText}>Fuettern</Text>
                </Pressable>
                {(pet.type === "dog" || pet.type === "horse") && (
                  <Pressable style={({ pressed }) => [s.actionBtn, pressed && { opacity: 0.6 }]}>
                    <IconSymbol name="figure.walk" size={16} color="#66BB6A" />
                    <Text style={[s.actionText, { color: "#66BB6A" }]}>Gassi</Text>
                  </Pressable>
                )}
                <Pressable style={({ pressed }) => [s.actionBtn, pressed && { opacity: 0.6 }]}>
                  <IconSymbol name="camera.fill" size={16} color="#8B8B80" />
                  <Text style={[s.actionText, { color: "#8B8B80" }]}>Foto</Text>
                </Pressable>
                <Pressable style={({ pressed }) => [s.actionBtn, pressed && { opacity: 0.6 }]}>
                  <IconSymbol name="cross.case.fill" size={16} color="#EF5350" />
                  <Text style={[s.actionText, { color: "#EF5350" }]}>Gesundheit</Text>
                </Pressable>
              </View>
            </Pressable>
          ))
        )}

        {/* Add Pet */}
        {pets.length > 0 && (
          <Pressable
            onPress={() => router.push("/onboarding")}
            style={({ pressed }) => [s.addCard, pressed && { opacity: 0.7 }]}
          >
            <IconSymbol name="plus.circle.fill" size={24} color="#D4A843" />
            <Text style={s.addCardText}>Weiteres Tier hinzufuegen</Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  headerTitle: { fontSize: 28, fontWeight: "300", color: "#FAFAF8", letterSpacing: 2 },
  headerSub: { fontSize: 12, fontWeight: "400", color: "#6B6B6B", letterSpacing: 1, marginTop: 4 },
  addBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: "rgba(212,168,67,0.1)",
    borderWidth: 1, borderColor: "rgba(212,168,67,0.2)",
    alignItems: "center", justifyContent: "center",
  },
  goldDivider: { width: 40, height: 1, backgroundColor: "#D4A843", marginBottom: 32 },

  emptyCard: {
    backgroundColor: "#141418",
    borderWidth: 1, borderColor: "rgba(212,168,67,0.1)",
    padding: 40, alignItems: "center",
  },
  emptyIcon: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: "rgba(212,168,67,0.1)",
    alignItems: "center", justifyContent: "center", marginBottom: 16,
  },
  emptyTitle: { fontSize: 16, fontWeight: "500", color: "#FAFAF8", letterSpacing: 0.5 },
  emptySubtitle: { fontSize: 13, fontWeight: "400", color: "#6B6B6B", marginTop: 8 },

  petCard: {
    backgroundColor: "#141418",
    borderWidth: 1, borderColor: "rgba(212,168,67,0.08)",
    marginBottom: 12,
  },
  petRow: { flexDirection: "row", alignItems: "center", padding: 16, gap: 14 },
  avatar: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: "rgba(212,168,67,0.1)",
    borderWidth: 1, borderColor: "rgba(212,168,67,0.2)",
    alignItems: "center", justifyContent: "center",
  },
  avatarText: { fontSize: 24, fontWeight: "300", color: "#D4A843" },
  petName: { fontSize: 18, fontWeight: "500", color: "#FAFAF8", letterSpacing: 0.5 },
  petType: { fontSize: 12, fontWeight: "400", color: "#8B8B80", marginTop: 2, letterSpacing: 0.5 },
  metaRow: { flexDirection: "row", gap: 12, marginTop: 6 },
  metaItem: { backgroundColor: "rgba(212,168,67,0.06)", paddingHorizontal: 8, paddingVertical: 2 },
  metaText: { fontSize: 11, fontWeight: "400", color: "#6B6B6B", letterSpacing: 0.5 },

  actionsRow: {
    flexDirection: "row", gap: 8,
    paddingHorizontal: 16, paddingBottom: 14, paddingTop: 4,
    borderTopWidth: 1, borderTopColor: "rgba(212,168,67,0.05)",
  },
  actionBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 8 },
  actionText: { fontSize: 12, fontWeight: "500", color: "#D4A843", letterSpacing: 0.5 },

  addCard: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10,
    borderWidth: 1, borderColor: "rgba(212,168,67,0.15)", borderStyle: "dashed",
    paddingVertical: 20, marginTop: 8,
  },
  addCardText: { fontSize: 14, fontWeight: "500", color: "#D4A843", letterSpacing: 0.5 },
});
