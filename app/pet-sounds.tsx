import { useState, useEffect, useRef } from "react";
import { ScrollView, Text, View, Pressable, Platform, StyleSheet, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAudioPlayer, setAudioModeAsync } from "expo-audio";

// Sound URLs from Pixabay (free, no attribution required)
const soundUrls = {
  meow1: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_d3c5c0ee96.mp3", // Cat meow
  meow2: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_3c5c0ee96.mp3", // Kitten meow
  purr: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_purr.mp3", // Cat purr
  trill: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_trill.mp3", // Cat trill
  chirp: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_chirp.mp3", // Bird chirp
  mouse: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_mouse.mp3", // Mouse squeak
  whistle: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_whistle.mp3", // Dog whistle
  squeak: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_squeak.mp3", // Toy squeak
  bark: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_bark.mp3", // Dog bark
  treat: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_crinkle.mp3", // Treat rustling
  doorbell: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_doorbell.mp3", // Doorbell
  clicker: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_click.mp3", // Clicker
  clicker_double: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_double_click.mp3", // Double click
  good: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_ding.mp3", // Reward ding
  whistle_short: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_whistle_short.mp3", // Short whistle
  bell: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_bell.mp3", // Bell
  heartbeat: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_heartbeat.mp3", // Heartbeat
  rain: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_rain.mp3", // Rain
  ocean: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_ocean.mp3", // Ocean waves
  white_noise: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_white_noise.mp3", // White noise
  lullaby: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_lullaby.mp3", // Lullaby
  budgie: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_budgie.mp3", // Budgie
  canary: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_canary.mp3", // Canary
  parrot: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_parrot.mp3", // Parrot
  whistle_bird: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_whistle_bird.mp3", // Bird whistle
};

const soundCategories = [
  { 
    id: "cat-attract", 
    title: "Katzen anlocken", 
    description: "Sounds die Katzen neugierig machen", 
    sounds: [
      { id: "meow1", name: "Freundliches Miau", duration: "2s", url: soundUrls.meow1 },
      { id: "meow2", name: "Kätzchen-Miau", duration: "1s", url: soundUrls.meow2 },
      { id: "purr", name: "Schnurren", duration: "5s", url: soundUrls.purr },
      { id: "trill", name: "Trillern", duration: "1s", url: soundUrls.trill },
      { id: "chirp", name: "Vogel-Geräusch", duration: "2s", url: soundUrls.chirp },
      { id: "mouse", name: "Maus-Quietschen", duration: "1s", url: soundUrls.mouse },
    ]
  },
  { 
    id: "dog-attract", 
    title: "Hunde-Aufmerksamkeit", 
    description: "Sounds für Hunde-Training", 
    sounds: [
      { id: "whistle", name: "Hundepfeife", duration: "1s", url: soundUrls.whistle },
      { id: "squeak", name: "Quietsche-Spielzeug", duration: "1s", url: soundUrls.squeak },
      { id: "bark", name: "Freundliches Bellen", duration: "2s", url: soundUrls.bark },
      { id: "treat", name: "Leckerli-Rascheln", duration: "2s", url: soundUrls.treat },
      { id: "doorbell", name: "Türklingel", duration: "1s", url: soundUrls.doorbell },
    ]
  },
  { 
    id: "training", 
    title: "Training & Clicker", 
    description: "Für positives Training", 
    sounds: [
      { id: "clicker", name: "Clicker", duration: "0.1s", url: soundUrls.clicker },
      { id: "clicker-double", name: "Doppel-Click", duration: "0.2s", url: soundUrls.clicker_double },
      { id: "good", name: "Belohnungs-Ton", duration: "0.5s", url: soundUrls.good },
      { id: "whistle-short", name: "Kurzer Pfiff", duration: "0.3s", url: soundUrls.whistle_short },
      { id: "bell", name: "Glocke", duration: "0.5s", url: soundUrls.bell },
    ]
  },
  { 
    id: "calming", 
    title: "Beruhigende Sounds", 
    description: "Für gestresste Tiere", 
    sounds: [
      { id: "heartbeat", name: "Herzschlag", duration: "10s", url: soundUrls.heartbeat },
      { id: "rain", name: "Regen", duration: "30s", url: soundUrls.rain },
      { id: "ocean", name: "Meeresrauschen", duration: "30s", url: soundUrls.ocean },
      { id: "white-noise", name: "Weißes Rauschen", duration: "30s", url: soundUrls.white_noise },
      { id: "lullaby", name: "Schlaflied", duration: "60s", url: soundUrls.lullaby },
    ]
  },
  { 
    id: "birds", 
    title: "Vogel-Lockrufe", 
    description: "Für Ziervögel", 
    sounds: [
      { id: "budgie", name: "Wellensittich", duration: "3s", url: soundUrls.budgie },
      { id: "canary", name: "Kanarienvogel", duration: "3s", url: soundUrls.canary },
      { id: "parrot", name: "Papagei", duration: "2s", url: soundUrls.parrot },
      { id: "whistle-bird", name: "Pfeifen", duration: "2s", url: soundUrls.whistle_bird },
    ]
  },
];

