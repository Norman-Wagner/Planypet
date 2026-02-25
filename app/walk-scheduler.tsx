import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Alert, ActivityIndicator, Platform, Linking } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { usePetStore } from '@/lib/pet-store';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WalkSuggestion {
  id: string;
  time: string;
  duration: number;
  distance: number;
  weatherCondition: string;
  temperature: number;
  weatherIcon: string;
  routeName: string;
  routeDescription: string;
  difficulty: 'easy' | 'moderate' | 'hard';
  score: number; // 0-100, higher is better
}

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

const ROUTE_SUGGESTIONS = [
  {
    name: 'Parkrunde',
    description: 'Entspannte Runde durch den Park',
    distance: 2,
    duration: 20,
    difficulty: 'easy' as const,
  },
  {
    name: 'Waldweg',
    description: 'Naturnaher Spaziergang im Wald',
    distance: 4,
    duration: 40,
    difficulty: 'moderate' as const,
  },
  {
    name: 'Seeufer',
    description: 'Schöner Weg am Wasser entlang',
    distance: 5,
    duration: 45,
    difficulty: 'moderate' as const,
  },
  {
    name: 'Bergpfad',
    description: 'Anspruchsvoller Aufstieg mit Aussicht',
    distance: 6,
    duration: 60,
    difficulty: 'hard' as const,
  },
  {
    name: 'Stadtrunde',
    description: 'Urbaner Spaziergang durch die Stadt',
    distance: 3,
    duration: 30,
    difficulty: 'easy' as const,
  },
];

const WALK_TIMES = [
  { time: '08:00', label: 'Früh morgens' },
  { time: '10:00', label: 'Vormittags' },
  { time: '14:00', label: 'Nachmittags' },
  { time: '17:00', label: 'Spätnachmittags' },
  { time: '19:00', label: 'Abends' },
];

