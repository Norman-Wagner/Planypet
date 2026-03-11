import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { usePetStore } from "@/features/pets/PetStore";
import { IconSymbol } from "@/components/ui/icon-symbol";

interface Task {
  id: string;
  type: "feeding" | "walking" | "medication" | "alert";
  title: string;
  time: string;
  completed: boolean;
  petName: string;
  priority: "high" | "normal" | "low";
}

export function DashboardScreen() {
  const colors = useColors();
  const { getAllPets } = usePetStore();
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      type: "feeding",
      title: "Fütterung",
      time: "08:00",
      completed: false,
      petName: "Max",
      priority: "high",
    },
    {
      id: "2",
      type: "walking",
      title: "Gassi gehen",
      time: "10:30",
      completed: false,
      petName: "Max",
      priority: "normal",
    },
    {
      id: "3",
      type: "medication",
      title: "Medikament",
      time: "14:00",
      completed: false,
      petName: "Luna",
      priority: "high",
    },
  ]);

  const pets = getAllPets();

  const handleTaskComplete = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task))
    );
  };

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
                <View
                  className="p-4 rounded-lg flex-row items-center justify-between"
                  style={{ backgroundColor: colors.surface }}
                >
                  <View>
                    <Text className="font-semibold text-foreground">{item.name}</Text>
                    <Text className="text-sm text-muted">{item.animalType}</Text>
                  </View>
                  <View className="px-3 py-1 rounded-full" style={{ backgroundColor: colors.primary }}>
                    <Text className="text-white text-xs font-semibold">{item.breed || "Rasse?"}</Text>
                  </View>
                </View>
              )}
            />
          </View>
        )}

        {/* Today's Tasks */}
        <View className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-foreground">Aufgaben heute</Text>
            <View className="px-2 py-1 rounded-full" style={{ backgroundColor: colors.primary }}>
              <Text className="text-white text-xs font-semibold">{tasks.filter((t) => !t.completed).length}</Text>
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
                    backgroundColor: item.completed ? colors.surface : colors.background,
                    borderColor: item.completed ? colors.border : getPriorityColor(item.priority),
                    borderWidth: 1,
                    opacity: item.completed ? 0.6 : 1,
                  }}
                  onPress={() => handleTaskComplete(item.id)}
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
                      className="w-6 h-6 rounded-full border-2 items-center justify-center"
                      style={{
                        borderColor: getPriorityColor(item.priority),
                        backgroundColor: item.completed ? getPriorityColor(item.priority) : "transparent",
                      }}
                    >
                      {item.completed && <Text className="text-white text-xs">✓</Text>}
                    </View>
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
            >
              <IconSymbol name="plus.circle" size={24} color="#ffffff" />
              <Text className="text-white text-xs font-semibold mt-2">Tier hinzufügen</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 p-4 rounded-lg items-center"
              style={{ backgroundColor: colors.primary }}
            >
              <IconSymbol name="figure.walk" size={24} color="#ffffff" />
              <Text className="text-white text-xs font-semibold mt-2">Gassi starten</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
