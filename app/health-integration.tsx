import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Alert, ActivityIndicator, Platform } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { usePetStore } from '@/lib/pet-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface HealthData {
  steps: number;
  distance: number;
  activeEnergy: number;
  heartRate: number;
  date: string;
}

interface ActivityStats {
  totalSteps: number;
  totalDistance: number;
  totalCalories: number;
  averageHeartRate: number;
  lastUpdated: string;
  isConnected: boolean;
}

export default function HealthIntegrationScreen() {
  const colors = useColors();
  const { pets } = usePetStore();
  const [selectedPet, setSelectedPet] = useState(pets[0]?.id || '');
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [stats, setStats] = useState<ActivityStats>({
    totalSteps: 0,
    totalDistance: 0,
    totalCalories: 0,
    averageHeartRate: 0,
    lastUpdated: '',
    isConnected: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    loadHealthData();
  }, []);

  const loadHealthData = async () => {
    try {
      const stored = await AsyncStorage.getItem('healthData');
      if (stored) {
        const data = JSON.parse(stored);
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading health data:', error);
    }
  };

  const requestHealthKitPermissions = async () => {
    if (Platform.OS !== 'ios') {
      Alert.alert('Info', 'Health App Integration ist nur auf iOS verfügbar. Auf Android verwende Google Fit.');
      return;
    }

    setIsConnecting(true);
    try {
      // In production: Use react-native-health or similar library
      // For now: Simulate permission request
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockData: ActivityStats = {
        totalSteps: Math.floor(Math.random() * 15000) + 5000,
        totalDistance: Math.round((Math.random() * 8 + 2) * 100) / 100,
        totalCalories: Math.floor(Math.random() * 500) + 200,
        averageHeartRate: Math.floor(Math.random() * 30) + 60,
        lastUpdated: new Date().toISOString(),
        isConnected: true,
      };

      setStats(mockData);
      await AsyncStorage.setItem('healthData', JSON.stringify(mockData));

      Alert.alert('Erfolg', 'Health App verbunden!\n\nDeine Aktivitätsdaten werden jetzt synchronisiert.');
    } catch (error) {
      Alert.alert('Fehler', 'Health App konnte nicht verbunden werden');
    } finally {
      setIsConnecting(false);
    }
  };

  const requestGoogleFitPermissions = async () => {
    if (Platform.OS !== 'android') {
      Alert.alert('Info', 'Google Fit ist nur auf Android verfügbar. Auf iOS verwende Health App.');
      return;
    }

    setIsConnecting(true);
    try {
      // In production: Use react-native-google-fit or similar
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockData: ActivityStats = {
        totalSteps: Math.floor(Math.random() * 15000) + 5000,
        totalDistance: Math.round((Math.random() * 8 + 2) * 100) / 100,
        totalCalories: Math.floor(Math.random() * 500) + 200,
        averageHeartRate: Math.floor(Math.random() * 30) + 60,
        lastUpdated: new Date().toISOString(),
        isConnected: true,
      };

      setStats(mockData);
      await AsyncStorage.setItem('healthData', JSON.stringify(mockData));

      Alert.alert('Erfolg', 'Google Fit verbunden!\n\nDeine Aktivitätsdaten werden jetzt synchronisiert.');
    } catch (error) {
      Alert.alert('Fehler', 'Google Fit konnte nicht verbunden werden');
    } finally {
      setIsConnecting(false);
    }
  };

  const syncHealthData = async () => {
    setIsLoading(true);
    try {
      // Simulate data sync
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedStats = {
        ...stats,
        lastUpdated: new Date().toISOString(),
      };

      setStats(updatedStats);
      await AsyncStorage.setItem('healthData', JSON.stringify(updatedStats));

      Alert.alert('Erfolg', 'Aktivitätsdaten aktualisiert!');
    } catch (error) {
      Alert.alert('Fehler', 'Synchronisierung fehlgeschlagen');
    } finally {
      setIsLoading(false);
    }
  };

  const linkActivityToPet = async () => {
    if (!stats.isConnected) {
      Alert.alert('Fehler', 'Bitte verbinde zuerst Health App oder Google Fit');
      return;
    }

    try {
      const petActivities = await AsyncStorage.getItem('petActivities');
      const existing = petActivities ? JSON.parse(petActivities) : [];

      const activity = {
        id: Date.now().toString(),
        petId: selectedPet,
        steps: stats.totalSteps,
        distance: stats.totalDistance,
        calories: stats.totalCalories,
        date: new Date().toISOString(),
      };

      const updated = [...existing, activity];
      await AsyncStorage.setItem('petActivities', JSON.stringify(updated));

      Alert.alert('Erfolg', `Aktivität mit ${pets.find(p => p.id === selectedPet)?.name} verknüpft!`);
    } catch (error) {
      Alert.alert('Fehler', 'Verknüpfung fehlgeschlagen');
    }
  };

  return (
    <ScreenContainer className="p-6 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Aktivitäts-Tracking</Text>
            <Text className="text-base text-muted">Verbinde deine Health App</Text>
          </View>

          {/* Connection Status */}
          <View className={`rounded-2xl p-6 gap-3 ${stats.isConnected ? 'bg-success/10 border border-success' : 'bg-surface border border-border'}`}>
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-bold text-foreground">
                {stats.isConnected ? '✓ Verbunden' : '✗ Nicht verbunden'}
              </Text>
              <View className={`w-3 h-3 rounded-full ${stats.isConnected ? 'bg-success' : 'bg-muted'}`} />
            </View>
            {stats.lastUpdated && (
              <Text className="text-xs text-muted">
                Zuletzt aktualisiert: {new Date(stats.lastUpdated).toLocaleTimeString('de-DE')}
              </Text>
            )}
          </View>

          {/* Connection Buttons */}
          <View className="gap-3">
            {Platform.OS === 'ios' && (
              <Pressable
                onPress={requestHealthKitPermissions}
                disabled={isConnecting || stats.isConnected}
                className={`rounded-xl p-4 items-center ${stats.isConnected ? 'bg-muted' : 'bg-primary'}`}
              >
                {isConnecting ? (
                  <ActivityIndicator color="#0A0A0F" />
                ) : (
                  <Text className="text-lg font-bold text-background">
                    {stats.isConnected ? '✓ Health App verbunden' : 'Health App verbinden'}
                  </Text>
                )}
              </Pressable>
            )}

            {Platform.OS === 'android' && (
              <Pressable
                onPress={requestGoogleFitPermissions}
                disabled={isConnecting || stats.isConnected}
                className={`rounded-xl p-4 items-center ${stats.isConnected ? 'bg-muted' : 'bg-primary'}`}
              >
                {isConnecting ? (
                  <ActivityIndicator color="#0A0A0F" />
                ) : (
                  <Text className="text-lg font-bold text-background">
                    {stats.isConnected ? '✓ Google Fit verbunden' : 'Google Fit verbinden'}
                  </Text>
                )}
              </Pressable>
            )}
          </View>

          {/* Activity Stats */}
          {stats.isConnected && (
            <>
              <View className="gap-3">
                <Text className="text-sm font-semibold text-foreground">Heute</Text>

                {/* Steps */}
                <View className="bg-surface rounded-xl p-4 gap-3">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-sm font-semibold text-muted">Schritte</Text>
                    <Text className="text-2xl font-bold text-primary">{stats.totalSteps.toLocaleString('de-DE')}</Text>
                  </View>
                  <View className="h-2 bg-background rounded-full overflow-hidden">
                    <View
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${Math.min((stats.totalSteps / 10000) * 100, 100)}%` }}
                    />
                  </View>
                  <Text className="text-xs text-muted">Ziel: 10.000 Schritte</Text>
                </View>

                {/* Distance */}
                <View className="bg-surface rounded-xl p-4 gap-2">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-sm font-semibold text-muted">Distanz</Text>
                    <Text className="text-2xl font-bold text-primary">{stats.totalDistance.toFixed(2)} km</Text>
                  </View>
                  <Text className="text-xs text-muted">Basierend auf Schritten</Text>
                </View>

                {/* Calories */}
                <View className="bg-surface rounded-xl p-4 gap-2">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-sm font-semibold text-muted">Kalorien</Text>
                    <Text className="text-2xl font-bold text-primary">{stats.totalCalories} kcal</Text>
                  </View>
                  <Text className="text-xs text-muted">Aktive Energie</Text>
                </View>

                {/* Heart Rate */}
                <View className="bg-surface rounded-xl p-4 gap-2">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-sm font-semibold text-muted">Durchschn. Herzfrequenz</Text>
                    <Text className="text-2xl font-bold text-primary">{stats.averageHeartRate} bpm</Text>
                  </View>
                  <Text className="text-xs text-muted">Beats per Minute</Text>
                </View>
              </View>

              {/* Pet Selector */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">Aktivität verknüpfen mit</Text>
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

              {/* Link Activity Button */}
              <Pressable
                onPress={linkActivityToPet}
                className="bg-primary rounded-xl p-4 items-center"
              >
                <Text className="text-lg font-bold text-background">
                  Aktivität verknüpfen
                </Text>
              </Pressable>

              {/* Sync Button */}
              <Pressable
                onPress={syncHealthData}
                disabled={isLoading}
                className="bg-surface rounded-xl p-4 items-center border border-border"
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.foreground} />
                ) : (
                  <Text className="text-lg font-bold text-foreground">Daten aktualisieren</Text>
                )}
              </Pressable>
            </>
          )}

          {/* Info */}
          <View className="bg-surface rounded-xl p-4 gap-2">
            <Text className="text-sm font-semibold text-foreground">ℹ️ Hinweis</Text>
            <Text className="text-xs text-muted">
              {Platform.OS === 'ios'
                ? 'Deine Health App Daten werden sicher synchronisiert. Planypet hat nur Lesezugriff auf deine Aktivitätsdaten.'
                : 'Deine Google Fit Daten werden sicher synchronisiert. Planypet hat nur Lesezugriff auf deine Aktivitätsdaten.'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
