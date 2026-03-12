import React, { useState, useEffect } from "react";
import { View, Text, Pressable, ActivityIndicator, ScrollView } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { usePetStore } from "@/store/PetStore";
import * as WalkTracker from "@/lib/walk-tracker-service";
import type { WalkSession } from "@/lib/walk-tracker-service";

export default function WalkTrackerScreen() {
  const store = usePetStore();
  const activePet = store.getActivePet();
  const [walkSession, setWalkSession] = useState<WalkSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [updateInterval, setUpdateInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (updateInterval) {
        clearInterval(updateInterval);
      }
    };
  }, [updateInterval]);

  const handleStartWalk = async () => {
    if (!activePet) return;

    setIsLoading(true);
    try {
      const session = await WalkTracker.startWalkSession(activePet.id);
      if (session) {
        setWalkSession(session);

        // Update location every 10 seconds
        const interval = setInterval(() => {
          setWalkSession((prev) => {
            if (!prev) return null;
            // Update duration
            const duration = Math.floor(
              (new Date().getTime() - prev.startTime.getTime()) / 1000
            );
            return { ...prev, duration };
          });
        }, 10000);

        setUpdateInterval(interval as any);
      }
    } catch (error) {
      console.error("Error starting walk:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndWalk = async () => {
    if (!walkSession || !activePet) return;

    setIsLoading(true);
    try {
      const walkEvent = WalkTracker.endWalkSession(walkSession);
      walkEvent.performedBy = "Current User"; // TODO: Get from auth

      // Record walk in pet data
      store.recordWalk(activePet.id, walkEvent);

      // Create activity log entry
      store.addActivity({
        petId: activePet.id,
        type: "walking",
        title: `${walkEvent.performedBy} walked ${activePet.name} ${WalkTracker.formatDistance(walkEvent.distance)}`,
        description: `Duration: ${WalkTracker.formatDuration(walkEvent.duration * 60)}${
          walkEvent.weather
            ? ` • ${walkEvent.weather.temperature}°C ${walkEvent.weather.condition}`
            : ""
        }`,
        timestamp: new Date().toISOString(),
        performedBy: walkEvent.performedBy,
        data: {
          distance: walkEvent.distance,
          duration: walkEvent.duration,
          weather: walkEvent.weather,
        },
      });

      setWalkSession(null);
      if (updateInterval) {
        clearInterval(updateInterval);
        setUpdateInterval(null);
      }
    } catch (error) {
      console.error("Error ending walk:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!activePet) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-gray-600">Kein Tier ausgewählt</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-4">
          <View className="items-center mb-6">
            <Text className="text-3xl font-bold text-foreground">
              🚶 Gassi mit {activePet.name}
            </Text>
          </View>

          {!walkSession ? (
            <Pressable
              onPress={handleStartWalk}
              disabled={isLoading}
              className="bg-blue-500 rounded-lg py-4 px-6 items-center"
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold text-lg">
                  🚀 Gassi starten
                </Text>
              )}
            </Pressable>
          ) : (
            <View className="bg-white rounded-lg p-6 border border-blue-200">
              <View className="mb-6">
                <View className="flex-row justify-between mb-4">
                  <View>
                    <Text className="text-gray-600 text-sm">Distanz</Text>
                    <Text className="text-2xl font-bold text-blue-600">
                      {WalkTracker.formatDistance(walkSession.distance)}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-gray-600 text-sm">Dauer</Text>
                    <Text className="text-2xl font-bold text-blue-600">
                      {WalkTracker.formatDuration(walkSession.duration)}
                    </Text>
                  </View>
                </View>

                {walkSession.weather && (
                  <View className="bg-blue-50 rounded-lg p-3 mb-4">
                    <View className="flex-row items-center justify-between">
                      <View>
                  <Text className="text-gray-700 font-semibold">
                        🌡️ {walkSession.weather.condition}
                      </Text>
                        <Text className="text-gray-600 text-sm">
                          {walkSession.weather.temperature}°C • {walkSession.weather.humidity}% Luftfeuchte
                        </Text>
                      </View>
                      <Text className="text-lg">💨 {walkSession.weather.windSpeed} km/h</Text>
                    </View>
                  </View>
                )}

                <Text className="text-gray-600 text-xs">
                  Route: {walkSession.route.length} Punkte erfasst
                </Text>
              </View>

              <Pressable
                onPress={handleEndWalk}
                disabled={isLoading}
                className="bg-green-500 rounded-lg py-4 px-6 items-center"
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-semibold text-lg">
                    ✓ Gassi beenden
                  </Text>
                )}
              </Pressable>
            </View>
          )}

          {/* Walk History */}
          {activePet.walking.walkHistory.length > 0 && (
            <View className="mt-6">
              <Text className="text-lg font-bold text-foreground mb-3">
                Letzte Gassi-Runden
              </Text>
              {activePet.walking.walkHistory.slice(-5).map((walk) => (
                <View
                  key={walk.id}
                  className="bg-gray-50 rounded-lg p-3 mb-2 border border-gray-200"
                >
                  <View className="flex-row justify-between items-center">
                    <View>
                      <Text className="font-semibold text-gray-800">
                        {WalkTracker.formatDistance(walk.distance)}
                      </Text>
                      <Text className="text-sm text-gray-600">
                        {WalkTracker.formatDuration(walk.duration * 60)}
                      </Text>
                    </View>
                    {walk.weather && (
                      <Text className="text-lg">
                        🌡️ {walk.weather.temperature}°C
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
