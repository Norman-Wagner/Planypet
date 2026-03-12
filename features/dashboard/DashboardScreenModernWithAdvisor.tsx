import React, { useMemo, useState } from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { usePetStore } from "@/store/PetStore";
import { AIPetAdvisorModal, AIPetAdvisorButton } from "@/features/ai-advisor/AIPetAdvisorModal";
import { cn } from "@/lib/utils";

export default function DashboardScreenModernWithAdvisor() {
  const store = usePetStore();
  const activePet = store.getActivePet();
  const [advisorOpen, setAdvisorOpen] = useState(false);

  const tasks = useMemo(
    () => (activePet ? store.getTasksForPet(activePet.id).filter((t) => t.status !== "completed") : []),
    [activePet, store]
  );

  const handleTaskAccept = (taskId: string, userName: string) => {
    store.acceptTask(taskId, userName);
  };

  const handleTaskComplete = (taskId: string) => {
    store.completeTask(taskId);
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

  const getTaskColor = (type: string): string => {
    const colors: Record<string, string> = {
      feeding: "from-orange-500 to-red-500",
      walking: "from-green-500 to-emerald-500",
      medication: "from-purple-500 to-pink-500",
      care: "from-blue-500 to-cyan-500",
    };
    return colors[type] || "from-blue-500 to-cyan-500";
  };

  if (!activePet) {
    return (
      <ScreenContainer className="items-center justify-center bg-gradient-to-br from-slate-900 to-blue-950">
        <Text className="text-white text-lg">Kein Tier ausgewählt</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-gradient-to-br from-slate-900 to-blue-950 p-0 relative">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header with gradient */}
        <View className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 pt-6 pb-8">
          <Text className="text-white text-3xl font-bold mb-1">{activePet.name}</Text>
          <Text className="text-blue-100 text-sm">
            {activePet.species.charAt(0).toUpperCase() + activePet.species.slice(1)}
            {activePet.breed ? ` • ${activePet.breed}` : ""}
          </Text>
        </View>

        <View className="px-6 py-6 gap-4">
          {/* Tasks Section */}
          {tasks.length > 0 ? (
            <View className="gap-3">
              <Text className="text-white text-lg font-semibold mb-2">Aufgaben heute</Text>

              {tasks.map((task) => (
                <View
                  key={task.id}
                  className={cn(
                    "rounded-2xl p-4 backdrop-blur-xl border",
                    "bg-white/10 border-white/20",
                    "shadow-lg"
                  )}
                >
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-1">
                      <Text className="text-white font-semibold text-base">
                        {getTaskLabel(task.type)}
                      </Text>
                      <Text className="text-blue-200 text-xs mt-1">
                        Geplant: {task.scheduledTime}
                      </Text>
                    </View>
                    <View
                      className={cn(
                        "rounded-full px-3 py-1",
                        "bg-gradient-to-r",
                        getTaskColor(task.type)
                      )}
                    >
                      <Text className="text-white text-xs font-semibold">
                        {task.status === "accepted" ? "Angenommen" : "Ausstehend"}
                      </Text>
                    </View>
                  </View>

                  {/* Action buttons */}
                  <View className="flex-row gap-2">
                    {task.status === "pending" && (
                      <Pressable
                        onPress={() => handleTaskAccept(task.id, "Norman")}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg py-2.5 items-center"
                      >
                        <Text className="text-white font-semibold text-sm">Ich mache das</Text>
                      </Pressable>
                    )}

                    {task.status === "accepted" && (
                      <Pressable
                        onPress={() => handleTaskComplete(task.id)}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg py-2.5 items-center"
                      >
                        <Text className="text-white font-semibold text-sm">Erledigt</Text>
                      </Pressable>
                    )}
                  </View>

                  {task.assignedTo && (
                    <Text className="text-blue-200 text-xs mt-2">
                      Verantwortlich: {task.assignedTo}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <View className="rounded-2xl p-6 backdrop-blur-xl border bg-white/10 border-white/20 items-center">
              <Text className="text-blue-200 text-center">Keine Aufgaben für heute</Text>
            </View>
          )}

          {/* Quick Actions */}
          <View className="mt-4 gap-3">
            <Text className="text-white text-lg font-semibold">Schnellaktionen</Text>

            <Pressable className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 flex-row items-center justify-between">
              <Text className="text-white font-semibold">Gassi starten</Text>
              <Text className="text-white text-xl">→</Text>
            </Pressable>

            <Pressable className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-4 flex-row items-center justify-between">
              <Text className="text-white font-semibold">QR-Code für verlorenes Tier</Text>
              <Text className="text-white text-xl">→</Text>
            </Pressable>
          </View>

          {/* Recent Activity Preview */}
          {activePet && (
            <View className="mt-4">
              <Text className="text-white text-lg font-semibold mb-3">Letzte Aktivitäten</Text>
              {store.getActivities(activePet.id).slice(-3).map((activity) => (
                <View
                  key={activity.id}
                  className="rounded-xl p-3 backdrop-blur-xl border bg-white/5 border-white/10 mb-2"
                >
                  <Text className="text-white text-sm font-medium">{activity.title}</Text>
                  <Text className="text-blue-300 text-xs mt-1">{activity.description}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* AI Advisor Button */}
      <AIPetAdvisorButton onPress={() => setAdvisorOpen(true)} />

      {/* AI Advisor Modal */}
      <AIPetAdvisorModal isOpen={advisorOpen} onClose={() => setAdvisorOpen(false)} />
    </ScreenContainer>
  );
}
