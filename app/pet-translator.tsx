import { useState } from "react";
import { ScrollView, Text, View, Pressable, Platform, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import { GlassCard } from "@/components/ui/glass-card";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { usePetStore } from "@/lib/pet-store";

// Mögliche Übersetzungen für verschiedene Tiergeräusche
const catTranslations = [
  { sound: "Kurzes Miau", meanings: ["Hallo!", "Aufmerksamkeit bitte", "Ich grüße dich"], emoji: "😺" },
  { sound: "Langes Miau", meanings: ["Ich habe Hunger", "Ich will raus", "Ich brauche etwas"], emoji: "😿" },
  { sound: "Mehrfaches Miau", meanings: ["Ich bin aufgeregt", "Spiel mit mir!", "Etwas Interessantes!"], emoji: "😸" },
  { sound: "Tiefes Miau", meanings: ["Ich bin unzufrieden", "Das gefällt mir nicht", "Lass mich in Ruhe"], emoji: "😾" },
  { sound: "Schnurren", meanings: ["Ich bin glücklich", "Ich fühle mich wohl", "Weitermachen!"], emoji: "😻" },
  { sound: "Fauchen", meanings: ["Ich habe Angst", "Bleib weg!", "Warnung!"], emoji: "🙀" },
  { sound: "Trillern", meanings: ["Ich freue mich dich zu sehen", "Komm mit!", "Aufregung"], emoji: "😽" },
];

const dogTranslations = [
  { sound: "Kurzes Bellen", meanings: ["Hallo!", "Aufmerksamkeit", "Jemand ist da"], emoji: "🐕" },
  { sound: "Anhaltendes Bellen", meanings: ["Alarm!", "Gefahr erkannt", "Beschützer-Modus"], emoji: "🐕‍🦺" },
  { sound: "Hohes Bellen", meanings: ["Ich bin aufgeregt", "Spielen!", "Freude"], emoji: "🐶" },
  { sound: "Tiefes Bellen", meanings: ["Warnung", "Bleib weg", "Ich bin wachsam"], emoji: "🦮" },
  { sound: "Winseln", meanings: ["Ich bin traurig", "Ich vermisse dich", "Aufmerksamkeit bitte"], emoji: "🥺" },
  { sound: "Heulen", meanings: ["Einsamkeit", "Kommunikation", "Ich rufe"], emoji: "🐺" },
  { sound: "Knurren", meanings: ["Warnung", "Das ist meins", "Ich bin unwohl"], emoji: "😤" },
  { sound: "Fiepen", meanings: ["Ich habe Schmerzen", "Ich bin ängstlich", "Hilfe"], emoji: "😢" },
];

export default function PetTranslatorScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { pets } = usePetStore();
  
  const [isListening, setIsListening] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedPetType, setSelectedPetType] = useState<"cat" | "dog">("cat");
  const [translation, setTranslation] = useState<{
    sound: string;
    meaning: string;
    confidence: number;
    emoji: string;
  } | null>(null);
  const [listenDuration, setListenDuration] = useState(0);

  const startListening = async () => {
    setIsListening(true);
    setListenDuration(0);
    setTranslation(null);

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Simuliere Aufnahme für 3 Sekunden
    let duration = 0;
    const interval = setInterval(() => {
      duration += 1;
      setListenDuration(duration);
      if (duration >= 3) {
        clearInterval(interval);
        analyzeSound();
      }
    }, 1000);
  };

  const analyzeSound = async () => {
    setIsListening(false);
    setIsAnalyzing(true);

    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    // Simulierte KI-Analyse
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const translations = selectedPetType === "cat" ? catTranslations : dogTranslations;
    const randomTranslation = translations[Math.floor(Math.random() * translations.length)];
    const randomMeaning = randomTranslation.meanings[Math.floor(Math.random() * randomTranslation.meanings.length)];

    setTranslation({
      sound: randomTranslation.sound,
      meaning: randomMeaning,
      confidence: Math.floor(Math.random() * 30) + 70,
      emoji: randomTranslation.emoji,
    });

    setIsAnalyzing(false);
  };

  return (
    <View className="flex-1">
      <LinearGradient
        colors={["#0066CC", "#00A3FF", "#8B5CF6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 0.8 }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 40,
          paddingHorizontal: 20,
        }}
      >
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-3"
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <IconSymbol name="chevron.left" size={24} color="#FFFFFF" />
          </Pressable>
          <View className="flex-1">
            <Text className="text-white text-2xl font-bold">Tier-Übersetzer</Text>
            <Text className="text-white/70 text-base">Verstehe was dein Tier sagt</Text>
          </View>
          <Text className="text-4xl">🎤</Text>
        </View>

        {/* Tier-Auswahl */}
        <GlassCard className="mb-6">
          <Text className="text-foreground font-semibold mb-3">Welches Tier möchtest du übersetzen?</Text>
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => setSelectedPetType("cat")}
              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1, flex: 1 })}
            >
              <View
                className={`p-4 rounded-xl items-center ${
                  selectedPetType === "cat" ? "bg-primary" : "bg-surface"
                }`}
              >
                <Text className="text-3xl mb-2">🐱</Text>
                <Text className={selectedPetType === "cat" ? "text-white font-bold" : "text-foreground"}>
                  Katze
                </Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => setSelectedPetType("dog")}
              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1, flex: 1 })}
            >
              <View
                className={`p-4 rounded-xl items-center ${
                  selectedPetType === "dog" ? "bg-primary" : "bg-surface"
                }`}
              >
                <Text className="text-3xl mb-2">🐕</Text>
                <Text className={selectedPetType === "dog" ? "text-white font-bold" : "text-foreground"}>
                  Hund
                </Text>
              </View>
            </Pressable>
          </View>
        </GlassCard>

        {/* Aufnahme-Button */}
        <GlassCard className="mb-6 items-center py-8">
          <Text className="text-muted text-sm mb-4">
            {isListening
              ? `Höre zu... ${listenDuration}s`
              : isAnalyzing
              ? "Analysiere Geräusch..."
              : "Tippe zum Zuhören"}
          </Text>

          <Pressable
            onPress={startListening}
            disabled={isListening || isAnalyzing}
            style={({ pressed }) => ({
              opacity: pressed || isListening || isAnalyzing ? 0.7 : 1,
              transform: [{ scale: pressed ? 0.95 : 1 }],
            })}
          >
            <LinearGradient
              colors={isListening ? ["#10B981", "#34D399"] : isAnalyzing ? ["#F59E0B", "#FBBF24"] : ["#0066CC", "#00A3FF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              {isAnalyzing ? (
                <Text className="text-white text-4xl">🔍</Text>
              ) : isListening ? (
                <Text className="text-white text-4xl">👂</Text>
              ) : (
                <IconSymbol name="mic.fill" size={48} color="#FFFFFF" />
              )}
            </LinearGradient>
          </Pressable>

          <Text className="text-muted text-xs mt-4 text-center">
            Halte das Handy nah an dein Tier
          </Text>
        </GlassCard>

        {/* Übersetzung */}
        {translation && (
          <GlassCard className="mb-6">
            <View className="items-center mb-4">
              <Text className="text-5xl mb-2">{translation.emoji}</Text>
              <Text className="text-muted text-sm">Erkanntes Geräusch:</Text>
              <Text className="text-foreground text-lg font-bold">{translation.sound}</Text>
            </View>

            <View className="bg-primary/10 rounded-xl p-4 mb-4">
              <Text className="text-muted text-sm text-center mb-1">Dein Tier sagt:</Text>
              <Text className="text-foreground text-xl font-bold text-center">
                "{translation.meaning}"
              </Text>
            </View>

            <View className="flex-row items-center justify-center">
              <View className="bg-success/20 px-3 py-1 rounded-full">
                <Text className="text-success text-sm font-medium">
                  {translation.confidence}% Konfidenz
                </Text>
              </View>
            </View>
          </GlassCard>
        )}

        {/* Geräusch-Guide */}
        <GlassCard>
          <Text className="text-foreground font-semibold mb-3">
            {selectedPetType === "cat" ? "Katzen" : "Hunde"}-Geräusche verstehen
          </Text>
          {(selectedPetType === "cat" ? catTranslations : dogTranslations).map((item, index) => (
            <View
              key={index}
              className={`flex-row items-center py-3 ${index > 0 ? "border-t border-border" : ""}`}
            >
              <Text className="text-2xl mr-3">{item.emoji}</Text>
              <View className="flex-1">
                <Text className="text-foreground font-medium">{item.sound}</Text>
                <Text className="text-muted text-sm">{item.meanings.join(" • ")}</Text>
              </View>
            </View>
          ))}
        </GlassCard>

        {/* Disclaimer */}
        <View className="mt-4 p-4 bg-warning/10 rounded-xl">
          <Text className="text-warning text-xs text-center">
            ⚠️ Die Übersetzungen sind KI-basierte Interpretationen und dienen der Unterhaltung.
            Bei Verhaltensänderungen deines Tieres konsultiere bitte einen Tierarzt.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
