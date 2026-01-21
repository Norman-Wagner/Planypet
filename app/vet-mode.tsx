import { useState } from "react";
import { ScrollView, Text, View, Pressable, Share, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import { GlassCard } from "@/components/ui/glass-card";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { PetAvatar } from "@/components/ui/pet-avatar";
import { useColors } from "@/hooks/use-colors";
import { usePetStore, Pet, HealthRecord } from "@/lib/pet-store";

export default function VetModeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { pets, healthRecords } = usePetStore();
  
  const [selectedPet, setSelectedPet] = useState<Pet | null>(pets[0] || null);

  // Get health records for selected pet
  const petRecords = selectedPet 
    ? healthRecords.filter((r) => r.petId === selectedPet.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];

  const symptoms = petRecords.filter((r) => r.type === "symptom");
  const vaccinations = petRecords.filter((r) => r.type === "vaccination");
  const medications = petRecords.filter((r) => r.type === "medication");
  const appointments = petRecords.filter((r) => r.type === "appointment");

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
    <View className="flex-1">
      {/* Gradient Background */}
      <LinearGradient
        colors={["#10B981", "#34D399", "#F0F7FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 0.6 }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />
      
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ 
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 40,
          paddingHorizontal: 20,
        }}
      >
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-3"
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <IconSymbol name="chevron.left" size={24} color="#FFFFFF" />
          </Pressable>
          <View className="flex-1">
            <Text className="text-white text-2xl font-bold">Tierarzt-Modus</Text>
            <Text className="text-white/70 text-base">Kompakte Übersicht für den Arztbesuch</Text>
          </View>
          <Pressable
            onPress={handleShare}
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <IconSymbol name="share.fill" size={22} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Pet Selector */}
        {pets.length > 1 && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="mb-6"
            contentContainerStyle={{ gap: 12 }}
          >
            {pets.map((pet) => (
              <Pressable
                key={pet.id}
                onPress={() => setSelectedPet(pet)}
                style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] })}
              >
                <GlassCard 
                  className={`w-24 items-center py-3 ${
                    selectedPet?.id === pet.id ? "border-2 border-white" : ""
                  }`}
                >
                  <PetAvatar name={pet.name} type={pet.type} size="md" />
                  <Text className="text-foreground font-medium mt-1 text-sm" numberOfLines={1}>
                    {pet.name}
                  </Text>
                </GlassCard>
              </Pressable>
            ))}
          </ScrollView>
        )}

        {selectedPet ? (
          <>
            {/* Pet Info Card */}
            <GlassCard className="mb-6">
              <View className="flex-row items-center mb-4">
                <PetAvatar name={selectedPet.name} type={selectedPet.type} size="xl" />
                <View className="flex-1 ml-4">
                  <Text className="text-foreground text-2xl font-bold">{selectedPet.name}</Text>
                  <Text className="text-muted">{selectedPet.breed || "Keine Rasse angegeben"}</Text>
                </View>
              </View>
              
              <View className="flex-row flex-wrap gap-3">
                {selectedPet.age && (
                  <View className="bg-surface/50 px-3 py-2 rounded-xl">
                    <Text className="text-muted text-xs">Alter</Text>
                    <Text className="text-foreground font-semibold">{selectedPet.age}</Text>
                  </View>
                )}
                {selectedPet.weight && (
                  <View className="bg-surface/50 px-3 py-2 rounded-xl">
                    <Text className="text-muted text-xs">Gewicht</Text>
                    <Text className="text-foreground font-semibold">{selectedPet.weight}</Text>
                  </View>
                )}
                <View className="bg-surface/50 px-3 py-2 rounded-xl">
                  <Text className="text-muted text-xs">Gruppe</Text>
                  <Text className="text-foreground font-semibold">{selectedPet.isGroup ? "Ja" : "Nein"}</Text>
                </View>
              </View>
            </GlassCard>

            {/* Symptoms Section */}
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-foreground text-lg font-semibold">
                Symptome ({symptoms.length})
              </Text>
              <Pressable
                onPress={() => router.push("/add-symptom")}
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                <View className="flex-row items-center">
                  <IconSymbol name="plus.circle.fill" size={20} color={colors.primary} />
                  <Text className="text-primary font-medium ml-1">Hinzufügen</Text>
                </View>
              </Pressable>
            </View>
            
            {symptoms.length === 0 ? (
              <GlassCard className="mb-6 items-center py-4">
                <IconSymbol name="checkmark.circle.fill" size={32} color={colors.success} />
                <Text className="text-foreground font-medium mt-2">Keine Symptome</Text>
              </GlassCard>
            ) : (
              <View className="mb-6">
                {symptoms.slice(0, 3).map((symptom) => (
                  <GlassCard key={symptom.id} className="mb-2">
                    <View className="flex-row items-center">
                      <View className="w-10 h-10 rounded-full bg-error/20 items-center justify-center mr-3">
                        <IconSymbol name="exclamationmark.triangle.fill" size={20} color={colors.error} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-foreground font-semibold">{symptom.title}</Text>
                        <Text className="text-muted text-sm">{formatDate(symptom.date)}</Text>
                      </View>
                    </View>
                    {symptom.description && (
                      <Text className="text-muted text-sm mt-2">{symptom.description}</Text>
                    )}
                  </GlassCard>
                ))}
              </View>
            )}

            {/* Vaccinations Section */}
            <Text className="text-foreground text-lg font-semibold mb-3">
              Impfungen ({vaccinations.length})
            </Text>
            
            {vaccinations.length === 0 ? (
              <GlassCard className="mb-6 items-center py-4">
                <IconSymbol name="syringe.fill" size={32} color={colors.muted} />
                <Text className="text-foreground font-medium mt-2">Keine Impfungen</Text>
              </GlassCard>
            ) : (
              <View className="mb-6">
                {vaccinations.map((vac) => (
                  <GlassCard key={vac.id} className="mb-2">
                    <View className="flex-row items-center">
                      <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center mr-3">
                        <IconSymbol name="syringe.fill" size={20} color={colors.primary} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-foreground font-semibold">{vac.title}</Text>
                        <Text className="text-muted text-sm">{formatDate(vac.date)}</Text>
                      </View>
                    </View>
                  </GlassCard>
                ))}
              </View>
            )}

            {/* Medications Section */}
            <Text className="text-foreground text-lg font-semibold mb-3">
              Medikamente ({medications.length})
            </Text>
            
            {medications.length === 0 ? (
              <GlassCard className="mb-6 items-center py-4">
                <IconSymbol name="pill.fill" size={32} color={colors.muted} />
                <Text className="text-foreground font-medium mt-2">Keine Medikamente</Text>
              </GlassCard>
            ) : (
              <View className="mb-6">
                {medications.map((med) => (
                  <GlassCard key={med.id} className="mb-2">
                    <View className="flex-row items-center">
                      <View className="w-10 h-10 rounded-full bg-warning/20 items-center justify-center mr-3">
                        <IconSymbol name="pill.fill" size={20} color={colors.warning} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-foreground font-semibold">{med.title}</Text>
                        <Text className="text-muted text-sm">{formatDate(med.date)}</Text>
                      </View>
                    </View>
                  </GlassCard>
                ))}
              </View>
            )}

            {/* Disclaimer */}
            <GlassCard className="border-warning/30">
              <View className="flex-row items-start">
                <IconSymbol name="info.circle.fill" size={20} color={colors.warning} />
                <View className="flex-1 ml-3">
                  <Text className="text-foreground font-medium text-sm">Wichtiger Hinweis</Text>
                  <Text className="text-muted text-xs mt-1">
                    Diese Übersicht dient nur zur Dokumentation. Sie ersetzt keine tierärztliche Diagnose oder Behandlung.
                  </Text>
                </View>
              </View>
            </GlassCard>
          </>
        ) : (
          <GlassCard className="items-center py-8">
            <IconSymbol name="pawprint.fill" size={48} color={colors.muted} />
            <Text className="text-foreground font-medium mt-3">Kein Tier ausgewählt</Text>
            <Text className="text-muted text-sm text-center mt-1">
              Füge zuerst ein Haustier hinzu
            </Text>
          </GlassCard>
        )}
      </ScrollView>
    </View>
  );
}
