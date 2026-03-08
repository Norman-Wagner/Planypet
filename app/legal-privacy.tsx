import React from "react";
import { View, Text, ScrollView } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

export default function PrivacyPolicyScreen() {
  const colors = useColors();

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="pb-6">
        <Text className="text-3xl font-bold text-foreground mb-6">Datenschutzerklärung</Text>

        <View className="gap-4">
          <Section title="1. Verantwortlicher" color={colors.primary}>
            <Text className="text-sm text-foreground leading-relaxed">
              Aaron Bestattungen GmbH{"\n"}
              Planypet Division{"\n"}
              Chemnitz, Sachsen{"\n"}
              Deutschland
            </Text>
          </Section>

          <Section title="2. Erfasste Daten" color={colors.primary}>
            <Text className="text-sm text-foreground leading-relaxed">
              • Nutzerdaten: Name, Email, Telefon, Adresse{"\n"}
              • Haustier-Informationen: Name, Art, Rasse, Alter, Gewicht{"\n"}
              • Gesundheitsdaten: Impfungen, Medikamente, Allergien{"\n"}
              • Aktivitätsdaten: Gassi-Routen, Fütterungszeiten{"\n"}
              • Chip-Registrierungsdaten (nur mit Zustimmung){"\n"}
              • Gerätedaten: IP-Adresse, Gerätetyp, Betriebssystem
            </Text>
          </Section>

          <Section title="3. Rechtsgrundlage (GDPR)" color={colors.primary}>
            <Text className="text-sm text-foreground leading-relaxed">
              Verarbeitung basiert auf:{"\n"}
              • Art. 6 Abs. 1 lit. a GDPR (Einwilligung){"\n"}
              • Art. 6 Abs. 1 lit. b GDPR (Vertragserfüllung){"\n"}
              • Art. 6 Abs. 1 lit. f GDPR (berechtigte Interessen)
            </Text>
          </Section>

          <Section title="4. Datenspeicherung" color={colors.primary}>
            <Text className="text-sm text-foreground leading-relaxed">
              Daten werden gespeichert, solange das Konto aktiv ist. Nach Löschung werden Daten
              innerhalb von 30 Tagen gelöscht, außer gesetzliche Aufbewahrungspflichten bestehen.
            </Text>
          </Section>

          <Section title="5. Ihre Rechte" color={colors.primary}>
            <Text className="text-sm text-foreground leading-relaxed">
              • Recht auf Auskunft (Art. 15 GDPR){"\n"}
              • Recht auf Berichtigung (Art. 16 GDPR){"\n"}
              • Recht auf Löschung (Art. 17 GDPR){"\n"}
              • Recht auf Datenportabilität (Art. 20 GDPR){"\n"}
              • Widerspruchsrecht (Art. 21 GDPR)
            </Text>
          </Section>

          <Section title="6. Kontakt" color={colors.primary}>
            <Text className="text-sm text-foreground leading-relaxed">
              Datenschutzbeauftragte: privacy@planypet.app{"\n"}
              Beschwerde bei Aufsichtsbehörde möglich
            </Text>
          </Section>

          <Text className="text-xs text-muted mt-6">
            Letzte Aktualisierung: März 2026
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function Section({
  title,
  children,
  color,
}: {
  title: string;
  children: React.ReactNode;
  color: string;
}) {
  return (
    <View className="bg-surface rounded-lg border border-border p-4">
      <Text className="text-base font-bold mb-2" style={{ color }}>
        {title}
      </Text>
      {children}
    </View>
  );
}
