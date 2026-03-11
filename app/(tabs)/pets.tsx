import React from "react";
import { View, Text, ScrollView, TouchableOpacity, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { usePetStore } from "@/features/pets/PetStore";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useRouter } from "expo-router";

export default function PetsScreen() {
  const colors = useColors();
  const { getAllPets, addPet } = usePetStore();
  const router = useRouter();
  const pets = getAllPets();

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="gap-6 p-6">
        {/* Header */}
        <View>
          <Text className="text-3xl font-bold text-foreground">Meine Tiere</Text>
          <Text className="text-sm text-muted mt-1">{pets.length} Tier(e)</Text>
        </View>

        {/* Pet List */}
        {pets.length === 0 ? (
          <View className="flex-1 items-center justify-center gap-4">
            <View
              className="w-20 h-20 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.primary }}
            >
              <IconSymbol name="pawprint.fill" size={40} color="#ffffff" />
            </View>
            <Text className="text-lg font-semibold text-foreground">Keine Tiere hinzugefügt</Text>
            <Text className="text-sm text-muted text-center">Füge dein erstes Haustier hinzu, um zu beginnen</Text>
            <TouchableOpacity
              className="px-6 py-3 rounded-lg mt-4"
              style={{ backgroundColor: colors.primary }}
              onPress={() => router.push("/pet-identification" as any)}
            >
              <Text className="text-white font-semibold">Tier hinzufügen</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={pets}
            keyExtractor={(pet) => pet.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="p-4 rounded-lg border gap-3 flex-row items-center"
                style={{ backgroundColor: colors.surface, borderColor: colors.border }}
              >
                <View
                  className="w-12 h-12 rounded-full items-center justify-center"
                  style={{ backgroundColor: colors.primary }}
                >
                  <IconSymbol name="pawprint.fill" size={24} color="#ffffff" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-foreground">{item.name}</Text>
                  <Text className="text-sm text-muted">{item.animalType}</Text>
                </View>
                <IconSymbol name="chevron.right" size={20} color={colors.muted} />
              </TouchableOpacity>
            )}
          />
        )}

        {/* Add Pet Button */}
        <TouchableOpacity
          className="p-4 rounded-lg items-center flex-row justify-center gap-2 mt-4"
          style={{ backgroundColor: colors.primary }}
          onPress={() => router.push("/pet-identification" as any)}
        >
          <IconSymbol name="plus.circle" size={20} color="#ffffff" />
          <Text className="text-white font-semibold">Neues Tier hinzufügen</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}
