import { ScrollView, Text, View, Pressable, StyleSheet, Linking } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function ImpressumScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0F" }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40, paddingHorizontal: 20 }}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [s.backBtn, pressed && { opacity: 0.6 }]}>
          <IconSymbol name="chevron.left" size={20} color="#D4A843" />
          <Text style={s.backText}>Zurueck</Text>
        </Pressable>
        <View style={s.header}>
          <Text style={s.headerTitle}>Impressum</Text>
          <View style={s.goldDivider} />
        </View>

        <View style={s.card}>
          <Text style={s.bold}>Angaben gemaess Paragraph 5 TMG</Text>
          <Text style={s.text}>Wagnerconnect UG (haftungsbeschraenkt)</Text>
          <Text style={s.text}>Vertreten durch: Privatperson</Text>
          <Text style={s.muted}>Deutschland</Text>

          <View style={s.divider} />
          <Text style={s.bold}>Kontakt:</Text>
          <Pressable onPress={() => Linking.openURL("mailto:Planypet@icloud.com")} style={({ pressed }) => pressed && { opacity: 0.6 }}>
            <Text style={[s.text, { color: "#D4A843" }]}>E-Mail: Planypet@icloud.com</Text>
          </Pressable>

          <View style={s.divider} />
          <Text style={s.bold}>Verantwortlich fuer den Inhalt nach Paragraph 55 Abs. 2 RStV:</Text>
          <Text style={s.text}>Planypet - Tierpflege App</Text>

          <View style={s.divider} />
          <Text style={s.bold}>EU-Streitschlichtung</Text>
          <Text style={s.muted}>Die Europaeische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:</Text>
          <Pressable onPress={() => Linking.openURL("https://ec.europa.eu/consumers/odr/")} style={({ pressed }) => pressed && { opacity: 0.6 }}>
            <Text style={[s.muted, { color: "#D4A843", marginTop: 4 }]}>https://ec.europa.eu/consumers/odr/</Text>
          </Pressable>
          <Text style={[s.muted, { marginTop: 8 }]}>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</Text>

          <View style={s.divider} />
          <Text style={s.bold}>Haftungsausschluss:</Text>

          <Text style={[s.semibold, { marginTop: 12 }]}>Haftung fuer Inhalte</Text>
          <Text style={s.muted}>Die Inhalte unserer App wurden mit groesster Sorgfalt erstellt. Fuer die Richtigkeit, Vollstaendigkeit und Aktualitaet der Inhalte koennen wir jedoch keine Gewaehr uebernehmen. Als Diensteanbieter sind wir gemaess Paragraph 7 Abs.1 TMG fuer eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.</Text>

          <Text style={[s.semibold, { marginTop: 12 }]}>Gesundheitshinweis</Text>
          <Text style={s.muted}>Die in dieser App bereitgestellten KI-gestuetzten Gesundheitshinweise dienen ausschliesslich Informationszwecken und ersetzen in keinem Fall die professionelle Beratung oder Behandlung durch einen approbierten Tierarzt. Bei gesundheitlichen Problemen Ihres Haustieres konsultieren Sie bitte immer einen Tierarzt.</Text>

          <Text style={[s.semibold, { marginTop: 12 }]}>Datenschutz</Text>
          <Text style={s.muted}>Die Nutzung unserer App ist ohne Angabe personenbezogener Daten moeglich. Soweit auf unseren Seiten personenbezogene Daten erhoben werden, erfolgt dies stets auf freiwilliger Basis und nach Ihrer ausdruecklichen Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Diese Daten werden ohne Ihre ausdrueckliche Zustimmung nicht an Dritte weitergegeben. Weitere Informationen finden Sie in unserer Datenschutzerklaerung.</Text>

          <View style={s.divider} />
          <Text style={{ fontSize: 11, fontWeight: "400", color: "#4A4A4A", fontStyle: "italic", textAlign: "center" }}>
            (PS.: Denkt dran, alle guten Dinge sind 3 ;)... Viele Gruesse "Eure Deutschen Entwickler")
          </Text>
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
  goldDivider: { width: 40, height: 1, backgroundColor: "#D4A843", marginTop: 16 },
  card: { backgroundColor: "#141418", padding: 20, borderWidth: 1, borderColor: "rgba(212,168,67,0.08)" },
  bold: { fontSize: 14, fontWeight: "600", color: "#FAFAF8", letterSpacing: 0.3, marginBottom: 8 },
  semibold: { fontSize: 14, fontWeight: "500", color: "#FAFAF8", letterSpacing: 0.3, marginBottom: 6 },
  text: { fontSize: 14, fontWeight: "400", color: "#C8C8C0", lineHeight: 22, marginBottom: 4 },
  muted: { fontSize: 13, fontWeight: "400", color: "#6B6B6B", lineHeight: 20, marginBottom: 4 },
  divider: { height: 1, backgroundColor: "rgba(212,168,67,0.08)", marginVertical: 16 },
});
