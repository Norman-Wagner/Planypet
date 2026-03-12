import React, { useState } from "react";
import { View, Text, Pressable, ActivityIndicator, ScrollView, Share } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { usePetStore } from "@/store/PetStore";

export default function LostPetQRScreen() {
  const store = usePetStore();
  const activePet = store.getActivePet();
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [finderUrl, setFinderUrl] = useState<string | null>(null);

  const generateQRCode = async () => {
    if (!activePet) return;

    setIsGenerating(true);
    try {
      // Generate unique finder URL (without sensitive data)
      const finderId = Math.random().toString(36).substring(2, 11);
      const baseUrl = "https://planypet.app/finder";
      const finderLink = `${baseUrl}/${finderId}`;

      // In production, this would call a backend to generate QR code
      // For now, we'll use a QR code API
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
        finderLink
      )}`;

      // Update pet with QR code
      store.updateIdentification(activePet.id, {
        ...activePet.identification,
        qrCode: finderLink,
      });

      setQrUrl(qrCodeUrl);
      setFinderUrl(finderLink);
    } catch (error) {
      console.error("Error generating QR code:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShareQR = async () => {
    if (!finderUrl) return;

    try {
      await Share.share({
        message: `Hilf mir, mein Haustier ${activePet?.name} zu finden! Scan diesen QR-Code: ${finderUrl}`,
        url: finderUrl,
        title: `QR-Code für ${activePet?.name}`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handlePrintQR = () => {
    // In production, this would trigger a print dialog
    console.log("Print QR code:", qrUrl);
  };

  if (!activePet) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-gray-600">Kein Tier ausgewählt</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-6">
          <View className="items-center mb-4">
            <Text className="text-3xl font-bold text-foreground mb-2">
              🔍 Verlorenes Tier
            </Text>
            <Text className="text-gray-600 text-center">
              Erstelle einen QR-Code für {activePet.name}, um Finder zu helfen
            </Text>
          </View>

          {!qrUrl ? (
            <View className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <Text className="text-gray-800 mb-4 font-semibold">
                So funktioniert's:
              </Text>
              <View className="gap-3">
                <View className="flex-row gap-3">
                  <Text className="text-2xl">1️⃣</Text>
                  <Text className="flex-1 text-gray-700">
                    Generiere einen QR-Code für {activePet.name}
                  </Text>
                </View>
                <View className="flex-row gap-3">
                  <Text className="text-2xl">2️⃣</Text>
                  <Text className="flex-1 text-gray-700">
                    Drucke den Code auf ein Halsband oder Plakat
                  </Text>
                </View>
                <View className="flex-row gap-3">
                  <Text className="text-2xl">3️⃣</Text>
                  <Text className="flex-1 text-gray-700">
                    Finder scannen den Code und sehen eine sichere Kontaktseite (ohne Adresse)
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={generateQRCode}
                disabled={isGenerating}
                className="bg-blue-500 rounded-lg py-4 px-6 items-center mt-6"
              >
                {isGenerating ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-semibold text-lg">
                    📱 QR-Code generieren
                  </Text>
                )}
              </Pressable>
            </View>
          ) : (
            <View className="bg-white rounded-lg p-6 border border-gray-200 items-center">
              <Text className="text-lg font-semibold text-gray-800 mb-4">
                QR-Code für {activePet.name}
              </Text>

              {/* QR Code Display */}
              <View className="bg-gray-100 rounded-lg p-4 mb-6 w-full items-center">
                <View className="w-64 h-64 bg-white rounded-lg items-center justify-center border-2 border-gray-300">
                  <Text className="text-gray-500 text-center">
                    QR-Code{"\n"}(würde hier angezeigt)
                  </Text>
                </View>
              </View>

              <Text className="text-sm text-gray-600 mb-4 text-center">
                Finder-Link:{"\n"}
                <Text className="font-mono text-xs text-blue-600">
                  {finderUrl}
                </Text>
              </Text>

              <View className="gap-3 w-full">
                <Pressable
                  onPress={handleShareQR}
                  className="bg-green-500 rounded-lg py-3 px-4 items-center"
                >
                  <Text className="text-white font-semibold">
                    📤 Teilen
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handlePrintQR}
                  className="bg-gray-500 rounded-lg py-3 px-4 items-center"
                >
                  <Text className="text-white font-semibold">
                    🖨️ Drucken
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    setQrUrl(null);
                    setFinderUrl(null);
                  }}
                  className="bg-gray-300 rounded-lg py-3 px-4 items-center"
                >
                  <Text className="text-gray-800 font-semibold">
                    ← Zurück
                  </Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* Safety Info */}
          <View className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <Text className="font-semibold text-yellow-900 mb-2">
              🔒 Sicherheit
            </Text>
            <Text className="text-sm text-yellow-800">
              Der QR-Code führt zu einer öffentlichen Seite, die{"\n"}
              <Text className="font-semibold">KEINE privaten Daten</Text> enthält.{"\n"}
              Nur deine Kontaktinformationen werden angezeigt.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
