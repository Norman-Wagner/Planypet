import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, FlatList, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

interface Activity {
  id: string;
  type: "walk" | "feeding" | "play" | "health";
  title: string;
  time: string;
  duration?: string;
  icon: string;
}

export default function ActivityScreen() {
  const colors = useColors();
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "1",
      type: "walk",
      title: "Gassi-Runde",
      time: "Heute, 14:30",
      duration: "45 Min",
      icon: "figure.walk",
    },
    {
      id: "2",
      type: "feeding",
      title: "Fütterung",
      time: "Heute, 12:00",
      icon: "fork.knife",
    },
    {
      id: "3",
      type: "play",
      title: "Spielzeit",
      time: "Gestern, 16:00",
      duration: "30 Min",
      icon: "star.fill",
    },
  ]);

  const handleLogActivity = (type: string) => {
    Alert.alert("Erfolg", `${type} protokolliert ✓`);
  };

  const ACTIVITY_TYPES = {
    walk: { color: colors.success, label: "Gassi" },
    feeding: { color: colors.primary, label: "Fütterung" },
    play: { color: colors.warning, label: "Spielzeit" },
    health: { color: colors.error, label: "Gesundheit" },
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="pb-6">
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground">Aktivität</Text>
          <Text className="text-muted">Aktivitäten deines Haustieres</Text>
        </View>

        {/* Quick Log Buttons */}
        <View className="flex-row gap-2 mb-6">
          <TouchableOpacity
            className="flex-1 bg-success/20 rounded-lg py-3 items-center"
            onPress={() => handleLogActivity("Gassi")}
          >
            <IconSymbol name="figure.walk" size={20} color={colors.success} />
            <Text className="text-xs font-semibold text-foreground mt-1">Gassi</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-primary/20 rounded-lg py-3 items-center"
            onPress={() => handleLogActivity("Fütterung")}
          >
            <IconSymbol name="fork.knife" size={20} color={colors.primary} />
            <Text className="text-xs font-semibold text-foreground mt-1">Fütterung</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-warning/20 rounded-lg py-3 items-center"
            onPress={() => handleLogActivity("Spielzeit")}
          >
            <IconSymbol name="star.fill" size={20} color={colors.warning} />
            <Text className="text-xs font-semibold text-foreground mt-1">Spielzeit</Text>
          </TouchableOpacity>
        </View>

        {/* Activity History */}
        <Text className="text-lg font-bold text-foreground mb-3">Aktivitätsverlauf</Text>
        <FlatList
          data={activities}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="bg-surface rounded-lg border border-border p-4 mb-3 flex-row items-start gap-3">
              <View
                className="w-10 h-10 rounded-lg items-center justify-center"
                style={{
                  backgroundColor: ACTIVITY_TYPES[item.type].color + "20",
                }}
              >
                <IconSymbol
                  name={item.icon as any}
                  size={20}
                  color={ACTIVITY_TYPES[item.type].color}
                />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground">{item.title}</Text>
                <Text className="text-sm text-muted">{item.time}</Text>
                {item.duration && (
                  <Text className="text-xs text-muted mt-1">Dauer: {item.duration}</Text>
                )}
              </View>
            </View>
          )}
        />
      </ScrollView>
    </ScreenContainer>
  );
}
