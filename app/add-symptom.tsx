import { useState } from "react";
import { ScrollView, Text, View, Pressable, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { PetAvatar } from "@/components/ui/pet-avatar";
import { VoiceInput } from "@/components/ui/voice-input";
import { useColors } from "@/hooks/use-colors";
import { usePetStore, Pet } from "@/lib/pet-store";

export default function AddSymptomScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { pets, addHealthRecord } = usePetStore();
  
  const [selectedPet, setSelectedPet] = useState<Pet | null>(pets[0] || null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [recordType, setRecordType] = useState<"symptom" | "vaccination" | "medication" | "note">("symptom");
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showVoiceInput, setShowVoiceInput] = useState(false);

  const handleAnalyze = async () => {
    if (!selectedPet || !description) {
      Alert.alert("Fehler", "Bitte beschreibe die Symptome");
      return;
    }

    setIsAnalyzing(true);
    try {
      // Simulate AI analysis
      setTimeout(() => {
        const analysis = `Basierend auf den beschriebenen Symptomen könnte es sich um folgende Ursachen handeln:\n\n1. Ernährungsbedingte Beschwerden\n2. Leichte Infektion\n3. Stress oder Umstellungsreaktion\n\n⚠️ Empfehlung: Bei anhaltenden oder sich verschlimmernden Symptomen bitte einen Tierarzt aufsuchen!`;
        setAiAnalysis(analysis);
        setIsAnalyzing(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to analyze symptoms:", error);
      setIsAnalyzing(false);
      Alert.alert("Fehler", "KI-Analyse konnte nicht durchgeführt werden");
    }
  };

  const handleSave = () => {
    if (!selectedPet || !title) return;
    
    addHealthRecord({
      petId: selectedPet.id,
      type: recordType,
      title,
      description: description || undefined,
      date: new Date().toISOString(),
    });
    
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    router.back();
  };

  const handleVoiceTranscript = (text: string) => {
    setDescription((prev) => (prev ? `${prev} ${text}` : text));
    setShowVoiceInput(false);
  };

  const recordTypes = [
    { key: "symptom", label: "Symptom", icon: "exclamationmark.triangle.fill", color: colors.error },
    { key: "vaccination", label: "Impfung", icon: "syringe.fill", color: colors.primary },
    { key: "medication", label: "Medikament", icon: "pill.fill", color: colors.warning },
    { key: "note", label: "Notiz", icon: "doc.text.fill", color: colors.muted },
  ] as const;

  return (
    <View className="flex-1">
      {/* Gradient Background */}
      <LinearGradient
        colors={["#EF4444", "#F87171", "#F0F7FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 0.6 }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
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
              <Text className="text-white text-2xl font-bold">Eintrag hinzufügen</Text>
              <Text className="text-white/70 text-base">Gesundheitsdaten dokumentieren</Text>
            </View>
          </View>

          {/* Pet Selector */}
          <Text className="text-foreground text-sm font-medium mb-2">Für welches Tier?</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="mb-6"
            contentContainerStyle={{ gap: 12 }}
          >
            {pets.map((pet) => (
              <Pressable
                key={pet.id}
                onPress={() => setSelectedPet(pet)}
                style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] })}
              >
                <GlassCard 
                  className={`w-24 items-center py-3 ${
                    selectedPet?.id === pet.id ? "border-2 border-primary" : ""
                  }`}
                >
                  <PetAvatar name={pet.name} type={pet.type} size="md" />
                  <Text className="text-foreground font-medium mt-1 text-sm" numberOfLines={1}>
                    {pet.name}
                  </Text>
                </GlassCard>
              </Pressable>
            ))}
          </ScrollView>

          {/* Record Type */}
          <Text className="text-foreground text-sm font-medium mb-2">Art des Eintrags</Text>
          <View className="flex-row flex-wrap gap-2 mb-6">
            {recordTypes.map(({ key, label, icon, color }) => (
              <Pressable
                key={key}
                onPress={() => setRecordType(key)}
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                <View 
                  className={`flex-row items-center px-4 py-2 rounded-full ${
                    recordType === key ? "bg-primary" : "bg-surface border border-border"
                  }`}
                >
                  <IconSymbol 
                    name={icon as any} 
                    size={16} 
                    color={recordType === key ? "#FFFFFF" : color} 
                  />
                  <Text 
                    className={`ml-2 font-medium ${
                      recordType === key ? "text-white" : "text-foreground"
                    }`}
                  >
                    {label}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          {/* Title Input */}
          <GlassCard className="mb-4">
            <Text className="text-muted text-sm mb-2">Titel / Bezeichnung *</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder={
                recordType === "symptom" ? "z.B. Husten, Appetitlosigkeit" :
                recordType === "vaccination" ? "z.B. Tollwut, Staupe" :
                recordType === "medication" ? "z.B. Antibiotikum, Schmerzmittel" :
                "z.B. Tierarztbesuch, Beobachtung"
              }
              placeholderTextColor={colors.muted}
              className="text-foreground text-lg py-2"
              returnKeyType="next"
            />
          </GlassCard>

          {/* Description Input */}
          <GlassCard className="mb-6">
            <Text className="text-muted text-sm mb-2">Beschreibung (optional)</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Weitere Details, Beobachtungen, Dosierung..."
              placeholderTextColor={colors.muted}
              className="text-foreground text-base py-2"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={{ minHeight: 100 }}
            />
          </GlassCard>

          {/* Voice Input */}
          {showVoiceInput && (
            <GlassCard className="mb-6 items-center py-6">
              <VoiceInput onTranscript={handleVoiceTranscript} placeholder="Halte gedrückt zum Sprechen" />
              <Pressable onPress={() => setShowVoiceInput(false)} className="mt-4">
                <Text className="text-muted text-sm">Abbrechen</Text>
              </Pressable>
            </GlassCard>
          )}

          {/* Media Buttons */}
          <View className="flex-row gap-3 mb-6">
            <Pressable 
              className="flex-1"
              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
            >
              <GlassCard className="items-center py-4">
                <View className="w-12 h-12 rounded-full bg-primary/20 items-center justify-center mb-2">
                  <IconSymbol name="camera.fill" size={24} color={colors.primary} />
                </View>
                <Text className="text-foreground font-medium text-sm">Foto</Text>
              </GlassCard>
            </Pressable>
            <Pressable 
              className="flex-1"
              onPress={() => setShowVoiceInput(true)}
              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
            >
              <GlassCard className="items-center py-4">
                <View className="w-12 h-12 rounded-full bg-warning/20 items-center justify-center mb-2">
                  <IconSymbol name="mic.fill" size={24} color={colors.warning} />
                </View>
                <Text className="text-foreground font-medium text-sm">Spracheingabe</Text>
              </GlassCard>
            </Pressable>
          </View>

          {/* AI Analysis Button */}
          {recordType === "symptom" && description && (
            <View className="mb-6">
              <GradientButton
                title={isAnalyzing ? "Analysiere..." : "Mit KI analysieren"}
                size="md"
                onPress={handleAnalyze}
                disabled={isAnalyzing}
              />
            </View>
          )}

          {/* AI Analysis Result */}
          {aiAnalysis && (
            <GlassCard className="mb-6 border-primary/30">
              <View className="flex-row items-start mb-2">
                <Text className="text-2xl mr-2">🤖</Text>
                <Text className="text-foreground font-semibold text-base flex-1">KI-Analyse</Text>
              </View>
              <Text className="text-foreground text-sm leading-relaxed">{aiAnalysis}</Text>
            </GlassCard>
          )}

          {/* Save Button */}
          <GradientButton
            title="Speichern"
            size="lg"
            onPress={handleSave}
            disabled={!selectedPet || !title}
          />

          {/* Disclaimer */}
          <GlassCard className="mt-6 border-warning/30">
            <View className="flex-row items-start">
              <IconSymbol name="info.circle.fill" size={20} color={colors.warning} />
              <View className="flex-1 ml-3">
                <Text className="text-foreground font-medium text-sm">Hinweis</Text>
                <Text className="text-muted text-xs mt-1">
                  Diese Dokumentation ersetzt keinen Tierarztbesuch. Bei akuten Symptomen kontaktiere bitte sofort einen Tierarzt.
                </Text>
              </View>
            </View>
          </GlassCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
