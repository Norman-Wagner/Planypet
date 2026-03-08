import React from "react";
import { View, Text, ScrollView } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

export default function DisclaimerScreen() {
  const colors = useColors();

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="pb-6">
        <Text className="text-3xl font-bold text-foreground mb-6">Haftungsausschluss</Text>

        <View className="gap-4">
          <Section title="⚠️ WICHTIGER HAFTUNGSAUSSCHLUSS" color={colors.error}>
            <Text className="text-sm text-foreground leading-relaxed font-semibold">
              Planypet ist KEINE medizinische Fachperson und bietet KEINE professionelle
              Tierarzt-Beratung. Die App dient nur zur Dokumentation und Information.
            </Text>
          </Section>

          <Section title="1. Keine medizinische Beratung" color={colors.primary}>
            <Text className="text-sm text-foreground leading-relaxed">
              Alle Informationen in Planypet (KI-Tipps, Symptom-Checker, Ratgeber) sind nur zu
              Informationszwecken. Sie ersetzen NICHT die Beratung durch einen lizenzierten
              Tierarzt.
            </Text>
          </Section>

          <Section title="2. Notfälle" color={colors.error}>
            <Text className="text-sm text-foreground leading-relaxed">
              Bei Notfällen oder Verdacht auf ernsthafte Erkrankungen kontaktieren Sie sofort einen
              Tierarzt oder eine Tierklinik. Verwenden Sie die Planypet-Notfall-Funktion NICHT als
              Ersatz für professionelle medizinische Hilfe.
            </Text>
          </Section>

          <Section title="3. Chip-Registrierung" color={colors.primary}>
            <Text className="text-sm text-foreground leading-relaxed">
              Planypet ist NICHT verantwortlich für:{"\n"}
              • Fehler in Chip-Registrierungsdatenbanken{"\n"}
              • Verzögerungen bei der Registrierung{"\n"}
              • Kosten für Chip-Registrierung oder Chip-Implantation
            </Text>
          </Section>

          <Section title="4. GPS-Tracking" color={colors.primary}>
            <Text className="text-sm text-foreground leading-relaxed">
              GPS-Tracking ist NICHT 100% genau. Verlassen Sie sich NICHT ausschließlich auf
              Planypet für die Verfolgung Ihres Haustiers. Nutzen Sie auch andere Methoden wie
              Leine, Halsband und Aufsicht.
            </Text>
          </Section>

          <Section title="5. Datensicherheit" color={colors.primary}>
            <Text className="text-sm text-foreground leading-relaxed">
              Obwohl wir Sicherheitsmaßnahmen treffen, können wir KEINE 100%ige Sicherheit
              garantieren. Sie verwenden die App auf eigenes Risiko.
            </Text>
          </Section>

          <Section title="6. Verfügbarkeit" color={colors.primary}>
            <Text className="text-sm text-foreground leading-relaxed">
              Planypet ist AS-IS verfügbar. Wir garantieren KEINE ununterbrochene Verfügbarkeit
              und sind NICHT verantwortlich für Ausfallzeiten.
            </Text>
          </Section>

          <Section title="7. Haftungsbeschränkung" color={colors.primary}>
            <Text className="text-sm text-foreground leading-relaxed">
              Planypet haftet NICHT für:{"\n"}
              • Verletzungen oder Tod von Haustieren{"\n"}
              • Finanzielle Verluste{"\n"}
              • Emotionale Schäden{"\n"}
              • Indirekte oder Folgeschäden
            </Text>
          </Section>

          <Text className="text-xs text-muted mt-6">
            Letzte Aktualisierung: März 2026{"\n"}
            Bitte lesen Sie diesen Haftungsausschluss sorgfältig durch.
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
