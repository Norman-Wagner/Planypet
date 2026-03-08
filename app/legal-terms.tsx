import React from "react";
import { View, Text, ScrollView } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

export default function TermsOfServiceScreen() {
  const colors = useColors();

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="pb-6">
        <Text className="text-3xl font-bold text-foreground mb-6">Nutzungsbedingungen</Text>

        <View className="gap-4">
          <Section title="1. Akzeptanz der Bedingungen" color={colors.primary}>
            <Text className="text-sm text-foreground leading-relaxed">
              Durch die Nutzung von Planypet akzeptieren Sie diese Nutzungsbedingungen vollständig.
              Falls Sie nicht zustimmen, dürfen Sie die App nicht nutzen.
            </Text>
          </Section>

          <Section title="2. Nutzungsrechte" color={colors.primary}>
            <Text className="text-sm text-foreground leading-relaxed">
              Sie erhalten eine persönliche, nicht-übertragbare Lizenz zur Nutzung der App. Sie
              dürfen die App nicht vermieten, verkaufen oder modifizieren.
            </Text>
          </Section>

          <Section title="3. Benutzerverantwortung" color={colors.primary}>
            <Text className="text-sm text-foreground leading-relaxed">
              Sie sind verantwortlich für:{"\n"}
              • Geheimhaltung Ihrer Anmeldedaten{"\n"}
              • Alle Aktivitäten unter Ihrem Konto{"\n"}
              • Einhaltung aller geltenden Gesetze
            </Text>
          </Section>

          <Section title="4. Haftungsbeschränkung" color={colors.primary}>
            <Text className="text-sm text-foreground leading-relaxed">
              Planypet ist NICHT verantwortlich für:{"\n"}
              • Fehler oder Ausfallzeiten der App{"\n"}
              • Datenverlust oder -beschädigung{"\n"}
              • Schäden durch fehlerhafte medizinische Informationen{"\n"}
              • Verletzungen oder Todesfälle von Haustieren
            </Text>
          </Section>

          <Section title="5. Medizinischer Disclaimer" color={colors.primary}>
            <Text className="text-sm text-foreground leading-relaxed">
              Planypet bietet KEINE medizinische Beratung. Alle Informationen sind nur zu
              Informationszwecken. Konsultieren Sie immer einen Tierarzt für medizinische Fragen.
            </Text>
          </Section>

          <Section title="6. Änderungen der Bedingungen" color={colors.primary}>
            <Text className="text-sm text-foreground leading-relaxed">
              Wir können diese Bedingungen jederzeit ändern. Änderungen werden durch Mitteilung in
              der App bekannt gemacht.
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
