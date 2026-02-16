import { useState } from "react";
import { ScrollView, Text, View, Pressable, Switch, Alert, StyleSheet, Share, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { usePetStore } from "@/lib/pet-store";
import { useConsent, PRIVACY_POLICY_VERSION } from "@/lib/consent-store";

export default function PrivacyCenterScreen() {
  const insets = useSafeAreaInsets();
  const store = usePetStore();
  const consent = useConsent();
  const [exportSuccess, setExportSuccess] = useState(false);

  // Art. 15 DSGVO - Auskunftsrecht: Zeige alle gespeicherten Daten
  const getStoredDataSummary = () => {
    return {
      benutzername: store.userName || "Nicht angegeben",
      benutzerrolle: store.userRole || "Nicht angegeben",
      anzahlTiere: store.pets.length,
      anzahlFuetterungen: store.feedings.length,
      anzahlSpaziergaenge: store.walks.length,
      anzahlGesundheitseintraege: store.healthRecords.length,
      anzahlFamilienmitglieder: store.familyMembers.length,
      anzahlVorraete: store.supplies.length,
      einwilligungen: {
        lokaleDatanspeicherung: consent.essentialData,
        kiAnalyse: consent.aiAnalysis,
        pushBenachrichtigungen: consent.pushNotifications,
        kameraZugriff: consent.cameraAccess,
        standortTracking: consent.locationTracking,
        kalenderZugriff: consent.calendarAccess,
        zeitpunktDerEinwilligung: consent.consentTimestamp || "Keine Einwilligung erteilt",
        datenschutzVersion: consent.privacyPolicyVersion || "Nicht verfuegbar",
      },
    };
  };

  // Art. 20 DSGVO - Datenportabilitaet: Exportiere alle Daten als JSON
  const handleExportData = async () => {
    try {
      const exportData = {
        exportDatum: new Date().toISOString(),
        exportFormat: "JSON (maschinenlesbar gemaess Art. 20 DSGVO)",
        verantwortlicher: "Planypet - Tierpflege App, Planypet@icloud.com",
        benutzerdaten: {
          name: store.userName,
          rolle: store.userRole,
        },
        tiere: store.pets.map((p) => ({
          id: p.id,
          name: p.name,
          typ: p.type,
          rasse: p.breed,
          alter: p.age,
          gewicht: p.weight,
          geburtsdatum: p.birthDate,
          vorlieben: p.preferences,
          fotoUrl: p.photoUrl,
          istGruppe: p.isGroup,
          erstelltAm: p.createdAt,
        })),
        fuetterungen: store.feedings,
        spaziergaenge: store.walks,
        gesundheitsakten: store.healthRecords,
        familienmitglieder: store.familyMembers.map((m) => ({
          id: m.id,
          name: m.name,
          rolle: m.role,
          email: m.email,
          telefon: m.phone,
          zugewieseneTiere: m.assignedPets,
          berechtigungen: m.permissions,
          erstelltAm: m.createdAt,
        })),
        vorraete: store.supplies,
        einwilligungen: consent.exportConsentData(),
      };

      const jsonString = JSON.stringify(exportData, null, 2);

      await Share.share({
        message: jsonString,
        title: "Planypet Datenexport (DSGVO Art. 20)",
      });

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (error) {
      console.error("Export error:", error);
      Alert.alert("Fehler", "Der Datenexport konnte nicht durchgefuehrt werden.");
    }
  };

  // Art. 17 DSGVO - Recht auf Loeschung
  const handleDeleteAllData = () => {
    Alert.alert(
      "Alle Daten loeschen",
      "Gemaess Art. 17 DSGVO haben Sie das Recht auf Loeschung aller personenbezogenen Daten. Dieser Vorgang kann nicht rueckgaengig gemacht werden.\n\nMoechten Sie wirklich alle Daten unwiderruflich loeschen?",
      [
        { text: "Abbrechen", style: "cancel" },
        {
          text: "Endgueltig loeschen",
          style: "destructive",
          onPress: async () => {
            await store.clearAllData();
            await consent.revokeAllConsent();
            if (Platform.OS !== "web") {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            Alert.alert(
              "Daten geloescht",
              "Alle Ihre personenbezogenen Daten wurden erfolgreich geloescht. Die App wird zurueckgesetzt.",
              [{ text: "OK", onPress: () => router.replace("/onboarding") }]
            );
          },
        },
      ]
    );
  };

  // Art. 7 Abs. 3 DSGVO - Widerruf einzelner Einwilligungen
  const handleToggleConsent = async (key: "aiAnalysis" | "pushNotifications" | "cameraAccess" | "locationTracking" | "calendarAccess", currentValue: boolean) => {
    if (currentValue) {
      // Widerruf
      await consent.revokeConsent(key);
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } else {
      // Erneute Einwilligung
      await consent.updateConsent({ [key]: true });
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };

  const summary = getStoredDataSummary();

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
          <Text style={s.headerTitle}>Datenschutz-Center</Text>
          <Text style={s.headerSub}>Ihre Rechte gemaess DSGVO</Text>
          <View style={s.goldDivider} />
        </View>

        {/* Art. 15 - Auskunftsrecht */}
        <Text style={s.sectionTitle}>Auskunftsrecht (Art. 15 DSGVO)</Text>
        <View style={s.card}>
          <Text style={s.cardDesc}>
            Folgende personenbezogene Daten sind auf Ihrem Geraet gespeichert:
          </Text>
          <View style={s.dataGrid}>
            <DataRow label="Benutzername" value={summary.benutzername} />
            <DataRow label="Rolle" value={summary.benutzerrolle} />
            <DataRow label="Tiere" value={`${summary.anzahlTiere} Eintraege`} />
            <DataRow label="Fuetterungen" value={`${summary.anzahlFuetterungen} Eintraege`} />
            <DataRow label="Spaziergaenge" value={`${summary.anzahlSpaziergaenge} Eintraege`} />
            <DataRow label="Gesundheitsakten" value={`${summary.anzahlGesundheitseintraege} Eintraege`} />
            <DataRow label="Familienmitglieder" value={`${summary.anzahlFamilienmitglieder} Eintraege`} />
            <DataRow label="Vorraete" value={`${summary.anzahlVorraete} Eintraege`} />
          </View>
          <View style={s.infoNote}>
            <IconSymbol name="info.circle.fill" size={14} color="#D4A843" />
            <Text style={s.infoNoteText}>
              Alle Daten werden primaer lokal auf Ihrem Geraet gespeichert. Nur bei aktivierter KI-Analyse werden Daten verschluesselt an unseren Server uebertragen und nach der Analyse geloescht.
            </Text>
          </View>
        </View>

        {/* Art. 7 Abs. 3 - Widerruf der Einwilligung */}
        <Text style={s.sectionTitle}>Einwilligungen verwalten (Art. 7 Abs. 3 DSGVO)</Text>
        <View style={s.card}>
          <Text style={s.cardDesc}>
            Sie koennen Ihre Einwilligungen jederzeit mit Wirkung fuer die Zukunft widerrufen.
          </Text>
          <ConsentToggle
            title="Lokale Datenspeicherung"
            value={consent.essentialData}
            disabled={true}
            note="Erforderlich fuer die Grundfunktionen"
          />
          <View style={s.divider} />
          <ConsentToggle
            title="KI-Analyse"
            value={consent.aiAnalysis}
            onToggle={() => handleToggleConsent("aiAnalysis", consent.aiAnalysis)}
          />
          <View style={s.divider} />
          <ConsentToggle
            title="Push-Benachrichtigungen"
            value={consent.pushNotifications}
            onToggle={() => handleToggleConsent("pushNotifications", consent.pushNotifications)}
          />
          <View style={s.divider} />
          <ConsentToggle
            title="Kamera & Fotos"
            value={consent.cameraAccess}
            onToggle={() => handleToggleConsent("cameraAccess", consent.cameraAccess)}
          />
          <View style={s.divider} />
          <ConsentToggle
            title="Standort-Tracking"
            value={consent.locationTracking}
            onToggle={() => handleToggleConsent("locationTracking", consent.locationTracking)}
          />
          <View style={s.divider} />
          <ConsentToggle
            title="Kalender-Zugriff"
            value={consent.calendarAccess}
            onToggle={() => handleToggleConsent("calendarAccess", consent.calendarAccess)}
          />
          {consent.consentTimestamp ? (
            <Text style={s.timestampText}>
              Letzte Aenderung: {new Date(consent.consentTimestamp).toLocaleString("de-DE")}
            </Text>
          ) : null}
        </View>

        {/* Art. 20 - Datenportabilitaet */}
        <Text style={s.sectionTitle}>Datenexport (Art. 20 DSGVO)</Text>
        <Pressable
          onPress={handleExportData}
          style={({ pressed }) => [s.actionCard, pressed && { opacity: 0.7 }]}
        >
          <View style={s.actionRow}>
            <View style={[s.actionIcon, { backgroundColor: "rgba(66,165,245,0.1)" }]}>
              <IconSymbol name="square.and.arrow.up.fill" size={20} color="#42A5F5" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.actionTitle}>
                {exportSuccess ? "Export erfolgreich" : "Alle Daten exportieren"}
              </Text>
              <Text style={s.actionSub}>
                Maschinenlesbares JSON-Format
              </Text>
            </View>
            <IconSymbol name="chevron.right" size={14} color="#4A4A4A" />
          </View>
        </Pressable>

        {/* Art. 17 - Recht auf Loeschung */}
        <Text style={s.sectionTitle}>Daten loeschen (Art. 17 DSGVO)</Text>
        <Pressable
          onPress={handleDeleteAllData}
          style={({ pressed }) => [s.actionCard, { borderColor: "rgba(239,83,80,0.15)" }, pressed && { opacity: 0.7 }]}
        >
          <View style={s.actionRow}>
            <View style={[s.actionIcon, { backgroundColor: "rgba(239,83,80,0.1)" }]}>
              <IconSymbol name="trash.fill" size={20} color="#EF5350" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.actionTitle, { color: "#EF5350" }]}>Alle Daten unwiderruflich loeschen</Text>
              <Text style={s.actionSub}>
                Alle personenbezogenen Daten und Einwilligungen
              </Text>
            </View>
            <IconSymbol name="chevron.right" size={14} color="#4A4A4A" />
          </View>
        </Pressable>

        {/* Verantwortlicher */}
        <Text style={s.sectionTitle}>Verantwortlicher (Art. 13 DSGVO)</Text>
        <View style={s.card}>
          <Text style={s.cardTitle}>Planypet - Tierpflege App</Text>
          <Text style={s.cardSub}>E-Mail: Planypet@icloud.com</Text>
          <Text style={s.cardSub}>Deutschland</Text>
          <View style={[s.divider, { marginVertical: 12 }]} />
          <Text style={s.cardDesc}>
            Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehoerde ueber die Verarbeitung Ihrer personenbezogenen Daten zu beschweren (Art. 77 DSGVO).
          </Text>
        </View>

        {/* Datenschutzerklaerung Version */}
        <View style={s.versionInfo}>
          <Text style={s.versionText}>Datenschutzerklaerung Version {PRIVACY_POLICY_VERSION}</Text>
          <Text style={s.versionText}>DSGVO (EU) / GDPR konform</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.dataRow}>
      <Text style={s.dataLabel}>{label}</Text>
      <Text style={s.dataValue}>{value}</Text>
    </View>
  );
}

