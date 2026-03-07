import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

interface HealthRecord {
  id: string;
  type: "vaccination" | "medication" | "checkup" | "note";
  title: string;
  date: string;
  icon: string;
  color: string;
}

export default function HealthScreen() {
  const colors = useColors();
  const [healthRecords] = useState<HealthRecord[]>([
    {
      id: "1",
      type: "vaccination",
      title: "Tollwut-Impfung",
      date: "15.02.2026",
      icon: "syringe.fill",
      color: colors.success,
    },
    {
      id: "2",
      type: "checkup",
      title: "Zahnkontrolle",
      date: "01.02.2026",
      icon: "heart.fill",
      color: colors.primary,
    },
    {
      id: "3",
      type: "medication",
      title: "Wurmkur",
      date: "15.01.2026",
      icon: "pills.fill",
      color: colors.warning,
    },
  ]);

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="pb-6">
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground">Gesundheit</Text>
          <Text className="text-muted">Impfpass & Gesundheitsdaten</Text>
        </View>

        {/* Health Summary */}
        <View className="bg-surface rounded-lg border border-border p-4 mb-6">
          <View className="flex-row justify-between items-start mb-3">
            <View>
              <Text className="text-sm text-muted mb-1">Nächste Impfung</Text>
              <Text className="text-lg font-bold text-foreground">Staupe</Text>
              <Text className="text-xs text-muted">Fällig: 15.05.2026</Text>
            </View>
            <View className="w-12 h-12 bg-warning/20 rounded-lg items-center justify-center">
              <IconSymbol name="exclamationmark.circle.fill" size={24} color={colors.warning} />
            </View>
          </View>
        </View>

        {/* Health Records */}
        <Text className="text-lg font-bold text-foreground mb-3">Medizinische Einträge</Text>
        <FlatList
          data={healthRecords}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="bg-surface rounded-lg border border-border p-4 mb-3 flex-row items-start gap-3">
              <View
                className="w-10 h-10 rounded-lg items-center justify-center"
                style={{ backgroundColor: item.color + "20" }}
              >
                <IconSymbol name={item.icon as any} size={20} color={item.color} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground">{item.title}</Text>
                <Text className="text-sm text-muted">{item.date}</Text>
              </View>
            </View>
          )}
        />

        {/* Add Health Record Button */}
        <TouchableOpacity className="bg-primary rounded-lg py-3 items-center mt-4">
          <View className="flex-row items-center gap-2">
            <IconSymbol name="plus.circle.fill" size={20} color="#ffffff" />
            <Text className="text-background font-semibold">Eintrag hinzufügen</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}
