import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Switch,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import * as Notifications from "expo-notifications";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function FeedingScheduleScreen() {
  const colors = useColors();
  const [pets, setPets] = useState<any[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    time: "08:00",
    amount: "200g",
    foodType: "Trockenfutter",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // All days
  });

  // Fetch pets
  const { data: petsData } = trpc.pets.list.useQuery();

  useEffect(() => {
    if (petsData) {
      const allPets = [...(petsData.owned || []), ...(petsData.shared || [])];
      setPets(allPets);
      if (allPets.length > 0) {
        setSelectedPetId(allPets[0].id);
      }
    }
  }, [petsData]);

  // Request notification permissions
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Benachrichtigungen",
          "Bitte aktiviere Benachrichtigungen, um Fütterungserinnerungen zu erhalten"
        );
      }
    })();
  }, []);

  const handleAddSchedule = async () => {
    if (!selectedPetId) {
      Alert.alert("Fehler", "Bitte wähle ein Tier aus");
      return;
    }

    try {
      // Schedule local notification
      const [hours, minutes] = formData.time.split(":").map(Number);
      
      // Schedule for each day
      formData.daysOfWeek.forEach((day) => {
        Notifications.scheduleNotificationAsync({
          content: {
            title: "Fütterungszeit!",
            body: `${pets.find((p) => p.id === selectedPetId)?.name} braucht Futter!`,
            sound: "default",
            badge: 1,
          },
          trigger: {
            weekday: day + 1,
            hour: hours,
            minute: minutes,
            repeats: true,
          } as any,
        });
      });

      Alert.alert("Erfolg", "Fütterungsplan wurde erstellt!");
      setShowForm(false);
      setFormData({
        time: "08:00",
        amount: "200g",
        foodType: "Trockenfutter",
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      });
    } catch (error) {
      Alert.alert("Fehler", "Fütterungsplan konnte nicht erstellt werden");
    }
  };

  const toggleDay = (day: number) => {
    setFormData((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter((d) => d !== day)
        : [...prev.daysOfWeek, day],
    }));
  };

  const dayNames = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground mb-2">Fütterungsplan</Text>
          <Text className="text-muted">Erstelle Fütterungserinnerungen für deine Tiere</Text>
        </View>

        {/* Pet Selection */}
        {pets.length > 0 && (
          <View className="mb-6">
            <Text className="text-sm font-semibold text-muted mb-2">Tier auswählen</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
              {pets.map((pet) => (
                <TouchableOpacity
                  key={pet.id}
                  className={`px-4 py-2 rounded-full ${
                    selectedPetId === pet.id
                      ? "bg-primary"
                      : "bg-surface border border-border"
                  }`}
                  onPress={() => setSelectedPetId(pet.id)}
                >
                  <Text
                    className={
                      selectedPetId === pet.id
                        ? "text-background font-semibold"
                        : "text-foreground"
                    }
                  >
                    {pet.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Active Schedules */}
        {schedules.length > 0 && (
          <View className="bg-success/10 border border-success rounded-lg p-4 mb-6">
            <Text className="text-success font-semibold mb-2">✓ Aktive Fütterungspläne</Text>
            {schedules.map((schedule, idx) => (
              <Text key={idx} className="text-sm text-success">
                {schedule.time} - {schedule.amount} {schedule.foodType}
              </Text>
            ))}
          </View>
        )}

        {/* Add Schedule Form */}
        {showForm ? (
          <View className="bg-surface rounded-lg p-4 border border-border mb-6">
            <Text className="text-lg font-semibold text-foreground mb-4">
              Neuer Fütterungsplan
            </Text>

            <View className="gap-4">
              {/* Time */}
              <View>
                <Text className="text-sm text-muted mb-1">Uhrzeit</Text>
                <TextInput
                  className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                  placeholder="HH:MM"
                  value={formData.time}
                  onChangeText={(text) => setFormData({ ...formData, time: text })}
                  placeholderTextColor={colors.muted}
                />
              </View>

              {/* Amount */}
              <View>
                <Text className="text-sm text-muted mb-1">Menge</Text>
                <TextInput
                  className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                  placeholder="z.B. 200g"
                  value={formData.amount}
                  onChangeText={(text) => setFormData({ ...formData, amount: text })}
                  placeholderTextColor={colors.muted}
                />
              </View>

              {/* Food Type */}
              <View>
                <Text className="text-sm text-muted mb-1">Futtertyp</Text>
                <TextInput
                  className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                  placeholder="z.B. Trockenfutter"
                  value={formData.foodType}
                  onChangeText={(text) => setFormData({ ...formData, foodType: text })}
                  placeholderTextColor={colors.muted}
                />
              </View>

              {/* Days of Week */}
              <View>
                <Text className="text-sm text-muted mb-2">Wochentage</Text>
                <View className="flex-row gap-1 flex-wrap">
                  {dayNames.map((day, idx) => (
                    <TouchableOpacity
                      key={idx}
                      className={`w-12 h-12 rounded-lg items-center justify-center ${
                        formData.daysOfWeek.includes(idx)
                          ? "bg-primary"
                          : "bg-background border border-border"
                      }`}
                      onPress={() => toggleDay(idx)}
                    >
                      <Text
                        className={
                          formData.daysOfWeek.includes(idx)
                            ? "text-background font-semibold"
                            : "text-foreground"
                        }
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Buttons */}
              <View className="flex-row gap-2 mt-4">
                <TouchableOpacity
                  className="flex-1 bg-primary rounded-lg py-3 items-center"
                  onPress={handleAddSchedule}
                >
                  <Text className="text-background font-semibold">Speichern</Text>
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
            <Text className="text-background font-semibold text-lg">
              + Fütterungsplan hinzufügen
            </Text>
          </TouchableOpacity>
        )}

        {/* Info */}
        <View className="bg-info/10 border border-info rounded-lg p-4 mt-6">
          <Text className="text-info font-semibold mb-2">ℹ️ Benachrichtigungen</Text>
          <Text className="text-sm text-info">
            Du erhältst täglich eine Benachrichtigung zur eingestellten Uhrzeit.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
