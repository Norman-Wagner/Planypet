import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

type OnboardingStep = "welcome" | "animal" | "name" | "microchip" | "feeding" | "family" | "complete";

export function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const colors = useColors();
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [petData, setPetData] = useState({
    animalType: "",
    petName: "",
    microchip: "",
    feedingSchedule: "",
  });

  const handleNext = () => {
    const steps: OnboardingStep[] = ["welcome", "animal", "name", "microchip", "feeding", "family", "complete"];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const handleSkip = () => {
    const steps: OnboardingStep[] = ["welcome", "animal", "name", "microchip", "feeding", "family", "complete"];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const handleComplete = () => {
    onComplete();
  };

  const renderStep = () => {
    switch (step) {
      case "welcome":
        return (
          <View className="flex-1 justify-center items-center gap-6 px-6">
            <Text className="text-4xl font-bold text-foreground text-center">Willkommen zu Planypet</Text>
            <Text className="text-base text-muted text-center">Dein Haustier verdient das Beste. Wir sorgen dafür.</Text>
            <TouchableOpacity
              className="w-full py-4 rounded-lg"
              style={{ backgroundColor: colors.primary }}
              onPress={handleNext}
            >
              <Text className="text-white font-semibold text-center">Beginnen</Text>
            </TouchableOpacity>
          </View>
        );

      case "animal":
        return (
          <View className="flex-1 gap-4 px-6 py-8">
            <Text className="text-2xl font-bold text-foreground">Welches Tier hast du?</Text>
            {["Hund", "Katze", "Kaninchen", "Vogel", "Reptil", "Anderes"].map((animal) => (
              <TouchableOpacity
                key={animal}
                className="p-4 rounded-lg border"
                style={{
                  borderColor: petData.animalType === animal ? colors.primary : colors.border,
                  backgroundColor: petData.animalType === animal ? colors.primary + "20" : colors.surface,
                }}
                onPress={() => setPetData({ ...petData, animalType: animal })}
              >
                <Text className="text-foreground font-semibold">{animal}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              className="w-full py-4 rounded-lg mt-4"
              style={{ backgroundColor: colors.primary }}
              onPress={handleNext}
            >
              <Text className="text-white font-semibold text-center">Weiter</Text>
            </TouchableOpacity>
          </View>
        );

      case "name":
        return (
          <View className="flex-1 gap-4 px-6 py-8">
            <Text className="text-2xl font-bold text-foreground">Name deines Haustieres</Text>
            <TextInput
              className="p-4 rounded-lg border text-foreground"
              style={{ borderColor: colors.border }}
              placeholder="z.B. Max"
              placeholderTextColor={colors.muted}
              value={petData.petName}
              onChangeText={(text) => setPetData({ ...petData, petName: text })}
            />
            <TouchableOpacity
              className="w-full py-4 rounded-lg mt-4"
              style={{ backgroundColor: colors.primary }}
              onPress={handleNext}
            >
              <Text className="text-white font-semibold text-center">Weiter</Text>
            </TouchableOpacity>
          </View>
        );

      case "microchip":
        return (
          <View className="flex-1 gap-4 px-6 py-8">
            <Text className="text-2xl font-bold text-foreground">Chipnummer (optional)</Text>
            <Text className="text-sm text-muted">15-stellige Nummer (z.B. 123456789012345)</Text>
            <TextInput
              className="p-4 rounded-lg border text-foreground"
              style={{ borderColor: colors.border }}
              placeholder="Chipnummer eingeben"
              placeholderTextColor={colors.muted}
              value={petData.microchip}
              onChangeText={(text) => setPetData({ ...petData, microchip: text })}
              keyboardType="numeric"
            />
            <TouchableOpacity
              className="w-full py-4 rounded-lg mt-4"
              style={{ backgroundColor: colors.primary }}
              onPress={handleNext}
            >
              <Text className="text-white font-semibold text-center">Weiter</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSkip}>
              <Text className="text-primary text-center font-semibold">Überspringen</Text>
            </TouchableOpacity>
          </View>
        );

      case "feeding":
        return (
          <View className="flex-1 gap-4 px-6 py-8">
            <Text className="text-2xl font-bold text-foreground">Fütterungsplan</Text>
            <Text className="text-sm text-muted">Wie oft fütterst du {petData.petName}?</Text>
            {["1x täglich", "2x täglich", "3x täglich", "Nach Bedarf"].map((schedule) => (
              <TouchableOpacity
                key={schedule}
                className="p-4 rounded-lg border"
                style={{
                  borderColor: petData.feedingSchedule === schedule ? colors.primary : colors.border,
                  backgroundColor: petData.feedingSchedule === schedule ? colors.primary + "20" : colors.surface,
                }}
                onPress={() => setPetData({ ...petData, feedingSchedule: schedule })}
              >
                <Text className="text-foreground font-semibold">{schedule}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              className="w-full py-4 rounded-lg mt-4"
              style={{ backgroundColor: colors.primary }}
              onPress={handleNext}
            >
              <Text className="text-white font-semibold text-center">Weiter</Text>
            </TouchableOpacity>
          </View>
        );

      case "family":
        return (
          <View className="flex-1 gap-4 px-6 py-8">
            <Text className="text-2xl font-bold text-foreground">Familie einladen (optional)</Text>
            <Text className="text-sm text-muted">Lade Familienmitglieder ein, um Aufgaben zu teilen</Text>
            <TouchableOpacity
              className="p-4 rounded-lg border-2"
              style={{ borderColor: colors.primary, borderStyle: "dashed" }}
            >
              <Text className="text-primary font-semibold text-center">+ Familienmitglied einladen</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-full py-4 rounded-lg mt-4"
              style={{ backgroundColor: colors.primary }}
              onPress={handleNext}
            >
              <Text className="text-white font-semibold text-center">Fertig</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSkip}>
              <Text className="text-primary text-center font-semibold">Überspringen</Text>
            </TouchableOpacity>
          </View>
        );

      case "complete":
        return (
          <View className="flex-1 justify-center items-center gap-6 px-6">
            <Text className="text-4xl font-bold text-foreground text-center">Fertig!</Text>
            <Text className="text-base text-muted text-center">Dein Profil ist eingerichtet. Los geht's!</Text>
            <TouchableOpacity
              className="w-full py-4 rounded-lg"
              style={{ backgroundColor: colors.primary }}
              onPress={handleComplete}
            >
              <Text className="text-white font-semibold text-center">Zum Dashboard</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>{renderStep()}</ScrollView>
    </ScreenContainer>
  );
}
