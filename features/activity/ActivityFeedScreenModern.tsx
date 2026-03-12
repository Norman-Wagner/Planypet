import React, { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { usePetStore } from "@/store/PetStore";
import { cn } from "@/lib/utils";

export default function ActivityFeedScreenModern() {
  const store = usePetStore();
  const activePet = store.getActivePet();

  const activities = useMemo(
    () => (activePet ? store.getActivities(activePet.id).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ) : []),
    [activePet, store]
  );

  const getActivityColor = (type: string): string => {
    const colors: Record<string, string> = {
      feeding: "from-orange-500/20 to-red-500/20 border-orange-500/30",
      walking: "from-green-500/20 to-emerald-500/20 border-green-500/30",
      medication: "from-purple-500/20 to-pink-500/20 border-purple-500/30",
      care: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
      task_accepted: "from-yellow-500/20 to-amber-500/20 border-yellow-500/30",
      task_completed: "from-green-500/20 to-emerald-500/20 border-green-500/30",
      alert: "from-red-500/20 to-pink-500/20 border-red-500/30",
      vaccination: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
    };
    return colors[type] || "from-slate-500/20 to-slate-600/20 border-slate-500/30";
  };

  const getActivityIcon = (type: string): string => {
    const icons: Record<string, string> = {
      feeding: "●",
      walking: "●",
      medication: "●",
      care: "●",
      task_accepted: "✓",
      task_completed: "✓",
      alert: "!",
      vaccination: "✓",
    };
    return icons[type] || "•";
  };

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Gerade eben";
    if (diffMins < 60) return `vor ${diffMins}m`;
    if (diffHours < 24) return `vor ${diffHours}h`;
    if (diffDays < 7) return `vor ${diffDays}d`;

    return date.toLocaleDateString("de-DE");
  };

  if (!activePet) {
    return (
      <ScreenContainer className="items-center justify-center bg-gradient-to-br from-slate-900 to-blue-950">
        <Text className="text-white text-lg">Kein Tier ausgewählt</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-gradient-to-br from-slate-900 to-blue-950 p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 pt-6 pb-8">
          <Text className="text-white text-3xl font-bold">Aktivitäten</Text>
          <Text className="text-blue-100 text-sm mt-1">{activePet.name}</Text>
        </View>

        <View className="px-6 py-6">
          {activities.length > 0 ? (
            <View className="gap-3">
              {activities.map((activity) => (
                <View
                  key={activity.id}
                  className={cn(
                    "rounded-2xl p-4 backdrop-blur-xl border",
                    "bg-white/5",
                    getActivityColor(activity.type)
                  )}
                >
                  <View className="flex-row items-start gap-3">
                    {/* Activity Icon */}
                    <View className="w-8 h-8 rounded-full bg-white/10 items-center justify-center mt-0.5">
                      <Text className="text-white text-xs font-bold">
                        {getActivityIcon(activity.type)}
                      </Text>
                    </View>

                    {/* Activity Content */}
                    <View className="flex-1">
                      <Text className="text-white font-semibold text-base leading-snug">
                        {activity.title}
                      </Text>
                      {activity.description && (
                        <Text className="text-blue-200 text-xs mt-1.5 leading-relaxed">
                          {activity.description}
                        </Text>
                      )}
                      <View className="flex-row items-center gap-2 mt-2">
                        <Text className="text-blue-300 text-xs">
                          {activity.performedBy}
                        </Text>
                        <Text className="text-blue-400 text-xs">
                          {formatTime(activity.timestamp)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className="rounded-2xl p-8 backdrop-blur-xl border bg-white/5 border-white/10 items-center">
              <Text className="text-blue-200 text-center text-base">
                Noch keine Aktivitäten für {activePet.name}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
