import { useState } from "react";
import { ScrollView, Text, View, Pressable, Platform, Vibration } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import { GlassCard } from "@/components/ui/glass-card";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

// Sound-Kategorien
const soundCategories = [
  {
    id: "cat-attract",
    title: "Katzen anlocken",
    emoji: "🐱",
    description: "Sounds die Katzen neugierig machen",
    sounds: [
      { id: "meow1", name: "Freundliches Miau", emoji: "😺", duration: "2s" },
      { id: "meow2", name: "Kätzchen-Miau", emoji: "🐱", duration: "1s" },
      { id: "purr", name: "Schnurren", emoji: "😻", duration: "5s" },
      { id: "trill", name: "Trillern", emoji: "😽", duration: "1s" },
      { id: "chirp", name: "Vogel-Geräusch", emoji: "🐦", duration: "2s" },
      { id: "mouse", name: "Maus-Quietschen", emoji: "🐭", duration: "1s" },
    ],
  },
  {
    id: "dog-attract",
    title: "Hunde-Aufmerksamkeit",
    emoji: "🐕",
    description: "Sounds für Hunde-Training",
    sounds: [
      { id: "whistle", name: "Hundepfeife", emoji: "📯", duration: "1s" },
      { id: "squeak", name: "Quietsche-Spielzeug", emoji: "🧸", duration: "1s" },
      { id: "bark", name: "Freundliches Bellen", emoji: "🐶", duration: "2s" },
      { id: "treat", name: "Leckerli-Rascheln", emoji: "🦴", duration: "2s" },
      { id: "doorbell", name: "Türklingel", emoji: "🔔", duration: "1s" },
    ],
  },
  {
    id: "training",
    title: "Training & Clicker",
    emoji: "🎯",
    description: "Für positives Training",
    sounds: [
      { id: "clicker", name: "Clicker", emoji: "👆", duration: "0.1s" },
      { id: "clicker-double", name: "Doppel-Click", emoji: "✌️", duration: "0.2s" },
      { id: "good", name: "Belohnungs-Ton", emoji: "✅", duration: "0.5s" },
      { id: "whistle-short", name: "Kurzer Pfiff", emoji: "🎵", duration: "0.3s" },
      { id: "bell", name: "Glocke", emoji: "🔔", duration: "0.5s" },
    ],
  },
  {
    id: "calming",
    title: "Beruhigende Sounds",
    emoji: "😴",
    description: "Für gestresste Tiere",
    sounds: [
      { id: "heartbeat", name: "Herzschlag", emoji: "💓", duration: "10s" },
      { id: "rain", name: "Regen", emoji: "🌧️", duration: "30s" },
      { id: "ocean", name: "Meeresrauschen", emoji: "🌊", duration: "30s" },
      { id: "white-noise", name: "Weißes Rauschen", emoji: "📻", duration: "30s" },
      { id: "lullaby", name: "Schlaflied", emoji: "🎶", duration: "60s" },
    ],
  },
  {
    id: "birds",
    title: "Vogel-Lockrufe",
    emoji: "🦜",
    description: "Für Ziervögel",
    sounds: [
      { id: "budgie", name: "Wellensittich", emoji: "🐦", duration: "3s" },
      { id: "canary", name: "Kanarienvogel", emoji: "🐤", duration: "3s" },
      { id: "parrot", name: "Papagei", emoji: "🦜", duration: "2s" },
      { id: "whistle-bird", name: "Pfeifen", emoji: "🎵", duration: "2s" },
    ],
  },
];

