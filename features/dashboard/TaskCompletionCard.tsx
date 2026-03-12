import React, { useState } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { usePetStore } from "@/store/PetStore";
import type { Task } from "@/store/types";

interface TaskCompletionCardProps {
  task: Task;
  petName: string;
  onCompleted?: () => void;
}

export function TaskCompletionCard({
  task,
  petName,
  onCompleted,
}: TaskCompletionCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const store = usePetStore();

  const handleCompleteTask = async () => {
    setIsCompleting(true);
    try {
      store.completeTask(task.id);
      onCompleted?.();
    } catch (error) {
      console.error("Error completing task:", error);
    } finally {
      setIsCompleting(false);
    }
  };

  const getTaskLabel = (type: string): string => {
    const labels: Record<string, string> = {
      feeding: "Fütterung",
      walking: "Gassi",
      medication: "Medikament",
      care: "Pflege",
    };
    return labels[type] || type;
  };

  const getTaskIcon = (type: string): string => {
    const icons: Record<string, string> = {
      feeding: "🍽️",
      walking: "🚶",
      medication: "💊",
      care: "🏥",
    };
    return icons[type] || "✓";
  };

  if (task.status !== "accepted") {
    return null;
  }

  return (
    <View className="bg-white rounded-lg p-4 mb-3 border border-gray-200 shadow-sm">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center flex-1">
          <Text className="text-2xl mr-3">{getTaskIcon(task.type)}</Text>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-gray-600">
              {getTaskLabel(task.type)} für {petName}
            </Text>
            <Text className="text-xs text-gray-500 mt-1">
              Angenommen von {task.assignedTo}
            </Text>
          </View>
        </View>
      </View>

      <Pressable
        onPress={handleCompleteTask}
        disabled={isCompleting}
        className="bg-green-500 rounded-lg py-3 px-4 flex-row items-center justify-center"
      >
        {isCompleting ? (
          <>
            <ActivityIndicator color="white" size="small" />
            <Text className="text-white font-semibold ml-2">
              Wird abgeschlossen...
            </Text>
          </>
        ) : (
          <Text className="text-white font-semibold">
            ✓ {getTaskLabel(task.type)} abgeschlossen
          </Text>
        )}
      </Pressable>
    </View>
  );
}
