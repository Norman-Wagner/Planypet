import { ScrollView, Text, View, Pressable } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenContainer } from "@/components/screen-container";
import { GlassCard } from "@/components/ui/glass-card";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function TermsScreen() {
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
          <Text className="text-3xl font-bold text-foreground">AGB</Text>
        </View>

        <GlassCard className="p-6 mb-6">
          <Text className="text-muted text-sm leading-relaxed mb-6">
            Allgemeine Geschäftsbedingungen für die Nutzung der Planypet App
          </Text>
          <Text className="text-muted text-sm leading-relaxed mb-6">
            Stand: {new Date().toLocaleDateString("de-DE")}
          </Text>

          {/* Geltungsbereich */}
          <Text className="text-foreground text-lg font-bold mb-3">1. Geltungsbereich</Text>
          <Text className="text-muted text-sm leading-relaxed mb-6">
            Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung der mobilen Anwendung "Planypet" (nachfolgend "App" genannt), die von Joachim Norman Wagner (nachfolgend "Anbieter" genannt) bereitgestellt wird. Mit der Installation und Nutzung der App erklären Sie sich mit diesen AGB einverstanden.
          </Text>

          {/* Leistungsbeschreibung */}
          <Text className="text-foreground text-lg font-bold mb-3">2. Leistungsbeschreibung</Text>
          <Text className="text-muted text-sm leading-relaxed mb-4">
            Planypet ist eine App zur Verwaltung und Pflege von Haustieren. Die App bietet folgende Funktionen:
          </Text>
          <Text className="text-muted text-sm leading-relaxed mb-2">
            • Verwaltung von Tierprofilen und Stammdaten
          </Text>
          <Text className="text-muted text-sm leading-relaxed mb-2">
            • Fütterungs- und Gassi-Planung mit Erinnerungen
          </Text>
          <Text className="text-muted text-sm leading-relaxed mb-2">
            • Gesundheitsdokumentation und Symptomerfassung
          </Text>
          <Text className="text-muted text-sm leading-relaxed mb-2">
            • GPS-Tracking für Spaziergänge
          </Text>
          <Text className="text-muted text-sm leading-relaxed mb-2">
            • KI-gestützte Gesundheitshinweise
          </Text>
          <Text className="text-muted text-sm leading-relaxed mb-2">
            • Familien-Sharing-Funktionen
          </Text>
          <Text className="text-muted text-sm leading-relaxed mb-6">
            • Notfall-Funktionen und Giftköder-Warnungen
          </Text>

          {/* Nutzungsbedingungen */}
          <Text className="text-foreground text-lg font-bold mb-3">3. Nutzungsbedingungen</Text>
          <Text className="text-muted text-sm leading-relaxed mb-4">
            3.1 Die App ist aktuell kostenlos nutzbar. Der Anbieter behält sich vor, zukünftig kostenpflichtige Premium-Funktionen anzubieten.
          </Text>
          <Text className="text-muted text-sm leading-relaxed mb-4">
            3.2 Sie verpflichten sich, die App nur für private, nicht-kommerzielle Zwecke zu nutzen.
          </Text>
          <Text className="text-muted text-sm leading-relaxed mb-4">
            3.3 Sie sind für die Richtigkeit und Aktualität der von Ihnen eingegebenen Daten selbst verantwortlich.
          </Text>
          <Text className="text-muted text-sm leading-relaxed mb-6">
            3.4 Die Weitergabe Ihrer Zugangsdaten an Dritte ist untersagt.
          </Text>

          {/* Gesundheitshinweis */}
          <Text className="text-foreground text-lg font-bold mb-3">4. Gesundheitshinweis und Haftungsausschluss</Text>
          <Text className="text-muted text-sm leading-relaxed mb-4">
            4.1 Die in der App bereitgestellten KI-gestützten Gesundheitshinweise dienen ausschließlich Informationszwecken und ersetzen in keinem Fall die professionelle Beratung oder Behandlung durch einen approbierten Tierarzt.
          </Text>
          <Text className="text-muted text-sm leading-relaxed mb-4">
            4.2 Der Anbieter übernimmt keine Haftung für die Richtigkeit, Vollständigkeit oder Aktualität der bereitgestellten Gesundheitsinformationen.
          </Text>
          <Text className="text-muted text-sm leading-relaxed mb-6">
            4.3 Bei gesundheitlichen Problemen Ihres Haustieres konsultieren Sie bitte immer einen Tierarzt.
          </Text>

          {/* Verfügbarkeit */}
          <Text className="text-foreground text-lg font-bold mb-3">5. Verfügbarkeit</Text>
          <Text className="text-muted text-sm leading-relaxed mb-6">
            Der Anbieter bemüht sich um eine hohe Verfügbarkeit der App. Es besteht jedoch kein Anspruch auf ununterbrochene Verfügbarkeit. Wartungsarbeiten, technische Störungen oder höhere Gewalt können zu vorübergehenden Einschränkungen führen.
          </Text>

          {/* Haftung */}
          <Text className="text-foreground text-lg font-bold mb-3">6. Haftung</Text>
          <Text className="text-muted text-sm leading-relaxed mb-4">
            6.1 Der Anbieter haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit.
          </Text>
          <Text className="text-muted text-sm leading-relaxed mb-4">
            6.2 Bei leichter Fahrlässigkeit haftet der Anbieter nur bei Verletzung wesentlicher Vertragspflichten (Kardinalpflichten). In diesem Fall ist die Haftung auf den vorhersehbaren, vertragstypischen Schaden begrenzt.
          </Text>
          <Text className="text-muted text-sm leading-relaxed mb-6">
            6.3 Die Haftung für Datenverlust ist auf den typischen Wiederherstellungsaufwand beschränkt, der bei regelmäßiger und gefahrentsprechender Anfertigung von Sicherungskopien eingetreten wäre.
          </Text>

          {/* Datenschutz */}
          <Text className="text-foreground text-lg font-bold mb-3">7. Datenschutz</Text>
          <Text className="text-muted text-sm leading-relaxed mb-6">
            Die Verarbeitung personenbezogener Daten erfolgt gemäß der Datenschutzerklärung, die Sie in der App einsehen können.
          </Text>

          {/* Änderungen */}
          <Text className="text-foreground text-lg font-bold mb-3">8. Änderungen der AGB</Text>
          <Text className="text-muted text-sm leading-relaxed mb-6">
            Der Anbieter behält sich vor, diese AGB jederzeit zu ändern. Über Änderungen werden Sie in der App informiert. Widersprechen Sie den geänderten AGB nicht innerhalb von 14 Tagen nach Bekanntgabe, gelten diese als akzeptiert.
          </Text>

          {/* Kündigung */}
          <Text className="text-foreground text-lg font-bold mb-3">9. Kündigung</Text>
          <Text className="text-muted text-sm leading-relaxed mb-6">
            Sie können die Nutzung der App jederzeit durch Deinstallation beenden. Der Anbieter kann die Bereitstellung der App jederzeit mit einer Frist von 30 Tagen einstellen.
          </Text>

          {/* Schlussbestimmungen */}
          <Text className="text-foreground text-lg font-bold mb-3">10. Schlussbestimmungen</Text>
          <Text className="text-muted text-sm leading-relaxed mb-4">
            10.1 Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
          </Text>
          <Text className="text-muted text-sm leading-relaxed mb-4">
            10.2 Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen hiervon unberührt.
          </Text>
          <Text className="text-muted text-sm leading-relaxed">
            10.3 Gerichtsstand ist, soweit gesetzlich zulässig, der Sitz des Anbieters.
          </Text>
        </GlassCard>
      </ScrollView>
    </ScreenContainer>
  );
}
