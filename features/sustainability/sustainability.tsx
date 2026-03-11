import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

interface EcoTip {
  id: string;
  title: string;
  description: string;
  impact: "low" | "medium" | "high";
  icon: string;
}

interface EcoChallenge {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  deadline: string;
}

export default function SustainabilityScreen() {
  const colors = useColors();

  const [ecoTips] = useState<EcoTip[]>([
    {
      id: "1",
      title: "Müllbeutel beim Gassi",
      description:
        "Nimm immer Müllbeutel mit zum Gassi. Hinterlassenschaften gehören in den Müll, nicht in die Natur.",
      impact: "high",
      icon: "trash.fill",
    },
    {
      id: "2",
      title: "Nachhaltiges Futter",
      description:
        "Wähle Futter mit nachhaltigen Verpackungen. Viele Hersteller bieten umweltfreundliche Alternativen.",
      impact: "high",
      icon: "leaf.fill",
    },
    {
      id: "3",
      title: "Lokale Tierärzte",
      description:
        "Nutze lokale Tierärzte, um lange Anfahrtswege zu vermeiden. Das spart CO2 und unterstützt lokale Unternehmen.",
      impact: "medium",
      icon: "car.fill",
    },
    {
      id: "4",
      title: "Spielzeug aus Recycling",
      description:
        "Kaufe Spielzeug aus recycelten Materialien. Das reduziert Müll und ist oft günstiger.",
      impact: "medium",
      icon: "cube.fill",
    },
    {
      id: "5",
      title: "Wasser sparen",
      description:
        "Nutze Regenwasser zum Waschen deines Haustiers. Das spart Trinkwasser und ist umweltfreundlich.",
      impact: "low",
      icon: "drop.fill",
    },
    {
      id: "6",
      title: "Natürliche Pflege",
      description:
        "Verwende natürliche Shampoos und Pflegeprodukte. Das ist besser für dein Haustier und die Umwelt.",
      impact: "medium",
      icon: "sparkles",
    },
  ]);

  const [challenges] = useState<EcoChallenge[]>([
    {
      id: "1",
      title: "Müllbeutel-Challenge",
      description: "Sammle 10 Tage lang Müll beim Gassi. Du erhältst 50 Punkte!",
      points: 50,
      completed: false,
      deadline: "31.03.2026",
    },
    {
      id: "2",
      title: "Nachhaltig-Einkaufen",
      description: "Kaufe diese Woche nur nachhaltiges Futter. 30 Punkte!",
      points: 30,
      completed: false,
      deadline: "15.03.2026",
    },
    {
      id: "3",
      title: "Grüne Route",
      description: "Gassi gehen im Park statt auf der Straße. 20 Punkte!",
      points: 20,
      completed: false,
      deadline: "30.03.2026",
    },
  ]);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return colors.success;
      case "medium":
        return colors.warning;
      case "low":
        return colors.muted;
      default:
        return colors.foreground;
    }
  };

  const handleCompleteChallenge = (challengeId: string) => {
    Alert.alert("Challenge abgeschlossen!", "Du hast Punkte verdient! 🎉");
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="pb-6">
        {/* Header */}
        <View className="mb-6">
          <View className="flex-row items-center gap-2 mb-2">
            <IconSymbol name="leaf.fill" size={28} color={colors.success} />
            <Text className="text-3xl font-bold text-foreground">Nachhaltigkeit</Text>
          </View>
          <Text className="text-muted">Schütze die Umwelt für zukünftige Generationen</Text>
        </View>

        {/* Impact Stats */}
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 bg-success/10 rounded-lg border border-success/30 p-3">
            <Text className="text-xs text-success font-semibold">Dein Impact</Text>
            <Text className="text-2xl font-bold text-success">127 kg</Text>
            <Text className="text-xs text-success">CO2 gespart</Text>
          </View>
          <View className="flex-1 bg-primary/10 rounded-lg border border-primary/30 p-3">
            <Text className="text-xs text-primary font-semibold">Punkte</Text>
            <Text className="text-2xl font-bold text-primary">280</Text>
            <Text className="text-xs text-primary">Eco-Punkte</Text>
          </View>
        </View>

        {/* Eco Tips */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-foreground mb-3">💡 Nachhaltigkeits-Tipps</Text>
          {ecoTips.map((tip) => (
            <View
              key={tip.id}
              className="bg-surface rounded-lg border border-border p-4 mb-3"
            >
              <View className="flex-row items-start gap-3">
                <View
                  className="w-10 h-10 rounded-lg items-center justify-center"
                  style={{ backgroundColor: getImpactColor(tip.impact) + "20" }}
                >
                  <IconSymbol
                    name={tip.icon as any}
                    size={20}
                    color={getImpactColor(tip.impact)}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-foreground">{tip.title}</Text>
                  <Text className="text-sm text-muted leading-relaxed mt-1">
                    {tip.description}
                  </Text>
                  <View className="mt-2">
                    <Text
                      className="text-xs font-semibold"
                      style={{ color: getImpactColor(tip.impact) }}
                    >
                      Impact:{" "}
                      {tip.impact === "high"
                        ? "🟢 Hoch"
                        : tip.impact === "medium"
                          ? "🟡 Mittel"
                          : "⚪ Niedrig"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Eco Challenges */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-foreground mb-3">🏆 Umwelt-Challenges</Text>
          {challenges.map((challenge) => (
            <View
              key={challenge.id}
              className="bg-surface rounded-lg border border-border p-4 mb-3"
            >
              <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1">
                  <Text className="text-base font-semibold text-foreground">
                    {challenge.title}
                  </Text>
                  <Text className="text-sm text-muted leading-relaxed mt-1">
                    {challenge.description}
                  </Text>
                </View>
                <View className="bg-primary/20 rounded px-2 py-1">
                  <Text className="text-xs font-bold text-primary">+{challenge.points}</Text>
                </View>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-xs text-muted">Deadline: {challenge.deadline}</Text>
                <TouchableOpacity
                  onPress={() => handleCompleteChallenge(challenge.id)}
                  className="bg-primary rounded px-3 py-2"
                >
                  <Text className="text-xs font-semibold text-background">Teilnehmen</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Environmental Impact Info */}
        <View className="bg-success/10 rounded-lg border border-success/30 p-4">
          <Text className="text-sm font-semibold text-success mb-2">🌍 Dein Beitrag zählt!</Text>
          <Text className="text-xs text-success leading-relaxed">
            Durch kleine Änderungen im Alltag kannst du einen großen Unterschied für die Umwelt
            machen. Jeder Müllbeutel beim Gassi, jede nachhaltige Kaufentscheidung hilft.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
