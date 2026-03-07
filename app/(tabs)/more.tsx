import React from "react";
import { View, Text, ScrollView, TouchableOpacity, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useRouter } from "expo-router";

interface MenuItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
}

export default function MoreScreen() {
  const colors = useColors();
  const router = useRouter();

  const menuItems: MenuItem[] = [
    {
      id: "ai",
      title: "KI-Assistent",
      description: "Tipps & Funktionserklärung",
      icon: "sparkles",
      route: "/ai-advisor",
      color: colors.primary,
    },
    {
      id: "community",
      title: "Community",
      description: "Challenges & Punkte verdienen",
      icon: "heart.fill",
      route: "/community-challenges",
      color: colors.error,
    },
    {
      id: "marketplace",
      title: "Marktplatz",
      description: "Futter & Zubehör kaufen",
      icon: "bag.fill",
      route: "/marketplace",
      color: colors.warning,
    },
    {
      id: "devices",
      title: "Smart Devices",
      description: "GPS-Tracker & Kameras",
      icon: "wifi",
      route: "/smart-devices",
      color: "#1A3A52",
    },
    {
      id: "settings",
      title: "Einstellungen",
      description: "Profil, Benachrichtigungen, Legal",
      icon: "gearshape.fill",
      route: "/settings",
      color: colors.muted,
    },
  ];

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="pb-6">
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground">Mehr</Text>
          <Text className="text-muted">Alle zusätzlichen Funktionen</Text>
        </View>

        <FlatList
          data={menuItems}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(item.route as any)}
              className="bg-surface rounded-lg border border-border p-4 mb-3 flex-row items-center gap-3"
            >
              <View
                className="w-12 h-12 rounded-lg items-center justify-center"
                style={{ backgroundColor: item.color + "20" }}
              >
                <IconSymbol name={item.icon as any} size={24} color={item.color} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground">{item.title}</Text>
                <Text className="text-sm text-muted">{item.description}</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.muted} />
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    </ScreenContainer>
  );
}
