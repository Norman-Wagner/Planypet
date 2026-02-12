import { useState } from "react";
import { View, Text, ScrollView, Pressable, Switch, StyleSheet, Linking } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useConsent } from "@/lib/consent-store";

interface ConsentOption {
  key: "essentialData" | "aiAnalysis" | "pushNotifications" | "cameraAccess" | "locationTracking" | "calendarAccess";
  title: string;
  description: string;
  required: boolean;
  icon: string;
  iconColor: string;
}

const CONSENT_OPTIONS: ConsentOption[] = [
  {
    key: "essentialData",
    title: "Lokale Datenspeicherung",
    description: "Speicherung Ihrer Tierdaten, Einstellungen und Gesundheitsakten auf Ihrem Geraet. Erforderlich fuer die Grundfunktionen der App.",
    required: true,
    icon: "internaldrive.fill",
    iconColor: "#D4A843",
  },
  {
    key: "aiAnalysis",
    title: "KI-Analyse",
    description: "Uebertragung von Daten an unseren Server fuer KI-gestuetzte Gesundheitshinweise und Rasserkennung. Daten werden nach der Analyse geloescht.",
    required: false,
    icon: "brain",
    iconColor: "#AB47BC",
  },
  {
    key: "pushNotifications",
    title: "Push-Benachrichtigungen",
    description: "Erinnerungen fuer Fuetterung, Gassi-Zeiten und Tierarzttermine. Ein Geraete-Token wird gespeichert.",
    required: false,
    icon: "bell.fill",
    iconColor: "#FFB74D",
  },
  {
    key: "cameraAccess",
    title: "Kamera & Fotos",
    description: "Zugriff auf Kamera und Fotobibliothek fuer Tierfotos, Symptomerfassung und Rasserkennung.",
    required: false,
    icon: "camera.fill",
    iconColor: "#42A5F5",
  },
  {
    key: "locationTracking",
    title: "Standort-Tracking",
    description: "GPS-Zugriff fuer die Aufzeichnung von Spaziergaengen und Giftkoeder-Warnungen in Ihrer Naehe.",
    required: false,
    icon: "location.fill",
    iconColor: "#66BB6A",
  },
  {
    key: "calendarAccess",
    title: "Kalender-Zugriff",
    description: "Tierarzttermine und Erinnerungen in Ihren Geraetekalender eintragen.",
    required: false,
    icon: "calendar",
    iconColor: "#EF5350",
  },
];

