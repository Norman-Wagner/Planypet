import React, { useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { usePetStore } from "@/store/PetStore";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useRouter } from "expo-router";

interface Task {
  id: string;
  type: "feeding" | "walking" | "medication" | "alert";
  title: string;
  time: string;
  completed: boolean;
  petName: string;
  priority: "high" | "normal" | "low";
  petId: string;
}

export function DashboardScreen() {
  const colors = useColors();
  const router = useRouter();
  const { getAllPets, getActivePet } = usePetStore();

  const pets = getAllPets();
  const activePet = getActivePet();

  // Generate tasks from pet data
  const tasks = useMemo(() => {
    const generatedTasks: Task[] = [];

    pets.forEach((pet) => {
      // Add feeding tasks
      pet.feeding.schedules.forEach((schedule) => {
        generatedTasks.push({
          id: `feeding-${pet.id}-${schedule.id}`,
          type: "feeding",
          title: "Fütterung",
          time: schedule.time,
          completed: false,
          petName: pet.name,
          priority: "high",
          petId: pet.id,
        });
      });

      // Add walking tasks
      pet.walking.schedules.forEach((schedule) => {
        generatedTasks.push({
          id: `walking-${pet.id}-${schedule.id}`,
          type: "walking",
          title: "Gassi gehen",
          time: schedule.time,
          completed: false,
          petName: pet.name,
          priority: "normal",
          petId: pet.id,
        });
      });

      // Add medication alerts
      pet.health.medications.forEach((med) => {
        if (med.endDate && new Date(med.endDate) > new Date()) {
          generatedTasks.push({
            id: `medication-${pet.id}-${med.id}`,
            type: "medication",
            title: `${med.name} (${med.frequency})`,
            time: "Täglich",
            completed: false,
            petName: pet.name,
            priority: "high",
            petId: pet.id,
          });
        }
      });

      // Add vaccination alerts
      pet.health.vaccinations.forEach((vac) => {
        if (vac.expiryDate) {
          const expiryDate = new Date(vac.expiryDate);
          const daysUntilExpiry = Math.floor((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

          if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
            generatedTasks.push({
              id: `vaccination-${pet.id}-${vac.id}`,
              type: "alert",
              title: `${vac.name} fällig in ${daysUntilExpiry} Tagen`,
              time: "Bald",
              completed: false,
              petName: pet.name,
              priority: "high",
              petId: pet.id,
            });
          }
        }
      });
    });

    // Sort by priority and time
    return generatedTasks.sort((a, b) => {
      const priorityOrder = { high: 0, normal: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [pets]);

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "feeding":
        return "fork.knife";
      case "walking":
        return "figure.walk";
      case "medication":
        return "pills";
      case "alert":
        return "exclamationmark.circle";
      default:
        return "checkmark.circle";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return colors.error;
      case "normal":
        return colors.primary;
      case "low":
        return colors.success;
      default:
        return colors.muted;
    }
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="gap-6 p-6">
        {/* Header */}
        <View>
          <Text className="text-3xl font-bold text-foreground">Heute</Text>
          <Text className="text-sm text-muted mt-1">{new Date().toLocaleDateString("de-DE")}</Text>
        </View>

        {/* Quick Stats */}
        {pets.length > 0 && (
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Deine Tiere</Text>
            <FlatList
              data={pets}
              keyExtractor={(pet) => pet.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="p-4 rounded-lg flex-row items-center justify-between"
                  style={{ backgroundColor: colors.surface }}
                  onPress={() => router.push(`/pet-profile/${item.id}` as any)}
                >
                  <View>
                    <Text className="font-semibold text-foreground">{item.name}</Text>
                    <Text className="text-sm text-muted">{item.species}</Text>
                  </View>
                  <View className="px-3 py-1 rounded-full" style={{ backgroundColor: colors.primary }}>
                    <Text className="text-white text-xs font-semibold">{item.breed || "Rasse?"}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Today's Tasks */}
        <View className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-foreground">Aufgaben heute</Text>
            <View className="px-2 py-1 rounded-full" style={{ backgroundColor: colors.primary }}>
              <Text className="text-white text-xs font-semibold">{tasks.length}</Text>
            </View>
          </View>

          {tasks.length === 0 ? (
            <View className="p-6 rounded-lg items-center" style={{ backgroundColor: colors.surface }}>
              <Text className="text-muted text-center">Keine Aufgaben für heute</Text>
            </View>
          ) : (
            <FlatList
              data={tasks}
              keyExtractor={(task) => task.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="p-4 rounded-lg flex-row items-center gap-4 border"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: getPriorityColor(item.priority),
                    borderWidth: 1,
                  }}
                  onPress={() => {
                    if (item.type === "walking") {
                      router.push(`/walk-tracker/${item.petId}` as any);
                    } else if (item.type === "feeding") {
                      router.push(`/feeding-system/${item.petId}` as any);
                    }
                  }}
                >
                  {/* Icon */}
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center"
                    style={{ backgroundColor: getPriorityColor(item.priority) }}
                  >
                    <IconSymbol name={getTaskIcon(item.type) as any} size={24} color="#ffffff" />
                  </View>

                  {/* Content */}
                  <View className="flex-1">
                    <Text className="font-semibold text-foreground">{item.title}</Text>
                    <Text className="text-sm text-muted">{item.petName}</Text>
                  </View>

                  {/* Time & Status */}
                  <View className="items-end gap-1">
                    <Text className="text-sm font-semibold text-foreground">{item.time}</Text>
                    <View
                      className="w-6 h-6 rounded-full border-2"
                      style={{
                        borderColor: getPriorityColor(item.priority),
                        backgroundColor: "transparent",
                      }}
                    />
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>

        {/* Quick Actions */}
        <View className="gap-3">
          <Text className="text-lg font-semibold text-foreground">Schnellaktionen</Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 p-4 rounded-lg items-center"
              style={{ backgroundColor: colors.primary }}
              onPress={() => router.push("/pet-identification" as any)}
            >
              <IconSymbol name="plus.circle" size={24} color="#ffffff" />
              <Text className="text-white text-xs font-semibold mt-2">Tier hinzufügen</Text>
            </TouchableOpacity>
            {activePet && (
              <TouchableOpacity
                className="flex-1 p-4 rounded-lg items-center"
                style={{ backgroundColor: colors.primary }}
                onPress={() => router.push(`/walk-tracker/${activePet.id}` as any)}
              >
                <IconSymbol name="figure.walk" size={24} color="#ffffff" />
                <Text className="text-white text-xs font-semibold mt-2">Gassi starten</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
