import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { router } from "expo-router";
import { usePetStore } from "@/lib/pet-store";

type OnboardingStep = "welcome" | "user-data" | "pet-setup" | "complete";

export default function OnboardingFlowScreen() {
  const colors = useColors();
  const { addPet } = usePetStore();

  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    emergencyContact: "",
  });

  const [petData, setPetData] = useState({
    name: "",
    species: "dog" as any,
    breed: "",
    age: "",
    weight: "",
    chipNumber: "",
  });

  const handleUserDataNext = () => {
    if (!userData.name || !userData.email) {
      Alert.alert("Fehler", "Bitte Name und Email ausfüllen");
      return;
    }
    setCurrentStep("pet-setup");
  };

  const handlePetSetupNext = () => {
    if (!petData.name) {
      Alert.alert("Fehler", "Bitte Tiernamen ausfüllen");
      return;
    }
    addPet({
      name: petData.name,
      type: petData.species as any,
      breed: petData.breed,
      age: petData.age || "0",
      weight: parseInt(petData.weight) || 0,
      isGroup: false,
    });
    setCurrentStep("complete");
  };

  const handleSkipStep = () => {
    if (currentStep === "user-data") {
      setCurrentStep("pet-setup");
    } else if (currentStep === "pet-setup") {
      setCurrentStep("complete");
    }
  };

  const handleComplete = () => {
    router.replace("/(tabs)");
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="pb-6">
        {/* Step 1: Welcome */}
        {currentStep === "welcome" && (
          <View className="flex-1 justify-center items-center px-6">
            <View className="w-24 h-24 bg-primary/20 rounded-full items-center justify-center mb-6">
              <IconSymbol name="pawprint.fill" size={48} color={colors.primary} />
            </View>
            <Text className="text-4xl font-bold text-foreground text-center mb-3">Willkommen!</Text>
            <Text className="text-base text-muted text-center mb-8">
              Lass uns Planypet zusammen einrichten. Es dauert nur wenige Minuten.
            </Text>
            <TouchableOpacity
              onPress={() => setCurrentStep("user-data")}
              className="w-full bg-primary rounded-lg py-3 mb-3"
            >
              <Text className="text-center font-semibold text-background">Beginnen</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 2: User Data */}
        {currentStep === "user-data" && (
          <View className="flex-1 px-6 pt-8">
            <Text className="text-3xl font-bold text-foreground mb-2">Deine Daten</Text>
            <Text className="text-muted mb-6">Schritt 1 von 3</Text>

            <View className="mb-4">
              <Text className="text-sm font-semibold text-foreground mb-2">Name *</Text>
              <TextInput
                placeholder="Dein Name"
                value={userData.name}
                onChangeText={(text) => setUserData({ ...userData, name: text })}
                className="border border-border rounded-lg px-4 py-3 text-foreground"
                placeholderTextColor={colors.muted}
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-semibold text-foreground mb-2">Email *</Text>
              <TextInput
                placeholder="deine@email.de"
                value={userData.email}
                onChangeText={(text) => setUserData({ ...userData, email: text })}
                keyboardType="email-address"
                className="border border-border rounded-lg px-4 py-3 text-foreground"
                placeholderTextColor={colors.muted}
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-semibold text-foreground mb-2">Telefon</Text>
              <TextInput
                placeholder="+49 123 456789"
                value={userData.phone}
                onChangeText={(text) => setUserData({ ...userData, phone: text })}
                keyboardType="phone-pad"
                className="border border-border rounded-lg px-4 py-3 text-foreground"
                placeholderTextColor={colors.muted}
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-semibold text-foreground mb-2">Adresse</Text>
              <TextInput
                placeholder="Straße, Hausnummer, PLZ, Stadt"
                value={userData.address}
                onChangeText={(text) => setUserData({ ...userData, address: text })}
                className="border border-border rounded-lg px-4 py-3 text-foreground"
                placeholderTextColor={colors.muted}
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-semibold text-foreground mb-2">Notfallkontakt</Text>
              <TextInput
                placeholder="Name und Telefon"
                value={userData.emergencyContact}
                onChangeText={(text) => setUserData({ ...userData, emergencyContact: text })}
                className="border border-border rounded-lg px-4 py-3 text-foreground"
                placeholderTextColor={colors.muted}
              />
            </View>

            <TouchableOpacity
              onPress={handleUserDataNext}
              className="w-full bg-primary rounded-lg py-3 mb-3"
            >
              <Text className="text-center font-semibold text-background">Weiter</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSkipStep}>
              <Text className="text-center text-primary font-semibold">Überspringen</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 3: Pet Setup */}
        {currentStep === "pet-setup" && (
          <View className="flex-1 px-6 pt-8">
            <Text className="text-3xl font-bold text-foreground mb-2">Dein erstes Tier</Text>
            <Text className="text-muted mb-6">Schritt 2 von 3</Text>

            <View className="mb-4">
              <Text className="text-sm font-semibold text-foreground mb-2">Tiername *</Text>
              <TextInput
                placeholder="z.B. Max"
                value={petData.name}
                onChangeText={(text) => setPetData({ ...petData, name: text })}
                className="border border-border rounded-lg px-4 py-3 text-foreground"
                placeholderTextColor={colors.muted}
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-semibold text-foreground mb-2">Tierart</Text>
              <View className="flex-row gap-2">
                {["dog", "cat", "other"].map((species) => (
                  <TouchableOpacity
                    key={species}
                    onPress={() => setPetData({ ...petData, species })}
                    className={`flex-1 py-2 rounded-lg ${
                      petData.species === species
                        ? "bg-primary"
                        : "bg-surface border border-border"
                    }`}
                  >
                    <Text
                      className={`text-center text-sm font-semibold ${
                        petData.species === species ? "text-background" : "text-foreground"
                      }`}
                    >
                      {species === "dog" ? "🐕 Hund" : species === "cat" ? "🐈 Katze" : "🐾 Andere"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-semibold text-foreground mb-2">Rasse</Text>
              <TextInput
                placeholder="z.B. Labrador"
                value={petData.breed}
                onChangeText={(text) => setPetData({ ...petData, breed: text })}
                className="border border-border rounded-lg px-4 py-3 text-foreground"
                placeholderTextColor={colors.muted}
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-semibold text-foreground mb-2">Chipnummer</Text>
              <TextInput
                placeholder="z.B. 123456789"
                value={petData.chipNumber}
                onChangeText={(text) => setPetData({ ...petData, chipNumber: text })}
                className="border border-border rounded-lg px-4 py-3 text-foreground"
                placeholderTextColor={colors.muted}
              />
            </View>

            <TouchableOpacity
              onPress={handlePetSetupNext}
              className="w-full bg-primary rounded-lg py-3 mb-3"
            >
              <Text className="text-center font-semibold text-background">Weiter</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSkipStep}>
              <Text className="text-center text-primary font-semibold">Überspringen</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 4: Complete */}
        {currentStep === "complete" && (
          <View className="flex-1 justify-center items-center px-6">
            <View className="w-24 h-24 bg-success/20 rounded-full items-center justify-center mb-6">
              <IconSymbol name="checkmark.circle.fill" size={48} color={colors.success} />
            </View>
            <Text className="text-3xl font-bold text-foreground text-center mb-3">
              Fertig! 🎉
            </Text>
            <Text className="text-base text-muted text-center mb-8">
              Planypet ist jetzt bereit. Lass uns dein Tier verwalten!
            </Text>
            <TouchableOpacity
              onPress={handleComplete}
              className="w-full bg-primary rounded-lg py-3"
            >
              <Text className="text-center font-semibold text-background">Zum Dashboard</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
