import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useRouter } from "expo-router";

type OnboardingStep = "welcome" | "profile" | "pet" | "tour" | "complete";

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  emergencyContact?: string;
  language: string;
}

interface PetData {
  name: string;
  animalType: string;
  breed: string;
  birthDate: string;
  weight: string;
  microchipId?: string;
}

const FEATURES = [
  { id: "dashboard", name: "Dashboard", icon: "house.fill", desc: "Übersicht deines Haustieres" },
  { id: "pets", name: "Tiere", icon: "pawprint.fill", desc: "Alle Haustiere verwalten" },
  { id: "activity", name: "Aktivität", icon: "figure.walk", desc: "Gassi-Runden tracken" },
  { id: "health", name: "Gesundheit", icon: "heart.fill", desc: "Impfpass & Medikamente" },
  { id: "feeding", name: "Fütterung", icon: "fork.knife", desc: "Fütterungsplan & Erinnerungen" },
  { id: "ai", name: "KI-Assistent", icon: "sparkles", desc: "Tipps & Funktionserklärung" },
  { id: "community", name: "Community", icon: "person.2.fill", desc: "Challenges & Punkte" },
  { id: "marketplace", name: "Marktplatz", icon: "bag.fill", desc: "Futter & Zubehör" },
  { id: "devices", name: "Smart Devices", icon: "wifi", desc: "GPS-Tracker & Kameras" },
  { id: "more", name: "Mehr", icon: "ellipsis", desc: "Weitere Funktionen" },
];