export default function PetSoundsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(soundCategories[0]);

  const playSound = async (soundId: string, soundName: string) => {
    if (playingSound === soundId) {
      setPlayingSound(null);
      return;
    }

    setPlayingSound(soundId);

    // Haptic Feedback
    if (Platform.OS !== "web") {
      if (soundId === "clicker" || soundId === "clicker-double") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        if (soundId === "clicker-double") {
          setTimeout(() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          }, 100);
        }
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    }

    // Simuliere Sound-Wiedergabe (in Produktion würde hier echter Audio abgespielt)
    const sound = selectedCategory.sounds.find((s) => s.id === soundId);
    const duration = sound?.duration || "1s";
    const ms = parseFloat(duration) * 1000;

    setTimeout(() => {
      setPlayingSound(null);
    }, Math.min(ms, 3000));
  };

  return (
    <View className="flex-1">
      <LinearGradient
        colors={["#10B981", "#34D399", "#6EE7B7"]}
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
            <Text className="text-white text-2xl font-bold">Tier-Soundboard</Text>
            <Text className="text-white/70 text-base">Lockrufe & Training</Text>
          </View>
          <Text className="text-4xl">🔊</Text>
        </View>

        {/* Kategorie-Auswahl */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-6"
          contentContainerStyle={{ gap: 12 }}
        >
          {soundCategories.map((category) => (
            <Pressable
              key={category.id}
              onPress={() => setSelectedCategory(category)}
              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
            >
              <View
                className={`px-4 py-3 rounded-xl flex-row items-center ${
                  selectedCategory.id === category.id
                    ? "bg-white"
                    : "bg-white/20"
                }`}
              >
                <Text className="text-xl mr-2">{category.emoji}</Text>
                <Text
                  className={
                    selectedCategory.id === category.id
                      ? "text-primary font-bold"
                      : "text-white font-medium"
                  }
                >
                  {category.title}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {/* Aktuelle Kategorie */}
        <GlassCard className="mb-6">
          <View className="flex-row items-center mb-2">
            <Text className="text-3xl mr-3">{selectedCategory.emoji}</Text>
            <View>
              <Text className="text-foreground text-xl font-bold">{selectedCategory.title}</Text>
              <Text className="text-muted text-sm">{selectedCategory.description}</Text>
            </View>
          </View>
        </GlassCard>

        {/* Sound-Buttons */}
        <View className="flex-row flex-wrap gap-3 mb-6">
          {selectedCategory.sounds.map((sound) => (
            <Pressable
              key={sound.id}
              onPress={() => playSound(sound.id, sound.name)}
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.95 : 1 }],
                width: "47%",
              })}
            >
              <GlassCard
                className={`items-center py-4 ${
                  playingSound === sound.id ? "border-2 border-primary" : ""
                }`}
              >
                <Text className="text-4xl mb-2">{sound.emoji}</Text>
                <Text className="text-foreground font-medium text-center">{sound.name}</Text>
                <Text className="text-muted text-xs">{sound.duration}</Text>
                {playingSound === sound.id && (
                  <View className="absolute top-2 right-2">
                    <Text className="text-primary text-lg">▶️</Text>
                  </View>
                )}
              </GlassCard>
            </Pressable>
          ))}
        </View>

        {/* Schnell-Clicker */}
        <GlassCard className="mb-6">
          <Text className="text-foreground font-semibold mb-4 text-center">Schnell-Clicker</Text>
          <Pressable
            onPress={() => playSound("clicker", "Clicker")}
            style={({ pressed }) => ({
              opacity: pressed ? 0.9 : 1,
              transform: [{ scale: pressed ? 0.95 : 1 }],
            })}
          >
            <LinearGradient
              colors={["#F59E0B", "#FBBF24"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: "100%",
                height: 80,
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text className="text-white text-2xl font-bold">CLICK!</Text>
              <Text className="text-white/80 text-sm">Tippe für Clicker-Sound</Text>
            </LinearGradient>
          </Pressable>
        </GlassCard>

        {/* Tipps */}
        <GlassCard>
          <Text className="text-foreground font-semibold mb-3">💡 Tipps zur Nutzung</Text>
          <View className="gap-2">
            <Text className="text-muted text-sm">
              • <Text className="font-medium">Katzen:</Text> Kätzchen-Miau und Vogel-Geräusche wecken die Neugier
            </Text>
            <Text className="text-muted text-sm">
              • <Text className="font-medium">Hunde:</Text> Quietsche-Spielzeug und Leckerli-Rascheln für Aufmerksamkeit
            </Text>
            <Text className="text-muted text-sm">
              • <Text className="font-medium">Training:</Text> Clicker immer mit Belohnung kombinieren
            </Text>
            <Text className="text-muted text-sm">
              • <Text className="font-medium">Beruhigung:</Text> Herzschlag-Sound hilft bei Trennungsangst
            </Text>
          </View>
        </GlassCard>

        {/* Disclaimer */}
        <View className="mt-4 p-4 bg-warning/10 rounded-xl">
          <Text className="text-warning text-xs text-center">
            ⚠️ Nutze die Sounds verantwortungsvoll. Zu häufige Nutzung kann dein Tier desensibilisieren.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
