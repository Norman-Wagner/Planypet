import { useState } from "react";
import { ScrollView, Text, View, Pressable, TextInput, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { PetType } from "@/components/ui/pet-avatar";
import { ConsentDialog } from "@/components/consent-dialog";
import { useConsent } from "@/lib/consent-store";

type OnboardingStep = "consent" | "welcome" | "name" | "petType" | "petName" | "petGroup" | "complete";

interface PetTypeOption {
  type: PetType;
  label: string;
  icon: string;
  category: string;
  supportsGroup: boolean;
}

const petCategories = [
  { key: "pets", label: "Haustiere" },
  { key: "birds", label: "Vogelwelt" },
  { key: "reptiles", label: "Reptilien" },
  { key: "amphibians", label: "Amphibien" },
  { key: "fish", label: "Aquaristik" },
  { key: "farm", label: "Nutztiere" },
];

const petTypes: PetTypeOption[] = [
  { type: "cat", label: "Katze", icon: "cat", category: "pets", supportsGroup: false },
  { type: "dog", label: "Hund", icon: "dog", category: "pets", supportsGroup: false },
  { type: "rabbit", label: "Kaninchen", icon: "hare", category: "pets", supportsGroup: true },
  { type: "hamster", label: "Hamster", icon: "hamster", category: "pets", supportsGroup: true },
  { type: "guinea_pig", label: "Meerschweinchen", icon: "guinea_pig", category: "pets", supportsGroup: true },
  { type: "chinchilla", label: "Chinchilla", icon: "chinchilla", category: "pets", supportsGroup: true },
  { type: "degu", label: "Degu", icon: "degu", category: "pets", supportsGroup: true },
  { type: "rat", label: "Ratte", icon: "rat", category: "pets", supportsGroup: true },
  { type: "mouse", label: "Maus", icon: "mouse", category: "pets", supportsGroup: true },
  { type: "ferret", label: "Frettchen", icon: "ferret", category: "pets", supportsGroup: true },
  { type: "parakeet", label: "Wellensittich", icon: "parakeet", category: "birds", supportsGroup: true },
  { type: "canary", label: "Kanarienvogel", icon: "canary", category: "birds", supportsGroup: true },
  { type: "cockatiel", label: "Nymphensittich", icon: "cockatiel", category: "birds", supportsGroup: false },
  { type: "parrot", label: "Papagei", icon: "parrot", category: "birds", supportsGroup: false },
  { type: "finch", label: "Zebrafinke", icon: "finch", category: "birds", supportsGroup: true },
  { type: "lovebird", label: "Agapornide", icon: "lovebird", category: "birds", supportsGroup: true },
  { type: "bearded_dragon", label: "Bartagame", icon: "bearded_dragon", category: "reptiles", supportsGroup: false },
  { type: "leopard_gecko", label: "Leopardgecko", icon: "gecko", category: "reptiles", supportsGroup: false },
  { type: "corn_snake", label: "Kornnatter", icon: "snake", category: "reptiles", supportsGroup: false },
  { type: "ball_python", label: "Königspython", icon: "python", category: "reptiles", supportsGroup: false },
  { type: "iguana", label: "Leguan", icon: "iguana", category: "reptiles", supportsGroup: false },
  { type: "chameleon", label: "Chamäleon", icon: "chameleon", category: "reptiles", supportsGroup: false },
  { type: "tortoise", label: "Schildkröte", icon: "tortoise", category: "reptiles", supportsGroup: false },
  { type: "axolotl", label: "Axolotl", icon: "axolotl", category: "amphibians", supportsGroup: true },
  { type: "frog", label: "Frosch", icon: "frog", category: "amphibians", supportsGroup: true },
  { type: "newt", label: "Molch", icon: "newt", category: "amphibians", supportsGroup: true },
  { type: "fish", label: "Fisch", icon: "fish", category: "fish", supportsGroup: true },
  { type: "goldfish", label: "Goldfisch", icon: "goldfish", category: "fish", supportsGroup: true },
  { type: "betta", label: "Bettafisch", icon: "betta", category: "fish", supportsGroup: false },
  { type: "horse", label: "Pferd", icon: "horse", category: "farm", supportsGroup: false },
  { type: "cow", label: "Kuh", icon: "cow", category: "farm", supportsGroup: true },
  { type: "sheep", label: "Schaf", icon: "sheep", category: "farm", supportsGroup: true },
  { type: "goat", label: "Ziege", icon: "goat", category: "farm", supportsGroup: true },
  { type: "pig", label: "Schwein", icon: "pig", category: "farm", supportsGroup: true },
  { type: "chicken", label: "Huhn", icon: "chicken", category: "farm", supportsGroup: true },
  { type: "duck", label: "Ente", icon: "duck", category: "farm", supportsGroup: true },
];

// Premium initial letter for pet type
function PetInitial({ label, selected }: { label: string; selected: boolean }) {
  return (
    <View style={[styles.petInitial, selected && styles.petInitialSelected]}>
      <Text style={[styles.petInitialText, selected && styles.petInitialTextSelected]}>
        {label.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { consentGiven } = useConsent();
  const [step, setStep] = useState<OnboardingStep>(consentGiven ? "welcome" : "consent");
  const [userName, setUserName] = useState("");
  const [selectedPetType, setSelectedPetType] = useState<PetTypeOption | null>(null);
  const [petName, setPetName] = useState("");
  const [isGroup, setIsGroup] = useState(false);
  const [activeCategory, setActiveCategory] = useState("pets");

  const handleComplete = async () => {
    await AsyncStorage.setItem("userName", userName);
    await AsyncStorage.setItem("onboardingComplete", "true");
    
    // BUGFIX: Load existing pets and add new one (do not overwrite)
    const existingPetsJson = await AsyncStorage.getItem("pets");
    const existingPets = existingPetsJson ? JSON.parse(existingPetsJson) : [];
    
    const newPet = {
      id: Date.now().toString(),
      name: petName,
      type: selectedPetType?.type,
      isGroup,
      createdAt: new Date().toISOString(),
    };
    
    // Add new pet to existing pets
    const allPets = [...existingPets, newPet];
    await AsyncStorage.setItem("pets", JSON.stringify(allPets));
    router.replace("/(tabs)");
  };

  const filteredPets = petTypes.filter((p) => p.category === activeCategory);

  const renderStep = () => {
    switch (step) {
      case "consent":
        return (
          <ConsentDialog onComplete={() => setStep("welcome")} />
        );

      case "welcome":
        return (
          <View style={styles.centerContainer}>
            <Animated.View entering={FadeInDown.duration(800).delay(200)} style={styles.crownContainer}>
              <LinearGradient
                colors={["#D4A843", "#B8860B", "#8B6914"]}
                style={styles.crownGradient}
              >
                <IconSymbol name="crown.fill" size={48} color="#FAFAF8" />
              </LinearGradient>
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(800).delay(400)}>
              <Text style={styles.heroTitle}>Planypet</Text>
              <View style={styles.goldLine} />
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(800).delay(600)}>
              <Text style={styles.heroSubtitle}>
                Dein Tier verdient das Beste.{"\n"}Wir sorgen dafuer.
              </Text>
            </Animated.View>

            <Animated.View entering={FadeInUp.duration(800).delay(900)} style={{ width: "100%", paddingHorizontal: 40 }}>
              <Pressable
                onPress={() => setStep("name")}
                style={({ pressed }) => [styles.premiumButton, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
              >
                <LinearGradient
                  colors={["#D4A843", "#B8860B"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.premiumButtonGradient}
                >
                  <Text style={styles.premiumButtonText}>Beginnen</Text>
                </LinearGradient>
              </Pressable>
            </Animated.View>
          </View>
        );

      case "name":
        return (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.centerContainer}
          >
            <Animated.View entering={FadeInDown.duration(600)}>
              <Text style={styles.stepTitle}>Wer bist du?</Text>
              <Text style={styles.stepSubtitle}>Damit wir dich persoenlich begruessen koennen</Text>
            </Animated.View>

            <Animated.View entering={FadeInUp.duration(600).delay(200)} style={{ width: "100%", paddingHorizontal: 32 }}>
              <View style={styles.inputContainer}>
                <TextInput
                  value={userName}
                  onChangeText={setUserName}
                  placeholder="Dein Name"
                  placeholderTextColor="#6B6B6B"
                  style={styles.premiumInput}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={() => userName.trim() && setStep("petType")}
                />
                <View style={styles.inputGoldLine} />
              </View>

              <Pressable
                onPress={() => setStep("petType")}
                disabled={!userName.trim()}
                style={({ pressed }) => [
                  styles.premiumButton,
                  { marginTop: 32 },
                  !userName.trim() && { opacity: 0.4 },
                  pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
                ]}
              >
                <LinearGradient
                  colors={["#D4A843", "#B8860B"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.premiumButtonGradient}
                >
                  <Text style={styles.premiumButtonText}>Weiter</Text>
                </LinearGradient>
              </Pressable>
            </Animated.View>
          </KeyboardAvoidingView>
        );

      case "petType":
        return (
          <View style={{ flex: 1 }}>
            <Animated.View entering={FadeInDown.duration(600)} style={{ paddingHorizontal: 24, paddingTop: 20 }}>
              <Text style={styles.stepTitle}>Dein Schaetzchen</Text>
              <Text style={styles.stepSubtitle}>Welche Tierart darf es sein?</Text>
            </Animated.View>

            {/* Category Tabs */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16, gap: 8 }}
            >
              {petCategories.map((cat) => (
                <Pressable
                  key={cat.key}
                  onPress={() => setActiveCategory(cat.key)}
                  style={({ pressed }) => [
                    styles.categoryTab,
                    activeCategory === cat.key && styles.categoryTabActive,
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryTabText,
                      activeCategory === cat.key && styles.categoryTabTextActive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Pet Grid */}
            <ScrollView
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120, gap: 10 }}
              showsVerticalScrollIndicator={false}
            >
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                {filteredPets.map((pet) => (
                  <Pressable
                    key={pet.type}
                    onPress={() => setSelectedPetType(pet)}
                    style={({ pressed }) => [
                      styles.petCard,
                      selectedPetType?.type === pet.type && styles.petCardSelected,
                      pressed && { transform: [{ scale: 0.96 }] },
                    ]}
                  >
                    <PetInitial label={pet.label} selected={selectedPetType?.type === pet.type} />
                    <Text style={[styles.petCardLabel, selectedPetType?.type === pet.type && styles.petCardLabelSelected]}>
                      {pet.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>

            {/* Bottom Button */}
            <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
              <Pressable
                onPress={() => setStep("petName")}
                disabled={!selectedPetType}
                style={({ pressed }) => [
                  styles.premiumButton,
                  !selectedPetType && { opacity: 0.4 },
                  pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
                ]}
              >
                <LinearGradient
                  colors={["#D4A843", "#B8860B"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.premiumButtonGradient}
                >
                  <Text style={styles.premiumButtonText}>Weiter</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        );

      case "petName":
        return (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.centerContainer}
          >
            <Animated.View entering={FadeInDown.duration(600)} style={{ alignItems: "center" }}>
              {/* Premium Pet Icon */}
              <View style={styles.throneContainer}>
                <LinearGradient
                  colors={["#D4A843", "#B8860B", "#8B6914"]}
                  style={styles.throneGradient}
                >
                  <Text style={styles.throneInitial}>
                    {selectedPetType?.label.charAt(0).toUpperCase()}
                  </Text>
                </LinearGradient>
                <View style={styles.throneBase}>
                  <LinearGradient
                    colors={["#D4A843", "#8B6914"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.throneBaseGradient}
                  />
                </View>
              </View>

              <Text style={styles.stepTitle}>
                Wie heisst dein {selectedPetType?.label}?
              </Text>
              <Text style={styles.stepSubtitle}>
                Gib deinem Liebling einen Namen
              </Text>
            </Animated.View>

            <Animated.View entering={FadeInUp.duration(600).delay(200)} style={{ width: "100%", paddingHorizontal: 32 }}>
              <View style={styles.inputContainer}>
                <TextInput
                  value={petName}
                  onChangeText={setPetName}
                  placeholder={`Name`}
                  placeholderTextColor="#6B6B6B"
                  style={styles.premiumInput}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={() => {
                    if (petName.trim()) {
                      selectedPetType?.supportsGroup ? setStep("petGroup") : setStep("complete");
                    }
                  }}
                />
                <View style={styles.inputGoldLine} />
              </View>

              <Pressable
                onPress={() => {
                  if (selectedPetType?.supportsGroup) {
                    setStep("petGroup");
                  } else {
                    setStep("complete");
                  }
                }}
                disabled={!petName.trim()}
                style={({ pressed }) => [
                  styles.premiumButton,
                  { marginTop: 32 },
                  !petName.trim() && { opacity: 0.4 },
                  pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
                ]}
              >
                <LinearGradient
                  colors={["#D4A843", "#B8860B"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.premiumButtonGradient}
                >
                  <Text style={styles.premiumButtonText}>Weiter</Text>
                </LinearGradient>
              </Pressable>
            </Animated.View>
          </KeyboardAvoidingView>
        );

      case "petGroup":
        return (
          <View style={styles.centerContainer}>
            <Animated.View entering={FadeInDown.duration(600)}>
              <Text style={styles.stepTitle}>Einzeltier oder Gruppe?</Text>
              <Text style={styles.stepSubtitle}>Hast du ein einzelnes Tier oder mehrere?</Text>
            </Animated.View>

            <Animated.View entering={FadeInUp.duration(600).delay(200)} style={{ width: "100%", paddingHorizontal: 24, gap: 16 }}>
              <Pressable
                onPress={() => setIsGroup(false)}
                style={({ pressed }) => [
                  styles.choiceCard,
                  !isGroup && styles.choiceCardSelected,
                  pressed && { transform: [{ scale: 0.98 }] },
                ]}
              >
                <View style={styles.choiceIcon}>
                  <IconSymbol name="person.fill" size={28} color={!isGroup ? "#D4A843" : "#6B6B6B"} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.choiceTitle, !isGroup && { color: "#FAFAF8" }]}>Einzeltier</Text>
                  <Text style={styles.choiceSubtitle}>Ein einzelnes Tier</Text>
                </View>
              </Pressable>

              <Pressable
                onPress={() => setIsGroup(true)}
                style={({ pressed }) => [
                  styles.choiceCard,
                  isGroup && styles.choiceCardSelected,
                  pressed && { transform: [{ scale: 0.98 }] },
                ]}
              >
                <View style={styles.choiceIcon}>
                  <IconSymbol name="person.2.fill" size={28} color={isGroup ? "#D4A843" : "#6B6B6B"} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.choiceTitle, isGroup && { color: "#FAFAF8" }]}>Gruppe</Text>
                  <Text style={styles.choiceSubtitle}>Mehrere Tiere (z.B. Aquarium)</Text>
                </View>
              </Pressable>

              <Pressable
                onPress={() => setStep("complete")}
                style={({ pressed }) => [
                  styles.premiumButton,
                  { marginTop: 16 },
                  pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
                ]}
              >
                <LinearGradient
                  colors={["#D4A843", "#B8860B"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.premiumButtonGradient}
                >
                  <Text style={styles.premiumButtonText}>Weiter</Text>
                </LinearGradient>
              </Pressable>
            </Animated.View>
          </View>
        );

      case "complete":
        return (
          <View style={styles.centerContainer}>
            <Animated.View entering={FadeInDown.duration(800).delay(200)} style={{ alignItems: "center" }}>
              <View style={styles.successRing}>
                <LinearGradient
                  colors={["#D4A843", "#B8860B"]}
                  style={styles.successGradient}
                >
                  <IconSymbol name="checkmark" size={40} color="#FAFAF8" />
                </LinearGradient>
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(800).delay(400)}>
              <Text style={styles.stepTitle}>Willkommen, {userName}</Text>
              <View style={styles.goldLine} />
              <Text style={[styles.stepSubtitle, { marginTop: 12 }]}>
                {petName} wurde erfolgreich registriert.{"\n"}Alles ist bereit.
              </Text>
            </Animated.View>

            <Animated.View entering={FadeInUp.duration(800).delay(700)} style={{ width: "100%", paddingHorizontal: 40 }}>
              <Pressable
                onPress={handleComplete}
                style={({ pressed }) => [styles.premiumButton, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
              >
                <LinearGradient
                  colors={["#D4A843", "#B8860B"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.premiumButtonGradient}
                >
                  <Text style={styles.premiumButtonText}>App starten</Text>
                </LinearGradient>
              </Pressable>
            </Animated.View>
          </View>
        );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Ultra-dark premium background */}
      <LinearGradient
        colors={["#0A0A0F", "#12121A", "#0A0A0F"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Subtle gold shimmer overlay */}
      <LinearGradient
        colors={["transparent", "rgba(212, 168, 67, 0.03)", "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={{ paddingTop: insets.top, paddingBottom: insets.bottom, flex: 1 }}>
        {step !== "welcome" && (
          <Pressable
            onPress={() => {
              const steps: OnboardingStep[] = ["welcome", "name", "petType", "petName", "petGroup", "complete"];
              const currentIndex = steps.indexOf(step);
              if (currentIndex > 0) {
                if (step === "complete" && !selectedPetType?.supportsGroup) {
                  setStep("petName");
                } else {
                  setStep(steps[currentIndex - 1]);
                }
              }
            }}
            style={({ pressed }) => [
              { position: "absolute", top: insets.top + 10, left: 16, zIndex: 10, padding: 8 },
              pressed && { opacity: 0.6 },
            ]}
          >
            <IconSymbol name="chevron.left" size={24} color="#D4A843" />
          </Pressable>
        )}

        {renderStep()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 32,
  },
  crownContainer: {
    marginBottom: 8,
  },
  crownGradient: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#D4A843",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: "300",
    letterSpacing: 8,
    color: "#FAFAF8",
    textAlign: "center",
    textTransform: "uppercase",
  },
  goldLine: {
    width: 60,
    height: 1,
    backgroundColor: "#D4A843",
    alignSelf: "center",
    marginTop: 16,
  },
  heroSubtitle: {
    fontSize: 16,
    fontWeight: "400",
    color: "#C8C8C0",
    textAlign: "center",
    lineHeight: 26,
    letterSpacing: 1,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: "300",
    letterSpacing: 2,
    color: "#FAFAF8",
    textAlign: "center",
  },
  stepSubtitle: {
    fontSize: 15,
    fontWeight: "400",
    color: "#8B8B80",
    textAlign: "center",
    marginTop: 8,
    letterSpacing: 0.5,
  },
  inputContainer: {
    marginTop: 24,
  },
  premiumInput: {
    fontSize: 20,
    fontWeight: "300",
    color: "#FAFAF8",
    textAlign: "center",
    paddingVertical: 16,
    letterSpacing: 2,
  },
  inputGoldLine: {
    height: 1,
    backgroundColor: "#D4A843",
    opacity: 0.4,
  },
  premiumButton: {
    borderRadius: 0,
    overflow: "hidden",
  },
  premiumButtonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  premiumButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0A0A0F",
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(212, 168, 67, 0.2)",
  },
  categoryTabActive: {
    backgroundColor: "rgba(212, 168, 67, 0.15)",
    borderColor: "#D4A843",
  },
  categoryTabText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6B6B6B",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  categoryTabTextActive: {
    color: "#D4A843",
  },
  petCard: {
    width: "30%",
    flexGrow: 1,
    backgroundColor: "#141418",
    borderWidth: 1,
    borderColor: "rgba(212, 168, 67, 0.1)",
    paddingVertical: 20,
    alignItems: "center",
    gap: 10,
  },
  petCardSelected: {
    borderColor: "#D4A843",
    backgroundColor: "rgba(212, 168, 67, 0.08)",
  },
  petCardLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#8B8B80",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  petCardLabelSelected: {
    color: "#D4A843",
  },
  petInitial: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(212, 168, 67, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(212, 168, 67, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  petInitialSelected: {
    backgroundColor: "rgba(212, 168, 67, 0.2)",
    borderColor: "#D4A843",
  },
  petInitialText: {
    fontSize: 18,
    fontWeight: "300",
    color: "#8B8B80",
    letterSpacing: 1,
  },
  petInitialTextSelected: {
    color: "#D4A843",
    fontWeight: "500",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: "rgba(10, 10, 15, 0.95)",
    borderTopWidth: 1,
    borderTopColor: "rgba(212, 168, 67, 0.1)",
  },
  throneContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  throneGradient: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#D4A843",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  throneInitial: {
    fontSize: 36,
    fontWeight: "300",
    color: "#FAFAF8",
    letterSpacing: 2,
  },
  throneBase: {
    marginTop: 8,
    width: 120,
    height: 3,
    overflow: "hidden",
  },
  throneBaseGradient: {
    flex: 1,
  },
  choiceCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#141418",
    borderWidth: 1,
    borderColor: "rgba(212, 168, 67, 0.1)",
    gap: 16,
  },
  choiceCardSelected: {
    borderColor: "#D4A843",
    backgroundColor: "rgba(212, 168, 67, 0.08)",
  },
  choiceIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(212, 168, 67, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  choiceTitle: {
    fontSize: 17,
    fontWeight: "500",
    color: "#8B8B80",
    letterSpacing: 1,
  },
  choiceSubtitle: {
    fontSize: 13,
    color: "#6B6B6B",
    marginTop: 2,
  },
  successRing: {
    marginBottom: 8,
  },
  successGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#D4A843",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
});