export default function OnboardingAssistantScreen() {
  const colors = useColors();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [language, setLanguage] = useState("de");

  // Profile Step
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    address: "",
    emergencyContact: "",
    language: "de",
  });

  // Pet Step
  const [pet, setPet] = useState<PetData>({
    name: "",
    animalType: "",
    breed: "",
    birthDate: "",
    weight: "",
    microchipId: "",
  });

  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const handleSkipStep = () => {
    setCompletedSteps(new Set([...completedSteps, currentStep]));
    moveToNextStep();
  };

  const moveToNextStep = () => {
    const steps: OnboardingStep[] = ["welcome", "profile", "pet", "tour", "complete"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleProfileComplete = () => {
    if (!profile.name || !profile.email) {
      Alert.alert("Fehler", "Name und E-Mail sind erforderlich");
      return;
    }
    setCompletedSteps(new Set([...completedSteps, "profile"]));
    moveToNextStep();
  };

  const handlePetComplete = () => {
    if (!pet.name || !pet.animalType) {
      Alert.alert("Fehler", "Name und Tierart sind erforderlich");
      return;
    }
    setCompletedSteps(new Set([...completedSteps, "pet"]));
    moveToNextStep();
  };

  const handleTourComplete = () => {
    setCompletedSteps(new Set([...completedSteps, "tour"]));
    setCurrentStep("complete");
  };

  const handleFinish = () => {
    // Save data and navigate to home
    router.replace("/(tabs)");
  };

  // STEP 1: Welcome
  if (currentStep === "welcome") {
    return (
      <ScreenContainer className="bg-background">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="justify-center pb-6">
          <View className="items-center gap-6">
            <View className="w-24 h-24 bg-primary/20 rounded-full items-center justify-center">
              <IconSymbol name="pawprint.fill" size={48} color={colors.primary} />
            </View>

            <View className="items-center gap-2">
              <Text className="text-3xl font-bold text-foreground">Willkommen bei Planypet</Text>
              <Text className="text-base text-muted text-center">
                Dein Tier verdient das Beste. Wir sorgen dafür.
              </Text>
            </View>

            <View className="w-full gap-3 mt-6">
              <View>
                <Text className="text-sm text-muted mb-2">Sprache wählen</Text>
                <View className="flex-row gap-2">
                  {[
                    { code: "de", name: "Deutsch" },
                    { code: "en", name: "English" },
                    { code: "fr", name: "Français" },
                  ].map((lang) => (
                    <TouchableOpacity
                      key={lang.code}
                      className={`flex-1 py-2 rounded-lg border ${
                        language === lang.code
                          ? "bg-primary border-primary"
                          : "bg-surface border-border"
                      }`}
                      onPress={() => {
                        setLanguage(lang.code);
                        setProfile({ ...profile, language: lang.code });
                      }}
                    >
                      <Text
                        className={`text-center font-semibold ${
                          language === lang.code ? "text-background" : "text-foreground"
                        }`}
                      >
                        {lang.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                className="bg-primary rounded-lg py-3 items-center mt-4"
                onPress={moveToNextStep}
              >
                <Text className="text-background font-semibold">Weiter</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-surface border border-border rounded-lg py-3 items-center"
                onPress={handleSkipStep}
              >
                <Text className="text-foreground font-semibold">Überspringen</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  // STEP 2: Profile
  if (currentStep === "profile") {
    return (
      <ScreenContainer className="bg-background">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="pb-6">
          <View className="mb-6">
            <Text className="text-2xl font-bold text-foreground mb-1">Schritt 1: Dein Profil</Text>
            <Text className="text-muted">Nur Name und E-Mail sind erforderlich</Text>
          </View>

          <View className="gap-4">
            {/* Name */}
            <View>
              <Text className="text-sm text-muted mb-2">Name *</Text>
              <TextInput
                className="bg-surface border border-border rounded-lg px-3 py-2 text-foreground"
                placeholder="Dein Name"
                value={profile.name}
                onChangeText={(text) => setProfile({ ...profile, name: text })}
                placeholderTextColor={colors.muted}
              />
            </View>

            {/* Email */}
            <View>
              <Text className="text-sm text-muted mb-2">E-Mail *</Text>
              <TextInput
                className="bg-surface border border-border rounded-lg px-3 py-2 text-foreground"
                placeholder="deine@email.de"
                value={profile.email}
                onChangeText={(text) => setProfile({ ...profile, email: text })}
                keyboardType="email-address"
                placeholderTextColor={colors.muted}
              />
            </View>

            {/* Phone */}
            <View>
              <Text className="text-sm text-muted mb-2">Telefon (optional)</Text>
              <TextInput
                className="bg-surface border border-border rounded-lg px-3 py-2 text-foreground"
                placeholder="+49 123 456789"
                value={profile.phone}
                onChangeText={(text) => setProfile({ ...profile, phone: text })}
                keyboardType="phone-pad"
                placeholderTextColor={colors.muted}
              />
            </View>

            {/* Address */}
            <View>
              <Text className="text-sm text-muted mb-2">Adresse (optional)</Text>
              <TextInput
                className="bg-surface border border-border rounded-lg px-3 py-2 text-foreground"
                placeholder="Straße, Hausnummer, PLZ, Stadt"
                value={profile.address}
                onChangeText={(text) => setProfile({ ...profile, address: text })}
                placeholderTextColor={colors.muted}
              />
            </View>

            {/* Emergency Contact */}
            <View>
              <Text className="text-sm text-muted mb-2">Notfallkontakt (optional)</Text>
              <TextInput
                className="bg-surface border border-border rounded-lg px-3 py-2 text-foreground"
                placeholder="Name und Telefon"
                value={profile.emergencyContact}
                onChangeText={(text) => setProfile({ ...profile, emergencyContact: text })}
                placeholderTextColor={colors.muted}
              />
            </View>
          </View>

          <View className="flex-row gap-2 mt-6">
            <TouchableOpacity
              className="flex-1 bg-surface border border-border rounded-lg py-3 items-center"
              onPress={handleSkipStep}
            >
              <Text className="text-foreground font-semibold">Überspringen</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-primary rounded-lg py-3 items-center"
              onPress={handleProfileComplete}
            >
              <Text className="text-background font-semibold">Weiter</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  // STEP 3: Pet
  if (currentStep === "pet") {
    return (
      <ScreenContainer className="bg-background">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="pb-6">
          <View className="mb-6">
            <Text className="text-2xl font-bold text-foreground mb-1">Schritt 2: Dein Tier</Text>
            <Text className="text-muted">Füge dein erstes Haustier hinzu</Text>
          </View>

          <View className="gap-4">
            {/* Pet Name */}
            <View>
              <Text className="text-sm text-muted mb-2">Name des Tieres *</Text>
              <TextInput
                className="bg-surface border border-border rounded-lg px-3 py-2 text-foreground"
                placeholder="z.B. Bella"
                value={pet.name}
                onChangeText={(text) => setPet({ ...pet, name: text })}
                placeholderTextColor={colors.muted}
              />
            </View>

            {/* Animal Type */}
            <View>
              <Text className="text-sm text-muted mb-2">Tierart *</Text>
              <View className="flex-row gap-2 flex-wrap">
                {["Hund", "Katze", "Vogel", "Reptil", "Nagetier"].map((type) => (
                  <TouchableOpacity
                    key={type}
                    className={`px-4 py-2 rounded-lg border ${
                      pet.animalType === type
                        ? "bg-primary border-primary"
                        : "bg-surface border-border"
                    }`}
                    onPress={() => setPet({ ...pet, animalType: type })}
                  >
                    <Text
                      className={
                        pet.animalType === type
                          ? "text-background font-semibold"
                          : "text-foreground"
                      }
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Breed */}
            <View>
              <Text className="text-sm text-muted mb-2">Rasse (optional)</Text>
              <TextInput
                className="bg-surface border border-border rounded-lg px-3 py-2 text-foreground"
                placeholder="z.B. Labrador Retriever"
                value={pet.breed}
                onChangeText={(text) => setPet({ ...pet, breed: text })}
                placeholderTextColor={colors.muted}
              />
            </View>

            {/* Birth Date */}
            <View>
              <Text className="text-sm text-muted mb-2">Geburtsdatum (optional)</Text>
              <TextInput
                className="bg-surface border border-border rounded-lg px-3 py-2 text-foreground"
                placeholder="TT.MM.YYYY"
                value={pet.birthDate}
                onChangeText={(text) => setPet({ ...pet, birthDate: text })}
                placeholderTextColor={colors.muted}
              />
            </View>

            {/* Weight */}
            <View>
              <Text className="text-sm text-muted mb-2">Gewicht (optional)</Text>
              <TextInput
                className="bg-surface border border-border rounded-lg px-3 py-2 text-foreground"
                placeholder="z.B. 25 kg"
                value={pet.weight}
                onChangeText={(text) => setPet({ ...pet, weight: text })}
                keyboardType="decimal-pad"
                placeholderTextColor={colors.muted}
              />
            </View>

            {/* Microchip */}
            <View>
              <Text className="text-sm text-muted mb-2">Chipnummer (optional)</Text>
              <TextInput
                className="bg-surface border border-border rounded-lg px-3 py-2 text-foreground"
                placeholder="z.B. 276098210012345"
                value={pet.microchipId}
                onChangeText={(text) => setPet({ ...pet, microchipId: text })}
                placeholderTextColor={colors.muted}
              />
              {pet.microchipId && (
                <View className="mt-2 gap-2">
                  <Text className="text-xs text-muted">Chip registrieren bei:</Text>
                  <TouchableOpacity
                    className="bg-surface border border-border rounded-lg p-2"
                    onPress={() => Linking.openURL("https://www.tasso.net")}
                  >
                    <Text className="text-primary font-semibold">Tasso.net</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-surface border border-border rounded-lg p-2"
                    onPress={() => Linking.openURL("https://www.findefix.com")}
                  >
                    <Text className="text-primary font-semibold">Findefix.com</Text>
                  </TouchableOpacity>
                  <Text className="text-xs text-muted mt-2">
                    Microchips helfen verlorenen Haustieren, schneller nach Hause zu kommen.
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View className="flex-row gap-2 mt-6">
            <TouchableOpacity
              className="flex-1 bg-surface border border-border rounded-lg py-3 items-center"
              onPress={handleSkipStep}
            >
              <Text className="text-foreground font-semibold">Überspringen</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-primary rounded-lg py-3 items-center"
              onPress={handlePetComplete}
            >
              <Text className="text-background font-semibold">Weiter</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  // STEP 4: Feature Tour
  if (currentStep === "tour") {
    return (
      <ScreenContainer className="bg-background">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="pb-6">
          <View className="mb-6">
            <Text className="text-2xl font-bold text-foreground mb-1">Schritt 3: App-Funktionen</Text>
            <Text className="text-muted">Entdecke alle Funktionen von Planypet</Text>
          </View>

          <View className="gap-3 mb-6">
            {FEATURES.map((feature) => (
              <View
                key={feature.id}
                className="bg-surface rounded-lg border border-border p-4 flex-row items-start gap-3"
              >
                <View className="w-12 h-12 bg-primary/20 rounded-lg items-center justify-center">
                  <IconSymbol name={feature.icon as any} size={24} color={colors.primary} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-foreground">{feature.name}</Text>
                  <Text className="text-sm text-muted">{feature.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          <View className="flex-row gap-2">
            <TouchableOpacity
              className="flex-1 bg-surface border border-border rounded-lg py-3 items-center"
              onPress={handleSkipStep}
            >
              <Text className="text-foreground font-semibold">Überspringen</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-primary rounded-lg py-3 items-center"
              onPress={handleTourComplete}
            >
              <Text className="text-background font-semibold">Fertig</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  // STEP 5: Complete
  if (currentStep === "complete") {
    return (
      <ScreenContainer className="bg-background">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="justify-center pb-6">
          <View className="items-center gap-6">
            <View className="w-24 h-24 bg-success/20 rounded-full items-center justify-center">
              <IconSymbol name="checkmark.circle.fill" size={48} color={colors.success} />
            </View>

            <View className="items-center gap-2">
              <Text className="text-3xl font-bold text-foreground">Herzlichen Glückwunsch!</Text>
              <Text className="text-base text-muted text-center">
                Du bist bereit, Planypet zu nutzen. Viel Spaß mit deinem Haustier!
              </Text>
            </View>

            <TouchableOpacity
              className="bg-primary rounded-lg py-3 px-8 items-center mt-6 w-full"
              onPress={handleFinish}
            >
              <Text className="text-background font-semibold text-lg">Zum Dashboard</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  return null;
}
