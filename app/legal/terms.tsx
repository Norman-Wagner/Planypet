import { ScrollView, Text, View, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/ui/icon-symbol";

const sections = [
  { title: "1. Geltungsbereich", content: "Diese Allgemeinen Geschaeftsbedingungen (AGB) gelten fuer die Nutzung der mobilen Anwendung \"Planypet\" (nachfolgend \"App\" genannt), die von der Wagnerconnect UG (haftungsbeschraenkt), vertreten durch Joachim Norman Wagner (nachfolgend \"Anbieter\" genannt), bereitgestellt wird. Mit der Installation und Nutzung der App erklaeren Sie sich mit diesen AGB einverstanden." },
  { title: "2. Leistungsbeschreibung", content: "Planypet ist eine App zur Verwaltung und Pflege von Haustieren. Die App bietet folgende Funktionen:\n\n- Verwaltung von Tierprofilen und Stammdaten\n- Fuetterungs- und Gassi-Planung mit Erinnerungen\n- Gesundheitsdokumentation und Symptomerfassung\n- GPS-Tracking fuer Spaziergaenge\n- KI-gestuetzte Gesundheitshinweise (optional, nur bei Einwilligung)\n- Familien-Sharing-Funktionen\n- Notfall-Funktionen und Giftkoeder-Warnungen\n- Foto-Album und Erinnerungen" },
  { title: "3. Nutzungsbedingungen", content: "3.1 Die App ist aktuell kostenlos nutzbar. Der Anbieter behaelt sich vor, zukuenftig kostenpflichtige Premium-Funktionen anzubieten.\n\n3.2 Sie verpflichten sich, die App nur fuer private, nicht-kommerzielle Zwecke zu nutzen.\n\n3.3 Sie sind fuer die Richtigkeit und Aktualitaet der von Ihnen eingegebenen Daten selbst verantwortlich.\n\n3.4 Die Weitergabe Ihrer Zugangsdaten an Dritte ist untersagt." },
  { title: "4. Datenschutz und DSGVO", content: "4.1 Die Verarbeitung personenbezogener Daten erfolgt gemaess der Datenschutz-Grundverordnung (DSGVO) und dem Bundesdatenschutzgesetz (BDSG).\n\n4.2 Vor der Nutzung bestimmter Funktionen (KI-Analyse, Push-Benachrichtigungen, Kamera, Standort) wird Ihre ausdrueckliche Einwilligung gemaess Art. 6 Abs. 1 lit. a DSGVO eingeholt.\n\n4.3 Sie koennen Ihre Einwilligungen jederzeit im Datenschutz-Center der App widerrufen (Art. 7 Abs. 3 DSGVO).\n\n4.4 Ihre Rechte gemaess Art. 15-22 DSGVO (Auskunft, Berichtigung, Loeschung, Datenportabilitaet, Widerspruch) koennen Sie ueber das Datenschutz-Center in den App-Einstellungen ausueben.\n\n4.5 Ausfuehrliche Informationen finden Sie in unserer Datenschutzerklaerung, die in der App einsehbar ist." },
  { title: "5. Gesundheitshinweis und Haftungsausschluss", content: "5.1 Die in der App bereitgestellten KI-gestuetzten Gesundheitshinweise dienen ausschliesslich Informationszwecken und ersetzen in keinem Fall die professionelle Beratung oder Behandlung durch einen approbierten Tierarzt.\n\n5.2 Der Anbieter uebernimmt keine Haftung fuer die Richtigkeit, Vollstaendigkeit oder Aktualitaet der bereitgestellten Gesundheitsinformationen.\n\n5.3 Bei gesundheitlichen Problemen Ihres Haustieres konsultieren Sie bitte immer einen Tierarzt." },
  { title: "6. Verfuegbarkeit", content: "Der Anbieter bemueht sich um eine hohe Verfuegbarkeit der App. Es besteht jedoch kein Anspruch auf ununterbrochene Verfuegbarkeit. Wartungsarbeiten, technische Stoerungen oder hoehere Gewalt koennen zu voruebergehenden Einschraenkungen fuehren." },
  { title: "7. Haftung", content: "7.1 Der Anbieter haftet unbeschraenkt fuer Vorsatz und grobe Fahrlaessigkeit.\n\n7.2 Bei leichter Fahrlaessigkeit haftet der Anbieter nur bei Verletzung wesentlicher Vertragspflichten (Kardinalpflichten).\n\n7.3 Die Haftung fuer Datenverlust ist auf den typischen Wiederherstellungsaufwand beschraenkt.\n\n7.4 Die Haftung der Wagnerconnect UG (haftungsbeschraenkt) ist auf das Gesellschaftsvermoegen beschraenkt." },
  { title: "8. Geistiges Eigentum", content: "8.1 Alle Inhalte, Designs, Logos und Texte der App sind urheberrechtlich geschuetzt und Eigentum des Anbieters.\n\n8.2 Die Vervielfaeltigung, Verbreitung oder sonstige Nutzung der Inhalte bedarf der schriftlichen Zustimmung des Anbieters." },
  { title: "9. Aenderungen der AGB", content: "Der Anbieter behaelt sich vor, diese AGB jederzeit zu aendern. Ueber wesentliche Aenderungen werden Sie in der App informiert. Widersprechen Sie den geaenderten AGB nicht innerhalb von 14 Tagen nach Bekanntgabe, gelten diese als akzeptiert." },
  { title: "10. Kuendigung", content: "Sie koennen die Nutzung der App jederzeit durch Deinstallation beenden. Vor der Deinstallation empfehlen wir, Ihre Daten ueber das Datenschutz-Center zu exportieren (Art. 20 DSGVO). Der Anbieter kann die Bereitstellung der App jederzeit mit einer Frist von 30 Tagen einstellen." },
  { title: "11. Schlussbestimmungen", content: "11.1 Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.\n\n11.2 Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit der uebrigen Bestimmungen hiervon unberuehrt.\n\n11.3 Gerichtsstand ist, soweit gesetzlich zulaessig, der Sitz des Anbieters." },
];

export default function TermsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0F" }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40, paddingHorizontal: 20 }}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [s.backBtn, pressed && { opacity: 0.6 }]}>
          <IconSymbol name="chevron.left" size={20} color="#D4A843" />
          <Text style={s.backText}>Zurueck</Text>
        </Pressable>
        <View style={s.header}>
          <Text style={s.headerTitle}>AGB</Text>
          <Text style={s.headerSub}>Stand: Februar 2026</Text>
          <View style={s.goldDivider} />
        </View>

        <View style={s.card}>
          <Text style={{ fontSize: 12, fontWeight: "400", color: "#6B6B6B", marginBottom: 20 }}>
            Allgemeine Geschaeftsbedingungen fuer die Nutzung der Planypet App der Wagnerconnect UG (haftungsbeschraenkt)
          </Text>
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
  sectionContent: { fontSize: 13, fontWeight: "400", color: "#8B8B80", lineHeight: 20 },
});
