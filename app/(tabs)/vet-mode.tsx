import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, Share } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

interface Vaccination {
  id: string;
  name: string;
  date: string;
  nextDue: string;
  veterinarian: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  reason: string;
  startDate: string;
  endDate?: string;
}

interface Allergy {
  id: string;
  allergen: string;
  severity: "mild" | "moderate" | "severe";
  reaction: string;
}

export default function VetModeScreen() {
  const colors = useColors();

  const [vaccinations] = useState<Vaccination[]>([
    {
      id: "1",
      name: "Tollwut",
      date: "15.02.2026",
      nextDue: "15.02.2027",
      veterinarian: "Dr. Schmidt, Tierarzt Chemnitz",
    },
    {
      id: "2",
      name: "Staupe/Parvovirose",
      date: "01.02.2026",
      nextDue: "01.02.2027",
      veterinarian: "Dr. Schmidt, Tierarzt Chemnitz",
    },
    {
      id: "3",
      name: "Leptospirose",
      date: "15.01.2026",
      nextDue: "15.01.2027",
      veterinarian: "Dr. Schmidt, Tierarzt Chemnitz",
    },
  ]);

  const [medications] = useState<Medication[]>([
    {
      id: "1",
      name: "Amoxicillin",
      dosage: "250mg",
      frequency: "2x täglich",
      reason: "Zahninfekt",
      startDate: "01.03.2026",
      endDate: "15.03.2026",
    },
    {
      id: "2",
      name: "Glucosamin",
      dosage: "500mg",
      frequency: "1x täglich",
      reason: "Gelenkgesundheit",
      startDate: "01.01.2026",
    },
  ]);

  const [allergies] = useState<Allergy[]>([
    {
      id: "1",
      allergen: "Rindfleisch",
      severity: "moderate",
      reaction: "Magen-Darm-Probleme",
    },
    {
      id: "2",
      allergen: "Getreide",
      severity: "mild",
      reaction: "Juckreiz",
    },
  ]);

  const handleExportData = async () => {
    try {
      const data = {
        vaccinations,
        medications,
        allergies,
        exportedAt: new Date().toISOString(),
      };

      await Share.share({
        message: JSON.stringify(data, null, 2),
        title: "Planypet Vet-Daten",
      });
    } catch (error) {
      Alert.alert("Fehler", "Daten konnten nicht exportiert werden");
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "mild":
        return colors.success;
      case "moderate":
        return colors.warning;
      case "severe":
        return colors.error;
      default:
        return colors.muted;
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="pb-6">
        {/* Header */}
        <View className="mb-6 flex-row justify-between items-start">
          <View>
            <Text className="text-3xl font-bold text-foreground">Vet-Modus</Text>
            <Text className="text-muted">Professionelle Tierarzt-Ansicht</Text>
          </View>
          <TouchableOpacity
            onPress={handleExportData}
            className="bg-primary/20 rounded-lg p-2"
          >
            <IconSymbol name="square.and.arrow.up" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 bg-surface rounded-lg border border-border p-3">
            <Text className="text-xs text-muted">Impfungen</Text>
            <Text className="text-2xl font-bold text-foreground">{vaccinations.length}</Text>
          </View>
          <View className="flex-1 bg-surface rounded-lg border border-border p-3">
            <Text className="text-xs text-muted">Medikamente</Text>
            <Text className="text-2xl font-bold text-foreground">{medications.length}</Text>
          </View>
          <View className="flex-1 bg-surface rounded-lg border border-border p-3">
            <Text className="text-xs text-muted">Allergien</Text>
            <Text className="text-2xl font-bold text-foreground">{allergies.length}</Text>
          </View>
        </View>

        {/* Vaccinations */}
        <View className="mb-6">
          <View className="flex-row items-center gap-2 mb-3">
            <IconSymbol name="syringe.fill" size={20} color={colors.success} />
            <Text className="text-lg font-bold text-foreground">Impfpass</Text>
          </View>
          {vaccinations.map((vac) => (
            <View
              key={vac.id}
              className="bg-surface rounded-lg border border-border p-4 mb-3"
            >
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-base font-semibold text-foreground">{vac.name}</Text>
                <View className="bg-success/20 rounded px-2 py-1">
                  <Text className="text-xs font-semibold text-success">✓ Aktuell</Text>
                </View>
              </View>
              <View className="gap-1">
                <Text className="text-sm text-muted">Geimpft: {vac.date}</Text>
                <Text className="text-sm text-muted">Nächste Impfung: {vac.nextDue}</Text>
                <Text className="text-xs text-muted mt-2">{vac.veterinarian}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Medications */}
        <View className="mb-6">
          <View className="flex-row items-center gap-2 mb-3">
            <IconSymbol name="pills.fill" size={20} color={colors.warning} />
            <Text className="text-lg font-bold text-foreground">Medikamente</Text>
          </View>
          {medications.map((med) => (
            <View
              key={med.id}
              className="bg-surface rounded-lg border border-border p-4 mb-3"
            >
              <Text className="text-base font-semibold text-foreground mb-2">{med.name}</Text>
              <View className="gap-1">
                <Text className="text-sm text-muted">Dosierung: {med.dosage}</Text>
                <Text className="text-sm text-muted">Häufigkeit: {med.frequency}</Text>
                <Text className="text-sm text-muted">Grund: {med.reason}</Text>
                <Text className="text-xs text-muted mt-2">
                  Von: {med.startDate} {med.endDate ? `bis ${med.endDate}` : "(laufend)"}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Allergies */}
        <View className="mb-6">
          <View className="flex-row items-center gap-2 mb-3">
            <IconSymbol name="exclamationmark.circle.fill" size={20} color={colors.error} />
            <Text className="text-lg font-bold text-foreground">Allergien & Unverträglichkeiten</Text>
          </View>
          {allergies.map((allergy) => (
            <View
              key={allergy.id}
              className="bg-surface rounded-lg border border-border p-4 mb-3"
            >
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-base font-semibold text-foreground">
                  {allergy.allergen}
                </Text>
                <View
                  className="rounded px-2 py-1"
                  style={{
                    backgroundColor: getSeverityColor(allergy.severity) + "20",
                  }}
                >
                  <Text
                    className="text-xs font-semibold"
                    style={{ color: getSeverityColor(allergy.severity) }}
                  >
                    {allergy.severity === "mild"
                      ? "Mild"
                      : allergy.severity === "moderate"
                        ? "Moderat"
                        : "Schwer"}
                  </Text>
                </View>
              </View>
              <Text className="text-sm text-muted">Reaktion: {allergy.reaction}</Text>
            </View>
          ))}
        </View>

        {/* Export Button */}
        <TouchableOpacity
          onPress={handleExportData}
          className="bg-primary rounded-lg py-3 items-center mb-4"
        >
          <View className="flex-row items-center gap-2">
            <IconSymbol name="doc.text.fill" size={20} color="#ffffff" />
            <Text className="text-background font-semibold">Daten exportieren/drucken</Text>
          </View>
        </TouchableOpacity>

        {/* Disclaimer */}
        <View className="p-4 bg-warning/10 rounded-lg border border-warning/30">
          <Text className="text-xs text-warning font-semibold mb-2">⚠️ WICHTIG</Text>
          <Text className="text-xs text-warning leading-relaxed">
            Diese Daten sind für Tierärzte gedacht. Bitte bringen Sie diese Informationen zu
            jedem Tierarzt-Termin mit. Sie ersetzen nicht die professionelle Beratung.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
