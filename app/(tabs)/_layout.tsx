import { Tabs } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { AIAssistantFAB } from "@/components/ai-assistant-fab";
import { useColors } from "@/hooks/use-colors";

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 64 + bottomPadding;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.muted,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            paddingTop: 10,
            paddingBottom: bottomPadding,
            height: tabBarHeight,
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            borderTopWidth: 0.5,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: "500",
            letterSpacing: 0.5,
            textTransform: "uppercase",
          },
        }}
      >
        {/* Home/Dashboard */}
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={24} name="house.fill" color={color} />
            ),
          }}
        />

        {/* Pet Management */}
        <Tabs.Screen
          name="pet-management"
          options={{
            title: "Tiere",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={24} name="pawprint.fill" color={color} />
            ),
          }}
        />

        {/* Feeding Schedule */}
        <Tabs.Screen
          name="feeding-schedule"
          options={{
            title: "Fütterung",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={24} name="fork.knife" color={color} />
            ),
          }}
        />

        {/* Gassi Tracking */}
        <Tabs.Screen
          name="gassi-tracking"
          options={{
            title: "Gassi",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={24} name="figure.walk" color={color} />
            ),
          }}
        />

        {/* Emergency */}
        <Tabs.Screen
          name="emergency"
          options={{
            title: "Notfall",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={24} name="exclamationmark.circle.fill" color={color} />
            ),
          }}
        />

        {/* Family Sharing */}
        <Tabs.Screen
          name="family-sharing"
          options={{
            title: "Familie",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={24} name="person.2.fill" color={color} />
            ),
          }}
        />

        {/* Community & Challenges */}
        <Tabs.Screen
          name="community-challenges"
          options={{
            title: "Community",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={24} name="heart.fill" color={color} />
            ),
          }}
        />

        {/* Marketplace */}
        <Tabs.Screen
          name="marketplace"
          options={{
            title: "Marktplatz",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={24} name="bag.fill" color={color} />
            ),
          }}
        />

        {/* Settings */}
        <Tabs.Screen
          name="settings"
          options={{
            title: "Einstellungen",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={24} name="gearshape.fill" color={color} />
            ),
          }}
        />
      </Tabs>
      <AIAssistantFAB />
    </View>
  );
}
