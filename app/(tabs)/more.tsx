import { ScrollView, Text, View, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

import { IconSymbol } from "@/components/ui/icon-symbol";

interface MenuItemProps {
  icon: string;
  iconColor: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
}

function MenuItem({ icon, iconColor, title, subtitle, onPress }: MenuItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [s.menuItem, pressed && { opacity: 0.7 }]}
    >
      <View style={[s.menuIcon, { backgroundColor: `${iconColor}15` }]}>
        <IconSymbol name={icon as any} size={20} color={iconColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.menuTitle}>{title}</Text>
        <Text style={s.menuSub}>{subtitle}</Text>
      </View>
      <IconSymbol name="chevron.right" size={14} color="#4A4A4A" />
    </Pressable>
  );
}

function SectionTitle({ text }: { text: string }) {
  return <Text style={s.sectionTitle}>{text}</Text>;
}

export default function MoreScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0F" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 100,
          paddingHorizontal: 20,
        }}
      >
        <View style={s.header}>
          <Text style={s.headerTitle}>Mehr</Text>
          <Text style={s.headerSub}>Einstellungen & Features</Text>
          <View style={s.goldDivider} />
        </View>

        {/* KI & Tools */}
        <SectionTitle text="KI & Tools" />
        <View style={s.section}>
          <MenuItem icon="mic.fill" iconColor="#A78BFA" title="Tier-Uebersetzer" subtitle="Verstehe was dein Tier sagt" onPress={() => router.push("/pet-translator")} />
          <MenuItem icon="speaker.wave.3.fill" iconColor="#66BB6A" title="Tier-Soundboard" subtitle="Lockrufe & Training" onPress={() => router.push("/pet-sounds")} />
          <MenuItem icon="camera.fill" iconColor="#D4A843" title="Rassen-Scanner" subtitle="Erkenne die Rasse deines Tieres" onPress={() => router.push("/breed-scanner")} />
          <MenuItem icon="cross.case.fill" iconColor="#EF5350" title="Erste Hilfe" subtitle="Notfall-Anleitungen" onPress={() => router.push("/first-aid")} />
        </View>

        {/* Features */}
        <SectionTitle text="Features" />
        <View style={s.section}>
          <MenuItem icon="location.fill" iconColor="#42A5F5" title="GPS-Tracking" subtitle="Gassi-Routen aufzeichnen" onPress={() => router.push("/gps-history")} />
          <MenuItem icon="cube.box.fill" iconColor="#FFB74D" title="Vorraete" subtitle="Futter & Zubehoer verwalten" onPress={() => router.push("/supplies")} />
          <MenuItem icon="cart.fill" iconColor="#66BB6A" title="Shop" subtitle="Tierbedarf bestellen" onPress={() => router.push("/shop")} />
          <MenuItem icon="person.2.fill" iconColor="#A78BFA" title="Tierbetreuung" subtitle="Tiersitter & Pensionen finden" onPress={() => router.push("/pet-care-finder")} />
          <MenuItem icon="photo.fill" iconColor="#D4A843" title="Fotoalbum" subtitle="Bilder deiner Haustiere" onPress={() => router.push("/photo-album")} />
        </View>

        {/* Community */}
        <SectionTitle text="Community" />
        <View style={s.section}>
          <MenuItem icon="person.2.fill" iconColor="#D4A843" title="Community-Feed" subtitle="Mit anderen Tierbesitzern teilen" onPress={() => router.push("/community")} />
        </View>

        {/* Notfall */}
        <SectionTitle text="Notfall" />
        <View style={s.section}>
          <MenuItem icon="exclamationmark.triangle.fill" iconColor="#EF5350" title="Tier vermisst" subtitle="Schnelle Hilfe bei Vermissung" onPress={() => router.push("/emergency")} />
          <MenuItem icon="exclamationmark.triangle.fill" iconColor="#FFB74D" title="Giftkoeder-Warnungen" subtitle="Gefahren in deiner Naehe" onPress={() => router.push("/emergency")} />
          <MenuItem icon="phone.fill" iconColor="#42A5F5" title="Notfallkontakte" subtitle="Tieraerzte & Tierkliniken" onPress={() => router.push("/emergency")} />
        </View>

        {/* Einstellungen */}
        <SectionTitle text="Einstellungen" />
        <View style={s.section}>
          <MenuItem icon="person.fill" iconColor="#8B8B80" title="Profil" subtitle="Deine Daten bearbeiten" />
          <MenuItem icon="person.2.fill" iconColor="#D4A843" title="Familie & Team" subtitle="Rollen & Aufgaben verwalten" />
          <MenuItem icon="bell.fill" iconColor="#FFB74D" title="Benachrichtigungen" subtitle="Push-Erinnerungen einstellen" />
          <MenuItem icon="gearshape.fill" iconColor="#8B8B80" title="App-Einstellungen" subtitle="Theme, Sprache, Export" onPress={() => router.push("/settings")} />
        </View>

        {/* Datensicherung */}
        <SectionTitle text="Datensicherung" />
        <View style={s.section}>
          <MenuItem icon="icloud.fill" iconColor="#66BB6A" title="Backup & Sync" subtitle="Daten sichern und synchronisieren" onPress={() => router.push("/backup")} />
        </View>

        {/* Rechtliches */}
        <SectionTitle text="Rechtliches" />
        <View style={s.section}>
          <MenuItem icon="doc.text.fill" iconColor="#8B8B80" title="Impressum" subtitle="Angaben gemaess Paragraph 5 TMG" onPress={() => router.push("/legal/impressum")} />
          <MenuItem icon="shield.fill" iconColor="#42A5F5" title="Datenschutzerklaerung" subtitle="DSGVO-konforme Datenschutzhinweise" onPress={() => router.push("/legal/privacy")} />
          <MenuItem icon="doc.text.fill" iconColor="#8B8B80" title="AGB" subtitle="Allgemeine Geschaeftsbedingungen" onPress={() => router.push("/legal/terms")} />
        </View>

        {/* Footer */}
        <View style={s.footer}>
          <Text style={s.footerText}>Planypet by Wagnerconnect</Text>
          <Text style={s.footerVersion}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  header: { marginBottom: 32 },
  headerTitle: { fontSize: 28, fontWeight: "300", color: "#FAFAF8", letterSpacing: 2 },
  headerSub: { fontSize: 12, fontWeight: "400", color: "#6B6B6B", letterSpacing: 1, marginTop: 4 },
  goldDivider: { width: 40, height: 1, backgroundColor: "#D4A843", marginTop: 16 },

  sectionTitle: {
    fontSize: 11, fontWeight: "600", color: "#D4A843",
    letterSpacing: 3, textTransform: "uppercase", marginBottom: 12, marginTop: 24,
  },

  section: {
    backgroundColor: "#141418",
    borderWidth: 1,
    borderColor: "rgba(212,168,67,0.08)",
  },

  menuItem: {
    flexDirection: "row", alignItems: "center", gap: 14,
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: "rgba(212,168,67,0.04)",
  },
  menuIcon: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: "center", justifyContent: "center",
  },
  menuTitle: { fontSize: 15, fontWeight: "500", color: "#FAFAF8", letterSpacing: 0.3 },
  menuSub: { fontSize: 12, fontWeight: "400", color: "#6B6B6B", marginTop: 1 },

  footer: { alignItems: "center", marginTop: 40, marginBottom: 20 },
  footerText: { fontSize: 12, fontWeight: "400", color: "#4A4A4A", letterSpacing: 1 },
  footerVersion: { fontSize: 11, fontWeight: "400", color: "#3A3A3A", marginTop: 4 },
});
