import { useState } from "react";
import { ScrollView, Text, View, Pressable, Linking, Platform, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { IconSymbol } from "@/components/ui/icon-symbol";

const emergencyCategories = [
  {
    id: "urgent", title: "Sofort zum Tierarzt!", color: "#EF5350",
    situations: [
      { title: "Bewusstlosigkeit", symptoms: ["Tier reagiert nicht", "Keine Bewegung", "Flache Atmung"], actions: ["Atemwege freimachen", "Auf die Seite legen", "Sofort Tierarzt rufen"] },
      { title: "Starke Blutung", symptoms: ["Blut spritzt", "Grosse Wunde", "Blut hoert nicht auf"], actions: ["Sauberes Tuch auf Wunde druecken", "Hochlagern wenn moeglich", "Sofort zum Tierarzt"] },
      { title: "Vergiftung", symptoms: ["Erbrechen", "Zittern", "Speicheln", "Kraempfe"], actions: ["NICHT zum Erbrechen bringen", "Gift sicherstellen", "Sofort Tierarzt/Giftnotruf"] },
      { title: "Hitzschlag", symptoms: ["Hecheln", "Taumeln", "Rote Zunge", "Bewusstlosigkeit"], actions: ["In den Schatten bringen", "Mit lauwarmem Wasser kuehlen", "Sofort zum Tierarzt"] },
    ],
  },
  {
    id: "common", title: "Haeufige Notfaelle", color: "#FFB74D",
    situations: [
      { title: "Durchfall", symptoms: ["Waessriger Stuhl", "Haeufiger Stuhlgang", "Appetitlosigkeit"], actions: ["24h Futterentzug", "Viel Wasser anbieten", "Bei Blut sofort zum Tierarzt"] },
      { title: "Erbrechen", symptoms: ["Wuergen", "Speicheln", "Unruhe"], actions: ["Futter entziehen", "Kleine Mengen Wasser", "Bei Blut/Dauer >24h zum Tierarzt"] },
      { title: "Insektenstich", symptoms: ["Schwellung", "Juckreiz", "Lecken der Stelle"], actions: ["Kuehlen", "Beobachten", "Bei Atemnot sofort zum Tierarzt"] },
      { title: "Zecke gefunden", symptoms: ["Kleiner dunkler Punkt", "Tier kratzt sich"], actions: ["Mit Zeckenzange entfernen", "Drehen, nicht ziehen", "Stelle desinfizieren"] },
    ],
  },
  {
    id: "wounds", title: "Verletzungen", color: "#66BB6A",
    situations: [
      { title: "Kleine Schnittwunde", symptoms: ["Kleine Blutung", "Oberflaechlich"], actions: ["Wunde reinigen", "Desinfizieren", "Sauber halten"] },
      { title: "Bisswunde", symptoms: ["Punktfoermige Wunden", "Schwellung"], actions: ["Wunde reinigen", "Immer zum Tierarzt (Infektionsgefahr!)"] },
      { title: "Verbrennungen", symptoms: ["Rote Haut", "Blasen", "Haarausfall"], actions: ["Mit kuehlem Wasser kuehlen", "Nicht reiben", "Zum Tierarzt"] },
      { title: "Fremdkoerper im Auge", symptoms: ["Auge zugekniffen", "Traenen", "Reiben"], actions: ["Nicht reiben lassen", "Mit Wasser spuelen", "Zum Tierarzt"] },
    ],
  },
];

const toxicItems = {
  food: [
    { name: "Schokolade", danger: "hoch" }, { name: "Zwiebeln/Knoblauch", danger: "hoch" },
    { name: "Weintrauben/Rosinen", danger: "hoch" }, { name: "Avocado", danger: "mittel" },
    { name: "Alkohol", danger: "hoch" }, { name: "Koffein", danger: "hoch" },
    { name: "Xylitol (Suessstoff)", danger: "sehr hoch" }, { name: "Macadamia-Nuesse", danger: "mittel" },
  ],
  plants: [
    { name: "Lilien (fuer Katzen)", danger: "sehr hoch" }, { name: "Oleander", danger: "sehr hoch" },
    { name: "Weihnachtsstern", danger: "mittel" }, { name: "Efeu", danger: "mittel" },
    { name: "Tulpen", danger: "mittel" }, { name: "Azalee", danger: "hoch" },
  ],
  household: [
    { name: "Rattengift", danger: "sehr hoch" }, { name: "Frostschutzmittel", danger: "sehr hoch" },
    { name: "Reinigungsmittel", danger: "hoch" }, { name: "Medikamente", danger: "hoch" },
    { name: "Schneckenkorn", danger: "sehr hoch" },
  ],
};

const getDangerColor = (danger: string) => {
  switch (danger) { case "sehr hoch": return "#EF5350"; case "hoch": return "#FF7043"; case "mittel": return "#FFB74D"; default: return "#6B6B6B"; }
};

export default function FirstAidScreen() {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState(emergencyCategories[0]);
  const [expandedSituation, setExpandedSituation] = useState<string | null>(null);
  const [showToxic, setShowToxic] = useState(false);

  const callEmergency = () => {
    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Linking.openURL("tel:112");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0F" }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40, paddingHorizontal: 20 }}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [s.backBtn, pressed && { opacity: 0.6 }]}>
          <IconSymbol name="chevron.left" size={20} color="#D4A843" />
          <Text style={s.backText}>Zurueck</Text>
        </Pressable>
        <View style={s.header}>
          <Text style={s.headerTitle}>Erste Hilfe</Text>
          <Text style={s.headerSub}>Notfall-Anleitungen fuer dein Tier</Text>
          <View style={s.goldDivider} />
        </View>

        {/* Emergency Call */}
        <Pressable onPress={callEmergency} style={({ pressed }) => [s.emergencyBtn, pressed && { opacity: 0.8 }]}>
          <View style={s.emergencyIcon}><IconSymbol name="phone.fill" size={24} color="#FAFAF8" /></View>
          <View style={{ flex: 1 }}>
            <Text style={s.emergencyTitle}>Tierarzt-Notruf</Text>
            <Text style={s.emergencySub}>Tippe fuer Notfall-Anruf</Text>
          </View>
        </Pressable>

        {/* Tabs */}
        <View style={s.tabRow}>
          <Pressable onPress={() => setShowToxic(false)} style={({ pressed }) => [s.tab, !showToxic && s.tabActive, pressed && { opacity: 0.7 }]}>
            <Text style={[s.tabText, !showToxic && s.tabTextActive]}>Notfaelle</Text>
          </Pressable>
          <Pressable onPress={() => setShowToxic(true)} style={({ pressed }) => [s.tab, showToxic && s.tabActive, pressed && { opacity: 0.7 }]}>
            <Text style={[s.tabText, showToxic && s.tabTextActive]}>Giftstoffe</Text>
          </Pressable>
        </View>

        {!showToxic ? (
          <>
            {/* Category Selection */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 20 }}>
              {emergencyCategories.map((cat) => (
                <Pressable key={cat.id} onPress={() => setSelectedCategory(cat)} style={({ pressed }) => [s.catBtn, selectedCategory.id === cat.id && { borderColor: cat.color, backgroundColor: `${cat.color}10` }, pressed && { opacity: 0.7 }]}>
                  <Text style={[s.catText, selectedCategory.id === cat.id && { color: cat.color }]}>{cat.title}</Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Situations */}
            {selectedCategory.situations.map((sit, index) => (
              <Pressable key={index} onPress={() => setExpandedSituation(expandedSituation === sit.title ? null : sit.title)}>
                <View style={[s.card, { marginBottom: 8 }]}>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Text style={s.cardTitle}>{sit.title}</Text>
                    <IconSymbol name={expandedSituation === sit.title ? "chevron.up" : "chevron.down"} size={16} color="#4A4A4A" />
                  </View>
                  {expandedSituation === sit.title && (
                    <View style={{ marginTop: 16 }}>
                      <Text style={s.subLabel}>Symptome</Text>
                      {sit.symptoms.map((sym, i) => (
                        <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 4 }}>
                          <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: "#FFB74D" }} />
                          <Text style={s.itemText}>{sym}</Text>
                        </View>
                      ))}
                      <Text style={[s.subLabel, { marginTop: 12 }]}>Massnahmen</Text>
                      {sit.actions.map((act, i) => (
                        <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 4 }}>
                          <Text style={{ fontSize: 12, fontWeight: "600", color: "#66BB6A", width: 16 }}>{i + 1}.</Text>
                          <Text style={s.itemText}>{act}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </Pressable>
            ))}
          </>
        ) : (
          <>
            {/* Toxic Items */}
            {(["food", "plants", "household"] as const).map((category) => (
              <View key={category}>
                <Text style={s.sectionTitle}>{category === "food" ? "Lebensmittel" : category === "plants" ? "Pflanzen" : "Haushalt"}</Text>
                <View style={s.card}>
                  {toxicItems[category].map((item, i) => (
                    <View key={i} style={[{ flexDirection: "row", alignItems: "center", paddingVertical: 10 }, i > 0 && { borderTopWidth: 1, borderTopColor: "rgba(212,168,67,0.05)" }]}>
                      <Text style={{ flex: 1, fontSize: 14, fontWeight: "400", color: "#FAFAF8" }}>{item.name}</Text>
                      <View style={{ backgroundColor: `${getDangerColor(item.danger)}15`, paddingHorizontal: 10, paddingVertical: 3 }}>
                        <Text style={{ fontSize: 11, fontWeight: "500", color: getDangerColor(item.danger), letterSpacing: 0.5 }}>{item.danger}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </>
        )}

        <View style={s.disclaimer}>
          <IconSymbol name="info.circle.fill" size={16} color="#D4A843" />
          <Text style={s.disclaimerText}>Diese Informationen ersetzen keinen Tierarzt. Bei Notfaellen immer sofort professionelle Hilfe suchen.</Text>
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
  emergencyBtn: { flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: "rgba(239,83,80,0.08)", padding: 20, borderWidth: 1, borderColor: "rgba(239,83,80,0.2)", marginBottom: 24 },
  emergencyIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#EF5350", alignItems: "center", justifyContent: "center" },
  emergencyTitle: { fontSize: 16, fontWeight: "500", color: "#EF5350", letterSpacing: 0.5 },
  emergencySub: { fontSize: 12, fontWeight: "400", color: "#8B8B80", marginTop: 2 },
  tabRow: { flexDirection: "row", gap: 12, marginBottom: 24 },
  tab: { flex: 1, paddingVertical: 14, alignItems: "center", backgroundColor: "#141418", borderWidth: 1, borderColor: "rgba(212,168,67,0.08)" },
  tabActive: { borderColor: "#D4A843", backgroundColor: "rgba(212,168,67,0.08)" },
  tabText: { fontSize: 14, fontWeight: "500", color: "#6B6B6B", letterSpacing: 1 },
  tabTextActive: { color: "#D4A843" },
  catBtn: { paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1, borderColor: "rgba(212,168,67,0.1)" },
  catText: { fontSize: 12, fontWeight: "500", color: "#6B6B6B", letterSpacing: 0.5 },
  card: { backgroundColor: "#141418", padding: 16, borderWidth: 1, borderColor: "rgba(212,168,67,0.08)" },
  cardTitle: { fontSize: 15, fontWeight: "500", color: "#FAFAF8", letterSpacing: 0.3 },
  subLabel: { fontSize: 11, fontWeight: "600", color: "#D4A843", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 },
  itemText: { fontSize: 13, fontWeight: "400", color: "#C8C8C0" },
  disclaimer: { flexDirection: "row", gap: 10, marginTop: 24, backgroundColor: "rgba(212,168,67,0.05)", padding: 16, borderWidth: 1, borderColor: "rgba(212,168,67,0.1)" },
  disclaimerText: { flex: 1, fontSize: 12, fontWeight: "400", color: "#6B6B6B", lineHeight: 18 },
});
