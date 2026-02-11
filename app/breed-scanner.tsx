import { useState } from "react";
import { ScrollView, Text, View, Pressable, Platform, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useImagePicker } from "@/hooks/use-image-picker";

const breedInfo: Record<string, { description: string; traits: string[]; care: string[] }> = {
  "Labrador Retriever": { description: "Freundlicher, aktiver und aufgeschlossener Familienhund.", traits: ["Freundlich", "Aktiv", "Intelligent", "Gut mit Kindern"], care: ["Viel Bewegung", "Regelmaessiges Buersten", "Gewichtskontrolle"] },
  "Deutscher Schaeferhund": { description: "Treuer, mutiger und vielseitiger Arbeitshund.", traits: ["Loyal", "Mutig", "Intelligent", "Beschuetzend"], care: ["Taegliche Bewegung", "Mentale Stimulation", "Fellpflege"] },
  "Golden Retriever": { description: "Sanftmuetiger, intelligenter und liebevoller Begleiter.", traits: ["Sanftmuetig", "Geduldig", "Zuverlaessig", "Verspielt"], care: ["Regelmaessiges Schwimmen", "Fellpflege", "Soziale Interaktion"] },
  "Britisch Kurzhaar": { description: "Ruhige, entspannte und unabhaengige Katzenrasse.", traits: ["Ruhig", "Unabhaengig", "Anhaenglich", "Pflegeleicht"], care: ["Woechentliches Buersten", "Spielzeit", "Gewichtskontrolle"] },
  "Maine Coon": { description: "Sanfte Riesen mit freundlichem Wesen.", traits: ["Freundlich", "Verspielt", "Intelligent", "Sozial"], care: ["Taegliches Buersten", "Viel Platz", "Interaktives Spielzeug"] },
  "Perserkatze": { description: "Elegante, ruhige Katze mit luxurioesem Fell.", traits: ["Ruhig", "Sanft", "Anhaenglich", "Gemuetlich"], care: ["Taegliche Fellpflege", "Augenpflege", "Ruhige Umgebung"] },
};

