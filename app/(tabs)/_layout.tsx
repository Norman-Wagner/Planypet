import { Tabs } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { AIAssistantFAB } from "@/components/ai-assistant-fab";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 64 + bottomPadding;

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0F" }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#D4A843",
          tabBarInactiveTintColor: "#4A4A4A",
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            paddingTop: 10,
            paddingBottom: bottomPadding,
            height: tabBarHeight,
            backgroundColor: "#0A0A0F",
            borderTopColor: "rgba(212,168,67,0.1)",
            borderTopWidth: 0.5,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: "500",
            letterSpacing: 1,
            textTransform: "uppercase",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Dashboard",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={24} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="pets"
          options={{
            title: "Tiere",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={24} name="pawprint.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="health"
          options={{
            title: "Gesundheit",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={24} name="heart.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="more"
          options={{
            title: "Mehr",
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
