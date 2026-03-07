import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Platform } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { AIAssistantFAB } from "@/components/ai-assistant-fab";

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 56 + bottomPadding;

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            paddingTop: 8,
            paddingBottom: bottomPadding,
            height: tabBarHeight,
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            borderTopWidth: 0.5,
          },
        }}
      >
        {/* Tab 1: Dashboard */}
        <Tabs.Screen
          name="index"
          options={{
            title: "Dashboard",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={24} name="house.fill" color={color} />
            ),
          }}
        />

        {/* Tab 2: Pets */}
        <Tabs.Screen
          name="pets"
          options={{
            title: "Tiere",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={24} name="pawprint.fill" color={color} />
            ),
          }}
        />

        {/* Tab 3: Activity */}
        <Tabs.Screen
          name="activity"
          options={{
            title: "Aktivität",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={24} name="figure.walk" color={color} />
            ),
          }}
        />

        {/* Tab 4: Health */}
        <Tabs.Screen
          name="health"
          options={{
            title: "Gesundheit",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={24} name="heart.fill" color={color} />
            ),
          }}
        />

        {/* Tab 5: More */}
        <Tabs.Screen
          name="more"
          options={{
            title: "Mehr",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={24} name="ellipsis" color={color} />
            ),
          }}
        />
      </Tabs>
      <AIAssistantFAB />
    </>
  );
}
