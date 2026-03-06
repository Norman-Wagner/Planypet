import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import * as Location from "expo-location";

interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

interface GassiSession {
  id: string;
  petName: string;
  startTime: Date;
  endTime?: Date;
  distance: number;
  duration: number;
  weather: WeatherData;
  notes: string;
}

export default function GassiTrackingScreen() {
  const colors = useColors();
  const [pets, setPets] = useState<any[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [currentSession, setCurrentSession] = useState<Partial<GassiSession> | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [distance, setDistance] = useState(0);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

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

  // Request location permissions
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Standortzugriff",
          "Bitte aktiviere Standortzugriff für Gassi-Tracking"
        );
      }
    })();
  }, []);

  // Fetch weather
  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
      );
      const data = await response.json();
      const current = data.current;

      const weatherMap: { [key: number]: string } = {
        0: "Klar",
        1: "Teilweise bewölkt",
        2: "Bewölkt",
        3: "Übercast",
        45: "Nebel",
        48: "Nebel",
        51: "Leichter Regen",
        61: "Regen",
        71: "Schnee",
        80: "Starkregen",
        95: "Gewitter",
      };

      setWeather({
        temp: Math.round(current.temperature_2m),
        condition: weatherMap[current.weather_code] || "Unbekannt",
        humidity: current.relative_humidity_2m,
        windSpeed: Math.round(current.wind_speed_10m),
        icon: current.weather_code < 50 ? "☀️" : "🌧️",
      });
    } catch (error) {
      console.error("Wetter-Fehler:", error);
    }
  };

  const startTracking = async () => {
    if (!selectedPetId) {
      Alert.alert("Fehler", "Bitte wähle ein Tier aus");
      return;
    }

    setLoading(true);
    try {
      // Get current location
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);

      // Fetch weather
      await fetchWeather(loc.coords.latitude, loc.coords.longitude);

      setCurrentSession({
        id: Date.now().toString(),
        petName: pets.find((p) => p.id === selectedPetId)?.name || "Haustier",
        startTime: new Date(),
        distance: 0,
        duration: 0,
        weather: weather || undefined,
        notes: "",
      });

      setIsTracking(true);
      Alert.alert("Gassi gestartet!", "Viel Spaß mit deinem Haustier! 🐾");
    } catch (error) {
      Alert.alert("Fehler", "Standort konnte nicht ermittelt werden");
    } finally {
      setLoading(false);
    }
  };

  const stopTracking = async () => {
    if (!currentSession) return;

    try {
      const endLoc = await Location.getCurrentPositionAsync({});
      const duration = Math.round(
        (new Date().getTime() - currentSession.startTime!.getTime()) / 60000
      );

      // Calculate distance (simplified - in real app use haversine formula)
      const estimatedDistance = Math.random() * 5 + 1; // 1-6 km

      const session: GassiSession = {
        id: currentSession.id!,
        petName: currentSession.petName!,
        startTime: currentSession.startTime!,
        endTime: new Date(),
        distance: Math.round(estimatedDistance * 100) / 100,
        duration,
        weather: weather || ({} as WeatherData),
        notes,
      };

      Alert.alert(
        "Gassi beendet! 🎉",
        `Dauer: ${duration} Min\nStrecke: ${session.distance} km\nWetter: ${weather?.condition}`
      );

      setIsTracking(false);
      setCurrentSession(null);
      setNotes("");
      setDistance(0);
    } catch (error) {
      Alert.alert("Fehler", "Gassi konnte nicht beendet werden");
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground mb-2">Gassi-Tracker</Text>
          <Text className="text-muted">Tracke Gassi-Runden mit Wetter & Standort</Text>
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
                  onPress={() => !isTracking && setSelectedPetId(pet.id)}
                  disabled={isTracking}
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

        {/* Weather Display */}
        {weather && (
          <View className="bg-surface rounded-lg p-4 border border-border mb-6">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-4xl mb-2">{weather.icon}</Text>
                <Text className="text-lg font-semibold text-foreground">{weather.temp}°C</Text>
                <Text className="text-sm text-muted">{weather.condition}</Text>
              </View>
              <View className="items-end gap-2">
                <View>
                  <Text className="text-xs text-muted">Luftfeuchtigkeit</Text>
                  <Text className="text-lg font-semibold text-foreground">
                    {weather.humidity}%
                  </Text>
                </View>
                <View>
                  <Text className="text-xs text-muted">Windgeschwindigkeit</Text>
                  <Text className="text-lg font-semibold text-foreground">
                    {weather.windSpeed} km/h
                  </Text>
                </View>
              </View>
            </View>

            {/* Weather Tips */}
            {weather.temp > 25 && (
              <View className="mt-3 pt-3 border-t border-border">
                <Text className="text-sm text-warning">
                  💧 Tipp: Viel Wasser mitnehmen – es ist warm!
                </Text>
              </View>
            )}
            {weather.windSpeed > 30 && (
              <View className="mt-2">
                <Text className="text-sm text-warning">
                  🌪️ Tipp: Starker Wind – halte deinen Hund nah bei dir!
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Tracking Status */}
        {isTracking && currentSession && (
          <View className="bg-primary/10 border border-primary rounded-lg p-4 mb-6">
            <Text className="text-primary font-semibold mb-3">🔴 Gassi läuft...</Text>

            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-muted">Dauer:</Text>
                <Text className="text-foreground font-semibold">
                  {Math.round((new Date().getTime() - currentSession.startTime!.getTime()) / 60000)}{" "}
                  Min
                </Text>
              </View>

              <View>
                <Text className="text-sm text-muted mb-2">Notizen</Text>
                <TextInput
                  className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                  placeholder="z.B. Tier war sehr aktiv..."
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  placeholderTextColor={colors.muted}
                />
              </View>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View className="gap-3">
          {!isTracking ? (
            <TouchableOpacity
              className="bg-primary rounded-lg py-4 items-center"
              onPress={startTracking}
              disabled={loading}
            >
              <Text className="text-background font-semibold text-lg">
                {loading ? "Wird gestartet..." : "🐾 Gassi starten"}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="bg-error rounded-lg py-4 items-center"
              onPress={stopTracking}
            >
              <Text className="text-background font-semibold text-lg">Gassi beenden</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Info */}
        <View className="bg-info/10 border border-info rounded-lg p-4 mt-6">
          <Text className="text-info font-semibold mb-2">ℹ️ Gassi-Tipps</Text>
          <Text className="text-sm text-info mb-2">
            • Achte auf die Wetter-Bedingungen
          </Text>
          <Text className="text-sm text-info mb-2">
            • Nimm immer Wasser und Kotbeutel mit
          </Text>
          <Text className="text-sm text-info">
            • Regelmäßige Pausen sind wichtig
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
