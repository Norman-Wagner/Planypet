import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { usePetStore } from "@/lib/pet-store";

const PET_SPECIES = [
  { id: "dog", name: "Hund", icon: "pawprint.fill" },
  { id: "cat", name: "Katze", icon: "pawprint.fill" },
  { id: "rabbit", name: "Kaninchen", icon: "pawprint.fill" },
  { id: "hamster", name: "Hamster", icon: "pawprint.fill" },
  { id: "bird", name: "Vogel", icon: "pawprint.fill" },
  { id: "fish", name: "Fisch", icon: "pawprint.fill" },
  { id: "reptile", name: "Reptil", icon: "pawprint.fill" },
  { id: "horse", name: "Pferd", icon: "pawprint.fill" },
];

export default function PetSetupScreen() {
  const insets = useSafeAreaInsets();
  const { addPet, pets } = usePetStore();
  const [step, setStep] = useState(1);
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null);
  const [petName, setPetName] = useState("");
  const [petAge, setPetAge] = useState("");
  const [petWeight, setPetWeight] = useState("");
  const [chipNumber, setChipNumber] = useState("");
  const [showSpeciesModal, setShowSpeciesModal] = useState(false);

  const handleNext = () => {
    if (step === 1 && selectedSpecies) {
      setStep(2);
    } else if (step === 2 && petName.trim()) {
      setStep(3);
    } else if (step === 3) {
      // Save pet and return to dashboard
      if (petName.trim() && selectedSpecies) {
        addPet({
          name: petName,
          species: selectedSpecies,
          age: petAge ? parseInt(petAge) : 0,
          weight: petWeight ? parseFloat(petWeight) : 0,
          chipNumber: chipNumber || undefined,
        } as any);
      }
      router.replace("/(tabs)");
    }
  };

  const handleSkip = () => {
    if (petName.trim() && selectedSpecies) {
      addPet({
        name: petName,
        species: selectedSpecies,
        age: petAge ? parseInt(petAge) : 0,
        weight: petWeight ? parseFloat(petWeight) : 0,
        chipNumber: chipNumber || undefined,
      } as any);
    }
    router.replace("/(tabs)");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <LinearGradient
        colors={["#1E5A96", "#0F3A5F"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingTop: insets.top + 16,
            paddingBottom: insets.bottom + 32,
            paddingHorizontal: 20,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Progress */}
          <View className="mb-8">
            <View className="flex-row gap-2 mb-4">
              {[1, 2, 3].map((s) => (
                <View
                  key={s}
                  className={`flex-1 h-1 rounded-full ${
                    s <= step ? "bg-white" : "bg-white/30"
                  }`}
                />
              ))}
            </View>
            <Text className="text-white/70 text-sm">
              Schritt {step} von 3
            </Text>
          </View>

          {/* Step 1: Species Selection */}
          {step === 1 && (
            <View>
              <View className="mb-8">
                <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center mx-auto mb-6">
                  <IconSymbol size={40} name="pawprint.fill" color="#FFFFFF" />
                </View>
                <Text className="text-white text-3xl font-bold text-center mb-2">
                  Welches Tier?
                </Text>
                <Text className="text-white/70 text-center">
                  Wähle die Tierart aus
                </Text>
              </View>

              <View className="gap-3">
                {PET_SPECIES.map((species) => (
                  <Pressable
                    key={species.id}
                    onPress={() => setSelectedSpecies(species.id)}
                    className={`p-4 rounded-2xl border-2 ${
                      selectedSpecies === species.id
                        ? "bg-white/20 border-white"
                        : "bg-white/5 border-white/20"
                    }`}
                  >
                    <View className="flex-row items-center gap-3">
                      <View className="w-12 h-12 bg-white/20 rounded-lg items-center justify-center">
                        <IconSymbol
                          size={24}
                          name={species.icon as any}
                          color="#FFFFFF"
                        />
                      </View>
                      <Text
                        className={`text-lg font-semibold ${
                          selectedSpecies === species.id
                            ? "text-white"
                            : "text-white/70"
                        }`}
                      >
                        {species.name}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Step 2: Pet Details */}
          {step === 2 && (
            <View>
              <View className="mb-8">
                <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center mx-auto mb-6">
                  <IconSymbol size={40} name="pencil.circle.fill" color="#FFFFFF" />
                </View>
                <Text className="text-white text-3xl font-bold text-center mb-2">
                  Tierdetails
                </Text>
                <Text className="text-white/70 text-center">
                  Erzähl uns mehr über dein Tier
                </Text>
              </View>

              <View className="gap-4">
                <View>
                  <Text className="text-white font-semibold mb-2">
                    Tiername *
                  </Text>
                  <TextInput
                    placeholder="z.B. Luna"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    value={petName}
                    onChangeText={setPetName}
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                  />
                </View>

                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <Text className="text-white font-semibold mb-2">Alter</Text>
                    <TextInput
                      placeholder="z.B. 3"
                      placeholderTextColor="rgba(255,255,255,0.4)"
                      value={petAge}
                      onChangeText={setPetAge}
                      keyboardType="numeric"
                      className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                    />
                  </View>

                  <View className="flex-1">
                    <Text className="text-white font-semibold mb-2">
                      Gewicht (kg)
                    </Text>
                    <TextInput
                      placeholder="z.B. 25"
                      placeholderTextColor="rgba(255,255,255,0.4)"
                      value={petWeight}
                      onChangeText={setPetWeight}
                      keyboardType="decimal-pad"
                      className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                    />
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Step 3: Chip Registration */}
          {step === 3 && (
            <View>
              <View className="mb-8">
                <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center mx-auto mb-6">
                  <IconSymbol size={40} name="tag.fill" color="#FFFFFF" />
                </View>
                <Text className="text-white text-3xl font-bold text-center mb-2">
                  Chipregistrierung
                </Text>
                <Text className="text-white/70 text-center">
                  Optional: Chipnummer für Registrierung
                </Text>
              </View>

              <View className="gap-4">
                <View>
                  <Text className="text-white font-semibold mb-2">
                    Chipnummer (optional)
                  </Text>
                  <TextInput
                    placeholder="z.B. 900001234567890"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    value={chipNumber}
                    onChangeText={setChipNumber}
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-mono text-sm"
                  />
                  <Text className="text-white/60 text-xs mt-2">
                    Diese wird bei Tasso, Findefix und anderen Registrierungsdatenbanken
                    verwendet.
                  </Text>
                </View>

                <View className="bg-white/10 rounded-2xl p-4 mt-4">
                  <View className="flex-row gap-3 mb-3">
                    <View className="w-8 h-8 bg-white/20 rounded items-center justify-center">
                      <IconSymbol size={16} name="info.circle.fill" color="#FFFFFF" />
                    </View>
                    <Text className="text-white/70 text-sm flex-1">
                      Wir helfen dir später, dein Tier in den wichtigsten Registrierungsdatenbanken
                      anzumelden.
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Buttons */}
          <View className="gap-3 mt-auto pt-8">
            <Pressable
              onPress={handleNext}
              className="bg-white rounded-lg py-4 items-center justify-center active:opacity-80"
            >
              <Text className="text-blue-600 font-bold text-lg">
                {step === 3 ? "Fertig" : "Weiter"}
              </Text>
            </Pressable>

            {step < 3 && (
              <Pressable onPress={handleSkip} className="py-3 items-center">
                <Text className="text-white/70 font-semibold">Überspringen</Text>
              </Pressable>
            )}
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