function ConsentToggle({ title, value, onToggle, disabled, note }: {
  title: string;
  value: boolean;
  onToggle?: () => void;
  disabled?: boolean;
  note?: string;
}) {
  return (
    <View style={s.consentRow}>
      <View style={{ flex: 1 }}>
        <Text style={s.consentTitle}>{title}</Text>
        {note && <Text style={s.consentNote}>{note}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        disabled={disabled}
        trackColor={{ false: "#2A2A30", true: "#D4A843" }}
        thumbColor="#FAFAF8"
      />
    </View>
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
  cardTitle: { fontSize: 15, fontWeight: "500", color: "#FAFAF8", letterSpacing: 0.3 },
  cardSub: { fontSize: 12, fontWeight: "400", color: "#6B6B6B", marginTop: 2 },
  cardDesc: { fontSize: 13, fontWeight: "400", color: "#8B8B80", lineHeight: 20, marginBottom: 12 },

  dataGrid: { gap: 8, marginTop: 4 },
  dataRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 4 },
  dataLabel: { fontSize: 13, fontWeight: "400", color: "#6B6B6B" },
  dataValue: { fontSize: 13, fontWeight: "500", color: "#FAFAF8" },

  infoNote: {
    flexDirection: "row", gap: 8, marginTop: 16,
    backgroundColor: "rgba(212,168,67,0.05)", padding: 12,
    borderWidth: 1, borderColor: "rgba(212,168,67,0.1)",
  },
  infoNoteText: { flex: 1, fontSize: 11, fontWeight: "400", color: "#6B6B6B", lineHeight: 17 },

  divider: { height: 1, backgroundColor: "rgba(212,168,67,0.05)", marginVertical: 12 },

  consentRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 4 },
  consentTitle: { fontSize: 14, fontWeight: "500", color: "#FAFAF8", letterSpacing: 0.3 },
  consentNote: { fontSize: 11, fontWeight: "400", color: "#6B6B6B", marginTop: 2 },
  timestampText: { fontSize: 11, fontWeight: "400", color: "#4A4A4A", marginTop: 12, textAlign: "center" },

  actionCard: {
    backgroundColor: "#141418", padding: 16,
    borderWidth: 1, borderColor: "rgba(212,168,67,0.08)",
  },
  actionRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  actionIcon: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: "center", justifyContent: "center",
  },
  actionTitle: { fontSize: 15, fontWeight: "500", color: "#FAFAF8", letterSpacing: 0.3 },
  actionSub: { fontSize: 12, fontWeight: "400", color: "#6B6B6B", marginTop: 2 },

  versionInfo: { alignItems: "center", marginTop: 32, marginBottom: 20, gap: 4 },
  versionText: { fontSize: 11, fontWeight: "400", color: "#4A4A4A" },
});