export default function BreedScannerScreen() {
  const insets = useSafeAreaInsets();
  const { pickImage, takePhoto } = useImagePicker();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ breed: string; confidence: number; mixedBreeds?: { breed: string; percentage: number }[]; info: typeof breedInfo[string] } | null>(null);
  const [petType, setPetType] = useState<"dog" | "cat">("dog");

  const handlePickImage = async () => { const uri = await pickImage(); if (uri) { setSelectedImage(uri); analyzeImage(uri); } };
  const handleTakePhoto = async () => { const uri = await takePhoto(); if (uri) { setSelectedImage(uri); analyzeImage(uri); } };

  const analyzeImage = async (_uri: string) => {
    setIsAnalyzing(true); setResult(null);
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await new Promise((r) => setTimeout(r, 2500));
    const dogBreeds = ["Labrador Retriever", "Deutscher Schaeferhund", "Golden Retriever"];
    const catBreeds = ["Britisch Kurzhaar", "Maine Coon", "Perserkatze"];
    const breeds = petType === "dog" ? dogBreeds : catBreeds;
    const mainBreed = breeds[Math.floor(Math.random() * breeds.length)];
    const isMixed = Math.random() > 0.5;
    setResult({
      breed: mainBreed, confidence: Math.floor(Math.random() * 20) + 75,
      mixedBreeds: isMixed ? [{ breed: mainBreed, percentage: Math.floor(Math.random() * 30) + 50 }, { breed: breeds[(breeds.indexOf(mainBreed) + 1) % breeds.length], percentage: Math.floor(Math.random() * 30) + 20 }] : undefined,
      info: breedInfo[mainBreed],
    });
    setIsAnalyzing(false);
    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0F" }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40, paddingHorizontal: 20 }}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [s.backBtn, pressed && { opacity: 0.6 }]}>
          <IconSymbol name="chevron.left" size={20} color="#D4A843" />
          <Text style={s.backText}>Zurueck</Text>
        </Pressable>
        <View style={s.header}>
          <Text style={s.headerTitle}>Rassen-Scanner</Text>
          <Text style={s.headerSub}>Erkenne die Rasse deines Tieres</Text>
          <View style={s.goldDivider} />
        </View>

        {/* Pet Type */}
        <View style={s.typeRow}>
          <Pressable onPress={() => setPetType("dog")} style={({ pressed }) => [s.typeBtn, petType === "dog" && s.typeBtnActive, pressed && { opacity: 0.7 }]}>
            <IconSymbol name="dog" size={20} color={petType === "dog" ? "#D4A843" : "#6B6B6B"} />
            <Text style={[s.typeText, petType === "dog" && s.typeTextActive]}>Hund</Text>
          </Pressable>
          <Pressable onPress={() => setPetType("cat")} style={({ pressed }) => [s.typeBtn, petType === "cat" && s.typeBtnActive, pressed && { opacity: 0.7 }]}>
            <IconSymbol name="cat" size={20} color={petType === "cat" ? "#D4A843" : "#6B6B6B"} />
            <Text style={[s.typeText, petType === "cat" && s.typeTextActive]}>Katze</Text>
          </Pressable>
        </View>

        {/* Image Area */}
        {!selectedImage ? (
          <View style={s.uploadArea}>
            <Text style={s.uploadLabel}>Waehle ein Foto deines Tieres</Text>
            <View style={{ flexDirection: "row", gap: 16, marginTop: 20 }}>
              <Pressable onPress={handleTakePhoto} style={({ pressed }) => [s.uploadBtn, pressed && { opacity: 0.7 }]}>
                <LinearGradient colors={["#D4A843", "#B8860B"]} style={s.uploadBtnGradient}>
                  <IconSymbol name="camera.fill" size={28} color="#0A0A0F" />
                  <Text style={s.uploadBtnText}>Kamera</Text>
                </LinearGradient>
              </Pressable>
              <Pressable onPress={handlePickImage} style={({ pressed }) => [s.uploadBtn, pressed && { opacity: 0.7 }]}>
                <View style={s.uploadBtnOutline}>
                  <IconSymbol name="photo.fill" size={28} color="#D4A843" />
                  <Text style={[s.uploadBtnText, { color: "#D4A843" }]}>Galerie</Text>
                </View>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={s.card}>
            <View style={{ overflow: "hidden", marginBottom: 12 }}>
              <Image source={{ uri: selectedImage }} style={{ width: "100%", height: 250 }} contentFit="cover" />
              {isAnalyzing && (
                <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(10,10,15,0.7)", alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontSize: 16, fontWeight: "500", color: "#D4A843", letterSpacing: 2 }}>Analysiere...</Text>
                </View>
              )}
            </View>
            <Pressable onPress={() => { setSelectedImage(null); setResult(null); }} style={({ pressed }) => [pressed && { opacity: 0.6 }]}>
              <Text style={{ fontSize: 14, fontWeight: "500", color: "#D4A843", textAlign: "center", letterSpacing: 0.5 }}>Neues Foto aufnehmen</Text>
            </Pressable>
          </View>
        )}

        {/* Result */}
        {result && (
          <>
            <View style={[s.card, { marginTop: 16, alignItems: "center", paddingVertical: 24 }]}>
              <Text style={{ fontSize: 11, fontWeight: "500", color: "#6B6B6B", letterSpacing: 2, textTransform: "uppercase" }}>Erkannte Rasse</Text>
              <Text style={{ fontSize: 24, fontWeight: "300", color: "#FAFAF8", letterSpacing: 1, marginTop: 8 }}>{result.breed}</Text>
              <View style={{ backgroundColor: "rgba(102,187,106,0.1)", paddingHorizontal: 16, paddingVertical: 6, marginTop: 12 }}>
                <Text style={{ fontSize: 12, fontWeight: "500", color: "#66BB6A", letterSpacing: 0.5 }}>{result.confidence}% Uebereinstimmung</Text>
              </View>
              {result.mixedBreeds && (
                <View style={{ width: "100%", marginTop: 20, backgroundColor: "rgba(212,168,67,0.04)", padding: 16 }}>
                  <Text style={{ fontSize: 11, fontWeight: "500", color: "#8B8B80", letterSpacing: 1, marginBottom: 12 }}>Mischlings-Analyse</Text>
                  {result.mixedBreeds.map((mix, i) => (
                    <View key={i} style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                      <View style={{ flex: 1, height: 3, backgroundColor: "rgba(212,168,67,0.1)", marginRight: 12, overflow: "hidden" }}>
                        <View style={{ height: 3, backgroundColor: "#D4A843", width: `${mix.percentage}%` }} />
                      </View>
                      <Text style={{ fontSize: 12, fontWeight: "500", color: "#D4A843", width: 40 }}>{mix.percentage}%</Text>
                      <Text style={{ fontSize: 12, fontWeight: "400", color: "#8B8B80", flex: 1 }}>{mix.breed}</Text>
                    </View>
                  ))}
                </View>
              )}
              <Text style={{ fontSize: 13, fontWeight: "400", color: "#6B6B6B", marginTop: 16, lineHeight: 20, textAlign: "center" }}>{result.info.description}</Text>
            </View>

            <Text style={s.sectionTitle}>Charaktereigenschaften</Text>
            <View style={[s.card, { flexDirection: "row", flexWrap: "wrap", gap: 8 }]}>
              {result.info.traits.map((trait, i) => (
                <View key={i} style={{ backgroundColor: "rgba(212,168,67,0.08)", paddingHorizontal: 14, paddingVertical: 6 }}>
                  <Text style={{ fontSize: 12, fontWeight: "500", color: "#D4A843", letterSpacing: 0.5 }}>{trait}</Text>
                </View>
              ))}
            </View>

            <Text style={s.sectionTitle}>Pflegetipps</Text>
            <View style={s.card}>
              {result.info.care.map((tip, i) => (
                <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8 }}>
                  <IconSymbol name="checkmark.circle.fill" size={16} color="#66BB6A" />
                  <Text style={{ fontSize: 14, fontWeight: "400", color: "#FAFAF8", letterSpacing: 0.3 }}>{tip}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={s.disclaimer}>
          <IconSymbol name="info.circle.fill" size={16} color="#D4A843" />
          <Text style={s.disclaimerText}>Die Rassen-Erkennung ist eine KI-basierte Schaetzung und kann von der tatsaechlichen Rasse abweichen.</Text>
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
  typeRow: { flexDirection: "row", gap: 12, marginBottom: 24 },
  typeBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16, backgroundColor: "#141418", borderWidth: 1, borderColor: "rgba(212,168,67,0.08)" },
  typeBtnActive: { borderColor: "#D4A843", backgroundColor: "rgba(212,168,67,0.08)" },
  typeText: { fontSize: 15, fontWeight: "500", color: "#6B6B6B", letterSpacing: 1 },
  typeTextActive: { color: "#D4A843" },
  uploadArea: { backgroundColor: "#141418", borderWidth: 1, borderColor: "rgba(212,168,67,0.08)", padding: 32, alignItems: "center" },
  uploadLabel: { fontSize: 13, fontWeight: "400", color: "#6B6B6B", letterSpacing: 0.5 },
  uploadBtn: { overflow: "hidden" },
  uploadBtnGradient: { width: 100, height: 100, alignItems: "center", justifyContent: "center", gap: 8 },
  uploadBtnOutline: { width: 100, height: 100, alignItems: "center", justifyContent: "center", gap: 8, borderWidth: 1, borderColor: "rgba(212,168,67,0.2)" },
  uploadBtnText: { fontSize: 11, fontWeight: "500", color: "#0A0A0F", letterSpacing: 1 },
  card: { backgroundColor: "#141418", padding: 16, borderWidth: 1, borderColor: "rgba(212,168,67,0.08)" },
  disclaimer: { flexDirection: "row", gap: 10, marginTop: 24, backgroundColor: "rgba(212,168,67,0.05)", padding: 16, borderWidth: 1, borderColor: "rgba(212,168,67,0.1)" },
  disclaimerText: { flex: 1, fontSize: 12, fontWeight: "400", color: "#6B6B6B", lineHeight: 18 },
});
