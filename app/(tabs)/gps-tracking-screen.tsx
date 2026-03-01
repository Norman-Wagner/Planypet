import { ScrollView, View, Text, Pressable, ActivityIndicator } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { PremiumFeatureCard } from '@/components/premium-feature-card';
import { LiabilityDisclaimer, DISCLAIMERS } from '@/components/liability-disclaimer';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { gpsTrackingService, WalkSession } from '@/lib/gps-tracking-service';

/**
 * GPS TRACKING SCREEN
 * - Live route recording
 * - Distance, duration, pace
 * - iOS: Apple Maps integration
 * - Android: Google Maps integration
 */

export default function GPSTrackingScreen() {
  const [session, setSession] = useState<WalkSession | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState<WalkSession[]>([]);
  const [petName, setPetName] = useState('Luna');

  useEffect(() => {
    loadPreviousSessions();
  }, []);

  const loadPreviousSessions = async () => {
    try {
      const allSessions = await gpsTrackingService.loadAllSessions();
      setSessions(allSessions);
    } catch (error) {
      console.error('Load sessions error:', error);
    }
  };

  const handleStartTracking = async () => {
    try {
      setLoading(true);
      const newSession = await gpsTrackingService.startWalkSession(petName);
      if (newSession) {
        setSession(newSession);
        setIsTracking(true);
      }
    } catch (error) {
      console.error('Start tracking error:', error);
      alert('Fehler beim Starten der Aufzeichnung');
    } finally {
      setLoading(false);
    }
  };

  const handleStopTracking = async () => {
    try {
      setLoading(true);
      const completedSession = await gpsTrackingService.stopWalkSession();
      if (completedSession) {
        setSession(null);
        setIsTracking(false);
        // Reload sessions
        await loadPreviousSessions();
      }
    } catch (error) {
      console.error('Stop tracking error:', error);
      alert('Fehler beim Beenden der Aufzeichnung');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenInMaps = async (walkSession: WalkSession) => {
    try {
      await gpsTrackingService.openRouteInMaps(walkSession);
    } catch (error) {
      console.error('Open maps error:', error);
    }
  };

  const handleShareSession = async (walkSession: WalkSession) => {
    try {
      await gpsTrackingService.shareWalkSession(walkSession);
      alert('Route als GPX exportiert');
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${secs}s`;
  };

  const formatDistance = (meters: number) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(2)} km`;
    }
    return `${Math.round(meters)} m`;
  };

  return (
    <ScreenContainer className="bg-black">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-8">
          {/* HEADER */}
          <View className="items-center pt-4">
            <View className="w-16 h-16 bg-cyan-600 rounded-full items-center justify-center mb-4">
              <MaterialIcons name="location-on" size={32} color="white" />
            </View>
            <Text className="text-3xl font-bold text-white">GPS-Tracking</Text>
            <Text className="text-sm text-gray-400 mt-1">Spaziergang aufzeichnen</Text>
          </View>

          {/* ACTIVE SESSION */}
          {isTracking && session && (
            <PremiumFeatureCard
              title="Aufzeichnung läuft..."
              color="#10b981"
              icon={<MaterialIcons name="fiber-manual-record" size={32} color="#ef4444" />}
              disclaimer={DISCLAIMERS.GPS}
            >
              <View className="gap-4 mt-4">
                <View className="flex-row justify-between">
                  <View>
                    <Text className="text-white text-xs opacity-75">Distanz</Text>
                    <Text className="text-white text-2xl font-bold">
                      {formatDistance(session.distance)}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-white text-xs opacity-75">Dauer</Text>
                    <Text className="text-white text-2xl font-bold">
                      {formatDuration(session.duration)}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-white text-xs opacity-75">Tempo</Text>
                    <Text className="text-white text-2xl font-bold">
                      {session.pace.toFixed(1)} km/h
                    </Text>
                  </View>
                </View>

                <View className="flex-row gap-2">
                  <Pressable
                    onPress={handleStopTracking}
                    disabled={loading}
                    className="flex-1 bg-red-600 rounded-lg py-3 items-center"
                  >
                    <Text className="text-white font-semibold">
                      {loading ? 'Wird beendet...' : 'Beenden'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </PremiumFeatureCard>
          )}

          {/* START TRACKING */}
          {!isTracking && (
            <PremiumFeatureCard
              title="Neue Aufzeichnung"
              color="#06b6d4"
              icon={<MaterialIcons name="play-circle" size={32} color="white" />}
            >
              <View className="gap-3 mt-4">
                <Text className="text-white text-sm opacity-75">Tier: {petName}</Text>

                <Pressable
                  onPress={handleStartTracking}
                  disabled={loading}
                  className="bg-green-600 rounded-lg py-3 items-center"
                >
                  <Text className="text-white font-semibold">
                    {loading ? 'Wird gestartet...' : 'Aufzeichnung starten'}
                  </Text>
                </Pressable>
              </View>
            </PremiumFeatureCard>
          )}

          {/* PREVIOUS SESSIONS */}
          {sessions.length > 0 && (
            <View>
              <Text className="text-white font-bold text-lg mb-3">Frühere Spaziergänge</Text>
              <View className="gap-2">
                {sessions.slice(0, 5).map((walkSession, idx) => (
                  <View
                    key={idx}
                    className="bg-gray-900 rounded-xl p-4 border border-gray-700"
                  >
                    <View className="flex-row justify-between items-start mb-3">
                      <View className="flex-1">
                        <Text className="text-white font-semibold">{walkSession.petName}</Text>
                        <Text className="text-gray-400 text-xs">
                          {new Date(walkSession.startTime).toLocaleDateString('de-DE')}
                        </Text>
                      </View>
                      <View className="flex-row gap-2">
                        <Pressable
                          onPress={() => handleOpenInMaps(walkSession)}
                          className="bg-blue-600 rounded-lg p-2"
                        >
                          <MaterialIcons name="map" size={20} color="white" />
                        </Pressable>
                        <Pressable
                          onPress={() => handleShareSession(walkSession)}
                          className="bg-purple-600 rounded-lg p-2"
                        >
                          <MaterialIcons name="share" size={20} color="white" />
                        </Pressable>
                      </View>
                    </View>

                    <View className="flex-row justify-between">
                      <View>
                        <Text className="text-gray-400 text-xs">Distanz</Text>
                        <Text className="text-white font-bold">
                          {formatDistance(walkSession.distance)}
                        </Text>
                      </View>
                      <View>
                        <Text className="text-gray-400 text-xs">Dauer</Text>
                        <Text className="text-white font-bold">
                          {formatDuration(walkSession.duration)}
                        </Text>
                      </View>
                      <View>
                        <Text className="text-gray-400 text-xs">Tempo</Text>
                        <Text className="text-white font-bold">
                          {walkSession.pace.toFixed(1)} km/h
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* DISCLAIMER */}
          <LiabilityDisclaimer
            title="GPS-Tracking Hinweis"
            text={DISCLAIMERS.GPS}
            compact={true}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
