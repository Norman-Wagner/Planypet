import { ScrollView, Text, View, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/ui/icon-symbol";

const sections = [
  { title: "1. Geltungsbereich", content: "Diese Allgemeinen Geschaeftsbedingungen (AGB) gelten fuer die Nutzung der mobilen Anwendung \"Planypet\" (nachfolgend \"App\" genannt), die von Joachim Norman Wagner (nachfolgend \"Anbieter\" genannt) bereitgestellt wird. Mit der Installation und Nutzung der App erklaeren Sie sich mit diesen AGB einverstanden." },
  { title: "2. Leistungsbeschreibung", content: "Planypet ist eine App zur Verwaltung und Pflege von Haustieren. Die App bietet folgende Funktionen:\n\n- Verwaltung von Tierprofilen und Stammdaten\n- Fuetterungs- und Gassi-Planung mit Erinnerungen\n- Gesundheitsdokumentation und Symptomerfassung\n- GPS-Tracking fuer Spaziergaenge\n- KI-gestuetzte Gesundheitshinweise\n- Familien-Sharing-Funktionen\n- Notfall-Funktionen und Giftkoeder-Warnungen" },
  { title: "3. Nutzungsbedingungen", content: "3.1 Die App ist aktuell kostenlos nutzbar. Der Anbieter behaelt sich vor, zukuenftig kostenpflichtige Premium-Funktionen anzubieten.\n\n3.2 Sie verpflichten sich, die App nur fuer private, nicht-kommerzielle Zwecke zu nutzen.\n\n3.3 Sie sind fuer die Richtigkeit und Aktualitaet der von Ihnen eingegebenen Daten selbst verantwortlich.\n\n3.4 Die Weitergabe Ihrer Zugangsdaten an Dritte ist untersagt." },
  { title: "4. Gesundheitshinweis und Haftungsausschluss", content: "4.1 Die in der App bereitgestellten KI-gestuetzten Gesundheitshinweise dienen ausschliesslich Informationszwecken und ersetzen in keinem Fall die professionelle Beratung oder Behandlung durch einen approbierten Tierarzt.\n\n4.2 Der Anbieter uebernimmt keine Haftung fuer die Richtigkeit, Vollstaendigkeit oder Aktualitaet der bereitgestellten Gesundheitsinformationen.\n\n4.3 Bei gesundheitlichen Problemen Ihres Haustieres konsultieren Sie bitte immer einen Tierarzt." },
  { title: "5. Verfuegbarkeit", content: "Der Anbieter bemueht sich um eine hohe Verfuegbarkeit der App. Es besteht jedoch kein Anspruch auf ununterbrochene Verfuegbarkeit. Wartungsarbeiten, technische Stoerungen oder hoehere Gewalt koennen zu voruebergehenden Einschraenkungen fuehren." },
  { title: "6. Haftung", content: "6.1 Der Anbieter haftet unbeschraenkt fuer Vorsatz und grobe Fahrlaessigkeit.\n\n6.2 Bei leichter Fahrlaessigkeit haftet der Anbieter nur bei Verletzung wesentlicher Vertragspflichten (Kardinalpflichten).\n\n6.3 Die Haftung fuer Datenverlust ist auf den typischen Wiederherstellungsaufwand beschraenkt." },
  { title: "7. Datenschutz", content: "Die Verarbeitung personenbezogener Daten erfolgt gemaess der Datenschutzerklaerung, die Sie in der App einsehen koennen." },
  { title: "8. Aenderungen der AGB", content: "Der Anbieter behaelt sich vor, diese AGB jederzeit zu aendern. Ueber Aenderungen werden Sie in der App informiert. Widersprechen Sie den geaenderten AGB nicht innerhalb von 14 Tagen nach Bekanntgabe, gelten diese als akzeptiert." },
  { title: "9. Kuendigung", content: "Sie koennen die Nutzung der App jederzeit durch Deinstallation beenden. Der Anbieter kann die Bereitstellung der App jederzeit mit einer Frist von 30 Tagen einstellen." },
  { title: "10. Schlussbestimmungen", content: "10.1 Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.\n\n10.2 Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit der uebrigen Bestimmungen hiervon unberuehrt.\n\n10.3 Gerichtsstand ist, soweit gesetzlich zulaessig, der Sitz des Anbieters." },
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
          <Text style={s.headerSub}>Stand: {new Date().toLocaleDateString("de-DE")}</Text>
          <View style={s.goldDivider} />
        </View>

        <View style={s.card}>
          <Text style={{ fontSize: 12, fontWeight: "400", color: "#6B6B6B", marginBottom: 20 }}>
            Allgemeine Geschaeftsbedingungen fuer die Nutzung der Planypet App
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
  sectionContent: { fontSize: 13, fontWeight: "400", color: "#6B6B6B", lineHeight: 20 },
});
