import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useRouter } from "expo-router";

type OnboardingStep = "welcome" | "user-data" | "emergency-contact" | "pet-setup" | "complete";

export default function OnboardingFlowScreen() {
  const colors = useColors();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [emergencyContact, setEmergencyContact] = useState({
    name: "",
    phone: "",
  });
  const [petData, setPetData] = useState({
    name: "",
    type: "dog",
    breed: "",
    birthDate: "",
    weight: "",
  });

  const handleNext = () => {
    switch (currentStep) {
      case "welcome":
        setCurrentStep("user-data");
        break;
      case "user-data":
        if (!userData.name || !userData.email) {
          Alert.alert("Fehler", "Bitte fülle alle erforderlichen Felder aus");
          return;
        }
        setCurrentStep("emergency-contact");
        break;
      case "emergency-contact":
        setCurrentStep("pet-setup");
        break;
      case "pet-setup":
        if (!petData.name) {
          Alert.alert("Fehler", "Bitte gib einen Namen für dein Tier ein");
          return;
        }
        setCurrentStep("complete");
        break;
      case "complete":
        // Navigate to main app
        (router.replace as any)("/(tabs)/index");
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case "user-data":
        setCurrentStep("welcome");
        break;
      case "emergency-contact":
        setCurrentStep("user-data");
        break;
      case "pet-setup":
        setCurrentStep("emergency-contact");
        break;
      case "complete":
        setCurrentStep("pet-setup");
        break;
    }
  };

  const progressPercentage = {
    welcome: 20,
    "user-data": 40,
    "emergency-contact": 60,
    "pet-setup": 80,
    complete: 100,
  }[currentStep];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScreenContainer className="bg-background">
        {/* Progress Bar */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm font-semibold text-muted">
              Schritt {currentStep === "welcome" ? 1 : currentStep === "user-data" ? 2 : currentStep === "emergency-contact" ? 3 : currentStep === "pet-setup" ? 4 : 5} von 5
            </Text>
            <Text className="text-sm font-semibold text-primary">{progressPercentage}%</Text>
          </View>
          <View className="h-2 bg-surface rounded-full overflow-hidden">
            <View
              className="h-full bg-primary rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </View>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="pb-6">
          {/* Welcome Step */}
          {currentStep === "welcome" && (
            <View className="flex-1 justify-center items-center gap-6">
              <Text className="text-5xl">🐾</Text>
              <View className="items-center gap-3">
                <Text className="text-3xl font-bold text-foreground text-center">
                  Willkommen bei Planypet!
                </Text>
                <Text className="text-lg text-muted text-center">
                  Dein Haustier verdient das Beste. Wir sorgen dafür.
                </Text>
              </View>
              <View className="bg-surface rounded-lg p-4 border border-border gap-2">
                <Text className="text-sm text-foreground font-semibold">✓ Fütterungserinnerungen</Text>
                <Text className="text-sm text-foreground font-semibold">✓ Gassi-Tracking mit Wetter</Text>
                <Text className="text-sm text-foreground font-semibold">✓ Chip-Registrierung</Text>
                <Text className="text-sm text-foreground font-semibold">✓ Notfall-Hilfe</Text>
              </View>
            </View>
          )}

          {/* User Data Step */}
          {currentStep === "user-data" && (
            <View className="flex-1 gap-4">
              <View>
                <Text className="text-2xl font-bold text-foreground mb-2">Deine Daten</Text>
                <Text className="text-muted">Damit wir dich kontaktieren können</Text>
              </View>

              <View className="gap-3 mt-4">
                <View>
                  <Text className="text-sm text-muted mb-1">Name *</Text>
                  <TextInput
                    className="bg-surface border border-border rounded-lg px-3 py-3 text-foreground"
                    placeholder="Dein Name"
                    value={userData.name}
                    onChangeText={(text) => setUserData({ ...userData, name: text })}
                    placeholderTextColor={colors.muted}
                  />
                </View>

                <View>
                  <Text className="text-sm text-muted mb-1">E-Mail *</Text>
                  <TextInput
                    className="bg-surface border border-border rounded-lg px-3 py-3 text-foreground"
                    placeholder="deine@email.de"
                    value={userData.email}
                    onChangeText={(text) => setUserData({ ...userData, email: text })}
                    keyboardType="email-address"
                    placeholderTextColor={colors.muted}
                  />
                </View>

                <View>
                  <Text className="text-sm text-muted mb-1">Telefon</Text>
                  <TextInput
                    className="bg-surface border border-border rounded-lg px-3 py-3 text-foreground"
                    placeholder="+49 123 456789"
                    value={userData.phone}
                    onChangeText={(text) => setUserData({ ...userData, phone: text })}
                    keyboardType="phone-pad"
                    placeholderTextColor={colors.muted}
                  />
                </View>

                <View>
                  <Text className="text-sm text-muted mb-1">Adresse</Text>
                  <TextInput
                    className="bg-surface border border-border rounded-lg px-3 py-3 text-foreground"
                    placeholder="Straße, Hausnummer, PLZ, Stadt"
                    value={userData.address}
                    onChangeText={(text) => setUserData({ ...userData, address: text })}
                    placeholderTextColor={colors.muted}
                  />
                </View>
              </View>
            </View>
          )}

          {/* Emergency Contact Step */}
          {currentStep === "emergency-contact" && (
            <View className="flex-1 gap-4">
              <View>
                <Text className="text-2xl font-bold text-foreground mb-2">Notfallkontakt</Text>
                <Text className="text-muted">Für den Notfall (optional)</Text>
              </View>

              <View className="gap-3 mt-4">
                <View>
                  <Text className="text-sm text-muted mb-1">Name</Text>
                  <TextInput
                    className="bg-surface border border-border rounded-lg px-3 py-3 text-foreground"
                    placeholder="Name der Kontaktperson"
                    value={emergencyContact.name}
                    onChangeText={(text) =>
                      setEmergencyContact({ ...emergencyContact, name: text })
                    }
                    placeholderTextColor={colors.muted}
                  />
                </View>

                <View>
                  <Text className="text-sm text-muted mb-1">Telefon</Text>
                  <TextInput
                    className="bg-surface border border-border rounded-lg px-3 py-3 text-foreground"
                    placeholder="+49 123 456789"
                    value={emergencyContact.phone}
                    onChangeText={(text) =>
                      setEmergencyContact({ ...emergencyContact, phone: text })
                    }
                    keyboardType="phone-pad"
                    placeholderTextColor={colors.muted}
                  />
                </View>
              </View>

              <View className="bg-info/10 border border-info rounded-lg p-3 mt-4">
                <Text className="text-sm text-info">
                  ℹ️ Diese Daten werden nur im Notfall verwendet und nicht an Dritte weitergegeben.
                </Text>
              </View>
            </View>
          )}

          {/* Pet Setup Step */}
          {currentStep === "pet-setup" && (
            <View className="flex-1 gap-4">
              <View>
                <Text className="text-2xl font-bold text-foreground mb-2">Dein erstes Haustier</Text>
                <Text className="text-muted">Lass uns mit deinem Liebsten beginnen</Text>
              </View>

              <View className="gap-3 mt-4">
                <View>
                  <Text className="text-sm text-muted mb-1">Name *</Text>
                  <TextInput
                    className="bg-surface border border-border rounded-lg px-3 py-3 text-foreground"
                    placeholder="z.B. Max"
                    value={petData.name}
                    onChangeText={(text) => setPetData({ ...petData, name: text })}
                    placeholderTextColor={colors.muted}
                  />
                </View>

                <View>
                  <Text className="text-sm text-muted mb-2">Tierart</Text>
                  <View className="flex-row gap-2 flex-wrap">
                    {["dog", "cat", "bird", "reptile"].map((type) => (
                      <TouchableOpacity
                        key={type}
                        className={`px-4 py-2 rounded-full ${
                          petData.type === type
                            ? "bg-primary"
                            : "bg-surface border border-border"
                        }`}
                        onPress={() => setPetData({ ...petData, type })}
                      >
                        <Text
                          className={
                            petData.type === type
                              ? "text-background font-semibold"
                              : "text-foreground"
                          }
                        >
                          {type === "dog"
                            ? "🐕 Hund"
                            : type === "cat"
                              ? "🐈 Katze"
                              : type === "bird"
                                ? "🦜 Vogel"
                                : "🐢 Reptil"}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View>
                  <Text className="text-sm text-muted mb-1">Rasse</Text>
                  <TextInput
                    className="bg-surface border border-border rounded-lg px-3 py-3 text-foreground"
                    placeholder="z.B. Labrador"
                    value={petData.breed}
                    onChangeText={(text) => setPetData({ ...petData, breed: text })}
                    placeholderTextColor={colors.muted}
                  />
                </View>

                <View>
                  <Text className="text-sm text-muted mb-1">Geburtsdatum</Text>
                  <TextInput
                    className="bg-surface border border-border rounded-lg px-3 py-3 text-foreground"
                    placeholder="YYYY-MM-DD"
                    value={petData.birthDate}
                    onChangeText={(text) => setPetData({ ...petData, birthDate: text })}
                    placeholderTextColor={colors.muted}
                  />
                </View>
              </View>
            </View>
          )}

          {/* Complete Step */}
          {currentStep === "complete" && (
            <View className="flex-1 justify-center items-center gap-6">
              <Text className="text-5xl">✨</Text>
              <View className="items-center gap-3">
                <Text className="text-3xl font-bold text-foreground text-center">
                  Alles bereit!
                </Text>
                <Text className="text-lg text-muted text-center">
                  {petData.name} ist jetzt in Planypet registriert.
                </Text>
              </View>
              <View className="bg-success/10 rounded-lg p-4 border border-success gap-2">
                <Text className="text-sm text-success font-semibold">✓ Profil erstellt</Text>
                <Text className="text-sm text-success font-semibold">✓ Haustier hinzugefügt</Text>
                <Text className="text-sm text-success font-semibold">✓ Bereit zum Starten</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Navigation Buttons */}
        <View className="flex-row gap-3 mt-6">
          {currentStep !== "welcome" && (
            <TouchableOpacity
              className="flex-1 bg-surface border border-border rounded-lg py-3 items-center"
              onPress={handleBack}
            >
              <Text className="text-foreground font-semibold">Zurück</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            className="flex-1 bg-primary rounded-lg py-3 items-center"
            onPress={handleNext}
          >
            <Text className="text-background font-semibold">
              {currentStep === "complete" ? "Zum Dashboard" : "Weiter"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
