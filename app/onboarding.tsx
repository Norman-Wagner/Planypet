import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { usePetStore } from "@/lib/pet-store";

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { setUserName } = usePetStore();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Save user data and proceed to pet setup
      if (name.trim()) {
        setUserName(name);
      }
      router.replace("/(tabs)");
    }
  };

  const handleSkip = () => {
    if (name.trim()) {
      setUserName(name);
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
          {/* Progress Indicator */}
          <View className="mb-8">
            <View className="flex-row gap-2 mb-4">
              {[1, 2, 3, 4].map((s) => (
                <View
                  key={s}
                  className={`flex-1 h-1 rounded-full ${
                    s <= step ? "bg-white" : "bg-white/30"
                  }`}
                />
              ))}
            </View>
            <Text className="text-white/70 text-sm">
              Schritt {step} von 4
            </Text>
          </View>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <View>
              <View className="mb-8">
                <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center mx-auto mb-6">
                  <IconSymbol size={40} name="person.fill" color="#FFFFFF" />
                </View>
                <Text className="text-white text-3xl font-bold text-center mb-2">
                  Willkommen!
                </Text>
                <Text className="text-white/70 text-center">
                  Lass uns dein Profil einrichten
                </Text>
              </View>

              <View className="gap-4">
                <View>
                  <Text className="text-white font-semibold mb-2">
                    Dein Name *
                  </Text>
                  <TextInput
                    placeholder="z.B. Norman Wagner"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    value={name}
                    onChangeText={setName}
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                  />
                </View>

                <View>
                  <Text className="text-white font-semibold mb-2">
                    E-Mail *
                  </Text>
                  <TextInput
                    placeholder="deine@email.de"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                  />
                </View>
              </View>
            </View>
          )}

          {/* Step 2: Contact Info */}
          {step === 2 && (
            <View>
              <View className="mb-8">
                <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center mx-auto mb-6">
                  <IconSymbol size={40} name="phone.fill" color="#FFFFFF" />
                </View>
                <Text className="text-white text-3xl font-bold text-center mb-2">
                  Kontaktdaten
                </Text>
                <Text className="text-white/70 text-center">
                  Damit wir dich erreichen können
                </Text>
              </View>

              <View className="gap-4">
                <View>
                  <Text className="text-white font-semibold mb-2">
                    Telefonnummer
                  </Text>
                  <TextInput
                    placeholder="+49 123 456789"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                  />
                </View>

                <View>
                  <Text className="text-white font-semibold mb-2">Adresse</Text>
                  <TextInput
                    placeholder="Straße 123, 09000 Chemnitz"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    value={address}
                    onChangeText={setAddress}
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                  />
                </View>
              </View>
            </View>
          )}

          {/* Step 3: Emergency Contact */}
          {step === 3 && (
            <View>
              <View className="mb-8">
                <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center mx-auto mb-6">
                  <IconSymbol size={40} name="heart.fill" color="#FFFFFF" />
                </View>
                <Text className="text-white text-3xl font-bold text-center mb-2">
                  Notfallkontakt
                </Text>
                <Text className="text-white/70 text-center">
                  Für Notfälle mit deinen Haustieren
                </Text>
              </View>

              <View className="gap-4">
                <View>
                  <Text className="text-white font-semibold mb-2">
                    Name der Kontaktperson
                  </Text>
                  <TextInput
                    placeholder="z.B. Familienangehöriger"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    value={emergencyContact}
                    onChangeText={setEmergencyContact}
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                  />
                </View>

                <View>
                  <Text className="text-white font-semibold mb-2">
                    Telefonnummer
                  </Text>
                  <TextInput
                    placeholder="+49 123 987654"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    value={emergencyPhone}
                    onChangeText={setEmergencyPhone}
                    keyboardType="phone-pad"
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                  />
                </View>

                <Text className="text-white/60 text-xs mt-2">
                  Diese Informationen werden nur in Notfällen verwendet und nicht
                  mit Dritten geteilt.
                </Text>
              </View>
            </View>
          )}

          {/* Step 4: Summary */}
          {step === 4 && (
            <View>
              <View className="mb-8">
                <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center mx-auto mb-6">
                  <IconSymbol size={40} name="checkmark.circle.fill" color="#FFFFFF" />
                </View>
                <Text className="text-white text-3xl font-bold text-center mb-2">
                  Fertig!
                </Text>
                <Text className="text-white/70 text-center">
                  Dein Profil ist eingerichtet
                </Text>
              </View>

              <View className="bg-white/10 rounded-2xl p-4 gap-3 mb-6">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 bg-white/20 rounded-lg items-center justify-center">
                    <IconSymbol size={20} name="person.fill" color="#FFFFFF" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white/60 text-xs">Name</Text>
                    <Text className="text-white font-semibold">{name}</Text>
                  </View>
                </View>

                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 bg-white/20 rounded-lg items-center justify-center">
                    <IconSymbol size={20} name="envelope.fill" color="#FFFFFF" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white/60 text-xs">E-Mail</Text>
                    <Text className="text-white font-semibold">{email}</Text>
                  </View>
                </View>

                {phone && (
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 bg-white/20 rounded-lg items-center justify-center">
                      <IconSymbol size={20} name="phone.fill" color="#FFFFFF" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-white/60 text-xs">Telefon</Text>
                      <Text className="text-white font-semibold">{phone}</Text>
                    </View>
                  </View>
                )}
              </View>

              <Text className="text-white/60 text-xs text-center mb-6">
                Anschließend richten wir dein erstes Haustier ein und der KI-Ratgeber
                führt dich durch alle Funktionen.
              </Text>
            </View>
          )}

          {/* Buttons */}
          <View className="gap-3 mt-auto pt-8">
            <Pressable
              onPress={handleNext}
              className="bg-white rounded-lg py-4 items-center justify-center active:opacity-80"
            >
              <Text className="text-blue-600 font-bold text-lg">
                {step === 4 ? "Starten" : "Weiter"}
              </Text>
            </Pressable>

            {step < 4 && (
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
