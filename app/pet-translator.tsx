import { useState } from "react";
import { ScrollView, Text, View, Pressable, Platform, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { usePetStore } from "@/lib/pet-store";

const catTranslations = [
  { sound: "Kurzes Miau", meanings: ["Hallo!", "Aufmerksamkeit bitte", "Ich gruesse dich"] },
  { sound: "Langes Miau", meanings: ["Ich habe Hunger", "Ich will raus", "Ich brauche etwas"] },
  { sound: "Mehrfaches Miau", meanings: ["Ich bin aufgeregt", "Spiel mit mir!", "Etwas Interessantes!"] },
  { sound: "Tiefes Miau", meanings: ["Ich bin unzufrieden", "Das gefaellt mir nicht", "Lass mich in Ruhe"] },
  { sound: "Schnurren", meanings: ["Ich bin gluecklich", "Ich fuehle mich wohl", "Weitermachen!"] },
  { sound: "Fauchen", meanings: ["Ich habe Angst", "Bleib weg!", "Warnung!"] },
  { sound: "Trillern", meanings: ["Ich freue mich dich zu sehen", "Komm mit!", "Aufregung"] },
];

const dogTranslations = [
  { sound: "Kurzes Bellen", meanings: ["Hallo!", "Aufmerksamkeit", "Jemand ist da"] },
  { sound: "Anhaltendes Bellen", meanings: ["Alarm!", "Gefahr erkannt", "Beschuetzer-Modus"] },
  { sound: "Hohes Bellen", meanings: ["Ich bin aufgeregt", "Spielen!", "Freude"] },
  { sound: "Tiefes Bellen", meanings: ["Warnung", "Bleib weg", "Ich bin wachsam"] },
  { sound: "Winseln", meanings: ["Ich bin traurig", "Ich vermisse dich", "Aufmerksamkeit bitte"] },
  { sound: "Heulen", meanings: ["Einsamkeit", "Kommunikation", "Ich rufe"] },
  { sound: "Knurren", meanings: ["Warnung", "Das ist meins", "Ich bin unwohl"] },
  { sound: "Fiepen", meanings: ["Ich habe Schmerzen", "Ich bin aengstlich", "Hilfe"] },
];

export default function PetTranslatorScreen() {
  const insets = useSafeAreaInsets();
  const [isListening, setIsListening] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedPetType, setSelectedPetType] = useState<"cat" | "dog">("cat");
  const [translation, setTranslation] = useState<{ sound: string; meaning: string; confidence: number } | null>(null);
  const [listenDuration, setListenDuration] = useState(0);

  const startListening = async () => {
    setIsListening(true);
    setListenDuration(0);
    setTranslation(null);
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    let duration = 0;
    const interval = setInterval(() => {
      duration += 1;
      setListenDuration(duration);
      if (duration >= 3) { clearInterval(interval); analyzeSound(); }
    }, 1000);
  };

  const analyzeSound = async () => {
    setIsListening(false);
    setIsAnalyzing(true);
    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const translations = selectedPetType === "cat" ? catTranslations : dogTranslations;
    const r = translations[Math.floor(Math.random() * translations.length)];
    setTranslation({ sound: r.sound, meaning: r.meanings[Math.floor(Math.random() * r.meanings.length)], confidence: Math.floor(Math.random() * 30) + 70 });
    setIsAnalyzing(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0F" }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40, paddingHorizontal: 20 }}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [s.backBtn, pressed && { opacity: 0.6 }]}>
          <IconSymbol name="chevron.left" size={20} color="#D4A843" />
          <Text style={s.backText}>Zurueck</Text>
        </Pressable>

        <View style={s.header}>
          <Text style={s.headerTitle}>Tier-Uebersetzer</Text>
          <Text style={s.headerSub}>Verstehe was dein Tier sagt</Text>
          <View style={s.goldDivider} />
        </View>

        {/* Pet Type Selection */}
        <View style={s.typeRow}>
          <Pressable onPress={() => setSelectedPetType("cat")} style={({ pressed }) => [s.typeBtn, selectedPetType === "cat" && s.typeBtnActive, pressed && { opacity: 0.7 }]}>
            <IconSymbol name="cat" size={20} color={selectedPetType === "cat" ? "#D4A843" : "#6B6B6B"} />
            <Text style={[s.typeText, selectedPetType === "cat" && s.typeTextActive]}>Katze</Text>
          </Pressable>
          <Pressable onPress={() => setSelectedPetType("dog")} style={({ pressed }) => [s.typeBtn, selectedPetType === "dog" && s.typeBtnActive, pressed && { opacity: 0.7 }]}>
            <IconSymbol name="dog" size={20} color={selectedPetType === "dog" ? "#D4A843" : "#6B6B6B"} />
            <Text style={[s.typeText, selectedPetType === "dog" && s.typeTextActive]}>Hund</Text>
          </Pressable>
        </View>

        {/* Record Button */}
        <View style={s.recordSection}>
          <Text style={s.recordLabel}>
            {isListening ? `Hoere zu... ${listenDuration}s` : isAnalyzing ? "Analysiere Geraeusch..." : "Tippe zum Zuhoeren"}
          </Text>
          <Pressable onPress={startListening} disabled={isListening || isAnalyzing} style={({ pressed }) => [pressed && { opacity: 0.8 }]}>
            <LinearGradient
              colors={isListening ? ["#66BB6A", "#388E3C"] : isAnalyzing ? ["#FFB74D", "#F57C00"] : ["#D4A843", "#B8860B"]}
              style={s.recordBtn}
            >
              <IconSymbol name={isListening ? "waveform" : "mic.fill"} size={40} color={isListening || isAnalyzing ? "#FAFAF8" : "#0A0A0F"} />
            </LinearGradient>
          </Pressable>
          <Text style={s.recordHint}>Halte das Handy nah an dein Tier</Text>
        </View>

        {/* Translation Result */}
        {translation && (
          <View style={s.resultCard}>
            <Text style={s.resultLabel}>Erkanntes Geraeusch</Text>
            <Text style={s.resultSound}>{translation.sound}</Text>
            <View style={s.resultMeaningBox}>
              <Text style={s.resultMeaningLabel}>Dein Tier sagt:</Text>
              <Text style={s.resultMeaning}>"{translation.meaning}"</Text>
            </View>
            <View style={s.confidenceBadge}>
              <Text style={s.confidenceText}>{translation.confidence}% Konfidenz</Text>
            </View>
          </View>
        )}

        {/* Sound Guide */}
        <Text style={s.sectionTitle}>{selectedPetType === "cat" ? "Katzen" : "Hunde"}-Geraeusche verstehen</Text>
        <View style={s.card}>
          {(selectedPetType === "cat" ? catTranslations : dogTranslations).map((item, index) => (
            <View key={index} style={[s.guideRow, index > 0 && { borderTopWidth: 1, borderTopColor: "rgba(212,168,67,0.05)" }]}>
              <View style={{ flex: 1 }}>
                <Text style={s.guideSound}>{item.sound}</Text>
                <Text style={s.guideMeaning}>{item.meanings.join(" / ")}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={s.disclaimer}>
          <IconSymbol name="info.circle.fill" size={16} color="#D4A843" />
          <Text style={s.disclaimerText}>Die Uebersetzungen sind KI-basierte Interpretationen und dienen der Unterhaltung. Bei Verhaltensaenderungen konsultiere bitte einen Tierarzt.</Text>
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
  sectionTitle: { fontSize: 11, fontWeight: "600", color: "#D4A843", letterSpacing: 3, textTransform: "uppercase", marginBottom: 12, marginTop: 28 },

  typeRow: { flexDirection: "row", gap: 12, marginBottom: 32 },
  typeBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16, backgroundColor: "#141418", borderWidth: 1, borderColor: "rgba(212,168,67,0.08)" },
  typeBtnActive: { borderColor: "#D4A843", backgroundColor: "rgba(212,168,67,0.08)" },
  typeText: { fontSize: 15, fontWeight: "500", color: "#6B6B6B", letterSpacing: 1 },
  typeTextActive: { color: "#D4A843" },

  recordSection: { alignItems: "center", marginBottom: 32 },
  recordLabel: { fontSize: 13, fontWeight: "400", color: "#8B8B80", letterSpacing: 1, marginBottom: 20 },
  recordBtn: { width: 120, height: 120, borderRadius: 60, alignItems: "center", justifyContent: "center" },
  recordHint: { fontSize: 12, fontWeight: "400", color: "#4A4A4A", marginTop: 16 },

  resultCard: { backgroundColor: "#141418", borderWidth: 1, borderColor: "rgba(212,168,67,0.15)", padding: 24, alignItems: "center", marginBottom: 8 },
  resultLabel: { fontSize: 11, fontWeight: "500", color: "#6B6B6B", letterSpacing: 2, textTransform: "uppercase" },
  resultSound: { fontSize: 20, fontWeight: "300", color: "#FAFAF8", letterSpacing: 1, marginTop: 8 },
  resultMeaningBox: { backgroundColor: "rgba(212,168,67,0.06)", padding: 20, marginTop: 16, width: "100%", alignItems: "center" },
  resultMeaningLabel: { fontSize: 11, fontWeight: "500", color: "#8B8B80", letterSpacing: 1 },
  resultMeaning: { fontSize: 20, fontWeight: "400", color: "#D4A843", marginTop: 8, textAlign: "center" },
  confidenceBadge: { backgroundColor: "rgba(102,187,106,0.1)", paddingHorizontal: 16, paddingVertical: 6, marginTop: 16 },
  confidenceText: { fontSize: 12, fontWeight: "500", color: "#66BB6A", letterSpacing: 0.5 },

  card: { backgroundColor: "#141418", borderWidth: 1, borderColor: "rgba(212,168,67,0.08)" },
  guideRow: { paddingHorizontal: 16, paddingVertical: 14 },
  guideSound: { fontSize: 14, fontWeight: "500", color: "#FAFAF8", letterSpacing: 0.3 },
  guideMeaning: { fontSize: 12, fontWeight: "400", color: "#6B6B6B", marginTop: 4 },

  disclaimer: { flexDirection: "row", gap: 10, marginTop: 24, backgroundColor: "rgba(212,168,67,0.05)", padding: 16, borderWidth: 1, borderColor: "rgba(212,168,67,0.1)" },
  disclaimerText: { flex: 1, fontSize: 12, fontWeight: "400", color: "#6B6B6B", lineHeight: 18 },
});
