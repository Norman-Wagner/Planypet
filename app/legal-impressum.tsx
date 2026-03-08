import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Linking } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function ImpressumScreen() {
  const colors = useColors();

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handlePhone = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="pb-6">
        <Text className="text-3xl font-bold text-foreground mb-6">Impressum</Text>

        <View className="gap-4">
          <Section title="Anbieter" color={colors.primary}>
            <Text className="text-sm text-foreground leading-relaxed font-semibold">
              Aaron Bestattungen GmbH{"\n"}
              Planypet Division
            </Text>
            <Text className="text-sm text-foreground leading-relaxed mt-2">
              Adresse:{"\n"}
              Chemnitz{"\n"}
              Sachsen, Deutschland
            </Text>
          </Section>

          <Section title="Kontakt" color={colors.primary}>
            <TouchableOpacity
              onPress={() => handleEmail("info@planypet.app")}
              className="flex-row items-center gap-2 py-2"
            >
              <IconSymbol name="envelope.fill" size={16} color={colors.primary} />
              <Text className="text-sm text-primary underline">info@planypet.app</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handlePhone("+49371123456")}
              className="flex-row items-center gap-2 py-2"
            >
              <IconSymbol name="phone.fill" size={16} color={colors.primary} />
              <Text className="text-sm text-primary underline">+49 (0)371 123456</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleEmail("support@planypet.app")}
              className="flex-row items-center gap-2 py-2"
            >
              <IconSymbol name="questionmark.circle.fill" size={16} color={colors.primary} />
              <Text className="text-sm text-primary underline">support@planypet.app</Text>
            </TouchableOpacity>
          </Section>

          <Section title="Geschäftsführung" color={colors.primary}>
            <Text className="text-sm text-foreground leading-relaxed">
              Norman Wagner{"\n"}
              Bestattermeister (Bachelor Professional)
            </Text>
          </Section>

          <Section title="Registrierung" color={colors.primary}>
            <Text className="text-sm text-foreground leading-relaxed">
              Handelsregister: [HRB-Nummer]{"\n"}
              Registergericht: Amtsgericht Chemnitz{"\n"}
              USt-ID: [VAT-ID]
            </Text>
          </Section>

          <Section title="Verantwortlich für Inhalte" color={colors.primary}>
            <Text className="text-sm text-foreground leading-relaxed">
              Nach § 7 Abs. 1 TMG ist der Anbieter für eigene Inhalte auf diesen Seiten nach den
              allgemeinen Gesetzen verantwortlich.
            </Text>
          </Section>

          <Section title="Haftung für Links" color={colors.primary}>
            <Text className="text-sm text-foreground leading-relaxed">
              Planypet ist nicht verantwortlich für externe Links. Der Anbieter prüft externe
              Links bei Erstveröffentlichung, haftet aber nicht für Inhalte externer Links.
            </Text>
          </Section>

          <Section title="Urheberrecht" color={colors.primary}>
            <Text className="text-sm text-foreground leading-relaxed">
              Alle Inhalte sind urheberrechtlich geschützt. Vervielfältigung, Verbreitung oder
              Speicherung ohne Genehmigung ist untersagt.
            </Text>
          </Section>

          <Section title="Datenschutz" color={colors.primary}>
            <Text className="text-sm text-foreground leading-relaxed">
              Siehe Datenschutzerklärung für Informationen zur Datenverarbeitung.
            </Text>
          </Section>

          <Section title="Streitbeilegung" color={colors.primary}>
            <Text className="text-sm text-foreground leading-relaxed">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS)
              bereit: https://ec.europa.eu/consumers/odr
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