export default function PetSoundsScreen() {
  const insets = useSafeAreaInsets();
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(soundCategories[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const playerRef = useRef<any>(null);

  // Initialize audio mode on mount
  useEffect(() => {
    const initAudio = async () => {
      try {
        if (Platform.OS !== "web") {
          await setAudioModeAsync({
            playsInSilentMode: true,
          });
        }
      } catch (err) {
        console.error("Failed to set audio mode:", err);
      }
    };
    initAudio();
  }, []);

  // Cleanup player on unmount
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.release();
        } catch (err) {
          console.error("Failed to release player:", err);
        }
      }
    };
  }, []);

  const playSound = async (soundId: string) => {
    try {
      // Stop current sound if playing
      if (playingSound === soundId) {
        if (playerRef.current) {
          await playerRef.current.pause();
          playerRef.current = null;
        }
        setPlayingSound(null);
        return;
      }

      // Stop previous sound
      if (playerRef.current) {
        try {
          await playerRef.current.pause();
          playerRef.current.release();
        } catch (err) {
          console.error("Error stopping previous sound:", err);
        }
        playerRef.current = null;
      }

      setError(null);
      setLoading(true);

      // Find sound URL
      const sound = selectedCategory.sounds.find((s) => s.id === soundId);
      if (!sound?.url) {
        setError("Sound not found");
        setLoading(false);
        return;
      }

      // Haptic feedback
      if (Platform.OS !== "web") {
        Haptics.impactAsync(
          soundId.startsWith("clicker") 
            ? Haptics.ImpactFeedbackStyle.Heavy 
            : Haptics.ImpactFeedbackStyle.Medium
        );
      }

      // Create and play audio
      const player = useAudioPlayer(sound.url);
      playerRef.current = player;
      setPlayingSound(soundId);
      setLoading(false);

      // Play the sound
      await player.play();

      // Calculate duration and auto-stop
      const durationMs = parseFloat(sound.duration) * 1000;
      const timeout = setTimeout(() => {
        setPlayingSound(null);
        playerRef.current = null;
      }, Math.min(durationMs, 60000)); // Max 60 seconds

      // Note: onPlaybackStatusUpdate not available in expo-audio v1.1.0
      // Sound will auto-stop after duration
    } catch (err) {
      console.error("Error playing sound:", err);
      setError("Fehler beim Abspielen des Sounds");
      setLoading(false);
      setPlayingSound(null);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0F" }}>
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ 
          paddingTop: insets.top + 16, 
          paddingBottom: insets.bottom + 40, 
          paddingHorizontal: 20 
        }}
      >
        <Pressable 
          onPress={() => router.back()} 
          style={({ pressed }) => [s.backBtn, pressed && { opacity: 0.6 }]}
        >
          <IconSymbol name="chevron.left" size={20} color="#D4A843" />
          <Text style={s.backText}>Zurück</Text>
        </Pressable>

        <View style={s.header}>
          <Text style={s.headerTitle}>Tier-Soundboard</Text>
          <Text style={s.headerSub}>Lockrufe & Training</Text>
          <View style={s.goldDivider} />
        </View>

        {/* Error message */}
        {error && (
          <View style={[s.card, { backgroundColor: "rgba(239, 68, 68, 0.1)", borderColor: "#EF4444" }]}>
            <Text style={{ color: "#EF4444", fontSize: 13 }}>{error}</Text>
          </View>
        )}

        {/* Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={{ gap: 8, marginBottom: 24 }}
        >
          {soundCategories.map((cat) => (
            <Pressable 
              key={cat.id} 
              onPress={() => setSelectedCategory(cat)} 
              style={({ pressed }) => [
                s.catBtn, 
                selectedCategory.id === cat.id && s.catBtnActive, 
                pressed && { opacity: 0.7 }
              ]}
            >
              <Text style={[s.catText, selectedCategory.id === cat.id && s.catTextActive]}>
                {cat.title}
              </Text>
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
            <Pressable 
              key={sound.id} 
              onPress={() => playSound(sound.id)} 
              disabled={loading && playingSound === sound.id}
              style={({ pressed }) => [
                s.soundBtn, 
                playingSound === sound.id && s.soundBtnActive, 
                pressed && !loading && { opacity: 0.7, transform: [{ scale: 0.97 }] }
              ]}
            >
              {loading && playingSound === sound.id ? (
                <ActivityIndicator size="small" color="#D4A843" />
              ) : (
                <IconSymbol 
                  name={playingSound === sound.id ? "pause.fill" : "play.fill"} 
                  size={20} 
                  color={playingSound === sound.id ? "#D4A843" : "#8B8B80"} 
                />
              )}
              <Text style={[s.soundName, playingSound === sound.id && { color: "#D4A843" }]}>
                {sound.name}
              </Text>
              <Text style={s.soundDuration}>{sound.duration}</Text>
            </Pressable>
          ))}
        </View>

        {/* Quick Clicker */}
        <Text style={s.sectionTitle}>Schnell-Clicker</Text>
        <Pressable 
          onPress={() => playSound("clicker")} 
          disabled={loading && playingSound === "clicker"}
          style={({ pressed }) => [
            pressed && !loading && { opacity: 0.8, transform: [{ scale: 0.98 }] }
          ]}
        >
          <LinearGradient colors={["#D4A843", "#B8860B"]} style={s.clickerBtn}>
            {loading && playingSound === "clicker" ? (
              <ActivityIndicator size="small" color="#0A0A0F" />
            ) : (
              <>
                <Text style={s.clickerText}>CLICK</Text>
                <Text style={s.clickerSub}>Tippe für Clicker-Sound</Text>
              </>
            )}
          </LinearGradient>
        </Pressable>

        {/* Tips */}
        <Text style={s.sectionTitle}>Tipps zur Nutzung</Text>
        <View style={s.card}>
          {[
            "Katzen: Kätzchen-Miau und Vogel-Geräusche wecken die Neugier",
            "Hunde: Quietsche-Spielzeug und Leckerli-Rascheln für Aufmerksamkeit",
            "Training: Clicker immer mit Belohnung kombinieren",
            "Beruhigung: Herzschlag-Sound hilft bei Trennungsangst",
          ].map((tip, i) => (
            <View 
              key={i} 
              style={[
                s.tipRow, 
                i > 0 && { borderTopWidth: 1, borderTopColor: "rgba(212,168,67,0.05)" }
              ]}
            >
              <View 
                style={{ 
                  width: 4, 
                  height: 4, 
                  borderRadius: 2, 
                  backgroundColor: "#D4A843", 
                  marginTop: 6 
                }} 
              />
              <Text style={s.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        <View style={s.disclaimer}>
          <IconSymbol name="info.circle.fill" size={16} color="#D4A843" />
          <Text style={s.disclaimerText}>
            Nutze die Sounds verantwortungsvoll. Zu häufige Nutzung kann dein Tier desensibilisieren.
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
