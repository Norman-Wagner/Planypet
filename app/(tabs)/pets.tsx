import React from "react";
import { View, Text, ScrollView, TouchableOpacity, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useRouter } from "expo-router";
import { usePetStore } from "@/lib/pet-store";

export default function PetsScreen() {
  const colors = useColors();
  const router = useRouter();
  const { pets } = usePetStore();

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="pb-6">
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground">Meine Tiere</Text>
          <Text className="text-muted">Verwalte deine Haustiere</Text>
        </View>

        {pets.length === 0 ? (
          <View className="items-center justify-center py-12 gap-4">
            <View className="w-20 h-20 bg-primary/20 rounded-full items-center justify-center">
              <IconSymbol name="pawprint.fill" size={40} color={colors.primary} />
            </View>
            <Text className="text-foreground font-semibold">Keine Tiere hinzugefügt</Text>
            <TouchableOpacity
              className="bg-primary rounded-lg py-2 px-6"
              onPress={() => router.push("/pet-setup" as any)}
            >
              <Text className="text-background font-semibold">Haustier hinzufügen</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <FlatList
              data={pets}
              scrollEnabled={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View className="bg-surface rounded-lg border border-border p-4 mb-3">
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <Text className="text-lg font-bold text-foreground">{item.name}</Text>
                      <Text className="text-muted">{(item as any).species || "Haustier"}</Text>
                    </View>
                    <TouchableOpacity className="p-2">
                      <IconSymbol name="ellipsis" size={24} color={colors.muted} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />

            <TouchableOpacity
              className="bg-primary rounded-lg py-3 items-center mt-4"
              onPress={() => router.push("/pet-setup" as any)}
            >
              <View className="flex-row items-center gap-2">
                <IconSymbol name="plus.circle.fill" size={20} color="#ffffff" />
                <Text className="text-background font-semibold">Weiteres Haustier hinzufügen</Text>
              </View>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
