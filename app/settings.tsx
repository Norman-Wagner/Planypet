import { useState } from "react";
import { ScrollView, Text, View, Pressable, Switch, Linking, Platform, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

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

  const handleClearData = () => {
    clearAllData();
    router.replace("/onboarding");
  };

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
          <Text style={s.backText}>Zurueck</Text>
        </Pressable>

        <View style={s.header}>
          <Text style={s.headerTitle}>Einstellungen</Text>
          <Text style={s.headerSub}>App personalisieren</Text>
          <View style={s.goldDivider} />
        </View>

        {/* Profil */}
        <Text style={s.sectionTitle}>Profil</Text>
        <View style={s.card}>
          <View style={s.row}>
            <View style={s.profileAvatar}>
              <Text style={s.profileInitial}>{(userName || "T").charAt(0).toUpperCase()}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.cardTitle}>{userName || "Tierfreund"}</Text>
              <Text style={s.cardSub}>Profil bearbeiten</Text>
            </View>
            <IconSymbol name="chevron.right" size={14} color="#4A4A4A" />
          </View>
        </View>

        {/* Sprache */}
        <Text style={s.sectionTitle}>{t("language")}</Text>
        <View style={s.card}>
          <Text style={s.cardSub2}>Waehle deine Sprache</Text>
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
                <Text style={[s.langText, language === lang.code && s.langTextActive]}>
                  {lang.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Benachrichtigungen */}
        <Text style={s.sectionTitle}>Benachrichtigungen</Text>
        <View style={s.card}>
          <SettingToggle
            icon="bell.fill"
            iconColor="#D4A843"
            title="Push-Benachrichtigungen"
            subtitle="Erinnerungen erhalten"
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
          <View style={s.divider} />
          <SettingToggle
            icon="speaker.wave.2.fill"
            iconColor="#FFB74D"
            title="Toene"
            subtitle="Benachrichtigungstoene"
            value={soundEnabled}
            onValueChange={setSoundEnabled}
          />
          <View style={s.divider} />
          <SettingToggle
            icon="iphone.radiowaves.left.and.right"
            iconColor="#66BB6A"
            title="Haptisches Feedback"
            subtitle="Vibrationen bei Aktionen"
            value={hapticEnabled}
            onValueChange={setHapticEnabled}
          />
        </View>

        {/* Datenschutz & Rechte */}
        <Text style={s.sectionTitle}>Datenschutz & Ihre Rechte</Text>
        <Pressable
          onPress={() => router.push("/privacy-center")}
          style={({ pressed }) => [s.card, pressed && { opacity: 0.7 }]}
        >
          <View style={s.row}>
            <View style={[s.iconCircle, { backgroundColor: "rgba(212,168,67,0.1)" }]}>
              <IconSymbol name="shield.fill" size={18} color="#D4A843" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.cardTitle}>Datenschutz-Center</Text>
              <Text style={s.cardSub}>Einwilligungen, Datenexport, Loeschung</Text>
            </View>
            <IconSymbol name="chevron.right" size={14} color="#4A4A4A" />
          </View>
        </Pressable>

        {/* Rechtliches */}
        <Text style={s.sectionTitle}>Rechtliches</Text>
        <View style={s.card}>
          <LegalLink title="Datenschutzerklaerung" onPress={() => router.push("/legal/privacy")} />
          <View style={s.divider} />
          <LegalLink title="AGB" onPress={() => router.push("/legal/terms")} />
          <View style={s.divider} />
          <LegalLink title="Impressum" onPress={() => router.push("/legal/impressum")} />
        </View>

        {/* Daten */}
        <Text style={s.sectionTitle}>Daten</Text>
        <Pressable
          onPress={handleClearData}
          style={({ pressed }) => [s.card, pressed && { opacity: 0.7 }]}
        >
          <View style={s.row}>
            <View style={[s.iconCircle, { backgroundColor: "rgba(239,83,80,0.1)" }]}>
              <IconSymbol name="trash.fill" size={18} color="#EF5350" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.cardTitle, { color: "#EF5350" }]}>Alle Daten loeschen</Text>
              <Text style={s.cardSub}>App zuruecksetzen</Text>
            </View>
          </View>
        </Pressable>

        {/* App Info */}
        <View style={s.footer}>
          <Text style={s.footerBrand}>Planypet</Text>
          <Text style={s.footerSub}>by Wagnerconnect</Text>
          <Text style={s.footerVersion}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function SettingToggle({ icon, iconColor, title, subtitle, value, onValueChange }: {
  icon: string; iconColor: string; title: string; subtitle: string;
  value: boolean; onValueChange: (v: boolean) => void;
}) {
  return (
    <View style={s.row}>
      <View style={[s.iconCircle, { backgroundColor: `${iconColor}15` }]}>
        <IconSymbol name={icon as any} size={18} color={iconColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.cardTitle}>{title}</Text>
        <Text style={s.cardSub}>{subtitle}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#2A2A30", true: "#D4A843" }}
        thumbColor="#FAFAF8"
      />
    </View>
  );
}

