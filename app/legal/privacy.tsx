import { ScrollView, Text, View, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/ui/icon-symbol";

const sections = [
  { title: "1. Datenschutz auf einen Blick", content: "Die folgenden Hinweise geben einen einfachen Ueberblick darueber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese App nutzen. Personenbezogene Daten sind alle Daten, mit denen Sie persoenlich identifiziert werden koennen." },
  { title: "2. Verantwortliche Stelle", content: "Verantwortlich fuer die Datenverarbeitung in dieser App ist:\n\nJoachim Norman Wagner\nE-Mail: info@wagnerconnect.com" },
  { title: "3. Welche Daten erfassen wir?", content: "3.1 Tierdaten: Die App speichert von Ihnen eingegebene Informationen ueber Ihre Haustiere lokal auf Ihrem Geraet.\n\n3.2 Standortdaten: Wenn Sie die GPS-Tracking-Funktion nutzen, erfasst die App Ihren Standort waehrend der Aktivitaet. Diese Daten werden lokal gespeichert.\n\n3.3 Fotos und Medien: Fotos werden lokal gespeichert. Bei KI-Analyse werden sie verschluesselt uebertragen und nach der Analyse geloescht.\n\n3.4 Push-Benachrichtigungen: Bei Aktivierung wird ein Geraete-Token generiert und auf unserem Server gespeichert." },
  { title: "4. Rechtsgrundlage der Verarbeitung", content: "Die Verarbeitung Ihrer Daten erfolgt auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) sowie zur Erfuellung der von Ihnen gewuenschten Funktionen der App (Art. 6 Abs. 1 lit. b DSGVO)." },
  { title: "5. Datenweitergabe an Dritte", content: "Ihre Daten werden grundsaetzlich nicht an Dritte weitergegeben. Ausnahmen:\n\n- KI-Analyse: Eingaben werden verschluesselt an unseren KI-Dienstleister uebertragen und nach der Analyse geloescht.\n- Push-Benachrichtigungen: Push-Tokens werden ueber den Expo Push Notification Service verarbeitet.\n- Familien-Sharing: Geteilte Tierdaten werden fuer andere Nutzer sichtbar." },
  { title: "6. Speicherdauer", content: "Ihre Daten werden lokal auf Ihrem Geraet gespeichert und verbleiben dort, bis Sie die App deinstallieren oder die Daten manuell loeschen." },
  { title: "7. Ihre Rechte", content: "Sie haben jederzeit das Recht auf:\n\n- Auskunft ueber Ihre gespeicherten Daten (Art. 15 DSGVO)\n- Berichtigung unrichtiger Daten (Art. 16 DSGVO)\n- Loeschung Ihrer Daten (Art. 17 DSGVO)\n- Einschraenkung der Verarbeitung (Art. 18 DSGVO)\n- Datenuebertragbarkeit (Art. 20 DSGVO)\n- Widerruf Ihrer Einwilligung (Art. 7 Abs. 3 DSGVO)\n\nKontakt: info@wagnerconnect.com" },
  { title: "8. Beschwerderecht", content: "Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehoerde ueber die Verarbeitung Ihrer personenbezogenen Daten zu beschweren." },
  { title: "9. Datensicherheit", content: "Wir verwenden technische und organisatorische Sicherheitsmassnahmen. Alle Datenuebertragungen erfolgen verschluesselt (HTTPS/TLS)." },
  { title: "10. Internationale Datenuebermittlung", content: "Diese App entspricht den Anforderungen der DSGVO (EU) und GDPR." },
  { title: "11. Aenderungen der Datenschutzerklaerung", content: "Wir behalten uns vor, diese Datenschutzerklaerung anzupassen, damit sie stets den aktuellen rechtlichen Anforderungen entspricht." },
];

export default function PrivacyScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0F" }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40, paddingHorizontal: 20 }}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [s.backBtn, pressed && { opacity: 0.6 }]}>
          <IconSymbol name="chevron.left" size={20} color="#D4A843" />
          <Text style={s.backText}>Zurueck</Text>
        </Pressable>
        <View style={s.header}>
          <Text style={s.headerTitle}>Datenschutz</Text>
          <Text style={s.headerSub}>Stand: {new Date().toLocaleDateString("de-DE")}</Text>
          <View style={s.goldDivider} />
        </View>

        <View style={s.card}>
          {sections.map((sec, i) => (
            <View key={i} style={i > 0 ? { marginTop: 20 } : undefined}>
              <Text style={s.sectionTitle}>{sec.title}</Text>
              <Text style={s.sectionContent}>{sec.content}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
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
  card: { backgroundColor: "#141418", padding: 20, borderWidth: 1, borderColor: "rgba(212,168,67,0.08)" },
  sectionTitle: { fontSize: 15, fontWeight: "500", color: "#FAFAF8", letterSpacing: 0.3, marginBottom: 8 },
  sectionContent: { fontSize: 13, fontWeight: "400", color: "#6B6B6B", lineHeight: 20 },
});
