import { useState } from "react";
import { ScrollView, Text, View, Pressable, Share, Platform, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { PetAvatar } from "@/components/ui/pet-avatar";
import { usePetStore, Pet } from "@/lib/pet-store";

const colors = {
  background: "#0A0A0F",
  gold: "#D4A843",
  card: "#141418",
  cardBorder: "rgba(212,168,67,0.08)",
  textPrimary: "#FAFAF8",
  textSecondary: "#8B8B80",
  textMuted: "#6B6B6B",
  textDimmer: "#4A4A4A",
};

export default function VetModeScreen() {
  const insets = useSafeAreaInsets();
  const { pets, healthRecords } = usePetStore();
  
  const [selectedPet, setSelectedPet] = useState<Pet | null>(pets[0] || null);

  const petRecords = selectedPet 
    ? healthRecords.filter((r) => r.petId === selectedPet.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];

  const symptoms = petRecords.filter((r) => r.type === "symptom");
  const vaccinations = petRecords.filter((r) => r.type === "vaccination");
  const medications = petRecords.filter((r) => r.type === "medication");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleShare = async () => {
    if (!selectedPet) return;
    
    const summary = `
TIERARZT-BERICHT für ${selectedPet.name}
========================================
Tierart: ${selectedPet.type}
${selectedPet.breed ? `Rasse: ${selectedPet.breed}` : ""}
${selectedPet.age ? `Alter: ${selectedPet.age}` : ""}
${selectedPet.weight ? `Gewicht: ${selectedPet.weight}` : ""}

SYMPTOME (${symptoms.length}):
${symptoms.map((s) => `- ${formatDate(s.date)}: ${s.title}${s.description ? ` - ${s.description}` : ""}`).join("\n") || "Keine Symptome dokumentiert"}

IMPFUNGEN (${vaccinations.length}):
${vaccinations.map((v) => `- ${formatDate(v.date)}: ${v.title}`).join("\n") || "Keine Impfungen dokumentiert"}

MEDIKAMENTE (${medications.length}):
${medications.map((m) => `- ${formatDate(m.date)}: ${m.title}${m.description ? ` - ${m.description}` : ""}`).join("\n") || "Keine Medikamente dokumentiert"}

Erstellt mit Planypet by Wagnerconnect
    `.trim();

    try {
      await Share.share({
        message: summary,
        title: `Tierarzt-Bericht ${selectedPet.name}`,
      });
      
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={{ 
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 40,
          paddingHorizontal: 20,
        }}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.headerButton, { opacity: pressed ? 0.7 : 1 }]}
          >
            <IconSymbol name="chevron.left" size={24} color={colors.gold} />
          </Pressable>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Tierarzt-Modus</Text>
            <Text style={styles.headerSubtitle}>Kompakte Übersicht für den Arztbesuch</Text>
            <View style={styles.headerDivider} />
          </View>
          <Pressable
            onPress={handleShare}
            style={({ pressed }) => [styles.headerButton, { opacity: pressed ? 0.7 : 1 }]}
          >
            <IconSymbol name="share.fill" size={22} color={colors.gold} />
          </Pressable>
        </View>

        {/* Pet Selector */}
        {pets.length > 1 && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.petSelectorContainer}
            contentContainerStyle={{ gap: 12 }}
          >
            {pets.map((pet) => (
              <Pressable
                key={pet.id}
                onPress={() => setSelectedPet(pet)}
                style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] })}
              >
                <View style={[styles.petSelectorCard, selectedPet?.id === pet.id && styles.petSelectorCardActive]}>
                  <PetAvatar name={pet.name} type={pet.type} size="md" />
                  <Text style={styles.petSelectorName} numberOfLines={1}>
                    {pet.name}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        )}

        {selectedPet ? (
          <>
            {/* Pet Info Card */}
            <View style={[styles.card, styles.marginBottom]}>
              <View style={styles.petInfoContainer}>
                <PetAvatar name={selectedPet.name} type={selectedPet.type} size="xl" />
                <View style={styles.petInfoTextContainer}>
                  <Text style={styles.petName}>{selectedPet.name}</Text>
                  <Text style={styles.petBreed}>{selectedPet.breed || "Keine Rasse angegeben"}</Text>
                </View>
              </View>
              
              <View style={styles.petStatsContainer}>
                {selectedPet.age && (
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Alter</Text>
                    <Text style={styles.statValue}>{selectedPet.age}</Text>
                  </View>
                )}
                {selectedPet.weight && (
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Gewicht</Text>
                    <Text style={styles.statValue}>{selectedPet.weight}</Text>
                  </View>
                )}
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Gruppe</Text>
                  <Text style={styles.statValue}>{selectedPet.isGroup ? "Ja" : "Nein"}</Text>
                </View>
              </View>
            </View>

            {/* Sections */}
            <Section title="Symptome" count={symptoms.length} records={symptoms} icon="exclamationmark.triangle.fill" iconColor="#D9534F" />
            <Section title="Impfungen" count={vaccinations.length} records={vaccinations} icon="syringe.fill" iconColor={colors.gold} />
            <Section title="Medikamente" count={medications.length} records={medications} icon="pill.fill" iconColor="#F0AD4E" />

            {/* Disclaimer */}
            <View style={[styles.card, { borderColor: "rgba(240, 173, 78, 0.3)" }]}>
              <View style={styles.disclaimerContainer}>
                <IconSymbol name="info.circle.fill" size={20} color="#F0AD4E" />
                <View style={styles.disclaimerTextContainer}>
                  <Text style={styles.disclaimerTitle}>Wichtiger Hinweis</Text>
                  <Text style={styles.disclaimerText}>
                    Diese Übersicht dient nur zur Dokumentation. Sie ersetzt keine tierärztliche Diagnose oder Behandlung.
                  </Text>
                </View>
              </View>
            </View>
          </>
        ) : (
          <View style={[styles.card, styles.centered]}>
            <IconSymbol name="pawprint.fill" size={48} color={colors.textMuted} />
            <Text style={styles.noPetText}>Kein Tier ausgewählt</Text>
            <Text style={styles.noPetSubtitle}>Füge zuerst ein Haustier hinzu</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const Section = ({ title, count, records, icon, iconColor }: { title: string; count: number; records: any[]; icon: any; iconColor: string }) => (
  <View style={styles.marginBottom}>
    <Text style={styles.sectionTitle}>{title} ({count})</Text>
    {records.length === 0 ? (
      <View style={[styles.card, styles.centered, { paddingVertical: 16 }]}>
        <IconSymbol name={icon} size={32} color={colors.textMuted} />
        <Text style={styles.noRecordText}>Keine {title}</Text>
      </View>
    ) : (
      records.slice(0, 3).map((record) => (
        <View key={record.id} style={[styles.card, { marginBottom: 8 }]}>
          <View style={styles.recordContainer}>
            <View style={[styles.recordIconContainer, { backgroundColor: `${iconColor}20` }]}>
              <IconSymbol name={icon} size={20} color={iconColor} />
            </View>
            <View style={styles.recordTextContainer}>
              <Text style={styles.recordTitle}>{record.title}</Text>
              <Text style={styles.recordDate}>{new Date(record.date).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })}</Text>
            </View>
          </View>
          {record.description && (
            <Text style={styles.recordDescription}>{record.description}</Text>
          )}
        </View>
      ))
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(212,168,67,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: "300",
    letterSpacing: 2,
  },
  headerSubtitle: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 2,
  },
  headerDivider: {
    width: 40,
    height: 1,
    backgroundColor: colors.gold,
    marginTop: 8,
  },
  petSelectorContainer: {
    marginBottom: 24,
  },
  petSelectorCard: {
    width: 96,
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  petSelectorCardActive: {
    borderColor: colors.gold,
    borderWidth: 1.5,
  },
  petSelectorName: {
    color: colors.textPrimary,
    fontWeight: "500",
    marginTop: 4,
    fontSize: 14,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
  },
  marginBottom: {
    marginBottom: 24,
  },
  petInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  petInfoTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  petName: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: "bold",
  },
  petBreed: {
    color: colors.textSecondary,
  },
  petStatsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statBox: {
    backgroundColor: "rgba(10,10,15,0.5)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 12,
  },
  statValue: {
    color: colors.textPrimary,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.gold,
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
  },
  noPetText: {
    color: colors.textPrimary,
    fontWeight: "500",
    marginTop: 12,
  },
  noPetSubtitle: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: "center",
    marginTop: 4,
  },
  noRecordText: {
    color: colors.textPrimary,
    fontWeight: "500",
    marginTop: 8,
  },
  recordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  recordIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  recordTextContainer: {
    flex: 1,
  },
  recordTitle: {
    color: colors.textPrimary,
    fontWeight: "600",
  },
  recordDate: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  recordDescription: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 8,
    paddingLeft: 52, // Align with title
  },
  disclaimerContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  disclaimerTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  disclaimerTitle: {
    color: colors.textPrimary,
    fontWeight: "500",
    fontSize: 14,
  },
  disclaimerText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
});
