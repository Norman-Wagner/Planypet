import { ScrollView, View, Text, Pressable, Image } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { PremiumFeatureCard } from '@/components/premium-feature-card';
import { LiabilityDisclaimer, DISCLAIMERS } from '@/components/liability-disclaimer';
import { useColors } from '@/hooks/use-colors';
import { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

/**
 * REDESIGNED DASHBOARD - Premium Dark Theme
 * - Farbige Feature-Sections
 * - Wetter-Integration
 * - KI-Ratgeber
 * - Keine Emojis, nur Icons
 */

export default function HomeScreenRedesign() {
  const colors = useColors();
  const [weather, setWeather] = useState<any>(null);
  const [walkRecommendation, setWalkRecommendation] = useState<any>(null);

  useEffect(() => {
    // TODO: Load weather data
    // TODO: Load walk recommendation
  }, []);

  return (
    <ScreenContainer className="bg-black">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-8">
          {/* HEADER - Planypet Logo + Greeting */}
          <View className="items-center pt-4">
            <Image
              source={require('@/assets/images/icon.png')}
              style={{ width: 60, height: 60, borderRadius: 12 }}
            />
            <Text className="text-3xl font-bold text-white mt-4">Planypet</Text>
            <Text className="text-sm text-gray-400 mt-1">Willkommen zurück, Norman</Text>
          </View>

          {/* WEATHER SECTION - Green */}
          <PremiumFeatureCard
            title="Gassi-Zeit"
            subtitle={weather?.description || 'Wetter wird geladen...'}
            color="#10b981"
            icon={<MaterialIcons name="cloud" size={32} color="white" />}
            onPress={() => {}}
            disclaimer={DISCLAIMERS.WEATHER}
          >
            <View className="flex-row justify-between mt-4">
              <View>
                <Text className="text-white text-sm opacity-90">Temperatur</Text>
                <Text className="text-white text-2xl font-bold">{weather?.temperature || '--'}°C</Text>
              </View>
              <View>
                <Text className="text-white text-sm opacity-90">Regen</Text>
                <Text className="text-white text-2xl font-bold">{weather?.rainProbability || '--'}%</Text>
              </View>
              <View>
                <Text className="text-white text-sm opacity-90">Wind</Text>
                <Text className="text-white text-2xl font-bold">{weather?.windSpeed || '--'} km/h</Text>
              </View>
            </View>
            {walkRecommendation && (
              <View className="mt-4 pt-4 border-t border-white border-opacity-20">
                <Text className="text-white font-semibold mb-2">Empfehlung:</Text>
                <Text className="text-white text-sm opacity-90">{walkRecommendation.reason}</Text>
              </View>
            )}
          </PremiumFeatureCard>

          {/* KI ADVISOR - Purple */}
          <PremiumFeatureCard
            title="KI-Ratgeber"
            subtitle="Experten-Tipps für Luna"
            color="#a855f7"
            icon={<MaterialIcons name="psychology" size={32} color="white" />}
            onPress={() => {}}
            disclaimer={DISCLAIMERS.AI_ADVISOR}
          >
            <Text className="text-white text-sm opacity-90 mt-4">
              Fragen Sie den KI-Ratgeber nach Ernährung, Gesundheit, Training und mehr.
            </Text>
          </PremiumFeatureCard>

          {/* HEALTH RECORDS - Red */}
          <PremiumFeatureCard
            title="Gesundheitsakten"
            subtitle="Impfungen & Termine"
            color="#ef4444"
            icon={<MaterialIcons name="favorite" size={32} color="white" />}
            onPress={() => {}}
            disclaimer={DISCLAIMERS.HEALTH}
          >
            <View className="mt-4 gap-2">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="check-circle" size={20} color="#10b981" />
                <Text className="text-white text-sm">Tollwut: 12.06.2024</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="check-circle" size={20} color="#10b981" />
                <Text className="text-white text-sm">Staupe: 08.08.2024</Text>
              </View>
            </View>
          </PremiumFeatureCard>

          {/* GPS TRACKING - Teal */}
          <PremiumFeatureCard
            title="GPS-Tracking"
            subtitle="Spaziergang aufzeichnen"
            color="#06b6d4"
            icon={<MaterialIcons name="location-on" size={32} color="white" />}
            onPress={() => {}}
            disclaimer={DISCLAIMERS.GPS}
          >
            <Text className="text-white text-sm opacity-90 mt-4">
              Strecke: 3.2 km | Dauer: 45 min | Tempo: 5.1 km/h
            </Text>
          </PremiumFeatureCard>

          {/* MARKETPLACE - Orange */}
          <PremiumFeatureCard
            title="Marktplatz"
            subtitle="Tierärzte, Trainer, Groomer"
            color="#f59e0b"
            icon={<MaterialIcons name="store" size={32} color="white" />}
            onPress={() => {}}
            disclaimer={DISCLAIMERS.MARKETPLACE}
          >
            <Text className="text-white text-sm opacity-90 mt-4">
              Finde Tierärzte, Trainer und Groomer in deiner Nähe.
            </Text>
          </PremiumFeatureCard>

          {/* COMMUNITY - Blue */}
          <PremiumFeatureCard
            title="Community"
            subtitle="Teile Fotos & Tipps"
            color="#3b82f6"
            icon={<MaterialIcons name="people" size={32} color="white" />}
            onPress={() => {}}
            disclaimer={DISCLAIMERS.COMMUNITY}
          >
            <Text className="text-white text-sm opacity-90 mt-4">
              Verbinde dich mit anderen Tierbesitzern.
            </Text>
          </PremiumFeatureCard>

          {/* BREED SCANNER - Pink */}
          <PremiumFeatureCard
            title="Rassen-Scanner"
            subtitle="KI-Erkennung"
            color="#ec4899"
            icon={<MaterialIcons name="photo-camera" size={32} color="white" />}
            onPress={() => {}}
            disclaimer="Diese KI-Erkennung ist zu Unterhaltungszwecken. Für genaue Rassen-Bestimmung konsultieren Sie einen Tierarzt."
          >
            <Text className="text-white text-sm opacity-90 mt-4">
              Fotografiere dein Tier und erhalte Rassen-Informationen.
            </Text>
          </PremiumFeatureCard>

          {/* SMART DEVICES - Cyan */}
          <PremiumFeatureCard
            title="Smart-Geräte"
            subtitle="Futterautomat, GPS-Tracker"
            color="#06b6d4"
            icon={<MaterialIcons name="devices" size={32} color="white" />}
            onPress={() => {}}
            disclaimer="Smart-Geräte sind optional. Planypet übernimmt keine Haftung für Gerätefehler."
          >
            <Text className="text-white text-sm opacity-90 mt-4">
              Verbinde Smart-Geräte für automatische Fütterung.
            </Text>
          </PremiumFeatureCard>

          {/* GENERAL DISCLAIMER */}
          <LiabilityDisclaimer
            title="Wichtiger Hinweis"
            text={DISCLAIMERS.GENERAL}
            className="mx-0"
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