export default function WalkSchedulerScreen() {
  const colors = useColors();
  const { pets } = usePetStore();
  const [selectedPet, setSelectedPet] = useState(pets[0]?.id || '');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [suggestions, setSuggestions] = useState<WalkSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<WalkSuggestion | null>(null);

  useEffect(() => {
    generateSuggestions();
  }, []);

  const fetchWeather = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Fehler', 'Standortzugriff erforderlich für Wetter');
        return null;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Simulate weather API call (in production: use real weather API)
      const mockWeather: WeatherData = {
        temperature: Math.round(Math.random() * 15 + 10),
        condition: ['Sonnig', 'Bewölkt', 'Regnerisch'][Math.floor(Math.random() * 3)],
        humidity: Math.round(Math.random() * 40 + 40),
        windSpeed: Math.round(Math.random() * 20),
        icon: ['☀️', '☁️', '🌧️'][Math.floor(Math.random() * 3)],
      };

      setWeather(mockWeather);
      return mockWeather;
    } catch (error) {
      console.error('Weather fetch error:', error);
      return null;
    }
  };

  const calculateScore = (weather: WeatherData, time: string, route: typeof ROUTE_SUGGESTIONS[0]) => {
    let score = 50;

    // Temperature scoring
    if (weather.temperature >= 15 && weather.temperature <= 25) score += 20;
    else if (weather.temperature >= 10 && weather.temperature <= 28) score += 10;

    // Weather condition scoring
    if (weather.condition === 'Sonnig') score += 15;
    else if (weather.condition === 'Bewölkt') score += 5;
    else score -= 10;

    // Time scoring (avoid midday heat)
    if (time === '08:00' || time === '19:00') score += 10;
    else if (time === '10:00' || time === '17:00') score += 5;

    // Route difficulty scoring (prefer moderate)
    if (route.difficulty === 'moderate') score += 5;

    return Math.min(100, Math.max(0, score));
  };

  const generateSuggestions = async () => {
    setIsLoading(true);
    try {
      const weatherData = await fetchWeather();
      if (!weatherData) {
        Alert.alert('Fehler', 'Wetterdaten konnten nicht abgerufen werden');
        setIsLoading(false);
        return;
      }

      const newSuggestions: WalkSuggestion[] = [];

      WALK_TIMES.forEach(({ time }) => {
        ROUTE_SUGGESTIONS.forEach((route) => {
          const score = calculateScore(weatherData, time, route);

          newSuggestions.push({
            id: `${time}-${route.name}`,
            time,
            duration: route.duration,
            distance: route.distance,
            weatherCondition: weatherData.condition,
            temperature: weatherData.temperature,
            weatherIcon: weatherData.icon,
            routeName: route.name,
            routeDescription: route.description,
            difficulty: route.difficulty,
            score,
          });
        });
      });

      // Sort by score (best first)
      newSuggestions.sort((a, b) => b.score - a.score);
      setSuggestions(newSuggestions.slice(0, 5)); // Top 5 suggestions
    } catch (error) {
      Alert.alert('Fehler', 'Vorschläge konnten nicht generiert werden');
    } finally {
      setIsLoading(false);
    }
  };

  const openWeatherApp = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('weather://');
    } else {
      // Android: Open Google Weather or default weather app
      Linking.openURL('https://weather.google.com/');
    }
  };

  const scheduleWalk = async (suggestion: WalkSuggestion) => {
    try {
      const walks = await AsyncStorage.getItem('scheduledWalks');
      const existing = walks ? JSON.parse(walks) : [];

      const newWalk = {
        id: Date.now().toString(),
        petId: selectedPet,
        scheduledTime: suggestion.time,
        duration: suggestion.duration,
        distance: suggestion.distance,
        routeName: suggestion.routeName,
        weather: {
          condition: suggestion.weatherCondition,
          temperature: suggestion.temperature,
        },
        createdAt: new Date().toISOString(),
        completed: false,
      };

      const updated = [...existing, newWalk];
      await AsyncStorage.setItem('scheduledWalks', JSON.stringify(updated));

      Alert.alert(
        'Erfolg',
        `Gassi um ${suggestion.time} Uhr geplant!\n\n${suggestion.routeName}\n${suggestion.distance} km, ${suggestion.duration} Min.`
      );

      setSelectedSuggestion(null);
    } catch (error) {
      Alert.alert('Fehler', 'Gassi konnte nicht geplant werden');
    }
  };

  return (
    <ScreenContainer className="p-6 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Gassi-Planung</Text>
            <Text className="text-base text-muted">Intelligente Vorschläge basierend auf Wetter</Text>
          </View>

          {/* Pet Selector */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Tier auswählen</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
              {pets.map(pet => (
                <Pressable
                  key={pet.id}
                  onPress={() => setSelectedPet(pet.id)}
                  className={`px-4 py-2 rounded-full ${selectedPet === pet.id ? 'bg-primary' : 'bg-surface'}`}
                >
                  <Text className={selectedPet === pet.id ? 'text-background font-bold' : 'text-foreground'}>
                    {pet.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Current Weather */}
          {weather && (
            <Pressable
              onPress={openWeatherApp}
              className="bg-surface rounded-2xl p-6 gap-3 border border-primary"
            >
              <View className="flex-row justify-between items-center">
                <View className="gap-2">
                  <Text className="text-4xl">{weather.icon}</Text>
                  <Text className="text-lg font-bold text-foreground">{weather.condition}</Text>
                  <Text className="text-2xl font-bold text-primary">{weather.temperature}°C</Text>
                </View>
                <View className="gap-2 items-end">
                  <Text className="text-sm text-muted">Luftfeuchtigkeit: {weather.humidity}%</Text>
                  <Text className="text-sm text-muted">Wind: {weather.windSpeed} km/h</Text>
                  <Text className="text-xs text-muted mt-2">Tippe für mehr Details</Text>
                </View>
              </View>
            </Pressable>
          )}

          {/* Refresh Button */}
          <Pressable
            onPress={generateSuggestions}
            disabled={isLoading}
            className="bg-primary rounded-lg p-3 items-center"
          >
            {isLoading ? (
              <ActivityIndicator color="#0A0A0F" />
            ) : (
              <Text className="text-background font-bold">Vorschläge aktualisieren</Text>
            )}
          </Pressable>

          {/* Suggestions */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">Beste Zeiten für Gassi</Text>
            {suggestions.map((suggestion, idx) => (
              <Pressable
                key={suggestion.id}
                onPress={() => setSelectedSuggestion(suggestion)}
                className={`rounded-xl p-4 gap-3 border ${
                  idx === 0 ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                {/* Header */}
                <View className="flex-row justify-between items-start">
                  <View className="flex-1 gap-1">
                    <Text className="text-lg font-bold text-foreground">{suggestion.time} Uhr</Text>
                    <Text className="text-sm font-semibold text-primary">{suggestion.routeName}</Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-2xl font-bold text-primary">{suggestion.score}</Text>
                    <Text className="text-xs text-muted">Punkte</Text>
                  </View>
                </View>

                {/* Details */}
                <View className="flex-row gap-4 text-sm">
                  <View className="gap-1">
                    <Text className="text-xs text-muted">Distanz</Text>
                    <Text className="font-semibold text-foreground">{suggestion.distance} km</Text>
                  </View>
                  <View className="gap-1">
                    <Text className="text-xs text-muted">Dauer</Text>
                    <Text className="font-semibold text-foreground">{suggestion.duration} Min</Text>
                  </View>
                  <View className="gap-1">
                    <Text className="text-xs text-muted">Wetter</Text>
                    <Text className="font-semibold text-foreground">{suggestion.weatherIcon} {suggestion.temperature}°C</Text>
                  </View>
                </View>

                {/* Description */}
                <Text className="text-sm text-muted">{suggestion.routeDescription}</Text>

                {/* Schedule Button */}
                <Pressable
                  onPress={() => scheduleWalk(suggestion)}
                  className="bg-primary rounded-lg p-2 items-center mt-2"
                >
                  <Text className="text-background font-bold text-sm">Diese Zeit planen</Text>
                </Pressable>
              </Pressable>
            ))}
          </View>

          {/* Info */}
          <View className="bg-surface rounded-xl p-4 gap-2">
            <Text className="text-sm font-semibold text-foreground">ℹ️ Hinweis</Text>
            <Text className="text-xs text-muted">
              Die Vorschläge basieren auf aktuellem Wetter, Tageszeit und Routenschwierigkeit. Tippe auf das Wetter-Widget, um die Wetter-App zu öffnen.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
