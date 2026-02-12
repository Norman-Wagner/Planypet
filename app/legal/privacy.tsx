import { ScrollView, Text, View, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/ui/icon-symbol";

const sections = [
  {
    title: "1. Datenschutz auf einen Blick",
    content: "Die folgenden Hinweise geben einen einfachen Ueberblick darueber, was mit Ihren personenbezogenen Daten passiert, wenn Sie die Planypet App nutzen. Personenbezogene Daten sind alle Daten, mit denen Sie persoenlich identifiziert werden koennen. Ausfuehrliche Informationen zum Thema Datenschutz entnehmen Sie den nachfolgenden Abschnitten.",
  },
  {
    title: "2. Verantwortliche Stelle (Art. 13 Abs. 1 lit. a DSGVO)",
    content: "Verantwortlich fuer die Datenverarbeitung in dieser App ist:\n\nJoachim Norman Wagner\nDeutschland\n\nE-Mail: info@wagnerconnect.com\n\nVerantwortliche Stelle ist die natuerliche Person, die allein oder gemeinsam mit anderen ueber die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten entscheidet.",
  },
  {
    title: "3. Welche Daten erfassen wir? (Art. 13 Abs. 1 lit. c, d DSGVO)",
    content: "3.1 Benutzerdaten\nBei der Ersteinrichtung der App geben Sie Ihren Namen und Ihre Rolle (z.B. Tierbesitzer) ein. Diese Daten werden ausschliesslich lokal auf Ihrem Geraet gespeichert.\n\n3.2 Tierdaten\nInformationen ueber Ihre Haustiere (Name, Art, Rasse, Gewicht, Geburtsdatum, Vorlieben, Fotos) werden lokal auf Ihrem Geraet gespeichert.\n\n3.3 Gesundheitsdaten\nSymptome, Impfungen, Medikamente, Tierarzttermine und Notizen werden lokal auf Ihrem Geraet gespeichert.\n\n3.4 Fuetterungs- und Aktivitaetsdaten\nFuetterungsplaene, Spaziergaenge und GPS-Tracks werden lokal gespeichert.\n\n3.5 Familienmitglieder-Daten\nNamen, Rollen, E-Mail-Adressen und Telefonnummern von Familienmitgliedern werden lokal gespeichert.\n\n3.6 Fotos und Medien\nFotos werden lokal auf Ihrem Geraet gespeichert. Bei Nutzung der KI-Analyse werden Bilder verschluesselt (HTTPS/TLS) an unseren Server uebertragen und nach der Analyse unverzueglich geloescht.\n\n3.7 Standortdaten\nBei aktiviertem GPS-Tracking werden Standortdaten waehrend der Aktivitaet erfasst und lokal gespeichert. Eine Uebertragung an Server findet nicht statt.\n\n3.8 Push-Benachrichtigungen\nBei Aktivierung wird ein Geraete-Token (Expo Push Token) generiert und fuer die Zustellung von Benachrichtigungen verwendet.\n\n3.9 Einwilligungsdaten\nIhre Datenschutz-Einstellungen (Einwilligungen und Widerrufe) werden mit Zeitstempel lokal gespeichert.",
  },
  {
    title: "4. Rechtsgrundlage der Verarbeitung (Art. 6 DSGVO)",
    content: "Die Verarbeitung Ihrer Daten erfolgt auf folgenden Rechtsgrundlagen:\n\n4.1 Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)\nFuer die Verarbeitung von Daten im Rahmen der KI-Analyse, Push-Benachrichtigungen, Kamera-/Fotozugriff, Standort-Tracking und Kalender-Zugriff holen wir Ihre ausdrueckliche Einwilligung ein. Sie koennen diese Einwilligung jederzeit mit Wirkung fuer die Zukunft widerrufen (Art. 7 Abs. 3 DSGVO).\n\n4.2 Art. 6 Abs. 1 lit. b DSGVO (Vertragerfuellung)\nDie lokale Speicherung Ihrer Tierdaten und Einstellungen ist fuer die Bereitstellung der von Ihnen gewuenschten App-Funktionen erforderlich.\n\n4.3 Art. 6 Abs. 1 lit. f DSGVO (Berechtigtes Interesse)\nDie Verarbeitung technischer Daten (z.B. Fehlerlogs) erfolgt auf Grundlage unseres berechtigten Interesses an der Sicherheit und Stabilitaet der App.",
  },
  {
    title: "5. Datenweitergabe an Dritte (Art. 13 Abs. 1 lit. e, f DSGVO)",
    content: "Ihre Daten werden grundsaetzlich nicht an Dritte weitergegeben. Ausnahmen bestehen nur bei:\n\n5.1 KI-Analyse (nur bei Einwilligung)\nBei aktivierter KI-Analyse werden Eingaben verschluesselt (HTTPS/TLS) an unseren KI-Dienstleister uebertragen. Die Daten werden ausschliesslich zur Analyse verwendet und danach unverzueglich geloescht. Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO.\n\n5.2 Push-Benachrichtigungen (nur bei Einwilligung)\nPush-Tokens werden ueber den Expo Push Notification Service (Expo, Inc., USA) verarbeitet. Es gelten die Datenschutzbestimmungen von Expo. Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO.\n\n5.3 Keine Weitergabe an Werbenetzwerke\nWir geben keine Daten an Werbenetzwerke, Analysedienste oder sonstige Dritte weiter.",
  },
  {
    title: "6. Datenuebermittlung in Drittlaender (Art. 13 Abs. 1 lit. f DSGVO)",
    content: "Bei Nutzung des Expo Push Notification Service koennen Daten in die USA uebermittelt werden. Expo hat sich zur Einhaltung angemessener Datenschutzstandards verpflichtet. Die Uebermittlung erfolgt auf Grundlage von Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO).",
  },
  {
    title: "7. Speicherdauer (Art. 13 Abs. 2 lit. a DSGVO)",
    content: "7.1 Lokale Daten werden auf Ihrem Geraet gespeichert und verbleiben dort, bis Sie die App deinstallieren oder die Daten manuell ueber das Datenschutz-Center loeschen.\n\n7.2 Bei KI-Analyse uebertragene Daten werden nach Abschluss der Analyse unverzueglich geloescht.\n\n7.3 Push-Tokens werden gespeichert, solange Sie Push-Benachrichtigungen aktiviert haben.",
  },
  {
    title: "8. Ihre Rechte (Art. 15-22 DSGVO)",
    content: "Sie haben jederzeit folgende Rechte:\n\nArt. 15 DSGVO - Auskunftsrecht\nSie koennen im Datenschutz-Center der App einsehen, welche Daten gespeichert sind.\n\nArt. 16 DSGVO - Recht auf Berichtigung\nSie koennen Ihre Daten jederzeit in der App bearbeiten.\n\nArt. 17 DSGVO - Recht auf Loeschung\nSie koennen alle Daten ueber das Datenschutz-Center unwiderruflich loeschen.\n\nArt. 18 DSGVO - Recht auf Einschraenkung\nSie koennen einzelne Datenverarbeitungen im Datenschutz-Center deaktivieren.\n\nArt. 20 DSGVO - Recht auf Datenuebertragbarkeit\nSie koennen alle Ihre Daten im maschinenlesbaren JSON-Format ueber das Datenschutz-Center exportieren.\n\nArt. 21 DSGVO - Widerspruchsrecht\nSie koennen der Verarbeitung auf Grundlage berechtigter Interessen jederzeit widersprechen.\n\nArt. 7 Abs. 3 DSGVO - Widerruf der Einwilligung\nSie koennen Ihre Einwilligungen jederzeit im Datenschutz-Center widerrufen.\n\nKontakt: info@wagnerconnect.com",
  },
  {
    title: "9. Beschwerderecht (Art. 77 DSGVO)",
    content: "Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehoerde ueber die Verarbeitung Ihrer personenbezogenen Daten zu beschweren. Die zustaendige Aufsichtsbehoerde richtet sich nach dem Bundesland Ihres Wohnsitzes.",
  },
  {
    title: "10. Datensicherheit (Art. 32 DSGVO)",
    content: "Wir verwenden technische und organisatorische Sicherheitsmassnahmen zum Schutz Ihrer Daten:\n\n- Alle Datenuebertragungen erfolgen verschluesselt (HTTPS/TLS)\n- Lokale Daten werden auf Ihrem Geraet in der App-Sandbox gespeichert\n- Keine unverschluesselte Speicherung sensibler Daten\n- Regelmaessige Ueberpruefung der Sicherheitsmassnahmen",
  },
  {
    title: "11. Internationale Konformitaet",
    content: "Diese App entspricht den Anforderungen der:\n\n- DSGVO (Datenschutz-Grundverordnung, EU)\n- BDSG (Bundesdatenschutzgesetz, Deutschland)\n- GDPR (General Data Protection Regulation, EU/EWR)\n\nDie DSGVO/GDPR-Konformitaet bietet ein hohes Datenschutzniveau, das in vielen Laendern als Referenzstandard anerkannt wird. Fuer Nutzer ausserhalb der EU/EWR gelten zusaetzlich die jeweiligen lokalen Datenschutzgesetze.",
  },
  {
    title: "12. Aenderungen der Datenschutzerklaerung",
    content: "Wir behalten uns vor, diese Datenschutzerklaerung anzupassen, damit sie stets den aktuellen rechtlichen Anforderungen entspricht. Bei wesentlichen Aenderungen werden Sie in der App informiert und ggf. um erneute Einwilligung gebeten.\n\nAktuelle Version: 1.0.0\nStand: Februar 2026",
  },
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
          <Text style={s.headerSub}>Stand: Februar 2026 | Version 1.0.0</Text>
          <View style={s.goldDivider} />
        </View>

        {/* Quick Link to Privacy Center */}
        <Pressable
          onPress={() => router.push("/privacy-center")}
          style={({ pressed }) => [s.quickLink, pressed && { opacity: 0.7 }]}
        >
          <IconSymbol name="shield.fill" size={16} color="#D4A843" />
          <Text style={s.quickLinkText}>Zum Datenschutz-Center (Einwilligungen, Export, Loeschung)</Text>
          <IconSymbol name="chevron.right" size={12} color="#4A4A4A" />
        </Pressable>

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
  header: { marginBottom: 24 },
  headerTitle: { fontSize: 28, fontWeight: "300", color: "#FAFAF8", letterSpacing: 2 },
  headerSub: { fontSize: 12, fontWeight: "400", color: "#6B6B6B", letterSpacing: 1, marginTop: 4 },
  goldDivider: { width: 40, height: 1, backgroundColor: "#D4A843", marginTop: 16 },
  quickLink: {
    flexDirection: "row", alignItems: "center", gap: 10,
    backgroundColor: "rgba(212,168,67,0.08)", padding: 14, marginBottom: 20,
    borderWidth: 1, borderColor: "rgba(212,168,67,0.15)",
  },
  quickLinkText: { flex: 1, fontSize: 12, fontWeight: "500", color: "#D4A843", letterSpacing: 0.3 },
  card: { backgroundColor: "#141418", padding: 20, borderWidth: 1, borderColor: "rgba(212,168,67,0.08)" },
  sectionTitle: { fontSize: 15, fontWeight: "500", color: "#FAFAF8", letterSpacing: 0.3, marginBottom: 8 },
  sectionContent: { fontSize: 13, fontWeight: "400", color: "#8B8B80", lineHeight: 20 },
});
