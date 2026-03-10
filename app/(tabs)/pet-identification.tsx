import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Image } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { validateMicrochip, formatMicrochip } from "@/features/petIdentification";
import * as ImagePicker from "expo-image-picker";

export default function PetIdentificationScreen() {
  const colors = useColors();

  const [microchip, setMicrochip] = useState("");
  const [taxTag, setTaxTag] = useState("");
  const [tagPhoto, setTagPhoto] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"microchip" | "tax-tag" | "qr-code">("microchip");

  const handleMicrochipChange = (text: string) => {
    // Allow only digits and spaces
    const cleaned = text.replace(/[^\d\s]/g, "");
    setMicrochip(cleaned);
  };

  const handleValidateMicrochip = () => {
    if (!microchip) {
      Alert.alert("Fehler", "Bitte Chipnummer eingeben");
      return;
    }

    if (!validateMicrochip(microchip)) {
      Alert.alert("Ungültige Chipnummer", "Die Chipnummer muss genau 15 Ziffern enthalten");
      return;
    }

    Alert.alert("Erfolg", `Chipnummer gültig: ${formatMicrochip(microchip)}`);
  };

  const handlePickTagPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setTagPhoto(result.assets[0].uri);
    }
  };

  const handleGenerateQRCode = () => {
    if (!validateMicrochip(microchip)) {
      Alert.alert("Fehler", "Bitte gültige Chipnummer eingeben");
      return;
    }
    // QR code generation would happen here
    Alert.alert("QR-Code", "QR-Code würde hier generiert: " + formatMicrochip(microchip));
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="pb-6">
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-3xl font-bold text-foreground mb-2">Tier-Identifikation</Text>
          <Text className="text-muted">Verwalte Chipnummer, Steuertag und QR-Code</Text>
        </View>

        {/* Tabs */}
        <View className="flex-row gap-2 px-6 mb-6">
          {(["microchip", "tax-tag", "qr-code"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg ${
                activeTab === tab ? "bg-primary" : "bg-surface border border-border"
              }`}
            >
              <Text
                className={`text-center text-sm font-semibold ${
                  activeTab === tab ? "text-background" : "text-foreground"
                }`}
              >
                {tab === "microchip" ? "Chip" : tab === "tax-tag" ? "Steuertag" : "QR-Code"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Microchip Tab */}
        {activeTab === "microchip" && (
          <View className="px-6">
            <View className="bg-surface rounded-lg p-4 mb-6 border border-border">
              <View className="flex-row items-center gap-3 mb-3">
                <IconSymbol name="barcode.viewfinder" size={24} color={colors.primary} />
                <Text className="text-foreground font-semibold">Chipnummer (15 Ziffern)</Text>
              </View>
              <Text className="text-muted text-sm mb-4">
                Geben Sie die 15-stellige Chipnummer ein. Diese finden Sie auf dem Chip-Zertifikat oder beim Tierarzt.
              </Text>

              <TextInput
                placeholder="123 456 789 012 345"
                value={formatMicrochip(microchip)}
                onChangeText={handleMicrochipChange}
                keyboardType="numeric"
                maxLength={17}
                className="border border-border rounded-lg px-4 py-3 text-foreground mb-4"
                placeholderTextColor={colors.muted}
              />

              <TouchableOpacity
                onPress={handleValidateMicrochip}
                className="bg-primary rounded-lg py-3"
              >
                <Text className="text-center font-semibold text-background">Validieren</Text>
              </TouchableOpacity>

              {microchip && validateMicrochip(microchip) && (
                <View className="mt-4 bg-success/10 rounded-lg p-3 border border-success">
                  <View className="flex-row items-center gap-2">
                    <IconSymbol name="checkmark.circle.fill" size={20} color={colors.success} />
                    <Text className="text-success font-semibold">Chipnummer gültig</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Tax Tag Tab */}
        {activeTab === "tax-tag" && (
          <View className="px-6">
            <View className="bg-surface rounded-lg p-4 mb-6 border border-border">
              <View className="flex-row items-center gap-3 mb-3">
                <IconSymbol name="tag.fill" size={24} color={colors.primary} />
                <Text className="text-foreground font-semibold">Steuertag-Nummer</Text>
              </View>
              <Text className="text-muted text-sm mb-4">
                Die Steuertag-Nummer finden Sie auf dem Steuertag Ihres Tieres (z.B. Hundesteuer-Marke).
              </Text>

              <TextInput
                placeholder="z.B. 12345/2024"
                value={taxTag}
                onChangeText={setTaxTag}
                className="border border-border rounded-lg px-4 py-3 text-foreground mb-4"
                placeholderTextColor={colors.muted}
              />

              {tagPhoto && (
                <View className="mb-4">
                  <Image
                    source={{ uri: tagPhoto }}
                    style={{ width: "100%", height: 200, borderRadius: 8 }}
                  />
                </View>
              )}

              <TouchableOpacity
                onPress={handlePickTagPhoto}
                className="bg-surface border border-border rounded-lg py-3 mb-4"
              >
                <View className="flex-row items-center justify-center gap-2">
                  <IconSymbol name="camera.fill" size={20} color={colors.primary} />
                  <Text className="text-primary font-semibold">
                    {tagPhoto ? "Foto ändern" : "Foto hinzufügen"}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity className="bg-primary rounded-lg py-3">
                <Text className="text-center font-semibold text-background">Speichern</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* QR Code Tab */}
        {activeTab === "qr-code" && (
          <View className="px-6">
            <View className="bg-surface rounded-lg p-4 mb-6 border border-border">
              <View className="flex-row items-center gap-3 mb-3">
                <IconSymbol name="qrcode" size={24} color={colors.primary} />
                <Text className="text-foreground font-semibold">QR-Code für Tier</Text>
              </View>
              <Text className="text-muted text-sm mb-4">
                Generieren Sie einen QR-Code für Ihr Tier. Dieser kann auf Tags oder Halsbändern angebracht werden.
              </Text>

              {qrCode ? (
                <View className="bg-background rounded-lg p-4 mb-4 items-center">
                  <View className="w-40 h-40 bg-white rounded-lg items-center justify-center">
                    <Text className="text-muted text-sm">QR-Code hier</Text>
                  </View>
                </View>
              ) : (
                <View className="bg-background rounded-lg p-4 mb-4 items-center">
                  <View className="w-40 h-40 bg-surface rounded-lg items-center justify-center border border-border">
                    <IconSymbol name="qrcode" size={60} color={colors.muted} />
                  </View>
                </View>
              )}

              <TouchableOpacity
                onPress={handleGenerateQRCode}
                className="bg-primary rounded-lg py-3"
              >
                <Text className="text-center font-semibold text-background">
                  {qrCode ? "QR-Code neu generieren" : "QR-Code generieren"}
                </Text>
              </TouchableOpacity>

              {qrCode && (
                <TouchableOpacity className="bg-surface border border-border rounded-lg py-3 mt-3">
                  <View className="flex-row items-center justify-center gap-2">
                    <IconSymbol name="arrow.down.doc" size={20} color={colors.primary} />
                    <Text className="text-primary font-semibold">Herunterladen</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
