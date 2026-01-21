import { useState } from "react";
import { ScrollView, Text, View, Pressable, Platform, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";

import { GlassCard } from "@/components/ui/glass-card";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useImagePicker } from "@/hooks/use-image-picker";

// Beispiel-Rassen-Daten
const breedInfo: Record<string, { description: string; traits: string[]; care: string[] }> = {
  "Labrador Retriever": {
    description: "Freundlicher, aktiver und aufgeschlossener Familienhund.",
    traits: ["Freundlich", "Aktiv", "Intelligent", "Gut mit Kindern"],
    care: ["Viel Bewegung", "Regelmäßiges Bürsten", "Gewichtskontrolle"],
  },
  "Deutscher Schäferhund": {
    description: "Treuer, mutiger und vielseitiger Arbeitshund.",
    traits: ["Loyal", "Mutig", "Intelligent", "Beschützend"],
    care: ["Tägliche Bewegung", "Mentale Stimulation", "Fellpflege"],
  },
  "Golden Retriever": {
    description: "Sanftmütiger, intelligenter und liebevoller Begleiter.",
    traits: ["Sanftmütig", "Geduldig", "Zuverlässig", "Verspielt"],
    care: ["Regelmäßiges Schwimmen", "Fellpflege", "Soziale Interaktion"],
  },
  "Britisch Kurzhaar": {
    description: "Ruhige, entspannte und unabhängige Katzenrasse.",
    traits: ["Ruhig", "Unabhängig", "Anhänglich", "Pflegeleicht"],
    care: ["Wöchentliches Bürsten", "Spielzeit", "Gewichtskontrolle"],
  },
  "Maine Coon": {
    description: "Sanfte Riesen mit freundlichem Wesen.",
    traits: ["Freundlich", "Verspielt", "Intelligent", "Sozial"],
    care: ["Tägliches Bürsten", "Viel Platz", "Interaktives Spielzeug"],
  },
  "Perserkatze": {
    description: "Elegante, ruhige Katze mit luxuriösem Fell.",
    traits: ["Ruhig", "Sanft", "Anhänglich", "Gemütlich"],
    care: ["Tägliche Fellpflege", "Augenpflege", "Ruhige Umgebung"],
  },
};

