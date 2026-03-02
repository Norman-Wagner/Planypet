import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";

import { IconSymbol } from "@/components/ui/icon-symbol";

export default function BreedScannerScreen() {
  const insets = useSafeAreaInsets();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      analyzeImage(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      analyzeImage(result.assets[0].uri);
    }
  };

  const analyzeImage = async (uri: string) => {
    setIsAnalyzing(true);
    try {
      // Simulate AI analysis
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setResult({
        breed: "Labrador Retriever",
        confidence: 94,
        size: "Groß (25-36 kg)",
        temperament: "Freundlich, Intelligent, Energisch",
        lifespan: "10-12 Jahre",
        characteristics: [
          "Wasserresistentes Fell",
          "Ausgezeichnete Schwimmer",
          "Hervorragende Familienhunde",
          "Trainierbar und loyal",
        ],
      });
    } catch (error) {
      Alert.alert("Fehler", "Analyse fehlgeschlagen");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <LinearGradient
      colors={["#7B3FF2", "#5B1FD2"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 100,
          paddingHorizontal: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-8">
          <View>
            <Text className="text-white text-sm font-medium opacity-80">
              KI-Erkennung
            </Text>
            <Text className="text-white text-2xl font-bold">Rasse-Scanner</Text>
          </View>
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
          >
            <IconSymbol size={20} name="xmark" color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Image Display or Upload Area */}
        {selectedImage ? (
          <View className="mb-6 rounded-2xl overflow-hidden border-2 border-white/30">
            <Image
              source={{ uri: selectedImage }}
              style={{ width: "100%", height: 280 }}
            />
            <Pressable
              onPress={() => {
                setSelectedImage(null);
                setResult(null);
              }}
              className="absolute top-3 right-3 w-10 h-10 bg-black/50 rounded-full items-center justify-center"
            >
              <IconSymbol size={20} name="xmark" color="#FFFFFF" />
            </Pressable>
          </View>
        ) : (
          <View className="bg-white/10 rounded-2xl border-2 border-dashed border-white/30 p-8 items-center justify-center mb-6 h-48">
            <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center mb-4">
              <IconSymbol size={32} name="camera.fill" color="#FFFFFF" />
            </View>
            <Text className="text-white font-semibold text-center mb-2">
              Foto hochladen
            </Text>
            <Text className="text-white/60 text-xs text-center">
              Machen Sie ein Foto oder wählen Sie ein Bild aus
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View className="gap-3 mb-6">
          <Pressable
            onPress={handleTakePhoto}
            className="py-4 rounded-2xl items-center justify-center"
          >
            <LinearGradient
              colors={["rgba(255,255,255,0.3)", "rgba(255,255,255,0.1)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: "100%",
                paddingVertical: 16,
                borderRadius: 16,
                alignItems: "center",
              }}
            >
              <View className="flex-row items-center gap-2">
                <IconSymbol size={20} name="camera.fill" color="#FFFFFF" />
                <Text className="text-white font-bold text-lg">Foto machen</Text>
              </View>
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={handlePickImage}
            className="py-4 rounded-2xl items-center justify-center"
          >
            <LinearGradient
              colors={["rgba(255,255,255,0.2)", "rgba(255,255,255,0.05)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: "100%",
                paddingVertical: 16,
                borderRadius: 16,
                alignItems: "center",
              }}
            >
              <View className="flex-row items-center gap-2">
                <IconSymbol size={20} name="photo.fill" color="#FFFFFF" />
                <Text className="text-white font-bold text-lg">
                  Galerie öffnen
                </Text>
              </View>
            </LinearGradient>
          </Pressable>
        </View>

        {/* Loading State */}
        {isAnalyzing && (
          <View className="bg-white/10 rounded-2xl p-6 border border-white/20 mb-6 items-center">
            <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center mb-3">
              <Text className="text-lg">⏳</Text>
            </View>
            <Text className="text-white font-semibold">Analysiere Foto...</Text>
            <Text className="text-white/60 text-xs mt-1">
              Dies kann bis zu 10 Sekunden dauern
            </Text>
          </View>
        )}

        {/* Results */}
        {result && !isAnalyzing && (
          <View className="gap-4 mb-6">
            {/* Main Result */}
            <View className="bg-white/10 rounded-2xl p-6 border border-white/20">
              <View className="flex-row items-center justify-between mb-4">
                <View>
                  <Text className="text-white/70 text-sm">Erkannte Rasse</Text>
                  <Text className="text-white font-bold text-2xl">
                    {result.breed}
                  </Text>
                </View>
                <View className="items-center">
                  <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center mb-2">
                    <Text className="text-2xl font-bold text-white">
                      {result.confidence}%
                    </Text>
                  </View>
                  <Text className="text-white/60 text-xs">Genauigkeit</Text>
                </View>
              </View>
            </View>

            {/* Details Grid */}
            <View className="gap-3">
              <View className="flex-row gap-3">
                <View className="flex-1 bg-white/10 rounded-2xl p-4 border border-white/20">
                  <Text className="text-white/70 text-xs mb-1">Größe</Text>
                  <Text className="text-white font-semibold text-sm">
                    {result.size}
                  </Text>
                </View>
                <View className="flex-1 bg-white/10 rounded-2xl p-4 border border-white/20">
                  <Text className="text-white/70 text-xs mb-1">Lebensdauer</Text>
                  <Text className="text-white font-semibold text-sm">
                    {result.lifespan}
                  </Text>
                </View>
              </View>
            </View>

            {/* Temperament */}
            <View className="bg-white/10 rounded-2xl p-4 border border-white/20">
              <Text className="text-white font-semibold mb-2">Charakter</Text>
              <Text className="text-white/80 text-sm">{result.temperament}</Text>
            </View>

            {/* Characteristics */}
            <View className="bg-white/10 rounded-2xl p-4 border border-white/20">
              <Text className="text-white font-semibold mb-3">Besonderheiten</Text>
              <View className="gap-2">
                {result.characteristics.map((char: string, idx: number) => (
                  <View key={idx} className="flex-row gap-2">
                    <Text className="text-white/60">•</Text>
                    <Text className="text-white/80 flex-1">{char}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Share Button */}
            <Pressable className="py-4 rounded-2xl items-center justify-center">
              <LinearGradient
                colors={["rgba(255,255,255,0.2)", "rgba(255,255,255,0.05)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: "100%",
                  paddingVertical: 16,
                  borderRadius: 16,
                  alignItems: "center",
                }}
              >
                <View className="flex-row items-center gap-2">
                  <IconSymbol size={20} name="square.and.arrow.up" color="#FFFFFF" />
                  <Text className="text-white font-bold text-lg">Teilen</Text>
                </View>
              </LinearGradient>
            </Pressable>
          </View>
        )}

        {/* Liability Disclaimer */}
        <View className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <Text className="text-white/60 text-xs leading-relaxed">
            <Text className="font-semibold">Hinweis:</Text> Diese KI-Erkennung
            basiert auf Bildanalyse. Das Ergebnis ist nicht 100% genau. Für
            genaue Rassebestimmung konsultieren Sie einen Tierarzt.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
