import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";

interface PremiumScreenProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  showBack?: boolean;
}

/**
 * Premium sub-screen wrapper with consistent dark luxury design.
 * Provides back button, header with gold divider, and proper safe area handling.
 */
export function PremiumScreen({ title, subtitle, children, showBack = true }: PremiumScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={s.screen}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 40,
          paddingHorizontal: 20,
        }}
      >
        {showBack && (
          <Pressable onPress={() => router.back()} style={({ pressed }) => [s.backBtn, pressed && { opacity: 0.6 }]}>
            <IconSymbol name="chevron.left" size={20} color="#D4A843" />
            <Text style={s.backText}>Zurueck</Text>
          </Pressable>
        )}
        <View style={s.header}>
          <Text style={s.headerTitle}>{title}</Text>
          <Text style={s.headerSub}>{subtitle}</Text>
          <View style={s.goldDivider} />
        </View>
        {children}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0A0A0F" },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 },
  backText: { fontSize: 14, fontWeight: "500", color: "#D4A843", letterSpacing: 0.5 },
  header: { marginBottom: 32 },
  headerTitle: { fontSize: 28, fontWeight: "300", color: "#FAFAF8", letterSpacing: 2 },
  headerSub: { fontSize: 12, fontWeight: "400", color: "#6B6B6B", letterSpacing: 1, marginTop: 4 },
  goldDivider: { width: 40, height: 1, backgroundColor: "#D4A843", marginTop: 16 },
});