function LegalLink({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.row, pressed && { opacity: 0.6 }]}>
      <Text style={s.cardTitle}>{title}</Text>
      <IconSymbol name="chevron.right" size={14} color="#4A4A4A" />
    </Pressable>
  );
}

const s = StyleSheet.create({
  backBtn: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 },
  backText: { fontSize: 14, fontWeight: "500", color: "#D4A843", letterSpacing: 0.5 },

  header: { marginBottom: 32 },
  headerTitle: { fontSize: 28, fontWeight: "300", color: "#FAFAF8", letterSpacing: 2 },
  headerSub: { fontSize: 12, fontWeight: "400", color: "#6B6B6B", letterSpacing: 1, marginTop: 4 },
  goldDivider: { width: 40, height: 1, backgroundColor: "#D4A843", marginTop: 16 },

  sectionTitle: {
    fontSize: 11, fontWeight: "600", color: "#D4A843",
    letterSpacing: 3, textTransform: "uppercase", marginBottom: 12, marginTop: 24,
  },

  card: {
    backgroundColor: "#141418", padding: 16,
    borderWidth: 1, borderColor: "rgba(212,168,67,0.08)",
  },

  row: { flexDirection: "row", alignItems: "center", gap: 14 },

  iconCircle: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: "center", justifyContent: "center",
  },

  profileAvatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: "rgba(212,168,67,0.1)",
    borderWidth: 1, borderColor: "rgba(212,168,67,0.2)",
    alignItems: "center", justifyContent: "center",
  },
  profileInitial: { fontSize: 22, fontWeight: "300", color: "#D4A843" },

  cardTitle: { fontSize: 15, fontWeight: "500", color: "#FAFAF8", letterSpacing: 0.3 },
  cardSub: { fontSize: 12, fontWeight: "400", color: "#6B6B6B", marginTop: 2 },
  cardSub2: { fontSize: 12, fontWeight: "400", color: "#6B6B6B", marginBottom: 12 },

  divider: { height: 1, backgroundColor: "rgba(212,168,67,0.05)", marginVertical: 14 },

  langRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  langBtn: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderWidth: 1, borderColor: "rgba(212,168,67,0.15)",
  },
  langBtnActive: {
    backgroundColor: "rgba(212,168,67,0.15)", borderColor: "#D4A843",
  },
  langText: { fontSize: 13, fontWeight: "500", color: "#6B6B6B", letterSpacing: 0.5 },
  langTextActive: { color: "#D4A843" },

  footer: { alignItems: "center", marginTop: 40, marginBottom: 20 },
  footerBrand: { fontSize: 18, fontWeight: "300", color: "#FAFAF8", letterSpacing: 3 },
  footerSub: { fontSize: 12, fontWeight: "400", color: "#6B6B6B", marginTop: 4 },
  footerVersion: { fontSize: 11, fontWeight: "400", color: "#4A4A4A", marginTop: 4 },
});
