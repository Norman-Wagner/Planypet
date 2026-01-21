import { ScrollView, Text, View, Pressable } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenContainer } from "@/components/screen-container";
import { GlassCard } from "@/components/ui/glass-card";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function ImpressumScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <ScreenContainer className="p-6">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <Pressable
            onPress={() => router.back()}
            className="mr-4"
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <IconSymbol name="chevron.left" size={28} color={colors.primary} />
          </Pressable>
          <Text className="text-3xl font-bold text-foreground">Impressum</Text>
        </View>

        <GlassCard className="p-6 mb-6">
          <Text className="text-foreground text-base leading-relaxed mb-4">
            <Text className="font-bold">Angaben gemäß § 5 TMG</Text>
          </Text>

          <Text className="text-foreground text-base leading-relaxed mb-2">
            Joachim Norman Wagner
          </Text>
          <Text className="text-muted text-base leading-relaxed mb-4">
            Deutschland
          </Text>

          <Text className="text-foreground text-base leading-relaxed mb-4">
            <Text className="font-bold">Kontakt:</Text>
          </Text>
          <Text className="text-foreground text-base leading-relaxed mb-2">
            E-Mail: info@wagnerconnect.com
          </Text>

          <View className="mt-6 pt-6 border-t border-border">
            <Text className="text-foreground text-base leading-relaxed mb-4">
              <Text className="font-bold">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</Text>
            </Text>
            <Text className="text-foreground text-base leading-relaxed">
              Joachim Norman Wagner
            </Text>
          </View>

          <View className="mt-6 pt-6 border-t border-border">
            <Text className="text-foreground text-base leading-relaxed mb-4">
              <Text className="font-bold">Haftungsausschluss:</Text>
            </Text>
            
            <Text className="text-foreground text-base leading-relaxed mb-3">
              <Text className="font-semibold">Haftung für Inhalte</Text>
            </Text>
            <Text className="text-muted text-sm leading-relaxed mb-4">
              Die Inhalte unserer App wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.
            </Text>

            <Text className="text-foreground text-base leading-relaxed mb-3">
              <Text className="font-semibold">Gesundheitshinweis</Text>
            </Text>
            <Text className="text-muted text-sm leading-relaxed mb-4">
              Die in dieser App bereitgestellten KI-gestützten Gesundheitshinweise dienen ausschließlich Informationszwecken und ersetzen in keinem Fall die professionelle Beratung oder Behandlung durch einen approbierten Tierarzt. Bei gesundheitlichen Problemen Ihres Haustieres konsultieren Sie bitte immer einen Tierarzt.
            </Text>

            <Text className="text-foreground text-base leading-relaxed mb-3">
              <Text className="font-semibold">Datenschutz</Text>
            </Text>
            <Text className="text-muted text-sm leading-relaxed">
              Die Nutzung unserer App ist ohne Angabe personenbezogener Daten möglich. Soweit auf unseren Seiten personenbezogene Daten erhoben werden, erfolgt dies stets auf freiwilliger Basis. Diese Daten werden ohne Ihre ausdrückliche Zustimmung nicht an Dritte weitergegeben. Weitere Informationen finden Sie in unserer Datenschutzerklärung.
            </Text>
          </View>

          <View className="mt-6 pt-6 border-t border-border">
            <Text className="text-muted text-xs italic text-center">
              (PS.: Denkt dran, alle guten Dinge sind 3 ;)... Viele Grüße "Eure Deutschen Entwickler")
            </Text>
          </View>
        </GlassCard>
      </ScrollView>
    </ScreenContainer>
  );
}
