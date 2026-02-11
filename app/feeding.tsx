import { useState } from "react";
import { ScrollView, Text, View, Pressable, TextInput, StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { PetAvatar } from "@/components/ui/pet-avatar";
import { usePetStore, Pet } from "@/lib/pet-store";

const COLORS = {
  background: "#0A0A0F",
  gold: "#D4A843",
  card: "#141418",
  cardBorder: "rgba(212, 168, 67, 0.08)",
  textPrimary: "#FAFAF8",
  textSecondary: "#8B8B80",
  textMuted: "#6B6B6B",
  textDimmer: "#4A4A4A",
};

export default function FeedingScreen() {
  const insets = useSafeAreaInsets();
  const { pets, addFeeding, feedings, completeFeeding } = usePetStore();

  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [foodType, setFoodType] = useState("");
  const [amount, setAmount] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddFeeding = () => {
    if (!selectedPet || !foodType) return;

    addFeeding({
      petId: selectedPet.id,
      time: new Date().toISOString(),
      food: foodType,
      amount: amount || "1 Portion",
      completed: false,
    });

    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    setSelectedPet(null);
    setFoodType("");
    setAmount("");
    setShowAddForm(false);
  };

  const handleCompleteFeeding = (id: string) => {
    completeFeeding(id);
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const pendingFeedings = feedings.filter((f) => !f.completed);
  const completedToday = feedings.filter(
    (f) => f.completed && new Date(f.completedAt || "").toDateString() === new Date().toDateString()
  );

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
            style={({ pressed }) => [styles.backButton, { opacity: pressed ? 0.7 : 1 }]}
          >
            <IconSymbol name="chevron.left" size={24} color={COLORS.gold} />
          </Pressable>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Fütterung</Text>
            <Text style={styles.headerSubtitle}>Fütterungszeiten verwalten</Text>
          </View>
        </View>
        <View style={styles.divider} />

        {/* Quick Feed Buttons */}
        <Text style={styles.sectionTitle}>Schnell füttern</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.quickFeedScrollView}
          contentContainerStyle={{ gap: 12 }}
        >
          {pets.map((pet) => (
            <Pressable
              key={pet.id}
              onPress={() => {
                setSelectedPet(pet);
                setShowAddForm(true);
              }}
              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] })}
            >
              <View style={styles.quickFeedCard}>
                <PetAvatar name={pet.name} type={pet.type} size="lg" />
                <Text style={styles.quickFeedPetName} numberOfLines={1}>
                  {pet.name}
                </Text>
                <Text style={styles.quickFeedActionText}>Füttern</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {/* Add Feeding Form */}
        {showAddForm && selectedPet && (
          <View style={styles.card}>
            <View style={styles.addFormHeader}>
              <PetAvatar name={selectedPet.name} type={selectedPet.type} size="md" />
              <Text style={styles.addFormTitle}>{selectedPet.name} füttern</Text>
            </View>

            <Text style={styles.inputLabel}>Futterart</Text>
            <View style={styles.foodTypeContainer}>
              {["Nassfutter", "Trockenfutter", "Leckerli", "Wasser"].map((type) => (
                <Pressable
                  key={type}
                  onPress={() => setFoodType(type)}
                  style={({ pressed }) => [styles.foodTypeButton, foodType === type && styles.foodTypeButtonActive, { opacity: pressed ? 0.7 : 1 }]}
                >
                  <Text style={[styles.foodTypeText, foodType === type && styles.foodTypeTextActive]}>
                    {type}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.inputLabel}>Menge (optional)</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="z.B. 150g oder 1 Portion"
              placeholderTextColor={COLORS.textMuted}
              style={styles.textInput}
            />

            <View style={styles.formButtonsContainer}>
              <Pressable
                onPress={() => {
                  setShowAddForm(false);
                  setSelectedPet(null);
                }}
                style={({ pressed }) => [styles.formButton, styles.cancelButton, { opacity: pressed ? 0.7 : 1 }]}
              >
                <Text style={styles.cancelButtonText}>Abbrechen</Text>
              </Pressable>
              <Pressable
                onPress={handleAddFeeding}
                disabled={!foodType}
                style={({ pressed }) => [styles.formButton, styles.saveButton, { opacity: !foodType || pressed ? 0.5 : 1 }]}
              >
                <Text style={styles.saveButtonText}>Speichern</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Pending Feedings */}
        <Text style={styles.sectionTitle}>Anstehende Fütterungen</Text>

        {pendingFeedings.length === 0 ? (
          <View style={[styles.card, styles.emptyStateCard]}>
            <IconSymbol name="checkmark.circle.fill" size={40} color={COLORS.gold} />
            <Text style={styles.emptyStateText}>Alle gefüttert!</Text>
            <Text style={styles.emptyStateSubtext}>Keine ausstehenden Fütterungen</Text>
          </View>
        ) : (
          pendingFeedings.map((feeding) => {
            const pet = pets.find((p) => p.id === feeding.petId);
            return (
              <View key={feeding.id} style={styles.card}>
                <View style={styles.feedingItemContainer}>
                  {pet && <PetAvatar name={pet.name} type={pet.type} size="md" />}
                  <View style={styles.feedingItemDetails}>
                    <Text style={styles.petName}>{pet?.name || "Tier"}</Text>
                    <Text style={styles.feedingInfo}>{feeding.food} • {feeding.amount}</Text>
                  </View>
                  <Pressable
                    onPress={() => handleCompleteFeeding(feeding.id)}
                    style={({ pressed }) => [styles.completeButton, { opacity: pressed ? 0.7 : 1 }]}
                  >
                    <Text style={styles.completeButtonText}>Erledigt</Text>
                  </Pressable>
                </View>
              </View>
            );
          })
        )}

        {/* Today's Completed */}
        {completedToday.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Heute erledigt</Text>
            {completedToday.map((feeding) => {
              const pet = pets.find((p) => p.id === feeding.petId);
              return (
                <View key={feeding.id} style={[styles.card, { opacity: 0.7 }]}>
                  <View style={styles.feedingItemContainer}>
                    {pet && <PetAvatar name={pet.name} type={pet.type} size="md" />}
                    <View style={styles.feedingItemDetails}>
                      <Text style={styles.petName}>{pet?.name || "Tier"}</Text>
                      <Text style={styles.feedingInfo}>{feeding.food} • {feeding.amount}</Text>
                    </View>
                    <IconSymbol name="checkmark.circle.fill" size={24} color={COLORS.gold} />
                  </View>
                </View>
              );
            })}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(212, 168, 67, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: "300",
    letterSpacing: 2,
  },
  headerSubtitle: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: COLORS.gold,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.gold,
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  quickFeedScrollView: {
    marginBottom: 24,
  },
  quickFeedCard: {
    width: 112,
    alignItems: "center",
    paddingVertical: 16,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  quickFeedPetName: {
    color: COLORS.textPrimary,
    fontWeight: "500",
    marginTop: 8,
  },
  quickFeedActionText: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 16,
    marginBottom: 12,
  },
  addFormHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  addFormTitle: {
    color: COLORS.textPrimary,
    fontWeight: "600",
    fontSize: 18,
    marginLeft: 12,
  },
  inputLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 8,
  },
  foodTypeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  foodTypeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.textDimmer,
  },
  foodTypeButtonActive: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
  },
  foodTypeText: {
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  foodTypeTextActive: {
    color: COLORS.background,
  },
  textInput: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.textDimmer,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: COLORS.textPrimary,
    marginBottom: 16,
    fontSize: 16,
  },
  formButtonsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  formButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: COLORS.textDimmer,
  },
  cancelButtonText: {
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: COLORS.gold,
  },
  saveButtonText: {
    color: COLORS.background,
    fontWeight: "600",
  },
  emptyStateCard: {
    alignItems: "center",
    paddingVertical: 24,
  },
  emptyStateText: {
    color: COLORS.textPrimary,
    fontWeight: "500",
    marginTop: 8,
  },
  emptyStateSubtext: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  feedingItemContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  feedingItemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  petName: {
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  feedingInfo: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  completeButton: {
    backgroundColor: "rgba(212, 168, 67, 0.15)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  completeButtonText: {
    color: COLORS.gold,
    fontWeight: "600",
  },
});