export default function BreedScannerScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { pickImage, takePhoto } = useImagePicker();
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    breed: string;
    confidence: number;
    mixedBreeds?: { breed: string; percentage: number }[];
    info: typeof breedInfo[string];
  } | null>(null);
  const [petType, setPetType] = useState<"dog" | "cat">("dog");

  const handlePickImage = async () => {
    const uri = await pickImage();
    if (uri) {
      setSelectedImage(uri);
      analyzeImage(uri);
    }
  };

  const handleTakePhoto = async () => {
    const uri = await takePhoto();
    if (uri) {
      setSelectedImage(uri);
      analyzeImage(uri);
    }
  };

  const analyzeImage = async (uri: string) => {
    setIsAnalyzing(true);
    setResult(null);

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Simulierte KI-Analyse
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Zufällige Rasse basierend auf Tiertyp
    const dogBreeds = ["Labrador Retriever", "Deutscher Schäferhund", "Golden Retriever"];
    const catBreeds = ["Britisch Kurzhaar", "Maine Coon", "Perserkatze"];
    const breeds = petType === "dog" ? dogBreeds : catBreeds;
    
    const mainBreed = breeds[Math.floor(Math.random() * breeds.length)];
    const isMixed = Math.random() > 0.5;

    const analysisResult = {
      breed: mainBreed,
      confidence: Math.floor(Math.random() * 20) + 75,
      mixedBreeds: isMixed
        ? [
            { breed: mainBreed, percentage: Math.floor(Math.random() * 30) + 50 },
            { breed: breeds[(breeds.indexOf(mainBreed) + 1) % breeds.length], percentage: Math.floor(Math.random() * 30) + 20 },
          ]
        : undefined,
      info: breedInfo[mainBreed],
    };

    setResult(analysisResult);
    setIsAnalyzing(false);

    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const resetScan = () => {
    setSelectedImage(null);
    setResult(null);
  };

  return (
    <View className="flex-1">
      <LinearGradient
        colors={["#8B5CF6", "#A78BFA", "#C4B5FD"]}
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
            <Text className="text-white text-2xl font-bold">Rassen-Scanner</Text>
            <Text className="text-white/70 text-base">Erkenne die Rasse deines Tieres</Text>
          </View>
          <Text className="text-4xl">📷</Text>
        </View>

        {/* Tier-Auswahl */}
        <GlassCard className="mb-6">
          <Text className="text-foreground font-semibold mb-3">Welches Tier möchtest du scannen?</Text>
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => setPetType("dog")}
              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1, flex: 1 })}
            >
              <View
                className={`p-4 rounded-xl items-center ${
                  petType === "dog" ? "bg-primary" : "bg-surface"
                }`}
              >
                <Text className="text-3xl mb-2">🐕</Text>
                <Text className={petType === "dog" ? "text-white font-bold" : "text-foreground"}>
                  Hund
                </Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => setPetType("cat")}
              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1, flex: 1 })}
            >
              <View
                className={`p-4 rounded-xl items-center ${
                  petType === "cat" ? "bg-primary" : "bg-surface"
                }`}
              >
                <Text className="text-3xl mb-2">🐱</Text>
                <Text className={petType === "cat" ? "text-white font-bold" : "text-foreground"}>
                  Katze
                </Text>
              </View>
            </Pressable>
          </View>
        </GlassCard>

        {/* Bild-Bereich */}
        {!selectedImage ? (
          <GlassCard className="mb-6 items-center py-8">
            <Text className="text-muted text-sm mb-6">Wähle ein Foto deines Tieres</Text>
            
            <View className="flex-row gap-4">
              <Pressable
                onPress={handleTakePhoto}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                })}
              >
                <LinearGradient
                  colors={["#8B5CF6", "#A78BFA"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 20,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconSymbol name="camera.fill" size={32} color="#FFFFFF" />
                  <Text className="text-white text-xs mt-2">Kamera</Text>
                </LinearGradient>
              </Pressable>

              <Pressable
                onPress={handlePickImage}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                })}
              >
                <LinearGradient
                  colors={["#6366F1", "#818CF8"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 20,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconSymbol name="photo.fill" size={32} color="#FFFFFF" />
                  <Text className="text-white text-xs mt-2">Galerie</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </GlassCard>
        ) : (
          <GlassCard className="mb-6">
            <View className="rounded-xl overflow-hidden mb-4">
              <Image
                source={{ uri: selectedImage }}
                style={{ width: "100%", height: 250 }}
                contentFit="cover"
              />
              {isAnalyzing && (
                <View className="absolute inset-0 bg-black/50 items-center justify-center">
                  <Text className="text-white text-lg font-bold">🔍 Analysiere...</Text>
                </View>
              )}
            </View>

            <Pressable
              onPress={resetScan}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Text className="text-primary text-center font-medium">Neues Foto aufnehmen</Text>
            </Pressable>
          </GlassCard>
        )}

        {/* Ergebnis */}
        {result && (
          <>
            <GlassCard className="mb-4">
              <View className="items-center mb-4">
                <Text className="text-4xl mb-2">{petType === "dog" ? "🐕" : "🐱"}</Text>
                <Text className="text-foreground text-2xl font-bold">{result.breed}</Text>
                <View className="bg-success/20 px-3 py-1 rounded-full mt-2">
                  <Text className="text-success text-sm font-medium">
                    {result.confidence}% Übereinstimmung
                  </Text>
                </View>
              </View>

              {result.mixedBreeds && (
                <View className="bg-surface rounded-xl p-4 mb-4">
                  <Text className="text-muted text-sm mb-2">Mischlings-Analyse:</Text>
                  {result.mixedBreeds.map((mix, index) => (
                    <View key={index} className="flex-row items-center mb-2">
                      <View className="flex-1 h-2 bg-border rounded-full overflow-hidden mr-3">
                        <View
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${mix.percentage}%` }}
                        />
                      </View>
                      <Text className="text-foreground text-sm w-20">{mix.percentage}%</Text>
                      <Text className="text-muted text-sm flex-1">{mix.breed}</Text>
                    </View>
                  ))}
                </View>
              )}

              <Text className="text-muted text-sm">{result.info.description}</Text>
            </GlassCard>

            <GlassCard className="mb-4">
              <Text className="text-foreground font-semibold mb-3">Charaktereigenschaften</Text>
              <View className="flex-row flex-wrap gap-2">
                {result.info.traits.map((trait, index) => (
                  <View key={index} className="bg-primary/10 px-3 py-1 rounded-full">
                    <Text className="text-primary text-sm">{trait}</Text>
                  </View>
                ))}
              </View>
            </GlassCard>

            <GlassCard>
              <Text className="text-foreground font-semibold mb-3">Pflegetipps</Text>
              {result.info.care.map((tip, index) => (
                <View key={index} className="flex-row items-center mb-2">
                  <Text className="text-primary mr-2">✓</Text>
                  <Text className="text-foreground text-sm">{tip}</Text>
                </View>
              ))}
            </GlassCard>
          </>
        )}

        {/* Disclaimer */}
        <View className="mt-4 p-4 bg-white/10 rounded-xl">
          <Text className="text-white text-xs text-center">
            ⚠️ Die Rassen-Erkennung ist eine KI-basierte Schätzung und kann von der tatsächlichen Rasse abweichen.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
