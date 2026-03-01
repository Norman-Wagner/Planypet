import { ScrollView, View, Text, Pressable, Switch, ActivityIndicator } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { PremiumFeatureCard } from '@/components/premium-feature-card';
import { LiabilityDisclaimer, DISCLAIMERS } from '@/components/liability-disclaimer';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { hybridWeatherService } from '@/lib/weather-service-hybrid';

/**
 * WEATHER ADVISOR SCREEN v2
 * - iOS: WeatherKit (native)
 * - Android: OpenWeatherMap
 * - Real-time weather with pet tolerance
 * - Walk recommendations
 * - Rain/Snow warnings
 */

export default function WeatherAdvisorV2Screen() {
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [rainNextHours, setRainNextHours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<any>(null);
  const [petPreferences, setPetPreferences] = useState({
    rainTolerance: 40,
    snowTolerance: 60,
    minTemp: 5,
    maxTemp: 25,
  });
  const [recommendation, setRecommendation] = useState<any>(null);

  useEffect(() => {
    loadWeatherData();
  }, []);

  const loadWeatherData = async () => {
    try {
      setLoading(true);

      // Get location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Location permission denied');
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);

      // Get weather (iOS WeatherKit or Android OpenWeatherMap)
      const weatherData = await hybridWeatherService.getWeather(
        loc.coords.latitude,
        loc.coords.longitude
      );
      setWeather(weatherData);

      // Get forecast
      const forecastData = await hybridWeatherService.getWeatherForecast(
        loc.coords.latitude,
        loc.coords.longitude
      );
      setForecast(forecastData);

      // Get rain next 3 hours
      const rainData = await hybridWeatherService.getRainNextHours(
        loc.coords.latitude,
        loc.coords.longitude,
        3
      );
      setRainNextHours(rainData || []);

      // Generate recommendation
      if (weatherData) {
        generateRecommendation(weatherData);
      }
    } catch (error) {
      console.error('Weather loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendation = (weather: any) => {
    const warnings: string[] = [];
    const considerations: string[] = [];
    let urgency: 'now' | 'soon' | 'wait' | 'not_recommended' = 'soon';
    let recommended = true;

    // Temperature check
    if (weather.temperature > petPreferences.maxTemp) {
      warnings.push(`Zu warm (${weather.temperature}°C)`);
      urgency = 'wait';
      recommended = false;
    }
    if (weather.temperature < petPreferences.minTemp) {
      warnings.push(`Zu kalt (${weather.temperature}°C)`);
      urgency = 'wait';
      recommended = false;
    }

    // Rain check
    if (weather.rainProbability > 70 && petPreferences.rainTolerance < 50) {
      warnings.push(`Hohe Regenwahrscheinlichkeit (${weather.rainProbability}%)`);
      urgency = 'wait';
      recommended = false;
    } else if (weather.rainProbability > 50 && petPreferences.rainTolerance < 50) {
      considerations.push('Dein Tier mag Regen nicht - Regenschutz empfohlen');
      urgency = 'soon';
    }

    // Snow check
    if (weather.snowProbability > 50 && petPreferences.snowTolerance < 50) {
      warnings.push(`Schneefall erwartet`);
      urgency = 'wait';
      recommended = false;
    }

    // Wind check
    if (weather.windSpeed > 30) {
      considerations.push('Starker Wind - Vorsicht beim Gassi');
    }

    setRecommendation({
      recommended,
      urgency,
      reason: weather.description,
      petConsiderations: considerations,
      weatherWarnings: warnings,
      source: weather.source, // 'weatherkit' or 'openweather'
    });
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'clear':
        return 'wb-sunny';
      case 'clouds':
        return 'wb-cloudy';
      case 'rain':
        return 'cloud-queue';
      case 'snow':
        return 'ac-unit';
      case 'thunderstorm':
        return 'flash-on';
      default:
        return 'cloud';
    }
  };

  const getRecommendationColor = (urgency: string) => {
    switch (urgency) {
      case 'now':
        return '#10b981';
      case 'soon':
        return '#f59e0b';
      case 'wait':
        return '#ef4444';
      case 'not_recommended':
        return '#6b7280';
      default:
        return '#3b82f6';
    }
  };

  if (loading) {
    return (
      <ScreenContainer className="bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#a855f7" />
        <Text className="text-white mt-4">Wetter wird geladen...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-black">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-8">
          {/* HEADER */}
          <View className="items-center pt-4">
            <Text className="text-3xl font-bold text-white">Wetter-Ratgeber</Text>
            <Text className="text-xs text-gray-500 mt-1">
              {recommendation?.source === 'weatherkit' ? 'iOS WeatherKit' : 'OpenWeatherMap'}
            </Text>
          </View>

          {/* CURRENT WEATHER */}
          {weather && (
            <PremiumFeatureCard
              title={weather.description}
              color="#06b6d4"
              icon={<MaterialIcons name={getWeatherIcon(weather.condition)} size={32} color="white" />}
            >
              <View className="gap-3 mt-4">
                <View className="flex-row justify-between">
                  <View>
                    <Text className="text-white text-xs opacity-75">Temperatur</Text>
                    <Text className="text-white text-2xl font-bold">{weather.temperature}°C</Text>
                  </View>
                  <View>
                    <Text className="text-white text-xs opacity-75">Gefühlt</Text>
                    <Text className="text-white text-2xl font-bold">{weather.feelsLike}°C</Text>
                  </View>
                  <View>
                    <Text className="text-white text-xs opacity-75">Luftfeuchte</Text>
                    <Text className="text-white text-2xl font-bold">{weather.humidity}%</Text>
                  </View>
                </View>

                <View className="flex-row justify-between pt-2 border-t border-white border-opacity-20">
                  <View>
                    <Text className="text-white text-xs opacity-75">Wind</Text>
                    <Text className="text-white font-bold">{weather.windSpeed} km/h</Text>
                  </View>
                  <View>
                    <Text className="text-white text-xs opacity-75">Sicht</Text>
                    <Text className="text-white font-bold">
                      {weather.visibility ? `${weather.visibility} km` : 'N/A'}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-white text-xs opacity-75">Luftdruck</Text>
                    <Text className="text-white font-bold">
                      {weather.pressure ? `${weather.pressure} hPa` : 'N/A'}
                    </Text>
                  </View>
                </View>
              </View>
            </PremiumFeatureCard>
          )}

          {/* RAIN NEXT 3 HOURS */}
          {rainNextHours.length > 0 && (
            <PremiumFeatureCard
              title="Regen nächste 3 Stunden"
              color="#3b82f6"
              icon={<MaterialIcons name="cloud-queue" size={32} color="white" />}
            >
              <View className="flex-row justify-between gap-2 mt-4">
                {rainNextHours.map((hour, idx) => (
                  <View key={idx} className="flex-1 items-center">
                    <Text className="text-white text-xs opacity-75">+{hour.hour}h</Text>
                    <View className="w-full h-16 bg-gray-700 rounded-lg mt-2 items-end justify-end p-1">
                      <View
                        className="w-full bg-blue-400 rounded"
                        style={{ height: `${Math.max(5, hour.probability)}%` }}
                      />
                    </View>
                    <Text className="text-white text-xs font-bold mt-1">{hour.probability}%</Text>
                  </View>
                ))}
              </View>
            </PremiumFeatureCard>
          )}

          {/* WALK RECOMMENDATION */}
          {recommendation && (
            <PremiumFeatureCard
              title={
                recommendation.urgency === 'now'
                  ? 'Jetzt Gassi gehen!'
                  : recommendation.urgency === 'soon'
                    ? 'Bald Gassi gehen'
                    : 'Warten Sie'
              }
              color={getRecommendationColor(recommendation.urgency)}
              icon={<MaterialIcons name="directions-walk" size={32} color="white" />}
              disclaimer={DISCLAIMERS.WEATHER}
            >
              {recommendation.petConsiderations.length > 0 && (
                <View className="mt-4">
                  {recommendation.petConsiderations.map((consideration: string, idx: number) => (
                    <View key={idx} className="flex-row items-start gap-2 mb-2">
                      <MaterialIcons name="info" size={16} color="#fbbf24" />
                      <Text className="text-white text-sm flex-1">{consideration}</Text>
                    </View>
                  ))}
                </View>
              )}

              {recommendation.weatherWarnings.length > 0 && (
                <View className="mt-4 pt-4 border-t border-white border-opacity-20">
                  {recommendation.weatherWarnings.map((warning: string, idx: number) => (
                    <View key={idx} className="flex-row items-start gap-2 mb-2">
                      <MaterialIcons name="warning" size={16} color="#ef4444" />
                      <Text className="text-white text-sm flex-1">{warning}</Text>
                    </View>
                  ))}
                </View>
              )}
            </PremiumFeatureCard>
          )}

          {/* PET PREFERENCES */}
          <View className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
            <Text className="text-white font-bold text-lg mb-4">Lunas Vorlieben</Text>

            <View className="gap-4">
              <View>
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-white text-sm">Regen-Toleranz</Text>
                  <Text className="text-white font-bold">{petPreferences.rainTolerance}%</Text>
                </View>
                <View className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-blue-500"
                    style={{ width: `${petPreferences.rainTolerance}%` }}
                  />
                </View>
              </View>

              <View>
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-white text-sm">Schnee-Toleranz</Text>
                  <Text className="text-white font-bold">{petPreferences.snowTolerance}%</Text>
                </View>
                <View className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-cyan-500"
                    style={{ width: `${petPreferences.snowTolerance}%` }}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* REFRESH BUTTON */}
          <Pressable
            onPress={loadWeatherData}
            className="bg-purple-600 rounded-lg py-3 items-center"
          >
            <Text className="text-white font-semibold flex-row items-center gap-2">
              <MaterialIcons name="refresh" size={20} color="white" />
              Aktualisieren
            </Text>
          </Pressable>

          {/* DISCLAIMER */}
          <LiabilityDisclaimer
            title="Wetter-Warnung"
            text={DISCLAIMERS.WEATHER}
            compact={true}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
