import { useState } from "react";
import { ScrollView, Text, View, Pressable, Linking, Alert, Platform, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { PetAvatar } from "@/components/ui/pet-avatar";
import { usePetStore, Pet } from "@/lib/pet-store";

const poisonWarnings = [
  { id: "1", location: "Stadtpark, Naehe Spielplatz", date: "Heute, 14:30", type: "Koeder mit Naegeln", distance: "1.2 km" },
  { id: "2", location: "Waldweg am Fluss", date: "Gestern, 10:15", type: "Verdaechtiges Fleisch", distance: "3.5 km" },
];

export default function EmergencyScreen() {
  const insets = useSafeAreaInsets();
  const { pets } = usePetStore();
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [showLostPetForm, setShowLostPetForm] = useState(false);

  const handleCallVet = () => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert("Tierarzt anrufen", "Moechtest du den Notfall-Tierarzt anrufen?", [
      { text: "Abbrechen", style: "cancel" },
      { text: "Anrufen", onPress: () => Linking.openURL("tel:+49123456789") },
    ]);
  };

  const handleReportLostPet = (pet: Pet) => {
    setSelectedPet(pet);
    setShowLostPetForm(true);
    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0F" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 40,
          paddingHorizontal: 20,
        }}
      >
        {/* Back */}
        <Pressable onPress={() => router.back()} style={({ pressed }) => [s.backBtn, pressed && { opacity: 0.6 }]}>
          <IconSymbol name="chevron.left" size={20} color="#D4A843" />
          <Text style={s.backText}>Zurueck</Text>
        </Pressable>

        <View style={s.header}>
          <Text style={s.headerTitle}>Notfall-Hilfe</Text>
          <Text style={s.headerSub}>Schnelle Hilfe im Ernstfall</Text>
          <View style={s.goldDivider} />
        </View>

        {/* Emergency Call */}
        <Pressable onPress={handleCallVet} style={({ pressed }) => [s.emergencyCard, pressed && { opacity: 0.8 }]}>
          <View style={s.emergencyIcon}>
            <IconSymbol name="phone.fill" size={28} color="#FAFAF8" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.emergencyTitle}>Notfall-Tierarzt</Text>
            <Text style={s.emergencySub}>24/7 Notdienst anrufen</Text>
          </View>
          <IconSymbol name="chevron.right" size={16} color="#EF5350" />
        </Pressable>

        {/* Lost Pet */}
        <Text style={s.sectionTitle}>Tier vermisst?</Text>
        <View style={s.card}>
          <Text style={s.cardSub}>Waehle das vermisste Tier:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingVertical: 8 }}>
            {pets.map((pet) => (
              <Pressable key={pet.id} onPress={() => handleReportLostPet(pet)} style={({ pressed }) => [pressed && { opacity: 0.7 }]}>
                <PetAvatar name={pet.name} type={pet.type} size="lg" showName />
              </Pressable>
            ))}
            {pets.length === 0 && <Text style={s.emptyText}>Keine Tiere registriert</Text>}
          </ScrollView>
        </View>

        {/* Lost Pet Form */}
        {showLostPetForm && selectedPet && (
          <View style={[s.card, { marginTop: 12, borderColor: "rgba(255,183,77,0.2)" }]}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <PetAvatar name={selectedPet.name} type={selectedPet.type} size="lg" />
              <View style={{ flex: 1 }}>
                <Text style={s.cardTitle}>{selectedPet.name} vermisst</Text>
                <Text style={s.cardSub2}>Melde dein Tier bei diesen Diensten:</Text>
              </View>
            </View>
            <Pressable onPress={() => Linking.openURL("https://www.tasso.net/")} style={({ pressed }) => [s.serviceBtn, pressed && { opacity: 0.7 }]}>
              <View style={[s.serviceIcon, { backgroundColor: "rgba(66,165,245,0.1)" }]}>
                <IconSymbol name="magnifyingglass" size={20} color="#42A5F5" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.serviceTitle}>TASSO</Text>
                <Text style={s.serviceSub}>Europas groesstes Haustierregister</Text>
              </View>
              <IconSymbol name="chevron.right" size={14} color="#42A5F5" />
            </Pressable>
            <Pressable onPress={() => Linking.openURL("https://www.findefix.com/")} style={({ pressed }) => [s.serviceBtn, pressed && { opacity: 0.7 }]}>
              <View style={[s.serviceIcon, { backgroundColor: "rgba(102,187,106,0.1)" }]}>
                <IconSymbol name="location.fill" size={20} color="#66BB6A" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.serviceTitle}>FINDEFIX</Text>
                <Text style={s.serviceSub}>Deutscher Tierschutzbund</Text>
              </View>
              <IconSymbol name="chevron.right" size={14} color="#66BB6A" />
            </Pressable>
            <Pressable onPress={() => setShowLostPetForm(false)} style={({ pressed }) => [{ marginTop: 16, alignItems: "center" }, pressed && { opacity: 0.6 }]}>
              <Text style={{ fontSize: 13, color: "#6B6B6B" }}>Abbrechen</Text>
            </Pressable>
          </View>
        )}

        {/* Poison Warnings */}
        <Text style={s.sectionTitle}>Giftkoeder-Warnungen</Text>
        {poisonWarnings.map((w) => (
          <View key={w.id} style={[s.card, { marginBottom: 8, borderColor: "rgba(255,183,77,0.12)" }]}>
            <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 14 }}>
              <View style={[s.warnIcon]}>
                <IconSymbol name="exclamationmark.triangle.fill" size={20} color="#FFB74D" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.cardTitle}>{w.type}</Text>
                <Text style={s.cardSub2}>{w.location}</Text>
                <View style={{ flexDirection: "row", gap: 8, marginTop: 4 }}>
                  <Text style={{ fontSize: 11, color: "#6B6B6B" }}>{w.date}</Text>
                  <Text style={{ fontSize: 11, color: "#FFB74D", fontWeight: "500" }}>{w.distance} entfernt</Text>
                </View>
              </View>
            </View>
          </View>
        ))}

        {/* Emergency Contacts */}
        <Text style={s.sectionTitle}>Notfallkontakte</Text>
        <Pressable onPress={() => Linking.openURL("tel:112")} style={({ pressed }) => [s.contactCard, pressed && { opacity: 0.7 }]}>
          <View style={[s.contactIcon, { backgroundColor: "rgba(239,83,80,0.1)" }]}>
            <IconSymbol name="phone.fill" size={20} color="#EF5350" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.cardTitle}>Notruf</Text>
            <Text style={s.cardSub2}>112</Text>
          </View>
        </Pressable>
        <Pressable onPress={() => Linking.openURL("tel:+4915735990000")} style={({ pressed }) => [s.contactCard, pressed && { opacity: 0.7 }]}>
          <View style={[s.contactIcon, { backgroundColor: "rgba(212,168,67,0.1)" }]}>
            <IconSymbol name="phone.fill" size={20} color="#D4A843" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.cardTitle}>Giftnotruf</Text>
            <Text style={s.cardSub2}>+49 157 3599 0000</Text>
          </View>
        </Pressable>

        {/* Disclaimer */}
        <View style={s.disclaimer}>
          <IconSymbol name="info.circle.fill" size={16} color="#D4A843" />
          <Text style={s.disclaimerText}>
            Bei akuten Vergiftungen oder schweren Verletzungen sofort den Tierarzt oder die Tierklinik aufsuchen. Jede Minute zaehlt!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  backBtn: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 },
  backText: { fontSize: 14, fontWeight: "500", color: "#D4A843", letterSpacing: 0.5 },
  header: { marginBottom: 32 },
  headerTitle: { fontSize: 28, fontWeight: "300", color: "#FAFAF8", letterSpacing: 2 },
  headerSub: { fontSize: 12, fontWeight: "400", color: "#6B6B6B", letterSpacing: 1, marginTop: 4 },
  goldDivider: { width: 40, height: 1, backgroundColor: "#D4A843", marginTop: 16 },
  sectionTitle: { fontSize: 11, fontWeight: "600", color: "#D4A843", letterSpacing: 3, textTransform: "uppercase", marginBottom: 12, marginTop: 24 },
  emergencyCard: {
    flexDirection: "row", alignItems: "center", gap: 14,
    backgroundColor: "rgba(239,83,80,0.08)", padding: 20,
    borderWidth: 1, borderColor: "rgba(239,83,80,0.2)",
  },
  emergencyIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#EF5350", alignItems: "center", justifyContent: "center" },
  emergencyTitle: { fontSize: 18, fontWeight: "500", color: "#EF5350", letterSpacing: 0.5 },
  emergencySub: { fontSize: 12, fontWeight: "400", color: "#8B8B80", marginTop: 2 },
  card: { backgroundColor: "#141418", padding: 16, borderWidth: 1, borderColor: "rgba(212,168,67,0.08)" },
  cardTitle: { fontSize: 15, fontWeight: "500", color: "#FAFAF8", letterSpacing: 0.3 },
  cardSub: { fontSize: 12, fontWeight: "400", color: "#6B6B6B", marginBottom: 12 },
  cardSub2: { fontSize: 12, fontWeight: "400", color: "#6B6B6B", marginTop: 2 },
  emptyText: { fontSize: 13, color: "#6B6B6B" },
  serviceBtn: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, backgroundColor: "rgba(212,168,67,0.04)", marginBottom: 8 },
  serviceIcon: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  serviceTitle: { fontSize: 14, fontWeight: "600", color: "#FAFAF8", letterSpacing: 1 },
  serviceSub: { fontSize: 12, fontWeight: "400", color: "#6B6B6B", marginTop: 1 },
  warnIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,183,77,0.1)", alignItems: "center", justifyContent: "center" },
  contactCard: { flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: "#141418", padding: 16, borderWidth: 1, borderColor: "rgba(212,168,67,0.08)", marginBottom: 8 },
  contactIcon: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  disclaimer: { flexDirection: "row", gap: 10, marginTop: 32, backgroundColor: "rgba(212,168,67,0.05)", padding: 16, borderWidth: 1, borderColor: "rgba(212,168,67,0.1)" },
  disclaimerText: { flex: 1, fontSize: 12, fontWeight: "400", color: "#6B6B6B", lineHeight: 18 },
});
