import { useState } from "react";
import { ScrollView, Text, View, Pressable, Platform, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { IconSymbol } from "@/components/ui/icon-symbol";

const soundCategories = [
  { id: "cat-attract", title: "Katzen anlocken", description: "Sounds die Katzen neugierig machen", sounds: [
    { id: "meow1", name: "Freundliches Miau", duration: "2s" }, { id: "meow2", name: "Kaetzchen-Miau", duration: "1s" },
    { id: "purr", name: "Schnurren", duration: "5s" }, { id: "trill", name: "Trillern", duration: "1s" },
    { id: "chirp", name: "Vogel-Geraeusch", duration: "2s" }, { id: "mouse", name: "Maus-Quietschen", duration: "1s" },
  ]},
  { id: "dog-attract", title: "Hunde-Aufmerksamkeit", description: "Sounds fuer Hunde-Training", sounds: [
    { id: "whistle", name: "Hundepfeife", duration: "1s" }, { id: "squeak", name: "Quietsche-Spielzeug", duration: "1s" },
    { id: "bark", name: "Freundliches Bellen", duration: "2s" }, { id: "treat", name: "Leckerli-Rascheln", duration: "2s" },
    { id: "doorbell", name: "Tuerklingel", duration: "1s" },
  ]},
  { id: "training", title: "Training & Clicker", description: "Fuer positives Training", sounds: [
    { id: "clicker", name: "Clicker", duration: "0.1s" }, { id: "clicker-double", name: "Doppel-Click", duration: "0.2s" },
    { id: "good", name: "Belohnungs-Ton", duration: "0.5s" }, { id: "whistle-short", name: "Kurzer Pfiff", duration: "0.3s" },
    { id: "bell", name: "Glocke", duration: "0.5s" },
  ]},
  { id: "calming", title: "Beruhigende Sounds", description: "Fuer gestresste Tiere", sounds: [
    { id: "heartbeat", name: "Herzschlag", duration: "10s" }, { id: "rain", name: "Regen", duration: "30s" },
    { id: "ocean", name: "Meeresrauschen", duration: "30s" }, { id: "white-noise", name: "Weisses Rauschen", duration: "30s" },
    { id: "lullaby", name: "Schlaflied", duration: "60s" },
  ]},
  { id: "birds", title: "Vogel-Lockrufe", description: "Fuer Ziervoegel", sounds: [
    { id: "budgie", name: "Wellensittich", duration: "3s" }, { id: "canary", name: "Kanarienvogel", duration: "3s" },
    { id: "parrot", name: "Papagei", duration: "2s" }, { id: "whistle-bird", name: "Pfeifen", duration: "2s" },
  ]},
];

export default function PetSoundsScreen() {
  const insets = useSafeAreaInsets();
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(soundCategories[0]);

  const playSound = async (soundId: string) => {
    if (playingSound === soundId) { setPlayingSound(null); return; }
    setPlayingSound(soundId);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(soundId.startsWith("clicker") ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Medium);
    }
    const sound = selectedCategory.sounds.find((s) => s.id === soundId);
    const ms = parseFloat(sound?.duration || "1") * 1000;
    setTimeout(() => setPlayingSound(null), Math.min(ms, 3000));
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0F" }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40, paddingHorizontal: 20 }}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [s.backBtn, pressed && { opacity: 0.6 }]}>
          <IconSymbol name="chevron.left" size={20} color="#D4A843" />
          <Text style={s.backText}>Zurueck</Text>
        </Pressable>
        <View style={s.header}>
          <Text style={s.headerTitle}>Tier-Soundboard</Text>
          <Text style={s.headerSub}>Lockrufe & Training</Text>
          <View style={s.goldDivider} />
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 24 }}>
          {soundCategories.map((cat) => (
            <Pressable key={cat.id} onPress={() => setSelectedCategory(cat)} style={({ pressed }) => [s.catBtn, selectedCategory.id === cat.id && s.catBtnActive, pressed && { opacity: 0.7 }]}>
              <Text style={[s.catText, selectedCategory.id === cat.id && s.catTextActive]}>{cat.title}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Category Info */}
        <View style={s.card}>
          <Text style={s.catTitle}>{selectedCategory.title}</Text>
          <Text style={s.catDesc}>{selectedCategory.description}</Text>
        </View>

        {/* Sound Grid */}
        <View style={s.grid}>
          {selectedCategory.sounds.map((sound) => (
            <Pressable key={sound.id} onPress={() => playSound(sound.id)} style={({ pressed }) => [s.soundBtn, playingSound === sound.id && s.soundBtnActive, pressed && { opacity: 0.7, transform: [{ scale: 0.97 }] }]}>
              <IconSymbol name={playingSound === sound.id ? "pause.fill" : "play.fill"} size={20} color={playingSound === sound.id ? "#D4A843" : "#8B8B80"} />
              <Text style={[s.soundName, playingSound === sound.id && { color: "#D4A843" }]}>{sound.name}</Text>
              <Text style={s.soundDuration}>{sound.duration}</Text>
            </Pressable>
          ))}
        </View>

        {/* Quick Clicker */}
        <Text style={s.sectionTitle}>Schnell-Clicker</Text>
        <Pressable onPress={() => playSound("clicker")} style={({ pressed }) => [pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }]}>
          <LinearGradient colors={["#D4A843", "#B8860B"]} style={s.clickerBtn}>
            <Text style={s.clickerText}>CLICK</Text>
            <Text style={s.clickerSub}>Tippe fuer Clicker-Sound</Text>
          </LinearGradient>
        </Pressable>

        {/* Tips */}
        <Text style={s.sectionTitle}>Tipps zur Nutzung</Text>
        <View style={s.card}>
          {[
            "Katzen: Kaetzchen-Miau und Vogel-Geraeusche wecken die Neugier",
            "Hunde: Quietsche-Spielzeug und Leckerli-Rascheln fuer Aufmerksamkeit",
            "Training: Clicker immer mit Belohnung kombinieren",
            "Beruhigung: Herzschlag-Sound hilft bei Trennungsangst",
          ].map((tip, i) => (
            <View key={i} style={[s.tipRow, i > 0 && { borderTopWidth: 1, borderTopColor: "rgba(212,168,67,0.05)" }]}>
              <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: "#D4A843", marginTop: 6 }} />
              <Text style={s.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        <View style={s.disclaimer}>
          <IconSymbol name="info.circle.fill" size={16} color="#D4A843" />
          <Text style={s.disclaimerText}>Nutze die Sounds verantwortungsvoll. Zu haeufige Nutzung kann dein Tier desensibilisieren.</Text>
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
  catBtn: { paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1, borderColor: "rgba(212,168,67,0.1)" },
  catBtnActive: { borderColor: "#D4A843", backgroundColor: "rgba(212,168,67,0.08)" },
  catText: { fontSize: 12, fontWeight: "500", color: "#6B6B6B", letterSpacing: 0.5 },
  catTextActive: { color: "#D4A843" },
  card: { backgroundColor: "#141418", padding: 16, borderWidth: 1, borderColor: "rgba(212,168,67,0.08)", marginBottom: 16 },
  catTitle: { fontSize: 18, fontWeight: "300", color: "#FAFAF8", letterSpacing: 1 },
  catDesc: { fontSize: 12, fontWeight: "400", color: "#6B6B6B", marginTop: 4 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  soundBtn: { width: "48%", backgroundColor: "#141418", borderWidth: 1, borderColor: "rgba(212,168,67,0.08)", padding: 16, alignItems: "center", gap: 8 },
  soundBtnActive: { borderColor: "#D4A843", backgroundColor: "rgba(212,168,67,0.06)" },
  soundName: { fontSize: 13, fontWeight: "500", color: "#FAFAF8", textAlign: "center", letterSpacing: 0.3 },
  soundDuration: { fontSize: 11, fontWeight: "400", color: "#4A4A4A" },
  clickerBtn: { height: 80, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  clickerText: { fontSize: 22, fontWeight: "600", color: "#0A0A0F", letterSpacing: 6 },
  clickerSub: { fontSize: 11, fontWeight: "400", color: "rgba(10,10,15,0.6)", marginTop: 4 },
  tipRow: { flexDirection: "row", gap: 10, paddingVertical: 10 },
  tipText: { flex: 1, fontSize: 13, fontWeight: "400", color: "#8B8B80", lineHeight: 20 },
  disclaimer: { flexDirection: "row", gap: 10, marginTop: 24, backgroundColor: "rgba(212,168,67,0.05)", padding: 16, borderWidth: 1, borderColor: "rgba(212,168,67,0.1)" },
  disclaimerText: { flex: 1, fontSize: 12, fontWeight: "400", color: "#6B6B6B", lineHeight: 18 },
});
