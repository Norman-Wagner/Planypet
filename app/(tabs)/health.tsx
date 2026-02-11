import { ScrollView, Text, View, Pressable, Alert, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { usePetStore } from "@/lib/pet-store";

export default function HealthScreen() {
  const insets = useSafeAreaInsets();
  const { pets } = usePetStore();

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
          <Text style={s.headerTitle}>Gesundheit</Text>
          <Text style={s.headerSub}>Gesundheitsakten & Tierarzt-Modus</Text>
          <View style={s.goldDivider} />
        </View>

        {/* Tierarzt-Modus */}
        <Pressable
          onPress={() => router.push("/vet-mode")}
          style={({ pressed }) => [s.vetCard, pressed && { opacity: 0.7 }]}
        >
          <View style={s.vetIcon}>
            <IconSymbol name="stethoscope" size={24} color="#66BB6A" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.vetTitle}>Tierarzt-Modus</Text>
            <Text style={s.vetSub}>Alle Daten kompakt fuer den Arztbesuch</Text>
          </View>
          <IconSymbol name="chevron.right" size={16} color="#4A4A4A" />
        </Pressable>

        {/* Quick Actions */}
        <View style={s.actionsRow}>
          <Pressable
            onPress={() => router.push("/add-symptom")}
            style={({ pressed }) => [s.actionCard, pressed && { opacity: 0.7 }]}
          >
            <View style={[s.actionIcon, { backgroundColor: "rgba(239,83,80,0.1)" }]}>
              <IconSymbol name="camera.fill" size={20} color="#EF5350" />
            </View>
            <Text style={s.actionText}>Symptom</Text>
          </Pressable>
          <Pressable style={({ pressed }) => [s.actionCard, pressed && { opacity: 0.7 }]}>
            <View style={[s.actionIcon, { backgroundColor: "rgba(212,168,67,0.1)" }]}>
              <IconSymbol name="mic.fill" size={20} color="#D4A843" />
            </View>
            <Text style={s.actionText}>Sprachnotiz</Text>
          </Pressable>
          <Pressable style={({ pressed }) => [s.actionCard, pressed && { opacity: 0.7 }]}>
            <View style={[s.actionIcon, { backgroundColor: "rgba(66,165,245,0.1)" }]}>
              <IconSymbol name="doc.text.fill" size={20} color="#42A5F5" />
            </View>
            <Text style={s.actionText}>PDF Export</Text>
          </Pressable>
        </View>

        {/* Anstehende Termine */}
        <Text style={s.sectionTitle}>Anstehende Termine</Text>
        <View style={s.card}>
          <View style={s.cardRow}>
            <View style={[s.cardIcon, { backgroundColor: "rgba(66,165,245,0.1)" }]}>
              <IconSymbol name="syringe.fill" size={20} color="#42A5F5" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.cardTitle}>Impfung</Text>
              <Text style={s.cardSub}>Naechste Woche - Tollwut-Auffrischung</Text>
            </View>
            <Pressable style={({ pressed }) => [s.calBtn, pressed && { opacity: 0.6 }]}>
              <Text style={s.calBtnText}>Kalender</Text>
            </Pressable>
          </View>
        </View>

        {/* Gesundheitsakten */}
        <Text style={s.sectionTitle}>Gesundheitsakten</Text>
        {pets.length === 0 ? (
          <View style={s.emptyCard}>
            <IconSymbol name="heart.fill" size={24} color="#D4A843" />
            <Text style={s.emptyText}>Fuege Tiere hinzu, um Gesundheitsakten zu sehen</Text>
          </View>
        ) : (
          pets.map((pet) => (
            <Pressable
              key={pet.id}
              onPress={() => router.push({ pathname: "/pet-detail", params: { petId: pet.id } })}
              style={({ pressed }) => [s.card, { marginBottom: 8 }, pressed && { opacity: 0.7 }]}
            >
              <View style={s.cardRow}>
                <View style={s.petAvatar}>
                  <Text style={s.petAvatarText}>{pet.name.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.cardTitle}>{pet.name}</Text>
                  <Text style={s.cardSub}>{pet.breed || pet.type}</Text>
                </View>
                <View style={s.statusBadge}>
                  <Text style={s.statusText}>Gesund</Text>
                </View>
              </View>
            </Pressable>
          ))
        )}

        {/* Wichtiger Hinweis */}
        <View style={s.disclaimer}>
          <IconSymbol name="info.circle.fill" size={16} color="#D4A843" />
          <Text style={s.disclaimerText}>
            Die KI-Hinweise ersetzen keinen Tierarzt. Bei gesundheitlichen Problemen konsultiere bitte immer einen Fachmann.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  header: { marginBottom: 32 },
  headerTitle: { fontSize: 28, fontWeight: "300", color: "#FAFAF8", letterSpacing: 2 },
  headerSub: { fontSize: 12, fontWeight: "400", color: "#6B6B6B", letterSpacing: 1, marginTop: 4 },
  goldDivider: { width: 40, height: 1, backgroundColor: "#D4A843", marginTop: 16 },

  sectionTitle: {
    fontSize: 11, fontWeight: "600", color: "#D4A843",
    letterSpacing: 3, textTransform: "uppercase", marginBottom: 12, marginTop: 28,
  },

  vetCard: {
    flexDirection: "row", alignItems: "center", gap: 14,
    backgroundColor: "#141418", padding: 16,
    borderWidth: 1, borderColor: "rgba(102,187,106,0.15)",
  },
  vetIcon: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: "rgba(102,187,106,0.1)",
    alignItems: "center", justifyContent: "center",
  },
  vetTitle: { fontSize: 16, fontWeight: "500", color: "#FAFAF8", letterSpacing: 0.5 },
  vetSub: { fontSize: 12, fontWeight: "400", color: "#6B6B6B", marginTop: 2 },

  actionsRow: { flexDirection: "row", gap: 10, marginTop: 20 },
  actionCard: {
    flex: 1, alignItems: "center", paddingVertical: 16,
    backgroundColor: "#141418",
    borderWidth: 1, borderColor: "rgba(212,168,67,0.08)",
  },
  actionIcon: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: "center", justifyContent: "center", marginBottom: 8,
  },
  actionText: { fontSize: 11, fontWeight: "500", color: "#8B8B80", letterSpacing: 0.5 },

  card: {
    backgroundColor: "#141418", padding: 16,
    borderWidth: 1, borderColor: "rgba(212,168,67,0.08)",
  },
  cardRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  cardIcon: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: "center", justifyContent: "center",
  },
  cardTitle: { fontSize: 15, fontWeight: "500", color: "#FAFAF8", letterSpacing: 0.3 },
  cardSub: { fontSize: 12, fontWeight: "400", color: "#6B6B6B", marginTop: 2 },

  calBtn: {
    backgroundColor: "rgba(66,165,245,0.1)",
    paddingHorizontal: 12, paddingVertical: 6,
  },
  calBtnText: { fontSize: 11, fontWeight: "500", color: "#42A5F5", letterSpacing: 0.5 },

  petAvatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: "rgba(212,168,67,0.1)",
    borderWidth: 1, borderColor: "rgba(212,168,67,0.2)",
    alignItems: "center", justifyContent: "center",
  },
  petAvatarText: { fontSize: 20, fontWeight: "300", color: "#D4A843" },

  statusBadge: { backgroundColor: "rgba(102,187,106,0.1)", paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 11, fontWeight: "500", color: "#66BB6A", letterSpacing: 0.5 },

  emptyCard: {
    backgroundColor: "#141418", padding: 32, alignItems: "center",
    borderWidth: 1, borderColor: "rgba(212,168,67,0.08)",
  },
  emptyText: { fontSize: 13, fontWeight: "400", color: "#6B6B6B", marginTop: 12, textAlign: "center" },

  disclaimer: {
    flexDirection: "row", gap: 10, marginTop: 32,
    backgroundColor: "rgba(212,168,67,0.05)", padding: 16,
    borderWidth: 1, borderColor: "rgba(212,168,67,0.1)",
  },
  disclaimerText: { flex: 1, fontSize: 12, fontWeight: "400", color: "#6B6B6B", lineHeight: 18 },
});
