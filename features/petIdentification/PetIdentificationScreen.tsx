import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { usePetStore } from "@/features/pets/PetStore";
import { validateMicrochip, generateQRCode } from "./registryService";

export function PetIdentificationScreen() {
  const colors = useColors();
  const { addPet } = usePetStore();
  const [microchip, setMicrochip] = useState("");
  const [taxTag, setTaxTag] = useState("");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"microchip" | "taxtag" | "qrcode">("microchip");

  const handleValidateMicrochip = () => {
    if (!microchip.trim()) {
      Alert.alert("Fehler", "Bitte gib eine Chipnummer ein");
      return;
    }

    const isValid = validateMicrochip(microchip);
    if (isValid) {
      Alert.alert("Erfolg", "Chipnummer ist gültig!");
    } else {
      Alert.alert("Fehler", "Chipnummer ist ungültig. Bitte überprüfe die Eingabe.");
    }
  };

  const handleGenerateQR = () => {
    if (!microchip.trim()) {
      Alert.alert("Fehler", "Bitte gib eine Chipnummer ein");
      return;
    }

    const qr = generateQRCode(microchip);
    setQrCode(qr);
    Alert.alert("Erfolg", "QR-Code generiert!");
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="gap-6 p-6">
        {/* Header */}
        <View>
          <Text className="text-3xl font-bold text-foreground">Tieridentifikation</Text>
          <Text className="text-sm text-muted mt-2">Verwalte Chipnummer, Steuertag und QR-Code</Text>
        </View>

        {/* Tabs */}
        <View className="flex-row gap-2">
          {["microchip", "taxtag", "qrcode"].map((tab) => (
            <TouchableOpacity
              key={tab}
              className="flex-1 py-3 rounded-lg"
              style={{
                backgroundColor: activeTab === tab ? colors.primary : colors.surface,
              }}
              onPress={() => setActiveTab(tab as "microchip" | "taxtag" | "qrcode")}
            >
              <Text
                className="text-center font-semibold"
                style={{ color: activeTab === tab ? "#ffffff" : colors.foreground }}
              >
                {tab === "microchip" ? "Chip" : tab === "taxtag" ? "Steuertag" : "QR-Code"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        {activeTab === "microchip" && (
          <View className="gap-4">
            <Text className="text-lg font-semibold text-foreground">Chipnummer (15 Ziffern)</Text>
            <TextInput
              className="p-4 rounded-lg border text-foreground"
              style={{ borderColor: colors.border }}
              placeholder="z.B. 123456789012345"
              placeholderTextColor={colors.muted}
              value={microchip}
              onChangeText={setMicrochip}
              keyboardType="numeric"
              maxLength={15}
            />
            <TouchableOpacity
              className="py-4 rounded-lg"
              style={{ backgroundColor: colors.primary }}
              onPress={handleValidateMicrochip}
            >
              <Text className="text-white font-semibold text-center">Validieren</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === "taxtag" && (
          <View className="gap-4">
            <Text className="text-lg font-semibold text-foreground">Steuertag-Nummer</Text>
            <TextInput
              className="p-4 rounded-lg border text-foreground"
              style={{ borderColor: colors.border }}
              placeholder="Steuertag-Nummer eingeben"
              placeholderTextColor={colors.muted}
              value={taxTag}
              onChangeText={setTaxTag}
            />
            <TouchableOpacity
              className="py-4 rounded-lg"
              style={{ backgroundColor: colors.primary }}
              onPress={() => Alert.alert("Erfolg", "Steuertag gespeichert!")}
            >
              <Text className="text-white font-semibold text-center">Speichern</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === "qrcode" && (
          <View className="gap-4">
            <Text className="text-lg font-semibold text-foreground">QR-Code generieren</Text>
            <Text className="text-sm text-muted">Generiere einen QR-Code für deine Chipnummer</Text>
            {qrCode && (
              <View className="p-4 rounded-lg" style={{ backgroundColor: colors.surface }}>
                <Text className="text-center text-muted text-sm">QR-Code: {qrCode}</Text>
              </View>
            )}
            <TouchableOpacity
              className="py-4 rounded-lg"
              style={{ backgroundColor: colors.primary }}
              onPress={handleGenerateQR}
            >
              <Text className="text-white font-semibold text-center">QR-Code generieren</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
