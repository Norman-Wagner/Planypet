import { useState } from "react";
import { ScrollView, Text, View, Pressable, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { PetAvatar, PetType } from "@/components/ui/pet-avatar";
import { useColors } from "@/hooks/use-colors";

type OnboardingStep = "welcome" | "name" | "petType" | "petName" | "petGroup" | "complete";

interface PetTypeOption {
  type: PetType;
  label: string;
  emoji: string;
  supportsGroup: boolean;
}

const petTypes: PetTypeOption[] = [
  { type: "cat", label: "Katze", emoji: "🐱", supportsGroup: false },
  { type: "dog", label: "Hund", emoji: "🐕", supportsGroup: false },
  { type: "smallPet", label: "Kleintier", emoji: "🐹", supportsGroup: true },
  { type: "bird", label: "Vogel", emoji: "🦜", supportsGroup: true },
  { type: "fish", label: "Fisch", emoji: "🐠", supportsGroup: true },
  { type: "reptile", label: "Reptil", emoji: "🦎", supportsGroup: false },
  { type: "horse", label: "Pferd", emoji: "🐴", supportsGroup: false },
];

export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [userName, setUserName] = useState("");
  const [selectedPetType, setSelectedPetType] = useState<PetTypeOption | null>(null);
  const [petName, setPetName] = useState("");
  const [isGroup, setIsGroup] = useState(false);

  const handleComplete = async () => {
    // Save onboarding data
    await AsyncStorage.setItem("userName", userName);
    await AsyncStorage.setItem("onboardingComplete", "true");
    
    // Save first pet
    const firstPet = {
      id: Date.now().toString(),
      name: petName,
      type: selectedPetType?.type,
      isGroup,
      createdAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem("pets", JSON.stringify([firstPet]));
    
    // Navigate to main app
    router.replace("/(tabs)");
  };

  const renderStep = () => {
    switch (step) {
      case "welcome":
        return (
          <View className="flex-1 justify-center items-center px-6">
            <View className="w-24 h-24 rounded-full bg-white/20 items-center justify-center mb-6">
              <Text className="text-5xl">🐾</Text>
            </View>
            <Text className="text-white text-3xl font-bold text-center mb-3">
              Willkommen bei Planypet
            </Text>
            <Text className="text-white/80 text-lg text-center mb-8">
              Dein persönlicher Assistent für die Pflege deiner Haustiere
            </Text>
            <GradientButton
              title="Los geht's"
              size="lg"
              onPress={() => setStep("name")}
            />
          </View>
        );

      case "name":
        return (
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 justify-center px-6"
          >
            <Text className="text-white text-2xl font-bold text-center mb-2">
              Wie heißt du?
            </Text>
            <Text className="text-white/70 text-center mb-8">
              Damit wir dich persönlich begrüßen können
            </Text>
            
            <GlassCard className="mb-6">
              <TextInput
                value={userName}
                onChangeText={setUserName}
                placeholder="Dein Name"
                placeholderTextColor={colors.muted}
                className="text-foreground text-lg py-2"
                autoFocus
                returnKeyType="done"
              />
            </GlassCard>
            
            <GradientButton
              title="Weiter"
              size="lg"
              disabled={!userName.trim()}
              onPress={() => setStep("petType")}
            />
          </KeyboardAvoidingView>
        );

      case "petType":
        return (
          <ScrollView 
            className="flex-1"
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
          >
            <Text className="text-white text-2xl font-bold text-center mb-2 mt-8">
              Welches Haustier hast du?
            </Text>
            <Text className="text-white/70 text-center mb-8">
              Wähle die Tierart aus
            </Text>
            
            <View className="flex-row flex-wrap justify-center gap-4">
              {petTypes.map((pet) => (
                <Pressable
                  key={pet.type}
                  onPress={() => setSelectedPetType(pet)}
                  style={({ pressed }) => ({ 
                    opacity: pressed ? 0.8 : 1,
                    transform: [{ scale: pressed ? 0.95 : 1 }],
                  })}
                >
                  <GlassCard 
                    className={`w-28 items-center py-5 ${
                      selectedPetType?.type === pet.type ? "border-2 border-primary" : ""
                    }`}
                  >
                    <Text className="text-4xl mb-2">{pet.emoji}</Text>
                    <Text className="text-foreground font-medium">{pet.label}</Text>
                  </GlassCard>
                </Pressable>
              ))}
            </View>
            
            <View className="mt-8">
              <GradientButton
                title="Weiter"
                size="lg"
                disabled={!selectedPetType}
                onPress={() => setStep("petName")}
              />
            </View>
          </ScrollView>
        );

      case "petName":
        return (
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 justify-center px-6"
          >
            <View className="items-center mb-6">
              <PetAvatar 
                name="" 
                type={selectedPetType?.type || "cat"} 
                size="xl" 
              />
            </View>
            
            <Text className="text-white text-2xl font-bold text-center mb-2">
              Wie heißt dein {selectedPetType?.label}?
            </Text>
            <Text className="text-white/70 text-center mb-8">
              Gib deinem Haustier einen Namen
            </Text>
            
            <GlassCard className="mb-6">
              <TextInput
                value={petName}
                onChangeText={setPetName}
                placeholder={`Name deines ${selectedPetType?.label}s`}
                placeholderTextColor={colors.muted}
                className="text-foreground text-lg py-2"
                autoFocus
                returnKeyType="done"
              />
            </GlassCard>
            
            <GradientButton
              title="Weiter"
              size="lg"
              disabled={!petName.trim()}
              onPress={() => {
                if (selectedPetType?.supportsGroup) {
                  setStep("petGroup");
                } else {
                  setStep("complete");
                }
              }}
            />
          </KeyboardAvoidingView>
        );

      case "petGroup":
        return (
          <View className="flex-1 justify-center px-6">
            <View className="items-center mb-6">
              <PetAvatar 
                name={petName} 
                type={selectedPetType?.type || "fish"} 
                size="xl" 
              />
            </View>
            
            <Text className="text-white text-2xl font-bold text-center mb-2">
              Einzeltier oder Gruppe?
            </Text>
            <Text className="text-white/70 text-center mb-8">
              Hast du ein einzelnes Tier oder mehrere?
            </Text>
            
            <View className="flex-row gap-4 mb-8">
              <Pressable
                onPress={() => setIsGroup(false)}
                style={({ pressed }) => ({ 
                  flex: 1,
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <GlassCard 
                  className={`items-center py-6 ${!isGroup ? "border-2 border-primary" : ""}`}
                >
                  <Text className="text-3xl mb-2">1️⃣</Text>
                  <Text className="text-foreground font-semibold">Einzeltier</Text>
                </GlassCard>
              </Pressable>
              
              <Pressable
                onPress={() => setIsGroup(true)}
                style={({ pressed }) => ({ 
                  flex: 1,
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <GlassCard 
                  className={`items-center py-6 ${isGroup ? "border-2 border-primary" : ""}`}
                >
                  <Text className="text-3xl mb-2">👥</Text>
                  <Text className="text-foreground font-semibold">Gruppe</Text>
                  <Text className="text-muted text-xs">(z.B. Aquarium)</Text>
                </GlassCard>
              </Pressable>
            </View>
            
            <GradientButton
              title="Weiter"
              size="lg"
              onPress={() => setStep("complete")}
            />
          </View>
        );

      case "complete":
        return (
          <View className="flex-1 justify-center items-center px-6">
            <View className="w-24 h-24 rounded-full bg-success/20 items-center justify-center mb-6">
              <IconSymbol name="checkmark.circle.fill" size={60} color={colors.success} />
            </View>
            <Text className="text-white text-3xl font-bold text-center mb-3">
              Alles bereit!
            </Text>
            <Text className="text-white/80 text-lg text-center mb-2">
              Hallo {userName}! 👋
            </Text>
            <Text className="text-white/70 text-center mb-8">
              {petName} wurde erfolgreich hinzugefügt. Du kannst jetzt loslegen!
            </Text>
            <GradientButton
              title="App starten"
              size="lg"
              onPress={handleComplete}
            />
          </View>
        );
    }
  };

  return (
    <View className="flex-1">
      {/* Gradient Background */}
      <LinearGradient
        colors={["#0066CC", "#00A3FF", "#8B5CF6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />
      
      <View style={{ paddingTop: insets.top, paddingBottom: insets.bottom, flex: 1 }}>
        {/* Back Button (except welcome) */}
        {step !== "welcome" && (
          <Pressable
            onPress={() => {
              const steps: OnboardingStep[] = ["welcome", "name", "petType", "petName", "petGroup", "complete"];
              const currentIndex = steps.indexOf(step);
              if (currentIndex > 0) {
                // Skip petGroup when going back if pet doesn't support groups
                if (step === "complete" && !selectedPetType?.supportsGroup) {
                  setStep("petName");
                } else {
                  setStep(steps[currentIndex - 1]);
                }
              }
            }}
            className="absolute top-0 left-4 z-10 w-10 h-10 items-center justify-center"
            style={{ marginTop: insets.top + 10 }}
          >
            <IconSymbol name="chevron.left" size={28} color="#FFFFFF" />
          </Pressable>
        )}
        
        {renderStep()}
      </View>
    </View>
  );
}
