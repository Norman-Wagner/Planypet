import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Glasmorphism without expo-blur (use opacity + backdrop)

interface Theme {
  id: string;
  name: string;
  colors: string[];
  description: string;
}

const THEMES: Theme[] = [
  {
    id: "blue",
    name: "Blau Gradient",
    colors: ["#1E5A96", "#0A7EA4", "#3498DB"],
    description: "Modern & Professional",
  },
  {
    id: "nature",
    name: "Natur & Wald",
    colors: ["#2ECC71", "#27AE60", "#16A085"],
    description: "Grün & Natürlich",
  },
  {
    id: "sand",
    name: "Sand & Wüste",
    colors: ["#D4A574", "#C19A6B", "#B8860B"],
    description: "Warm & Gemütlich",
  },
  {
    id: "pastel",
    name: "Pastell Verspielt",
    colors: ["#FF69B4", "#FFB6C1", "#DDA0DD"],
    description: "Süß & Spielerisch",
  },
];

export default function ThemeCustomizationScreen() {
  const colors = useColors();
  const [selectedTheme, setSelectedTheme] = useState("blue");

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const saved = await AsyncStorage.getItem("planypet_theme");
      if (saved) setSelectedTheme(saved);
    } catch (error) {
      console.error("Error loading theme:", error);
    }
  };

  const handleThemeSelect = async (themeId: string) => {
    try {
      await AsyncStorage.setItem("planypet_theme", themeId);
      setSelectedTheme(themeId);
      Alert.alert("Erfolg", `Theme "${themeId}" aktiviert! (Neustart erforderlich)`);
    } catch (error) {
      Alert.alert("Fehler", "Theme konnte nicht gespeichert werden");
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="pb-6">
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground">Design & Themes</Text>
          <Text className="text-muted">Wähle dein Lieblings-Design</Text>
        </View>

        {/* Theme Preview Cards with Glasmorphism */}
        <View className="gap-4">
          {THEMES.map((theme) => (
            <TouchableOpacity
              key={theme.id}
              onPress={() => handleThemeSelect(theme.id)}
              className="rounded-2xl overflow-hidden border-2"
              style={{
                borderColor: selectedTheme === theme.id ? colors.primary : colors.border,
              }}
            >
              {/* Gradient Background */}
              <View
                className="h-32 justify-center items-center relative"
                style={{
                  backgroundColor: theme.colors[0],
                }}
              >
                {/* Gradient overlay using multiple layers */}
                <View
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${theme.colors[0]} 0%, ${theme.colors[1]} 50%, ${theme.colors[2]} 100%)`,
                  } as any}
                />
                {/* Glasmorphism Overlay */}
                <View
                  className="absolute inset-0"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  }}
                />

                {/* 3D Glass Card */}
                <View
                  className="w-24 h-24 rounded-2xl items-center justify-center"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    borderWidth: 1,
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    shadowColor: theme.colors[0],
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.4,
                    shadowRadius: 16,
                    elevation: 12,
                  }}
                >
                  <View
                    className="w-20 h-20 rounded-xl items-center justify-center"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      borderWidth: 1,
                      borderColor: "rgba(255, 255, 255, 0.4)",
                    }}
                  >
                    <IconSymbol name="pawprint.fill" size={32} color="#ffffff" />
                  </View>
                </View>

                {/* Selection Indicator */}
                {selectedTheme === theme.id && (
                  <View className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full items-center justify-center">
                    <IconSymbol name="checkmark.circle.fill" size={24} color={theme.colors[0]} />
                  </View>
                )}
              </View>

              {/* Theme Info */}
              <View className="bg-surface p-4 border-t border-border">
                <Text className="text-lg font-bold text-foreground">{theme.name}</Text>
                <Text className="text-sm text-muted mt-1">{theme.description}</Text>

                {/* Color Swatches */}
                <View className="flex-row gap-2 mt-3">
                  {theme.colors.map((color, idx) => (
                    <View
                      key={idx}
                      className="w-6 h-6 rounded-lg border border-border"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Theme Features */}
        <View className="mt-8 bg-surface rounded-lg border border-border p-4">
          <Text className="text-lg font-bold text-foreground mb-3">✨ Theme-Features</Text>
          <View className="gap-2">
            <View className="flex-row items-center gap-2">
              <IconSymbol name="sparkles" size={16} color={colors.primary} />
              <Text className="text-sm text-foreground">Glasmorphism Design</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <IconSymbol name="cube.transparent" size={16} color={colors.primary} />
              <Text className="text-sm text-foreground">3D Effekte & Shadows</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <IconSymbol name="paintbrush.fill" size={16} color={colors.primary} />
              <Text className="text-sm text-foreground">Gradient Overlays</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <IconSymbol name="moon.stars.fill" size={16} color={colors.primary} />
              <Text className="text-sm text-foreground">Dark Mode Support</Text>
            </View>
          </View>
        </View>

        {/* Disclaimer */}
        <View className="mt-6 p-4 bg-warning/10 rounded-lg border border-warning/30">
          <Text className="text-xs text-warning font-semibold mb-2">ℹ️ HINWEIS</Text>
          <Text className="text-xs text-warning leading-relaxed">
            Theme-Änderungen werden nach einem Neustart der App wirksam. Starte die App neu, um
            dein neues Design zu sehen.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