export function ConsentDialog({ onComplete }: { onComplete: () => void }) {
  const insets = useSafeAreaInsets();
  const { updateConsent, giveFullConsent, giveMinimalConsent } = useConsent();
  const [showDetails, setShowDetails] = useState(false);
  const [selections, setSelections] = useState<Record<string, boolean>>({
    essentialData: true,
    aiAnalysis: true,
    pushNotifications: true,
    cameraAccess: true,
    locationTracking: true,
    calendarAccess: true,
  });

  const handleAcceptAll = async () => {
    await giveFullConsent();
    onComplete();
  };

  const handleAcceptSelected = async () => {
    await updateConsent(selections);
    onComplete();
  };

  const handleAcceptEssentialOnly = async () => {
    await giveMinimalConsent();
    onComplete();
  };

  const toggleSelection = (key: string) => {
    if (key === "essentialData") return; // Required, cannot be toggled off
    setSelections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (showDetails) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}>
          {/* Header */}
          <Pressable
            onPress={() => setShowDetails(false)}
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
          >
            <IconSymbol name="chevron.left" size={20} color="#D4A843" />
            <Text style={styles.backText}>Zurueck</Text>
          </Pressable>

          <Text style={styles.detailTitle}>Datenschutz-Einstellungen</Text>
          <Text style={styles.detailSub}>
            Waehlen Sie, welche Datenverarbeitungen Sie erlauben moechten. Sie koennen Ihre Einstellungen jederzeit in den App-Einstellungen aendern.
          </Text>
          <View style={styles.goldDivider} />

          {/* Consent Options */}
          {CONSENT_OPTIONS.map((option, index) => (
            <Animated.View
              key={option.key}
              entering={FadeInDown.duration(400).delay(index * 80)}
            >
              <View style={styles.optionCard}>
                <View style={styles.optionHeader}>
                  <View style={[styles.optionIcon, { backgroundColor: `${option.iconColor}15` }]}>
                    <IconSymbol name={option.icon as any} size={18} color={option.iconColor} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <Text style={styles.optionTitle}>{option.title}</Text>
                      {option.required && (
                        <View style={styles.requiredBadge}>
                          <Text style={styles.requiredText}>Erforderlich</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <Switch
                    value={selections[option.key]}
                    onValueChange={() => toggleSelection(option.key)}
                    disabled={option.required}
                    trackColor={{ false: "#2A2A30", true: "#D4A843" }}
                    thumbColor="#FAFAF8"
                  />
                </View>
                <Text style={styles.optionDesc}>{option.description}</Text>
              </View>
            </Animated.View>
          ))}

          {/* Rechtsgrundlage */}
          <View style={styles.legalNote}>
            <IconSymbol name="info.circle.fill" size={14} color="#D4A843" />
            <Text style={styles.legalNoteText}>
              Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung). Sie koennen Ihre Einwilligung jederzeit mit Wirkung fuer die Zukunft widerrufen (Art. 7 Abs. 3 DSGVO).
            </Text>
          </View>

          {/* Links */}
          <View style={styles.linksRow}>
            <Pressable onPress={() => Linking.openURL("mailto:info@wagnerconnect.com")} style={({ pressed }) => pressed && { opacity: 0.6 }}>
              <Text style={styles.linkText}>Kontakt</Text>
            </Pressable>
            <Text style={styles.linkDot}>|</Text>
            <Pressable style={({ pressed }) => pressed && { opacity: 0.6 }}>
              <Text style={styles.linkText}>Datenschutzerklaerung</Text>
            </Pressable>
            <Text style={styles.linkDot}>|</Text>
            <Pressable style={({ pressed }) => pressed && { opacity: 0.6 }}>
              <Text style={styles.linkText}>Impressum</Text>
            </Pressable>
          </View>
        </ScrollView>

        {/* Bottom Buttons */}
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
          <Pressable
            onPress={handleAcceptSelected}
            style={({ pressed }) => [styles.acceptBtn, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
          >
            <LinearGradient
              colors={["#D4A843", "#B8860B"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.acceptBtnGradient}
            >
              <Text style={styles.acceptBtnText}>Auswahl bestaetigen</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    );
  }

  // Main consent screen
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 24, paddingVertical: 40 }}
      >
        {/* Shield Icon */}
        <Animated.View entering={FadeInDown.duration(800).delay(200)} style={{ alignItems: "center", marginBottom: 32 }}>
          <LinearGradient
            colors={["#D4A843", "#B8860B", "#8B6914"]}
            style={styles.shieldGradient}
          >
            <IconSymbol name="shield.fill" size={40} color="#FAFAF8" />
          </LinearGradient>
        </Animated.View>

        {/* Title */}
        <Animated.View entering={FadeInDown.duration(800).delay(400)}>
          <Text style={styles.mainTitle}>Datenschutz</Text>
          <View style={[styles.goldDivider, { alignSelf: "center" }]} />
        </Animated.View>

        {/* Description */}
        <Animated.View entering={FadeInDown.duration(800).delay(600)}>
          <Text style={styles.mainDesc}>
            Ihre Privatsphaere ist uns wichtig. Planypet speichert Ihre Daten primaer lokal auf Ihrem Geraet. Fuer bestimmte Funktionen benoetigen wir Ihre Einwilligung.
          </Text>
          <Text style={styles.mainDesc2}>
            Verantwortlich: Joachim Norman Wagner{"\n"}
            Kontakt: info@wagnerconnect.com
          </Text>
        </Animated.View>

        {/* Summary of data processing */}
        <Animated.View entering={FadeInDown.duration(800).delay(800)}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <IconSymbol name="internaldrive.fill" size={16} color="#D4A843" />
              <Text style={styles.summaryText}>Lokale Datenspeicherung auf Ihrem Geraet</Text>
            </View>
            <View style={styles.summaryRow}>
              <IconSymbol name="brain" size={16} color="#AB47BC" />
              <Text style={styles.summaryText}>KI-Analyse (optional, Daten werden nach Analyse geloescht)</Text>
            </View>
            <View style={styles.summaryRow}>
              <IconSymbol name="bell.fill" size={16} color="#FFB74D" />
              <Text style={styles.summaryText}>Push-Benachrichtigungen (optional)</Text>
            </View>
            <View style={styles.summaryRow}>
              <IconSymbol name="camera.fill" size={16} color="#42A5F5" />
              <Text style={styles.summaryText}>Kamera & Fotos (optional)</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        {/* Accept All */}
        <Pressable
          onPress={handleAcceptAll}
          style={({ pressed }) => [styles.acceptBtn, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
        >
          <LinearGradient
            colors={["#D4A843", "#B8860B"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.acceptBtnGradient}
          >
            <Text style={styles.acceptBtnText}>Alle akzeptieren</Text>
          </LinearGradient>
        </Pressable>

        {/* Customize */}
        <Pressable
          onPress={() => setShowDetails(true)}
          style={({ pressed }) => [styles.customizeBtn, pressed && { opacity: 0.7 }]}
        >
          <Text style={styles.customizeBtnText}>Einstellungen anpassen</Text>
        </Pressable>

        {/* Essential Only */}
        <Pressable
          onPress={handleAcceptEssentialOnly}
          style={({ pressed }) => [styles.essentialBtn, pressed && { opacity: 0.7 }]}
        >
          <Text style={styles.essentialBtnText}>Nur erforderliche</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0F",
  },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 24 },
  backText: { fontSize: 14, fontWeight: "500", color: "#D4A843", letterSpacing: 0.5 },

  shieldGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#D4A843",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },

  mainTitle: {
    fontSize: 32,
    fontWeight: "300",
    color: "#FAFAF8",
    textAlign: "center",
    letterSpacing: 4,
    textTransform: "uppercase",
  },
  goldDivider: { width: 40, height: 1, backgroundColor: "#D4A843", marginTop: 16, marginBottom: 24 },

  mainDesc: {
    fontSize: 15,
    fontWeight: "400",
    color: "#C8C8C0",
    textAlign: "center",
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  mainDesc2: {
    fontSize: 12,
    fontWeight: "400",
    color: "#6B6B6B",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 16,
  },

  summaryCard: {
    backgroundColor: "#141418",
    borderWidth: 1,
    borderColor: "rgba(212,168,67,0.08)",
    padding: 20,
    marginTop: 24,
    gap: 14,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  summaryText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "400",
    color: "#8B8B80",
    lineHeight: 18,
  },

  bottomBar: {
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: "rgba(10, 10, 15, 0.95)",
    borderTopWidth: 1,
    borderTopColor: "rgba(212,168,67,0.1)",
    gap: 10,
  },

  acceptBtn: {
    overflow: "hidden",
  },
  acceptBtnGradient: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0A0A0F",
    letterSpacing: 2,
    textTransform: "uppercase",
  },

  customizeBtn: {
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(212,168,67,0.2)",
  },
  customizeBtnText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#D4A843",
    letterSpacing: 1,
  },

  essentialBtn: {
    paddingVertical: 12,
    alignItems: "center",
  },
  essentialBtnText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#6B6B6B",
    letterSpacing: 0.5,
  },

  // Detail view styles
  detailTitle: {
    fontSize: 24,
    fontWeight: "300",
    color: "#FAFAF8",
    letterSpacing: 2,
  },
  detailSub: {
    fontSize: 13,
    fontWeight: "400",
    color: "#8B8B80",
    lineHeight: 20,
    marginTop: 8,
  },

  optionCard: {
    backgroundColor: "#141418",
    borderWidth: 1,
    borderColor: "rgba(212,168,67,0.08)",
    padding: 16,
    marginTop: 12,
  },
  optionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FAFAF8",
    letterSpacing: 0.3,
  },
  optionDesc: {
    fontSize: 12,
    fontWeight: "400",
    color: "#6B6B6B",
    lineHeight: 18,
    marginTop: 10,
    paddingLeft: 48,
  },
  requiredBadge: {
    backgroundColor: "rgba(212,168,67,0.15)",
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  requiredText: {
    fontSize: 9,
    fontWeight: "600",
    color: "#D4A843",
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  legalNote: {
    flexDirection: "row",
    gap: 10,
    marginTop: 24,
    backgroundColor: "rgba(212,168,67,0.05)",
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(212,168,67,0.1)",
  },
  legalNoteText: {
    flex: 1,
    fontSize: 11,
    fontWeight: "400",
    color: "#6B6B6B",
    lineHeight: 17,
  },

  linksRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
    marginBottom: 20,
  },
  linkText: {
    fontSize: 11,
    fontWeight: "400",
    color: "#D4A843",
    letterSpacing: 0.3,
  },
  linkDot: {
    fontSize: 11,
    color: "#4A4A4A",
  },
});
