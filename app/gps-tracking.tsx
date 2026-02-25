import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { router } from 'expo-router';
import * as Location from 'expo-location';

export default function GpsTrackingScreen() {
  const colors = useColors();
  const [isTracking, setIsTracking] = useState(false);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [location, setLocation] = useState<any>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Fehler', 'Standortzugriff erforderlich');
        return;
      }
    })();
  }, []);

  const startTracking = async () => {
    setIsTracking(true);
    setDistance(0);
    setDuration(0);
    
    let startLocation = await Location.getCurrentPositionAsync({});
    setLocation(startLocation);
  };

  const stopTracking = () => {
    setIsTracking(false);
    Alert.alert('Gassi beendet', `Distanz: ${distance.toFixed(2)} km\nDauer: ${duration} Min.`);
  };

  return (
    <ScreenContainer className="p-6 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-6">
          <View className="flex-row justify-between items-center">
            <Text className="text-3xl font-bold text-foreground">Gassi mit GPS</Text>
            <Pressable onPress={() => router.push('/walk-scheduler')} className="bg-primary rounded-lg p-2">
              <Text className="text-background font-bold text-xs">Planen</Text>
            </Pressable>
          </View>
          
          <View className="bg-surface rounded-2xl p-6 gap-4">
            <View className="gap-2">
              <Text className="text-sm text-muted">Distanz</Text>
              <Text className="text-4xl font-bold text-primary">{distance.toFixed(2)} km</Text>
            </View>
            
            <View className="gap-2">
              <Text className="text-sm text-muted">Dauer</Text>
              <Text className="text-2xl font-bold text-foreground">{duration} Min.</Text>
            </View>
          </View>

          <Pressable
            onPress={isTracking ? stopTracking : startTracking}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <View className={`rounded-xl p-4 items-center ${isTracking ? 'bg-error' : 'bg-primary'}`}>
              <Text className="text-lg font-bold text-background">
                {isTracking ? 'Stoppen' : 'Starten'}
              </Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
