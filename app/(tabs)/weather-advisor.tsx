import { ScrollView, View, Text, Pressable, Switch } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { PremiumFeatureCard } from '@/components/premium-feature-card';
import { LiabilityDisclaimer, DISCLAIMERS } from '@/components/liability-disclaimer';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';

/**
 * WEATHER ADVISOR SCREEN
 * - Real-time weather with pet tolerance
 * - Walk recommendations
 * - Rain/Snow warnings
 * - Temperature alerts
 */

export default function WeatherAdvisorScreen() {
  const [weather, setWeather] = useState<any>(null);
  const [petPreferences, setPetPreferences] = useState({
    rainTolerance: 40,
    snowTolerance: 60,
    minTemp: 5,
    maxTemp: 25,
  });
  const [recommendation, setRecommendation] = useState<any>(null);

  useEffect(() => {
    // TODO: Load weather from weatherService
    // TODO: Load pet preferences
    // TODO: Generate recommendation
  }, []);

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
      default:
        return 'cloud';
    }
  };

  const getRecommendationColor = (urgency: string) => {
    switch (urgency) {
      case 'now':
        return '#10b981'; // Green
      case 'soon':
        return '#f59e0b'; // Orange
      case 'wait':
        return '#ef4444'; // Red
      case 'not_recommended':
        return '#6b7280'; // Gray
      default:
        return '#3b82f6'; // Blue
    }
  };

  return (
    <ScreenContainer className="bg-black">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-8">
          {/* HEADER */}
          <View className="items-center pt-4">
            <Text className="text-3xl font-bold text-white">Wetter-Ratgeber</Text>
            <Text className="text-sm text-gray-400 mt-1">Für Luna</Text>
          </View>

          {/* CURRENT WEATHER */}
          {weather && (
            <PremiumFeatureCard
              title={weather.description}
              color="#06b6d4"
              icon={<MaterialIcons name={getWeatherIcon(weather.condition)} size={32} color="white" />}
            >
              <View className="grid grid-cols-3 gap-4 mt-4">
                <View>
                  <Text className="text-white text-xs opacity-75">Temperatur</Text>
                  <Text className="text-white text-xl font-bold">{weather.temperature}°C</Text>
                  <Text className="text-white text-xs opacity-75">Gefühlt: {weather.feelsLike}°C</Text>
                </View>
                <View>
                  <Text className="text-white text-xs opacity-75">Luftfeuchtigkeit</Text>
                  <Text className="text-white text-xl font-bold">{weather.humidity}%</Text>
                </View>
                <View>
                  <Text className="text-white text-xs opacity-75">Wind</Text>
                  <Text className="text-white text-xl font-bold">{weather.windSpeed} km/h</Text>
                </View>
              </View>
            </PremiumFeatureCard>
          )}

          {/* RAIN PROBABILITY */}
          {weather && weather.rainProbability > 0 && (
            <PremiumFeatureCard
              title="Regenwahrscheinlichkeit"
              color={weather.rainProbability > 70 ? '#ef4444' : '#f59e0b'}
              icon={<MaterialIcons name="cloud-queue" size={32} color="white" />}
            >
              <View className="mt-4">
                <View className="flex-row items-center gap-3">
                  <View className="flex-1 h-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
                    <View
                      className="h-full bg-white"
                      style={{ width: `${weather.rainProbability}%` }}
                    />
                  </View>
                  <Text className="text-white font-bold">{weather.rainProbability}%</Text>
                </View>
                <Text className="text-white text-sm opacity-75 mt-3">
                  {weather.rainProbability > 70
                    ? 'Starker Regen erwartet'
                    : weather.rainProbability > 40
                      ? 'Regen möglich'
                      : 'Geringes Regenrisiko'}
                </Text>
              </View>
            </PremiumFeatureCard>
          )}

          {/* SNOW PROBABILITY */}
          {weather && weather.snowProbability > 0 && (
            <PremiumFeatureCard
              title="Schneewahrscheinlichkeit"
              color={weather.snowProbability > 50 ? '#3b82f6' : '#06b6d4'}
              icon={<MaterialIcons name="ac-unit" size={32} color="white" />}
            >
              <View className="mt-4">
                <View className="flex-row items-center gap-3">
                  <View className="flex-1 h-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
                    <View
                      className="h-full bg-white"
                      style={{ width: `${weather.snowProbability}%` }}
                    />
                  </View>
                  <Text className="text-white font-bold">{weather.snowProbability}%</Text>
                </View>
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
                    : recommendation.urgency === 'wait'
                      ? 'Warten Sie'
                      : 'Nicht empfohlen'
              }
              color={getRecommendationColor(recommendation.urgency)}
              icon={<MaterialIcons name="directions-walk" size={32} color="white" />}
              disclaimer={DISCLAIMERS.WEATHER}
            >
              <Text className="text-white text-sm opacity-90 mt-4">{recommendation.reason}</Text>

              {recommendation.bestTimeWindow && (
                <View className="mt-4 pt-4 border-t border-white border-opacity-20">
                  <Text className="text-white text-xs opacity-75">Beste Zeit:</Text>
                  <Text className="text-white font-semibold">
                    {recommendation.bestTimeWindow.start} - {recommendation.bestTimeWindow.end}
                  </Text>
                </View>
              )}

              {recommendation.petConsiderations.length > 0 && (
                <View className="mt-4">
                  <Text className="text-white text-xs opacity-75 mb-2">Für Luna:</Text>
                  {recommendation.petConsiderations.map((consideration: string, idx: number) => (
                    <View key={idx} className="flex-row items-start gap-2 mb-1">
                      <MaterialIcons name="info" size={16} color="#fbbf24" />
                      <Text className="text-white text-xs flex-1">{consideration}</Text>
                    </View>
                  ))}
                </View>
              )}

              {recommendation.weatherWarnings.length > 0 && (
                <View className="mt-4">
                  <Text className="text-white text-xs opacity-75 mb-2">Warnungen:</Text>
                  {recommendation.weatherWarnings.map((warning: string, idx: number) => (
                    <View key={idx} className="flex-row items-start gap-2 mb-1">
                      <MaterialIcons name="warning" size={16} color="#ef4444" />
                      <Text className="text-white text-xs flex-1">{warning}</Text>
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

              <View>
                <Text className="text-white text-sm mb-2">Komfortable Temperatur</Text>
                <Text className="text-white opacity-75">
                  {petPreferences.minTemp}°C bis {petPreferences.maxTemp}°C
                </Text>
              </View>
            </View>
          </View>

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
