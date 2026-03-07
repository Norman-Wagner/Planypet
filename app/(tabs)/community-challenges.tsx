import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  completed: boolean;
  progress: number; // 0-100
}

interface UserStatus {
  level: "messing" | "bronze" | "silver" | "gold";
  points: number;
  nextLevelPoints: number;
}

const LEVEL_COLORS = {
  messing: "#A0A0A0",
  bronze: "#CD7F32",
  silver: "#C0C0C0",
  gold: "#FFD700",
};

const LEVEL_LABELS = {
  messing: "Messing",
  bronze: "Bronze",
  silver: "Silber",
  gold: "Gold",
};

export default function CommunityChallengesScreen() {
  const colors = useColors();
  const [userStatus, setUserStatus] = useState<UserStatus>({
    level: "bronze",
    points: 450,
    nextLevelPoints: 1000,
  });

  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: "1",
      title: "Gassi-Abenteurer",
      description: "Gehe 5 verschiedene Routen",
      points: 50,
      icon: "figure.walk",
      completed: false,
      progress: 60,
    },
    {
      id: "2",
      title: "Fütterungs-Meister",
      description: "Füttere dein Tier 30 Tage hintereinander",
      points: 100,
      icon: "fork.knife",
      completed: false,
      progress: 80,
    },
    {
      id: "3",
      title: "Foto-Künstler",
      description: "Teile 10 Fotos deines Tieres",
      points: 75,
      icon: "camera.fill",
      completed: false,
      progress: 40,
    },
    {
      id: "4",
      title: "Chip-Held",
      description: "Registriere deinen Tier-Chip",
      points: 200,
      icon: "checkmark.circle.fill",
      completed: true,
      progress: 100,
    },
    {
      id: "5",
      title: "Gesundheits-Profi",
      description: "Führe 5 Tierarzt-Termine durch",
      points: 150,
      icon: "heart.fill",
      completed: false,
      progress: 20,
    },
    {
      id: "6",
      title: "Sozial-Schmetterling",
      description: "Verbinde dich mit 5 anderen Planypet-Nutzern",
      points: 100,
      icon: "person.2.fill",
      completed: false,
      progress: 0,
    },
  ]);

  const handleCompleteChallenge = (id: string) => {
    const challenge = challenges.find((c) => c.id === id);
    if (!challenge) return;

    if (challenge.completed) {
      Alert.alert("Info", "Diese Challenge ist bereits abgeschlossen");
      return;
    }

    setChallenges(
      challenges.map((c) =>
        c.id === id ? { ...c, completed: true, progress: 100 } : c
      )
    );

    const newPoints = userStatus.points + challenge.points;
    const leveledUp = newPoints >= userStatus.nextLevelPoints;

    setUserStatus({
      ...userStatus,
      points: leveledUp ? newPoints - userStatus.nextLevelPoints : newPoints,
      level: leveledUp
        ? (Object.keys(LEVEL_LABELS)[
            Object.keys(LEVEL_LABELS).indexOf(userStatus.level) + 1
          ] as UserStatus["level"]) || "gold"
        : userStatus.level,
      nextLevelPoints: leveledUp ? userStatus.nextLevelPoints * 1.5 : userStatus.nextLevelPoints,
    });

    Alert.alert(
      "Glückwunsch! 🎉",
      `+${challenge.points} Punkte verdient!\n${leveledUp ? "Level aufgestiegen!" : ""}`
    );
  };

  const progressPercentage = Math.round(
    (userStatus.points / userStatus.nextLevelPoints) * 100
  );

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="pb-6">
        {/* User Status Card */}
        <View className="bg-gradient-to-b from-primary/20 to-primary/5 rounded-lg border border-primary/30 p-4 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-sm text-muted mb-1">Dein Status</Text>
              <View className="flex-row items-center gap-2">
                <Text
                  className="text-3xl font-bold"
                  style={{ color: LEVEL_COLORS[userStatus.level] }}
                >
                  {LEVEL_LABELS[userStatus.level]}
                </Text>
                <IconSymbol
                  name="star.fill"
                  size={24}
                  color={LEVEL_COLORS[userStatus.level]}
                />
              </View>
            </View>
            <View className="items-end">
              <Text className="text-2xl font-bold text-foreground">
                {userStatus.points}
              </Text>
              <Text className="text-xs text-muted">Punkte</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View>
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-xs text-muted">
                Nächstes Level: {userStatus.nextLevelPoints.toFixed(0)} Punkte
              </Text>
              <Text className="text-xs font-semibold text-primary">
                {progressPercentage}%
              </Text>
            </View>
            <View className="h-2 bg-surface rounded-full overflow-hidden">
              <View
                className="h-full bg-primary rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </View>
          </View>
        </View>

        {/* Challenges */}
        <Text className="text-xl font-bold text-foreground mb-3">
          Verfügbare Challenges
        </Text>

        <FlatList
          data={challenges}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              className="bg-surface rounded-lg border border-border p-4 mb-3"
              style={{
                opacity: item.completed ? 0.6 : 1,
              }}
            >
              <View className="flex-row justify-between items-start gap-3 mb-2">
                <View className="flex-1">
                  <View className="flex-row items-center gap-2 mb-1">
                    <IconSymbol
                      name={item.icon as any}
                      size={20}
                      color={colors.primary}
                    />
                    <Text className="text-lg font-semibold text-foreground">
                      {item.title}
                    </Text>
                  </View>
                  <Text className="text-sm text-muted">{item.description}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-lg font-bold text-primary">
                    +{item.points}
                  </Text>
                  <Text className="text-xs text-muted">Punkte</Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View className="mb-3">
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-xs text-muted">Fortschritt</Text>
                  <Text className="text-xs font-semibold text-foreground">
                    {item.progress}%
                  </Text>
                </View>
                <View className="h-2 bg-background rounded-full overflow-hidden">
                  <View
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${item.progress}%` }}
                  />
                </View>
              </View>

              {/* Action Button */}
              <TouchableOpacity
                className={`py-2 rounded-lg items-center ${
                  item.completed
                    ? "bg-success/20"
                    : "bg-primary"
                }`}
                onPress={() => handleCompleteChallenge(item.id)}
                disabled={item.completed}
              >
                <Text
                  className={`font-semibold ${
                    item.completed
                      ? "text-success"
                      : "text-background"
                  }`}
                >
                  {item.completed ? "✓ Abgeschlossen" : "Teilnehmen"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />

        {/* Leaderboard Info */}
        <View className="bg-info/10 border border-info rounded-lg p-4 mt-6">
          <Text className="text-sm text-info font-semibold mb-2">
            ℹ️ Über Challenges
          </Text>
          <Text className="text-xs text-info leading-relaxed">
            Verdiene Punkte durch Challenges und steige in den Rängen auf:
            Messing → Bronze → Silber → Gold. Teile deine Erfolge mit der
            Community!
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
