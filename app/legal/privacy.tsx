import { ScrollView, Text, View, Pressable } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenContainer } from "@/components/screen-container";
import { GlassCard } from "@/components/ui/glass-card";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function PrivacyScreen() {
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
          <Text className="text-3xl font-bold text-foreground">Datenschutzerklärung</Text>
        </View>

        <GlassCard className="p-6 mb-6">
          <Text className="text-muted text-sm leading-relaxed mb-6">
            Stand: {new Date().toLocaleDateString("de-DE")}
          </Text>

          {/* Einleitung */}
          <Text className="text-foreground text-lg font-bold mb-3">1. Datenschutz auf einen Blick</Text>
          <Text className="text-muted text-sm leading-relaxed mb-6">
            Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese App nutzen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
          </Text>

          {/* Verantwortliche Stelle */}
          <Text className="text-foreground text-lg font-bold mb-3">2. Verantwortliche Stelle</Text>
          <Text className="text-muted text-sm leading-relaxed mb-2">
            Verantwortlich für die Datenverarbeitung in dieser App ist:
          </Text>
          <Text className="text-foreground text-sm leading-relaxed mb-2">
            Joachim Norman Wagner
          </Text>
          <Text className="text-foreground text-sm leading-relaxed mb-6">
            E-Mail: info@wagnerconnect.com
          </Text>

          {/* Datenerfassung */}
          <Text className="text-foreground text-lg font-bold mb-3">3. Welche Daten erfassen wir?</Text>
          
          <Text className="text-foreground text-base font-semibold mb-2">3.1 Tierdaten</Text>
          <Text className="text-muted text-sm leading-relaxed mb-4">
            Die App speichert von Ihnen eingegebene Informationen über Ihre Haustiere lokal auf Ihrem Gerät, darunter: Name, Tierart, Rasse, Geburtsdatum, Gewicht, Mikrochip-ID, Versicherungsinformationen, Fütterungspläne, Gassi-Zeiten, Gesundheitsdaten, Symptome, Impfungen, Medikamente und Fotos.
          </Text>

          <Text className="text-foreground text-base font-semibold mb-2">3.2 Standortdaten</Text>
          <Text className="text-muted text-sm leading-relaxed mb-4">
            Wenn Sie die GPS-Tracking-Funktion für Spaziergänge nutzen, erfasst die App Ihren Standort während der Aktivität. Diese Daten werden lokal auf Ihrem Gerät gespeichert und nicht an externe Server übertragen.
          </Text>

          <Text className="text-foreground text-base font-semibold mb-2">3.3 Fotos und Medien</Text>
          <Text className="text-muted text-sm leading-relaxed mb-4">
            Wenn Sie Fotos von Ihren Haustieren oder Symptomen hochladen, werden diese lokal auf Ihrem Gerät gespeichert. Bei Nutzung der KI-Analyse werden Fotos verschlüsselt an unseren Server übertragen und nach der Analyse gelöscht.
          </Text>

          <Text className="text-foreground text-base font-semibold mb-2">3.4 Push-Benachrichtigungen</Text>
          <Text className="text-muted text-sm leading-relaxed mb-6">
            Wenn Sie Push-Benachrichtigungen aktivieren, wird ein Geräte-Token (Push-Token) generiert und auf unserem Server gespeichert, um Ihnen Erinnerungen senden zu können. Dieses Token enthält keine personenbezogenen Daten.
          </Text>

          {/* Rechtsgrundlage */}
          <Text className="text-foreground text-lg font-bold mb-3">4. Rechtsgrundlage der Verarbeitung</Text>
          <Text className="text-muted text-sm leading-relaxed mb-6">
            Die Verarbeitung Ihrer Daten erfolgt auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) sowie zur Erfüllung der von Ihnen gewünschten Funktionen der App (Art. 6 Abs. 1 lit. b DSGVO).
          </Text>

          {/* Datenweitergabe */}
          <Text className="text-foreground text-lg font-bold mb-3">5. Datenweitergabe an Dritte</Text>
          <Text className="text-muted text-sm leading-relaxed mb-4">
            Ihre Daten werden grundsätzlich nicht an Dritte weitergegeben. Ausnahmen:
          </Text>
          <Text className="text-muted text-sm leading-relaxed mb-2">
            • <Text className="font-semibold">KI-Analyse:</Text> Bei Nutzung der KI-gestützten Symptomanalyse werden Ihre Eingaben verschlüsselt an unseren KI-Dienstleister übertragen und nach der Analyse gelöscht.
          </Text>
          <Text className="text-muted text-sm leading-relaxed mb-2">
            • <Text className="font-semibold">Push-Benachrichtigungen:</Text> Push-Tokens werden über den Expo Push Notification Service verarbeitet.
          </Text>
          <Text className="text-muted text-sm leading-relaxed mb-6">
            • <Text className="font-semibold">Familien-Sharing:</Text> Wenn Sie Tiere mit anderen Nutzern teilen, werden die entsprechenden Tierdaten für diese Nutzer sichtbar.
          </Text>

          {/* Speicherdauer */}
          <Text className="text-foreground text-lg font-bold mb-3">6. Speicherdauer</Text>
          <Text className="text-muted text-sm leading-relaxed mb-6">
            Ihre Daten werden lokal auf Ihrem Gerät gespeichert und verbleiben dort, bis Sie die App deinstallieren oder die Daten manuell löschen. Server-seitig gespeicherte Daten (Push-Tokens, geteilte Tierdaten) werden gelöscht, sobald Sie Ihr Konto löschen.
          </Text>

          {/* Ihre Rechte */}
          <Text className="text-foreground text-lg font-bold mb-3">7. Ihre Rechte</Text>
          <Text className="text-muted text-sm leading-relaxed mb-4">
            Sie haben jederzeit das Recht auf:
          </Text>
          <Text className="text-muted text-sm leading-relaxed mb-2">
            • Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO)
          </Text>
          <Text className="text-muted text-sm leading-relaxed mb-2">
            • Berichtigung unrichtiger Daten (Art. 16 DSGVO)
          </Text>
          <Text className="text-muted text-sm leading-relaxed mb-2">
            • Löschung Ihrer Daten (Art. 17 DSGVO)
          </Text>
          <Text className="text-muted text-sm leading-relaxed mb-2">
            • Einschränkung der Verarbeitung (Art. 18 DSGVO)
          </Text>
          <Text className="text-muted text-sm leading-relaxed mb-2">
            • Datenübertragbarkeit (Art. 20 DSGVO)
          </Text>
          <Text className="text-muted text-sm leading-relaxed mb-6">
            • Widerruf Ihrer Einwilligung (Art. 7 Abs. 3 DSGVO)
          </Text>

          <Text className="text-muted text-sm leading-relaxed mb-6">
            Zur Ausübung Ihrer Rechte kontaktieren Sie uns bitte unter: info@wagnerconnect.com
          </Text>

          {/* Beschwerderecht */}
          <Text className="text-foreground text-lg font-bold mb-3">8. Beschwerderecht</Text>
          <Text className="text-muted text-sm leading-relaxed mb-6">
            Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen Daten durch uns zu beschweren.
          </Text>

          {/* Datensicherheit */}
          <Text className="text-foreground text-lg font-bold mb-3">9. Datensicherheit</Text>
          <Text className="text-muted text-sm leading-relaxed mb-6">
            Wir verwenden technische und organisatorische Sicherheitsmaßnahmen, um Ihre Daten gegen zufällige oder vorsätzliche Manipulationen, Verlust, Zerstörung oder den Zugriff unberechtigter Personen zu schützen. Alle Datenübertragungen erfolgen verschlüsselt (HTTPS/TLS).
          </Text>

          {/* Internationale Übermittlung */}
          <Text className="text-foreground text-lg font-bold mb-3">10. Internationale Datenübermittlung</Text>
          <Text className="text-muted text-sm leading-relaxed mb-6">
            Diese App entspricht den Anforderungen der DSGVO (EU) und GDPR. Bei Nutzung außerhalb der EU gelten zusätzlich die lokalen Datenschutzbestimmungen. Wir empfehlen Nutzern außerhalb der EU, sich über die geltenden Datenschutzgesetze in ihrem Land zu informieren.
          </Text>

          {/* Änderungen */}
          <Text className="text-foreground text-lg font-bold mb-3">11. Änderungen der Datenschutzerklärung</Text>
          <Text className="text-muted text-sm leading-relaxed">
            Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen umzusetzen. Für Ihren erneuten Besuch gilt dann die neue Datenschutzerklärung.
          </Text>
        </GlassCard>
      </ScrollView>
    </ScreenContainer>
  );
}
