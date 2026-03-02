import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { usePetStore } from "@/lib/pet-store";

export default function AiSymptomScreen() {
  const insets = useSafeAreaInsets();
  const { pets } = usePetStore();
  const [selectedPet, setSelectedPet] = useState(pets[0]?.id || "");
  const [symptoms, setSymptoms] = useState("");
  const [duration, setDuration] = useState(1);
  const [severity, setSeverity] = useState("mild");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const severityLevels = [
    { value: "mild", label: "Mild", color: "#F39C12" },
    { value: "medium", label: "Mittel", color: "#E67E22" },
    { value: "severe", label: "Schwer", color: "#E74C3C" },
  ];

  const handleAnalyze = async () => {
    if (!symptoms.trim()) {
      Alert.alert("Fehler", "Bitte beschreiben Sie die Symptome");
      return;
    }

    setIsAnalyzing(true);
    try {
      // Simulate AI analysis
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const urgencyMap: Record<string, string> = {
        mild: "Gering",
        medium: "Mittel",
        severe: "Hoch",
      };

      const recommendationsMap: Record<string, string[]> = {
        mild: [
          "Beobachten Sie Ihr Tier genau",
          "Ausreichend Wasser bereitstellen",
          "Ruhephase einplanen",
        ],
        medium: [
          "Tierarzt kontaktieren",
          "Symptome dokumentieren",
          "Futter anpassen",
        ],
        severe: [
          "Sofort zum Tierarzt gehen",
          "Notfalldienst anrufen",
          "Vitalzeichen überwachen",
        ],
      };

      setResult({
        urgency: urgencyMap[severity],
        urgencyLevel: severity,
        duration,
        recommendations: recommendationsMap[severity] || [],
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
              KI-Experte
            </Text>
            <Text className="text-white text-2xl font-bold">
              Symptom-Analyse
            </Text>
          </View>
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
          >
            <IconSymbol size={20} name="xmark" color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Pet Selector */}
        <View className="mb-6">
          <Text className="text-white font-semibold mb-3">Welches Tier?</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="gap-2"
          >
            {pets.map((pet) => (
              <Pressable
                key={pet.id}
                onPress={() => setSelectedPet(pet.id)}
                className={`px-4 py-2 rounded-full ${
                  selectedPet === pet.id
                    ? "bg-white"
                    : "bg-white/20 border border-white/30"
                }`}
              >
                <Text
                  className={`font-semibold ${
                    selectedPet === pet.id ? "text-purple-600" : "text-white"
                  }`}
                >
                  {pet.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Symptoms Input */}
        <View className="mb-6">
          <Text className="text-white font-semibold mb-3">
            Beschreiben Sie die Symptome
          </Text>
          <TextInput
            placeholder="z.B. Erbrechen, Durchfall, Lethargie..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={symptoms}
            onChangeText={setSymptoms}
            multiline
            numberOfLines={4}
            className="bg-white/10 text-white p-4 rounded-2xl border border-white/20"
            style={{ textAlignVertical: "top" }}
          />
        </View>

        {/* Duration Slider */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-white font-semibold">Dauer</Text>
            <Text className="text-white/70 text-sm">
              {duration} {duration === 1 ? "Tag" : "Tage"}
            </Text>
          </View>
          <View className="flex-row gap-2">
            {[1, 2, 3, 7, 14].map((day) => (
              <Pressable
                key={day}
                onPress={() => setDuration(day)}
                className={`flex-1 py-3 rounded-lg ${
                  duration === day ? "bg-white" : "bg-white/20"
                }`}
              >
                <Text
                  className={`text-center font-semibold ${
                    duration === day ? "text-purple-600" : "text-white"
                  }`}
                >
                  {day}d
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Severity Selector */}
        <View className="mb-6">
          <Text className="text-white font-semibold mb-3">Schweregrad</Text>
          <View className="gap-2">
            {severityLevels.map((level) => (
              <Pressable
                key={level.value}
                onPress={() => setSeverity(level.value)}
                className={`p-4 rounded-2xl border-2 flex-row items-center gap-3 ${
                  severity === level.value
                    ? "bg-white/20 border-white"
                    : "bg-white/5 border-white/20"
                }`}
              >
                <View
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: level.color }}
                />
                <Text className="text-white font-semibold flex-1">
                  {level.label}
                </Text>
                {severity === level.value && (
                  <IconSymbol size={20} name="checkmark" color="#FFFFFF" />
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Analyze Button */}
        <Pressable
          onPress={handleAnalyze}
          disabled={isAnalyzing}
          className={`py-4 rounded-2xl items-center justify-center mb-6 ${
            isAnalyzing ? "opacity-60" : ""
          }`}
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
            <Text className="text-white font-bold text-lg">
              {isAnalyzing ? "Analysiere..." : "KI-Analyse starten"}
            </Text>
          </LinearGradient>
        </Pressable>

        {/* Results */}
        {result && (
          <View className="bg-white/10 rounded-2xl p-6 border border-white/20 mb-6">
            <View className="flex-row items-center gap-3 mb-4">
              <View
                className="w-12 h-12 rounded-full items-center justify-center"
                style={{
                  backgroundColor:
                    result.urgencyLevel === "severe"
                      ? "#E74C3C"
                      : result.urgencyLevel === "medium"
                        ? "#E67E22"
                        : "#F39C12",
                }}
              >
                <IconSymbol
                  size={24}
                  name="exclamationmark.triangle.fill"
                  color="#FFFFFF"
                />
              </View>
              <View>
                <Text className="text-white/70 text-sm">Dringlichkeit</Text>
                <Text className="text-white font-bold text-lg">
                  {result.urgency}
                </Text>
              </View>
            </View>

            <Text className="text-white font-semibold mb-3">
              Empfehlungen:
            </Text>
            {result.recommendations.map((rec: string, idx: number) => (
              <View key={idx} className="flex-row gap-3 mb-2">
                <Text className="text-white/60">•</Text>
                <Text className="text-white/80 flex-1">{rec}</Text>
              </View>
            ))}

            <View className="mt-4 pt-4 border-t border-white/20">
              <Text className="text-white/60 text-xs">
                <Text className="font-semibold">Wichtig:</Text> Dies ist eine
                KI-Einschätzung. Bei schweren Symptomen konsultieren Sie sofort
                einen Tierarzt.
              </Text>
            </View>
          </View>
        )}

        {/* Liability Disclaimer */}
        <View className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <Text className="text-white/60 text-xs leading-relaxed">
            <Text className="font-semibold">Haftungsausschluss:</Text> Diese
            KI-Analyse ersetzt nicht die Diagnose durch einen Tierarzt. Bei
            Notfällen wenden Sie sich sofort an einen Fachmann.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
