import React, { useState } from "react";
import { View, Text, ScrollView, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

interface ActivityEvent {
  id: string;
  type: "feeding" | "walking" | "medication" | "care" | "alert";
  title: string;
  description: string;
  petName: string;
  timestamp: Date;
  duration?: string;
  distance?: string;
  weather?: string;
  user?: string;
}

export function ActivityFeedScreen() {
  const colors = useColors();
  const [activities] = useState<ActivityEvent[]>([
    {
      id: "1",
      type: "feeding",
      title: "Fütterung",
      description: "Max hat sein Frühstück bekommen",
      petName: "Max",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      user: "Norman",
    },
    {
      id: "2",
      type: "walking",
      title: "Gassi gehen",
      description: "Schöne Runde im Park",
      petName: "Max",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      duration: "45 Min",
      distance: "3.2 km",
      weather: "Sonnig, 18°C",
      user: "Norman",
    },
    {
      id: "3",
      type: "medication",
      title: "Medikament gegeben",
      description: "Luna hat ihr Antibiotikum bekommen",
      petName: "Luna",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      user: "Sarah",
    },
    {
      id: "4",
      type: "care",
      title: "Zahnreinigung",
      description: "Max Zähne wurden gereinigt",
      petName: "Max",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      user: "Tierarzt Dr. Schmidt",
    },
  ]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "feeding":
        return "fork.knife";
      case "walking":
        return "figure.walk";
      case "medication":
        return "pills";
      case "care":
        return "heart.fill";
      case "alert":
        return "exclamationmark.circle";
      default:
        return "checkmark.circle";
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "feeding":
        return colors.primary;
      case "walking":
        return colors.success;
      case "medication":
        return colors.warning;
      case "care":
        return colors.error;
      case "alert":
        return colors.error;
      default:
        return colors.muted;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `vor ${minutes}m`;
    if (hours < 24) return `vor ${hours}h`;
    if (days < 7) return `vor ${days}d`;
    return date.toLocaleDateString("de-DE");
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="gap-6 p-6">
        {/* Header */}
        <View>
          <Text className="text-3xl font-bold text-foreground">Aktivitäten</Text>
          <Text className="text-sm text-muted mt-1">Timeline aller Ereignisse</Text>
        </View>

        {/* Activity Timeline */}
        <FlatList
          data={activities}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item, index }) => (
            <View className="gap-0">
              {/* Timeline Line */}
              {index < activities.length - 1 && (
                <View
                  className="absolute left-6 top-16 w-1 h-12"
                  style={{ backgroundColor: colors.border }}
                />
              )}

              {/* Activity Item */}
              <View className="flex-row gap-4 pb-6">
                {/* Icon Circle */}
                <View
                  className="w-12 h-12 rounded-full items-center justify-center"
                  style={{ backgroundColor: getActivityColor(item.type) }}
                >
                  <IconSymbol name={getActivityIcon(item.type) as any} size={24} color="#ffffff" />
                </View>

                {/* Content */}
                <View className="flex-1 gap-2">
                  <View className="flex-row items-center justify-between">
                    <Text className="font-semibold text-foreground">{item.title}</Text>
                    <Text className="text-xs text-muted">{formatTime(item.timestamp)}</Text>
                  </View>

                  <Text className="text-sm text-muted">{item.description}</Text>

                  {/* Pet & User Info */}
                  <View className="flex-row gap-2 mt-1">
                    <View className="px-2 py-1 rounded" style={{ backgroundColor: colors.surface }}>
                      <Text className="text-xs font-semibold text-foreground">{item.petName}</Text>
                    </View>
                    {item.user && (
                      <View className="px-2 py-1 rounded" style={{ backgroundColor: colors.surface }}>
                        <Text className="text-xs text-muted">{item.user}</Text>
                      </View>
                    )}
                  </View>

                  {/* Additional Info */}
                  {(item.duration || item.distance || item.weather) && (
                    <View className="flex-row gap-3 mt-2 pt-2 border-t" style={{ borderTopColor: colors.border }}>
                      {item.duration && (
                        <View className="flex-row items-center gap-1">
                          <IconSymbol name="clock" size={14} color={colors.muted} />
                          <Text className="text-xs text-muted">{item.duration}</Text>
                        </View>
                      )}
                      {item.distance && (
                        <View className="flex-row items-center gap-1">
                          <IconSymbol name="location" size={14} color={colors.muted} />
                          <Text className="text-xs text-muted">{item.distance}</Text>
                        </View>
                      )}
                      {item.weather && (
                        <View className="flex-row items-center gap-1">
                          <IconSymbol name="cloud.sun" size={14} color={colors.muted} />
                          <Text className="text-xs text-muted">{item.weather}</Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}
        />
      </ScrollView>
    </ScreenContainer>
  );
}
