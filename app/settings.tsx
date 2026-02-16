import React, { useState } from "react";
import { ScrollView, Text, View, Pressable, Switch, Linking, Platform, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { usePetStore } from "@/lib/pet-store";
import { useI18n, LANGUAGES } from "@/lib/i18n";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { userName, clearAllData } = usePetStore();
  const { language, setLanguage, t } = useI18n();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  
  // Visual Settings
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [sharpness, setSharpness] = useState(100);
  const [appTheme, setAppTheme] = useState("blue");
  
  // Feeding Settings
  const [portionSize, setPortionSize] = useState(200);
  const [feedingsPerDay, setFeedingsPerDay] = useState(2);
  const [fastingDaysEnabled, setFastingDaysEnabled] = useState(false);
  const [fastingDays, setFastingDays] = useState<number[]>([]);
  
  // Walk Settings
  const [walkDurationPreference, setWalkDurationPreference] = useState(30);

  const handleClearData = () => {
    clearAllData();
    router.replace("/onboarding");
  };

  const toggleFastingDay = (day: number) => {
    setFastingDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const DAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  const THEMES = [
    { name: "Blau", color: "#1E40AF" },
    { name: "Lila", color: "#7C3AED" },
    { name: "Grün", color: "#059669" },
    { name: "Orange", color: "#EA580C" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0F" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 40,
          paddingHorizontal: 20,
        }}
      >
        {/* Back + Header */}
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [s.backBtn, pressed && { opacity: 0.6 }]}
        >
          <IconSymbol name="chevron.left" size={20} color="#D4A843" />
          <Text style={s.backText}>Zurück</Text>
        </Pressable>

        <View style={s.header}>
          <Text style={s.headerTitle}>Einstellungen</Text>
          <Text style={s.headerSub}>App personalisieren</Text>
          <View style={s.goldDivider} />
        </View>

        {/* VISUELLE EINSTELLUNGEN */}
        <Text style={s.sectionTitle}>Visuelles Design</Text>
        
        {/* App Theme */}
        <View style={s.card}>
          <Text style={s.cardTitle}>App-Farbe</Text>
          <View style={s.themeGrid}>
            {THEMES.map((theme) => (
              <Pressable
                key={theme.name}
                onPress={() => setAppTheme(theme.name.toLowerCase())}
                style={({ pressed }) => [
                  s.themeBtn,
                  { backgroundColor: theme.color },
                  appTheme === theme.name.toLowerCase() && s.themeBtnActive,
                  pressed && { opacity: 0.8 },
                ]}
              >
                {appTheme === theme.name.toLowerCase() && (
                  <IconSymbol name="checkmark" size={16} color="#FFF" />
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Contrast */}
        <View style={s.card}>
          <View style={s.sliderHeader}>
            <Text style={s.cardTitle}>Kontrast</Text>
            <Text style={s.sliderValue}>{Math.round(contrast)}%</Text>
          </View>
          <Slider
            style={s.slider}
            minimumValue={50}
            maximumValue={200}
            value={contrast}
            onValueChange={setContrast}
            minimumTrackTintColor="#D4A843"
            maximumTrackTintColor="#2A2A2F"
          />
          <Text style={s.sliderHint}>50% - 200%</Text>
        </View>

        {/* Saturation */}
        <View style={s.card}>
          <View style={s.sliderHeader}>
            <Text style={s.cardTitle}>Sättigung</Text>
            <Text style={s.sliderValue}>{Math.round(saturation)}%</Text>
          </View>
          <Slider
            style={s.slider}
            minimumValue={0}
            maximumValue={200}
            value={saturation}
            onValueChange={setSaturation}
            minimumTrackTintColor="#D4A843"
            maximumTrackTintColor="#2A2A2F"
          />
          <Text style={s.sliderHint}>0% - 200%</Text>
        </View>

        {/* Sharpness */}
        <View style={s.card}>
          <View style={s.sliderHeader}>
            <Text style={s.cardTitle}>Schärfe</Text>
            <Text style={s.sliderValue}>{Math.round(sharpness)}%</Text>
          </View>
          <Slider
            style={s.slider}
            minimumValue={50}
            maximumValue={200}
            value={sharpness}
            onValueChange={setSharpness}
            minimumTrackTintColor="#D4A843"
            maximumTrackTintColor="#2A2A2F"
          />
          <Text style={s.sliderHint}>50% - 200%</Text>
        </View>

        {/* FÜTTERUNG */}
        <Text style={s.sectionTitle}>Fütterung</Text>

        {/* Portion Size */}
        <View style={s.card}>
          <View style={s.sliderHeader}>
            <Text style={s.cardTitle}>Futtermenge pro Mahlzeit</Text>
            <Text style={s.sliderValue}>{Math.round(portionSize)}g</Text>
          </View>
          <Slider
            style={s.slider}
            minimumValue={50}
            maximumValue={500}
            step={10}
            value={portionSize}
            onValueChange={setPortionSize}
            minimumTrackTintColor="#D4A843"
            maximumTrackTintColor="#2A2A2F"
          />
          <Text style={s.sliderHint}>50g - 500g</Text>
        </View>

        {/* Feedings Per Day */}
        <View style={s.card}>
          <View style={s.sliderHeader}>
            <Text style={s.cardTitle}>Fütterungen pro Tag</Text>
            <Text style={s.sliderValue}>{Math.round(feedingsPerDay)}x</Text>
          </View>
          <Slider
            style={s.slider}
            minimumValue={1}
            maximumValue={5}
            step={1}
            value={feedingsPerDay}
            onValueChange={setFeedingsPerDay}
            minimumTrackTintColor="#D4A843"
            maximumTrackTintColor="#2A2A2F"
          />
          <Text style={s.sliderHint}>1 - 5 Mahlzeiten</Text>
        </View>

        {/* Fasting Days */}
        <View style={s.card}>
          <View style={s.row}>
            <View style={{ flex: 1 }}>
              <Text style={s.cardTitle}>Fastentage aktivieren</Text>
              <Text style={s.cardSub}>Wähle Tage ohne Fütterung</Text>
            </View>
            <Switch
              value={fastingDaysEnabled}
              onValueChange={setFastingDaysEnabled}
              trackColor={{ false: "#2A2A2F", true: "#D4A843" }}
              thumbColor={fastingDaysEnabled ? "#0A0A0F" : "#4A4A4A"}
            />
          </View>

          {fastingDaysEnabled && (
            <View style={s.fastingDaysGrid}>
              {DAYS.map((day, idx) => (
                <Pressable
                  key={day}
                  onPress={() => toggleFastingDay(idx)}
                  style={({ pressed }) => [
                    s.dayBtn,
                    fastingDays.includes(idx) && s.dayBtnActive,
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <Text
                    style={[
                      s.dayText,
                      fastingDays.includes(idx) && s.dayTextActive,
                    ]}
                  >
                    {day}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Warning: No Walk After Eating */}
        <View style={s.warningCard}>
          <IconSymbol name="exclamationmark.triangle" size={20} color="#D4A843" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.warningTitle}>Nach dem Essen nicht sofort spazieren</Text>
            <Text style={s.warningText}>
              Warte mindestens 30-60 Minuten nach der Fütterung, bevor du mit deinem Tier spazieren gehst.
            </Text>
          </View>
        </View>

        {/* GASSI */}
        <Text style={s.sectionTitle}>Spaziergänge</Text>

        {/* Walk Duration Preference */}
        <View style={s.card}>
          <View style={s.sliderHeader}>
            <Text style={s.cardTitle}>Bevorzugte Spaziergang-Dauer</Text>
            <Text style={s.sliderValue}>{Math.round(walkDurationPreference)}min</Text>
          </View>
          <Slider
            style={s.slider}
            minimumValue={15}
            maximumValue={120}
            step={15}
            value={walkDurationPreference}
            onValueChange={setWalkDurationPreference}
            minimumTrackTintColor="#D4A843"
            maximumTrackTintColor="#2A2A2F"
          />
          <Text style={s.sliderHint}>15 - 120 Minuten</Text>
        </View>

        {/* Walk Suggestions */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Gassi-Vorschläge</Text>
          <View style={s.suggestionGrid}>
            {[15, 30, 45, 60].map((duration) => (
              <Pressable
                key={duration}
                style={({ pressed }) => [
                  s.suggestionBtn,
                  walkDurationPreference === duration && s.suggestionBtnActive,
                  pressed && { opacity: 0.7 },
                ]}
                onPress={() => setWalkDurationPreference(duration)}
              >
                <Text
                  style={[
                    s.suggestionText,
                    walkDurationPreference === duration &&
                      s.suggestionTextActive,
                  ]}
                >
                  {duration}min
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* SPRACHE */}
        <Text style={s.sectionTitle}>Sprache</Text>
        <View style={s.card}>
          <Text style={s.cardSub2}>Wähle deine Sprache</Text>
          <View style={s.langRow}>
            {LANGUAGES.map((lang) => (
              <Pressable
                key={lang.code}
                onPress={() => setLanguage(lang.code)}
                style={({ pressed }) => [
                  s.langBtn,
                  language === lang.code && s.langBtnActive,
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text
                  style={[
                    s.langText,
                    language === lang.code && s.langTextActive,
                  ]}
                >
                  {lang.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* BENACHRICHTIGUNGEN */}
        <Text style={s.sectionTitle}>Benachrichtigungen</Text>
        <View style={s.card}>
          <View style={s.row}>
            <Text style={s.cardTitle}>Benachrichtigungen</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#2A2A2F", true: "#D4A843" }}
              thumbColor={notificationsEnabled ? "#0A0A0F" : "#4A4A4A"}
            />
          </View>
        </View>

        <View style={s.card}>
          <View style={s.row}>
            <Text style={s.cardTitle}>Sound</Text>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: "#2A2A2F", true: "#D4A843" }}
              thumbColor={soundEnabled ? "#0A0A0F" : "#4A4A4A"}
            />
          </View>
        </View>

        <View style={s.card}>
          <View style={s.row}>
            <Text style={s.cardTitle}>Haptic Feedback</Text>
            <Switch
              value={hapticEnabled}
              onValueChange={setHapticEnabled}
              trackColor={{ false: "#2A2A2F", true: "#D4A843" }}
              thumbColor={hapticEnabled ? "#0A0A0F" : "#4A4A4A"}
            />
          </View>
        </View>

        {/* LEGAL */}
        <Text style={s.sectionTitle}>Rechtliches</Text>
        <Pressable
          onPress={() => router.push("/legal/privacy")}
          style={({ pressed }) => [s.card, pressed && { opacity: 0.7 }]}
        >
          <View style={s.row}>
            <Text style={s.cardTitle}>Datenschutz</Text>
            <IconSymbol name="chevron.right" size={14} color="#4A4A4A" />
          </View>
        </Pressable>

        <Pressable
          onPress={() => router.push("/legal/terms")}
          style={({ pressed }) => [s.card, pressed && { opacity: 0.7 }]}
        >
          <View style={s.row}>
            <Text style={s.cardTitle}>AGB</Text>
            <IconSymbol name="chevron.right" size={14} color="#4A4A4A" />
          </View>
        </Pressable>

        <Pressable
          onPress={() => router.push("/legal/impressum")}
          style={({ pressed }) => [s.card, pressed && { opacity: 0.7 }]}
        >
          <View style={s.row}>
            <Text style={s.cardTitle}>Impressum</Text>
            <IconSymbol name="chevron.right" size={14} color="#4A4A4A" />
          </View>
        </Pressable>

        {/* DANGER ZONE */}
        <Text style={s.sectionTitle}>Datenverwaltung</Text>
        <Pressable
          onPress={handleClearData}
          style={({ pressed }) => [s.dangerCard, pressed && { opacity: 0.7 }]}
        >
          <IconSymbol name="trash" size={18} color="#EF4444" />
          <Text style={s.dangerText}>Alle Daten löschen</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 8,
  },
  backText: {
    color: "#D4A843",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  header: {
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 4,
  },
  headerSub: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 16,
  },
  goldDivider: {
    height: 2,
    backgroundColor: "#D4A843",
    width: 40,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#D4A843",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 24,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#1A1A1F",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2A2A2F",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  cardSub2: {
    fontSize: 13,
    color: "#9CA3AF",
    marginBottom: 12,
  },
  sliderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sliderValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#D4A843",
  },
  slider: {
    height: 40,
    marginBottom: 8,
  },
  sliderHint: {
    fontSize: 12,
    color: "#6B7280",
  },
  themeGrid: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  themeBtn: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  themeBtnActive: {
    borderColor: "#D4A843",
  },
  fastingDaysGrid: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    flexWrap: "wrap",
  },
  dayBtn: {
    flex: 1,
    minWidth: "30%",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#0A0A0F",
    borderWidth: 1,
    borderColor: "#2A2A2F",
  },
  dayBtnActive: {
    backgroundColor: "#D4A843",
    borderColor: "#D4A843",
  },
  dayText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  dayTextActive: {
    color: "#0A0A0F",
  },
  warningCard: {
    backgroundColor: "#1F1F1F",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#D4A843",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#D4A843",
    marginBottom: 4,
  },
  warningText: {
    fontSize: 12,
    color: "#9CA3AF",
    lineHeight: 18,
  },
  suggestionGrid: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    flexWrap: "wrap",
  },
  suggestionBtn: {
    flex: 1,
    minWidth: "45%",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#0A0A0F",
    borderWidth: 1,
    borderColor: "#2A2A2F",
  },
  suggestionBtnActive: {
    backgroundColor: "#D4A843",
    borderColor: "#D4A843",
  },
  suggestionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  suggestionTextActive: {
    color: "#0A0A0F",
  },
  langRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  langBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#0A0A0F",
    borderWidth: 1,
    borderColor: "#2A2A2F",
  },
  langBtnActive: {
    backgroundColor: "#D4A843",
    borderColor: "#D4A843",
  },
  langText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  langTextActive: {
    color: "#0A0A0F",
  },
  dangerCard: {
    backgroundColor: "#1A1A1F",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EF4444",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dangerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#EF4444",
  },
});
