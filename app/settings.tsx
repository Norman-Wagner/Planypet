import { useState } from "react";
import { ScrollView, Text, View, Pressable, Switch, Linking, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import { GlassCard } from "@/components/ui/glass-card";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { usePetStore } from "@/lib/pet-store";
import { useI18n, LANGUAGES, Language } from "@/lib/i18n";

const themeColors = [
  { id: "blue", name: "Blau", colors: ["#0066CC", "#00A3FF"] },
  { id: "purple", name: "Lila", colors: ["#8B5CF6", "#A78BFA"] },
  { id: "green", name: "Grün", colors: ["#10B981", "#34D399"] },
  { id: "orange", name: "Orange", colors: ["#F59E0B", "#FBBF24"] },
  { id: "pink", name: "Pink", colors: ["#EC4899", "#F472B6"] },
];

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { userName, clearAllData } = usePetStore();
  const { language, setLanguage, t } = useI18n();
  
  const [selectedTheme, setSelectedTheme] = useState("blue");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
    if (Platform.OS !== "web" && hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // In a real app, this would persist and apply the theme
  };

  const handleClearData = () => {
    // In a real app, show confirmation dialog
    clearAllData();
    router.replace("/onboarding");
  };

  return (
    <View className="flex-1">
      {/* Gradient Background */}
      <LinearGradient
        colors={themeColors.find((t) => t.id === selectedTheme)?.colors as [string, string] || ["#0066CC", "#00A3FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 0.6 }}
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
            <Text className="text-white text-2xl font-bold">Einstellungen</Text>
            <Text className="text-white/70 text-base">App personalisieren</Text>
          </View>
        </View>

        {/* Profile Section */}
        <Text className="text-foreground text-lg font-semibold mb-3">Profil</Text>
        <GlassCard className="mb-6">
          <View className="flex-row items-center">
            <View className="w-16 h-16 rounded-full bg-primary/20 items-center justify-center mr-4">
              <Text className="text-3xl">👤</Text>
            </View>
            <View className="flex-1">
              <Text className="text-foreground text-lg font-bold">{userName || "Tierfreund"}</Text>
              <Text className="text-muted text-sm">Profil bearbeiten</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.muted} />
          </View>
        </GlassCard>

        {/* Language Section */}
        <Text className="text-foreground text-lg font-semibold mb-3">{t("language")}</Text>
        <GlassCard className="mb-6">
          <Text className="text-muted text-sm mb-3">Wähle deine Sprache</Text>
          <View className="flex-row flex-wrap gap-3">
            {LANGUAGES.map((lang) => (
              <Pressable
                key={lang.code}
                onPress={() => setLanguage(lang.code)}
                style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
              >
                <View 
                  className={`flex-row items-center px-4 py-2 rounded-full ${
                    language === lang.code ? "bg-primary" : "bg-surface"
                  }`}
                >
                  <Text className="text-lg mr-2">{lang.flag}</Text>
                  <Text className={language === lang.code ? "text-white font-bold" : "text-foreground"}>
                    {lang.name}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </GlassCard>

        {/* Theme Section */}
        <Text className="text-foreground text-lg font-semibold mb-3">{t("theme")}</Text>
        <GlassCard className="mb-6">
          <Text className="text-muted text-sm mb-3">Wähle deine Lieblingsfarbe</Text>
          <View className="flex-row flex-wrap gap-3">
            {themeColors.map((theme) => (
              <Pressable
                key={theme.id}
                onPress={() => handleThemeChange(theme.id)}
                style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] })}
              >
                <View className={`items-center ${selectedTheme === theme.id ? "scale-110" : ""}`}>
                  <LinearGradient
                    colors={theme.colors as [string, string]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ 
                      width: 48, 
                      height: 48, 
                      borderRadius: 24,
                      borderWidth: selectedTheme === theme.id ? 3 : 0,
                      borderColor: "#FFFFFF",
                    }}
                  />
                  <Text className={`text-xs mt-1 ${selectedTheme === theme.id ? "text-primary font-bold" : "text-muted"}`}>
                    {theme.name}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </GlassCard>

        {/* Notifications Section */}
        <Text className="text-foreground text-lg font-semibold mb-3">Benachrichtigungen</Text>
        <GlassCard className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center mr-3">
                <IconSymbol name="bell.fill" size={20} color={colors.primary} />
              </View>
              <View>
                <Text className="text-foreground font-medium">Push-Benachrichtigungen</Text>
                <Text className="text-muted text-sm">Erinnerungen erhalten</Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>
          
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 rounded-full bg-warning/20 items-center justify-center mr-3">
                <IconSymbol name="speaker.wave.2.fill" size={20} color={colors.warning} />
              </View>
              <View>
                <Text className="text-foreground font-medium">Töne</Text>
                <Text className="text-muted text-sm">Benachrichtigungstöne</Text>
              </View>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>
          
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 rounded-full bg-success/20 items-center justify-center mr-3">
                <IconSymbol name="iphone.radiowaves.left.and.right" size={20} color={colors.success} />
              </View>
              <View>
                <Text className="text-foreground font-medium">Haptisches Feedback</Text>
                <Text className="text-muted text-sm">Vibrationen bei Aktionen</Text>
              </View>
            </View>
            <Switch
              value={hapticEnabled}
              onValueChange={setHapticEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>
        </GlassCard>

        {/* Legal Section */}
        <Text className="text-foreground text-lg font-semibold mb-3">Rechtliches</Text>
        <GlassCard className="mb-6">
          <Pressable
            onPress={() => Linking.openURL("https://wagnerconnect.de/datenschutz")}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <View className="flex-row items-center justify-between py-2">
              <Text className="text-foreground">Datenschutzerklärung</Text>
              <IconSymbol name="chevron.right" size={20} color={colors.muted} />
            </View>
          </Pressable>
          
          <View className="h-px bg-border my-2" />
          
          <Pressable
            onPress={() => Linking.openURL("https://wagnerconnect.de/agb")}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <View className="flex-row items-center justify-between py-2">
              <Text className="text-foreground">AGB</Text>
              <IconSymbol name="chevron.right" size={20} color={colors.muted} />
            </View>
          </Pressable>
          
          <View className="h-px bg-border my-2" />
          
          <Pressable
            onPress={() => Linking.openURL("https://wagnerconnect.de/impressum")}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <View className="flex-row items-center justify-between py-2">
              <Text className="text-foreground">Impressum</Text>
              <IconSymbol name="chevron.right" size={20} color={colors.muted} />
            </View>
          </Pressable>
        </GlassCard>

        {/* Data Section */}
        <Text className="text-foreground text-lg font-semibold mb-3">Daten</Text>
        <GlassCard className="mb-6">
          <Pressable
            onPress={handleClearData}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-error/20 items-center justify-center mr-3">
                <IconSymbol name="trash.fill" size={20} color={colors.error} />
              </View>
              <View className="flex-1">
                <Text className="text-error font-medium">Alle Daten löschen</Text>
                <Text className="text-muted text-sm">App zurücksetzen</Text>
              </View>
            </View>
          </Pressable>
        </GlassCard>

        {/* App Info */}
        <GlassCard className="items-center py-6">
          <Text className="text-2xl mb-2">🐾</Text>
          <Text className="text-foreground font-bold text-lg">Planypet</Text>
          <Text className="text-muted text-sm">by Wagnerconnect</Text>
          <Text className="text-muted text-xs mt-2">Version 1.0.0</Text>
          <Text className="text-muted text-xs mt-4 text-center italic">
            PS.: Denkt dran, alle guten Dinge sind 3 ;)...{"\n"}
            Viele Grüße "Eure Deutschen Entwickler"
          </Text>
        </GlassCard>
      </ScrollView>
    </View>
  );
}
