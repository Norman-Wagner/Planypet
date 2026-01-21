import { useState } from "react";
import { ScrollView, Text, View, Pressable, Linking, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import { GlassCard } from "@/components/ui/glass-card";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

// Erste-Hilfe Kategorien
const emergencyCategories = [
  {
    id: "urgent",
    title: "Sofort zum Tierarzt!",
    emoji: "🚨",
    color: "#EF4444",
    situations: [
      {
        title: "Bewusstlosigkeit",
        symptoms: ["Tier reagiert nicht", "Keine Bewegung", "Flache Atmung"],
        actions: ["Atemwege freimachen", "Auf die Seite legen", "Sofort Tierarzt rufen"],
      },
      {
        title: "Starke Blutung",
        symptoms: ["Blut spritzt", "Große Wunde", "Blut hört nicht auf"],
        actions: ["Sauberes Tuch auf Wunde drücken", "Hochlagern wenn möglich", "Sofort zum Tierarzt"],
      },
      {
        title: "Vergiftung",
        symptoms: ["Erbrechen", "Zittern", "Speicheln", "Krämpfe"],
        actions: ["NICHT zum Erbrechen bringen", "Gift sicherstellen", "Sofort Tierarzt/Giftnotruf"],
      },
      {
        title: "Hitzschlag",
        symptoms: ["Hecheln", "Taumeln", "Rote Zunge", "Bewusstlosigkeit"],
        actions: ["In den Schatten bringen", "Mit lauwarmem Wasser kühlen", "Sofort zum Tierarzt"],
      },
    ],
  },
  {
    id: "common",
    title: "Häufige Notfälle",
    emoji: "⚠️",
    color: "#F59E0B",
    situations: [
      {
        title: "Durchfall",
        symptoms: ["Wässriger Stuhl", "Häufiger Stuhlgang", "Appetitlosigkeit"],
        actions: ["24h Futterentzug", "Viel Wasser anbieten", "Bei Blut sofort zum Tierarzt"],
      },
      {
        title: "Erbrechen",
        symptoms: ["Würgen", "Speicheln", "Unruhe"],
        actions: ["Futter entziehen", "Kleine Mengen Wasser", "Bei Blut/Dauer >24h zum Tierarzt"],
      },
      {
        title: "Insektenstich",
        symptoms: ["Schwellung", "Juckreiz", "Lecken der Stelle"],
        actions: ["Kühlen", "Beobachten", "Bei Atemnot sofort zum Tierarzt"],
      },
      {
        title: "Zecke gefunden",
        symptoms: ["Kleiner dunkler Punkt", "Tier kratzt sich"],
        actions: ["Mit Zeckenzange entfernen", "Drehen, nicht ziehen", "Stelle desinfizieren"],
      },
    ],
  },
  {
    id: "wounds",
    title: "Verletzungen",
    emoji: "🩹",
    color: "#10B981",
    situations: [
      {
        title: "Kleine Schnittwunde",
        symptoms: ["Kleine Blutung", "Oberflächlich"],
        actions: ["Wunde reinigen", "Desinfizieren", "Sauber halten"],
      },
      {
        title: "Bisswunde",
        symptoms: ["Punktförmige Wunden", "Schwellung"],
        actions: ["Wunde reinigen", "Immer zum Tierarzt (Infektionsgefahr!)"],
      },
      {
        title: "Verbrennungen",
        symptoms: ["Rote Haut", "Blasen", "Haarausfall"],
        actions: ["Mit kühlem Wasser kühlen", "Nicht reiben", "Zum Tierarzt"],
      },
      {
        title: "Fremdkörper im Auge",
        symptoms: ["Auge zugekniffen", "Tränen", "Reiben"],
        actions: ["Nicht reiben lassen", "Mit Wasser spülen", "Zum Tierarzt"],
      },
    ],
  },
];

// Giftige Substanzen
const toxicItems = {
  food: [
    { name: "Schokolade", danger: "hoch", emoji: "🍫" },
    { name: "Zwiebeln/Knoblauch", danger: "hoch", emoji: "🧅" },
    { name: "Weintrauben/Rosinen", danger: "hoch", emoji: "🍇" },
    { name: "Avocado", danger: "mittel", emoji: "🥑" },
    { name: "Alkohol", danger: "hoch", emoji: "🍺" },
    { name: "Koffein", danger: "hoch", emoji: "☕" },
    { name: "Xylitol (Süßstoff)", danger: "sehr hoch", emoji: "🍬" },
    { name: "Macadamia-Nüsse", danger: "mittel", emoji: "🥜" },
  ],
  plants: [
    { name: "Lilien (für Katzen)", danger: "sehr hoch", emoji: "🌸" },
    { name: "Oleander", danger: "sehr hoch", emoji: "🌺" },
    { name: "Weihnachtsstern", danger: "mittel", emoji: "🌟" },
    { name: "Efeu", danger: "mittel", emoji: "🌿" },
    { name: "Tulpen", danger: "mittel", emoji: "🌷" },
    { name: "Azalee", danger: "hoch", emoji: "🌺" },
  ],
  household: [
    { name: "Rattengift", danger: "sehr hoch", emoji: "☠️" },
    { name: "Frostschutzmittel", danger: "sehr hoch", emoji: "❄️" },
    { name: "Reinigungsmittel", danger: "hoch", emoji: "🧴" },
    { name: "Medikamente", danger: "hoch", emoji: "💊" },
    { name: "Schneckenkorn", danger: "sehr hoch", emoji: "🐌" },
  ],
};

export default function FirstAidScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState(emergencyCategories[0]);
  const [expandedSituation, setExpandedSituation] = useState<string | null>(null);
  const [showToxic, setShowToxic] = useState(false);

  const callEmergency = () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    // In Produktion: Tierarzt-Notruf oder lokale Nummer
    Linking.openURL("tel:112");
  };

  const getDangerColor = (danger: string) => {
    switch (danger) {
      case "sehr hoch":
        return "#DC2626";
      case "hoch":
        return "#EF4444";
      case "mittel":
        return "#F59E0B";
      default:
        return "#6B7280";
    }
  };

  return (
    <View className="flex-1">
      <LinearGradient
        colors={["#EF4444", "#F87171", "#FCA5A5"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 0.8 }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 40,
          paddingHorizontal: 20,
        }}
      >
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-3"
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <IconSymbol name="chevron.left" size={24} color="#FFFFFF" />
          </Pressable>
          <View className="flex-1">
            <Text className="text-white text-2xl font-bold">Erste Hilfe</Text>
            <Text className="text-white/70 text-base">Notfall-Anleitungen</Text>
          </View>
          <Text className="text-4xl">🏥</Text>
        </View>

        {/* Notfall-Button */}
        <Pressable
          onPress={callEmergency}
          style={({ pressed }) => ({
            opacity: pressed ? 0.9 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          })}
        >
          <GlassCard className="mb-6 flex-row items-center justify-center py-4 bg-red-500/30">
            <Text className="text-3xl mr-3">📞</Text>
            <View>
              <Text className="text-white text-lg font-bold">Tierarzt-Notruf</Text>
              <Text className="text-white/80 text-sm">Tippe für Notfall-Anruf</Text>
            </View>
          </GlassCard>
        </Pressable>

        {/* Tab-Auswahl */}
        <View className="flex-row mb-6 gap-2">
          <Pressable
            onPress={() => setShowToxic(false)}
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1, flex: 1 })}
          >
            <View
              className={`py-3 rounded-xl items-center ${
                !showToxic ? "bg-white" : "bg-white/20"
              }`}
            >
              <Text className={!showToxic ? "text-primary font-bold" : "text-white"}>
                🚑 Notfälle
              </Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => setShowToxic(true)}
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1, flex: 1 })}
          >
            <View
              className={`py-3 rounded-xl items-center ${
                showToxic ? "bg-white" : "bg-white/20"
              }`}
            >
              <Text className={showToxic ? "text-primary font-bold" : "text-white"}>
                ☠️ Giftig
              </Text>
            </View>
          </Pressable>
        </View>

        {!showToxic ? (
          <>
            {/* Kategorie-Auswahl */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-6"
              contentContainerStyle={{ gap: 12 }}
            >
              {emergencyCategories.map((category) => (
                <Pressable
                  key={category.id}
                  onPress={() => setSelectedCategory(category)}
                  style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
                >
                  <View
                    className={`px-4 py-3 rounded-xl flex-row items-center ${
                      selectedCategory.id === category.id
                        ? "bg-white"
                        : "bg-white/20"
                    }`}
                  >
                    <Text className="text-xl mr-2">{category.emoji}</Text>
                    <Text
                      className={
                        selectedCategory.id === category.id
                          ? "text-primary font-bold"
                          : "text-white font-medium"
                      }
                    >
                      {category.title}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>

            {/* Situationen */}
            {selectedCategory.situations.map((situation, index) => (
              <Pressable
                key={index}
                onPress={() =>
                  setExpandedSituation(
                    expandedSituation === situation.title ? null : situation.title
                  )
                }
              >
                <GlassCard className="mb-3">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-foreground text-lg font-bold flex-1">
                      {situation.title}
                    </Text>
                    <IconSymbol
                      name={expandedSituation === situation.title ? "chevron.up" : "chevron.down"}
                      size={20}
                      color={colors.muted}
                    />
                  </View>

                  {expandedSituation === situation.title && (
                    <View className="mt-4">
                      <Text className="text-muted font-medium mb-2">Symptome:</Text>
                      {situation.symptoms.map((symptom, i) => (
                        <Text key={i} className="text-foreground text-sm mb-1">
                          • {symptom}
                        </Text>
                      ))}

                      <Text className="text-muted font-medium mt-3 mb-2">Was tun:</Text>
                      {situation.actions.map((action, i) => (
                        <View key={i} className="flex-row items-start mb-2">
                          <View className="w-6 h-6 rounded-full bg-primary items-center justify-center mr-2">
                            <Text className="text-white text-xs font-bold">{i + 1}</Text>
                          </View>
                          <Text className="text-foreground text-sm flex-1">{action}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </GlassCard>
              </Pressable>
            ))}
          </>
        ) : (
          <>
            {/* Giftige Lebensmittel */}
            <GlassCard className="mb-4">
              <Text className="text-foreground font-bold text-lg mb-3">🍽️ Giftige Lebensmittel</Text>
              {toxicItems.food.map((item, index) => (
                <View
                  key={index}
                  className={`flex-row items-center py-2 ${
                    index > 0 ? "border-t border-border" : ""
                  }`}
                >
                  <Text className="text-xl mr-3">{item.emoji}</Text>
                  <Text className="text-foreground flex-1">{item.name}</Text>
                  <View
                    style={{ backgroundColor: getDangerColor(item.danger) + "20" }}
                    className="px-2 py-1 rounded"
                  >
                    <Text style={{ color: getDangerColor(item.danger) }} className="text-xs font-medium">
                      {item.danger}
                    </Text>
                  </View>
                </View>
              ))}
            </GlassCard>

            {/* Giftige Pflanzen */}
            <GlassCard className="mb-4">
              <Text className="text-foreground font-bold text-lg mb-3">🌿 Giftige Pflanzen</Text>
              {toxicItems.plants.map((item, index) => (
                <View
                  key={index}
                  className={`flex-row items-center py-2 ${
                    index > 0 ? "border-t border-border" : ""
                  }`}
                >
                  <Text className="text-xl mr-3">{item.emoji}</Text>
                  <Text className="text-foreground flex-1">{item.name}</Text>
                  <View
                    style={{ backgroundColor: getDangerColor(item.danger) + "20" }}
                    className="px-2 py-1 rounded"
                  >
                    <Text style={{ color: getDangerColor(item.danger) }} className="text-xs font-medium">
                      {item.danger}
                    </Text>
                  </View>
                </View>
              ))}
            </GlassCard>

            {/* Haushaltsgegenstände */}
            <GlassCard className="mb-4">
              <Text className="text-foreground font-bold text-lg mb-3">🏠 Haushaltsgefahren</Text>
              {toxicItems.household.map((item, index) => (
                <View
                  key={index}
                  className={`flex-row items-center py-2 ${
                    index > 0 ? "border-t border-border" : ""
                  }`}
                >
                  <Text className="text-xl mr-3">{item.emoji}</Text>
                  <Text className="text-foreground flex-1">{item.name}</Text>
                  <View
                    style={{ backgroundColor: getDangerColor(item.danger) + "20" }}
                    className="px-2 py-1 rounded"
                  >
                    <Text style={{ color: getDangerColor(item.danger) }} className="text-xs font-medium">
                      {item.danger}
                    </Text>
                  </View>
                </View>
              ))}
            </GlassCard>
          </>
        )}

        {/* Disclaimer */}
        <View className="mt-4 p-4 bg-white/10 rounded-xl">
          <Text className="text-white text-xs text-center">
            ⚠️ Diese Informationen ersetzen keinen Tierarzt! Bei Unsicherheit immer professionelle Hilfe suchen.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
