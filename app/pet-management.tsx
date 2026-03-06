import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { useRouter } from "expo-router";

export default function PetManagementScreen() {
  const colors = useColors();
  const router = useRouter();
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "dog",
    breed: "",
    birthDate: "",
    weight: "",
  });

  // Fetch pets
  const { data: petsData, isLoading: petsLoading } = trpc.pets.list.useQuery();

  useEffect(() => {
    if (petsData) {
      setPets([...(petsData.owned || []), ...(petsData.shared || [])]);
      setLoading(false);
    }
  }, [petsData]);

  // Create pet mutation
  const createPetMutation = trpc.pets.create.useMutation({
    onSuccess: () => {
      Alert.alert("Erfolg", "Tier wurde erfolgreich hinzugefügt!");
      setFormData({ name: "", type: "dog", breed: "", birthDate: "", weight: "" });
      setShowForm(false);
      // Refresh pets list
      setTimeout(() => {
        window.location.reload();
      }, 500);
    },
    onError: (error) => {
      Alert.alert("Fehler", error.message);
    },
  });

  const handleAddPet = () => {
    if (!formData.name) {
      Alert.alert("Fehler", "Bitte gib einen Namen ein");
      return;
    }

    createPetMutation.mutate({
      name: formData.name,
      type: formData.type,
      breed: formData.breed || undefined,
      birthDate: formData.birthDate || undefined,
      weight: formData.weight || undefined,
    });
  };

  if (loading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground mb-2">Meine Tiere</Text>
          <Text className="text-muted">Verwalte deine Haustiere und ihre Daten</Text>
        </View>

        {/* Pets List */}
        {pets.length > 0 ? (
          <View className="gap-3 mb-6">
            {pets.map((pet) => (
              <TouchableOpacity
                key={pet.id}
                className="bg-surface rounded-lg p-4 border border-border"
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-foreground">{pet.name}</Text>
                    <Text className="text-sm text-muted">
                      {pet.type} {pet.breed ? `• ${pet.breed}` : ""}
                    </Text>
                    {pet.microchipId && (
                      <Text className="text-xs text-success mt-1">✓ Chip registriert</Text>
                    )}
                  </View>
                  <Text className="text-2xl">
                    {pet.type === "dog"
                      ? "🐕"
                      : pet.type === "cat"
                        ? "🐈"
                        : pet.type === "bird"
                          ? "🦜"
                          : "🐾"}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View className="bg-surface rounded-lg p-6 mb-6 items-center">
            <Text className="text-4xl mb-3">🐾</Text>
            <Text className="text-lg font-semibold text-foreground mb-2">Noch keine Tiere</Text>
            <Text className="text-muted text-center">
              Füge dein erstes Haustier hinzu, um zu beginnen
            </Text>
          </View>
        )}

        {/* Add Pet Form */}
        {showForm ? (
          <View className="bg-surface rounded-lg p-4 border border-border">
            <Text className="text-lg font-semibold text-foreground mb-4">Neues Tier hinzufügen</Text>

            <View className="gap-3">
              <View>
                <Text className="text-sm text-muted mb-1">Name *</Text>
                <TextInput
                  className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                  placeholder="z.B. Max"
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  placeholderTextColor={colors.muted}
                />
              </View>

              <View>
                <Text className="text-sm text-muted mb-1">Tierart</Text>
                <View className="flex-row gap-2">
                  {["dog", "cat", "bird", "reptile", "small_mammal"].map((type) => (
                    <TouchableOpacity
                      key={type}
                      className={`flex-1 py-2 rounded-lg items-center ${
                        formData.type === type
                          ? "bg-primary"
                          : "bg-background border border-border"
                      }`}
                      onPress={() => setFormData({ ...formData, type })}
                    >
                      <Text
                        className={
                          formData.type === type ? "text-background font-semibold" : "text-foreground"
                        }
                      >
                        {type === "dog"
                          ? "🐕"
                          : type === "cat"
                            ? "🐈"
                            : type === "bird"
                              ? "🦜"
                              : type === "reptile"
                                ? "🐢"
                                : "🐹"}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View>
                <Text className="text-sm text-muted mb-1">Rasse</Text>
                <TextInput
                  className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                  placeholder="z.B. Labrador"
                  value={formData.breed}
                  onChangeText={(text) => setFormData({ ...formData, breed: text })}
                  placeholderTextColor={colors.muted}
                />
              </View>

              <View>
                <Text className="text-sm text-muted mb-1">Geburtsdatum</Text>
                <TextInput
                  className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                  placeholder="YYYY-MM-DD"
                  value={formData.birthDate}
                  onChangeText={(text) => setFormData({ ...formData, birthDate: text })}
                  placeholderTextColor={colors.muted}
                />
              </View>

              <View>
                <Text className="text-sm text-muted mb-1">Gewicht</Text>
                <TextInput
                  className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                  placeholder="z.B. 25kg"
                  value={formData.weight}
                  onChangeText={(text) => setFormData({ ...formData, weight: text })}
                  placeholderTextColor={colors.muted}
                />
              </View>

              <View className="flex-row gap-2 mt-2">
                <TouchableOpacity
                  className="flex-1 bg-primary rounded-lg py-3 items-center"
                  onPress={handleAddPet}
                  disabled={createPetMutation.isPending}
                >
                  <Text className="text-background font-semibold">
                    {createPetMutation.isPending ? "Wird gespeichert..." : "Speichern"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 bg-surface border border-border rounded-lg py-3 items-center"
                  onPress={() => setShowForm(false)}
                >
                  <Text className="text-foreground font-semibold">Abbrechen</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            className="bg-primary rounded-lg py-4 items-center"
            onPress={() => setShowForm(true)}
          >
            <Text className="text-background font-semibold text-lg">+ Neues Tier hinzufügen</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
