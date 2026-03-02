import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { usePetStore } from "@/lib/pet-store";

export default function HealthRecordsScreen() {
  const insets = useSafeAreaInsets();
  const { pets } = usePetStore();
  const [selectedPet, setSelectedPet] = useState(pets[0]?.id || "");
  const [vetMode, setVetMode] = useState(false);

  const vaccinations = [
    { name: "Tollwut", status: "Aktuell", date: "15.03.2024", nextDue: "15.03.2025" },
    { name: "Staupe", status: "Aktuell", date: "15.03.2024", nextDue: "15.03.2025" },
    { name: "Parvovirose", status: "Aktuell", date: "15.03.2024", nextDue: "15.03.2025" },
    { name: "Leptospirose", status: "Ausstehend", date: "—", nextDue: "01.04.2026" },
  ];

  const appointments = [
    { date: "22.03.2026", time: "14:30", vet: "Dr. Schmidt", reason: "Routineuntersuchung" },
    { date: "15.04.2026", time: "10:00", vet: "Dr. Müller", reason: "Zahnreinigung" },
  ];

  const handleVetModeToggle = () => {
    if (!vetMode) {
      Alert.alert(
        "Vet-Modus",
        "Vet-Modus aktiviert. Sensible Daten sind jetzt sichtbar.",
        [
          { text: "Abbrechen", onPress: () => {} },
          { text: "Aktivieren", onPress: () => setVetMode(true) },
        ]
      );
    } else {
      setVetMode(false);
    }
  };

  return (
    <LinearGradient
      colors={["#E74C3C", "#C0392B"]}
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
              Medizinische Daten
            </Text>
            <Text className="text-white text-2xl font-bold">Gesundheitsakten</Text>
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
                    selectedPet === pet.id ? "text-red-600" : "text-white"
                  }`}
                >
                  {pet.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Vet Mode Toggle */}
        <Pressable
          onPress={handleVetModeToggle}
          className={`p-4 rounded-2xl border-2 mb-6 flex-row items-center justify-between ${
            vetMode
              ? "bg-white/20 border-white"
              : "bg-white/5 border-white/20"
          }`}
        >
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 bg-white/20 rounded-lg items-center justify-center">
              <IconSymbol size={20} name="stethoscope" color="#FFFFFF" />
            </View>
            <View>
              <Text className="text-white font-semibold">Vet-Modus</Text>
              <Text className="text-white/60 text-xs">
                {vetMode ? "Aktiviert" : "Deaktiviert"}
              </Text>
            </View>
          </View>
          <View className={`w-6 h-6 rounded-full ${vetMode ? "bg-white" : "bg-white/30"}`} />
        </Pressable>

        {/* Health Status */}
        <View className="bg-white/10 rounded-2xl p-6 border border-white/20 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-white font-bold text-lg">Gesundheitsstatus</Text>
            <View className="w-12 h-12 bg-green-500/40 rounded-full items-center justify-center">
              <IconSymbol size={24} name="checkmark.circle.fill" color="#4ADE80" />
            </View>
          </View>
          <Text className="text-white/80 text-sm">
            Letzter Tierarztbesuch: 15.03.2024
          </Text>
          <Text className="text-white/80 text-sm">
            Nächste Untersuchung: 22.03.2026
          </Text>
        </View>

        {/* Vaccinations */}
        <View className="mb-6">
          <Text className="text-white font-bold text-lg mb-3">Impfungen</Text>
          <View className="gap-2">
            {vaccinations.map((vac, idx) => (
              <View
                key={idx}
                className="bg-white/10 rounded-2xl p-4 border border-white/20"
              >
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-white font-semibold">{vac.name}</Text>
                  <View
                    className={`px-3 py-1 rounded-full ${
                      vac.status === "Aktuell"
                        ? "bg-green-500/30"
                        : "bg-yellow-500/30"
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        vac.status === "Aktuell"
                          ? "text-green-200"
                          : "text-yellow-200"
                      }`}
                    >
                      {vac.status}
                    </Text>
                  </View>
                </View>
                <View className="flex-row justify-between text-xs">
                  <Text className="text-white/60">
                    Geimpft: {vac.date}
                  </Text>
                  <Text className="text-white/60">
                    Nächste: {vac.nextDue}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Appointments */}
        <View className="mb-6">
          <Text className="text-white font-bold text-lg mb-3">Termine</Text>
          <View className="gap-2">
            {appointments.map((apt, idx) => (
              <View
                key={idx}
                className="bg-white/10 rounded-2xl p-4 border border-white/20"
              >
                <View className="flex-row items-center gap-3 mb-2">
                  <View className="w-10 h-10 bg-white/20 rounded-lg items-center justify-center">
                    <IconSymbol size={20} name="calendar" color="#FFFFFF" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-semibold">{apt.date}</Text>
                    <Text className="text-white/60 text-xs">{apt.time} Uhr</Text>
                  </View>
                </View>
                <Text className="text-white/80 text-sm">
                  <Text className="font-semibold">{apt.vet}</Text> - {apt.reason}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Add Appointment Button */}
        <Pressable className="py-4 rounded-2xl items-center justify-center mb-6">
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
            <View className="flex-row items-center gap-2">
              <IconSymbol size={20} name="plus" color="#FFFFFF" />
              <Text className="text-white font-bold text-lg">
                Termin hinzufügen
              </Text>
            </View>
          </LinearGradient>
        </Pressable>

        {/* Liability Disclaimer */}
        <View className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <Text className="text-white/60 text-xs leading-relaxed">
            <Text className="font-semibold">Haftungsausschluss:</Text> Diese
            Gesundheitsakten ersetzen nicht die professionelle Beratung durch
            einen Tierarzt. Konsultieren Sie bei Fragen immer einen Fachmann.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
