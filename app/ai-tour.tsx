import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Animated, Dimensions } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  screen?: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Willkommen bei Planypet',
    description: 'Ich bin dein KI-Assistent. Ich helfe dir, dein Tier optimal zu versorgen.',
    icon: 'star.fill',
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Hier siehst du einen Überblick über dein Tier, anstehende Aufgaben und wichtige Informationen.',
    icon: 'house.fill',
    screen: '/(tabs)',
  },
  {
    id: 'pets',
    title: 'Meine Tiere',
    description: 'Verwalte alle deine Tiere. Du kannst mehrere Tiere hinzufügen und ihre Daten pflegen.',
    icon: 'pawprint.fill',
    screen: '/(tabs)/pets',
  },
  {
    id: 'supplies',
    title: 'Vorratsverwaltung',
    description: 'Verwalte Futter und Bedarf. Die App durchsucht automatisch Marktplätze für die besten Preise.',
    icon: 'bag.fill',
    screen: '/supplies-management',
  },
  {
    id: 'gps',
    title: 'Gassi mit GPS',
    description: 'Starte einen Spaziergang und track Distanz und Dauer mit GPS.',
    icon: 'location.fill',
    screen: '/gps-tracking',
  },
  {
    id: 'chip',
    title: 'Chip-Registrierung',
    description: 'Registriere den Chip deines Tieres in mehreren Datenbanken. Wichtig bei Verlust!',
    icon: 'checkmark.circle.fill',
    screen: '/chip-registration',
  },
  {
    id: 'profile',
    title: 'Mein Profil',
    description: 'Verwalte deine persönlichen Daten. Diese sind erforderlich für Notfall-Benachrichtigungen.',
    icon: 'person.fill',
    screen: '/user-profile',
  },
  {
    id: 'complete',
    title: 'Fertig!',
    description: 'Du kennst jetzt alle wichtigen Funktionen. Viel Spaß mit Planypet!',
    icon: 'checkmark.seal.fill',
  },
];

export default function AiTourScreen() {
  const colors = useColors();
  const [currentStep, setCurrentStep] = useState(0);
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [opacityAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentStep]);

  const step = TOUR_STEPS[currentStep];
  const isLastStep = currentStep === TOUR_STEPS.length - 1;

  const handleNext = async () => {
    if (isLastStep) {
      await AsyncStorage.setItem('tourComplete', 'true');
      router.replace('/(tabs)');
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem('tourComplete', 'true');
    router.replace('/(tabs)');
  };

  const handleVisitScreen = () => {
    if (step.screen) {
      router.push(step.screen as any);
    }
  };

  const progress = ((currentStep + 1) / TOUR_STEPS.length) * 100;

  return (
    <ScreenContainer className="p-6 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-8 justify-center flex-1">
          {/* Progress Bar */}
          <View className="gap-2">
            <View className="flex-row justify-between items-center">
              <Text className="text-xs font-semibold text-muted">
                Schritt {currentStep + 1} von {TOUR_STEPS.length}
              </Text>
              <Pressable onPress={handleSkip}>
                <Text className="text-xs font-semibold text-muted">Überspringen</Text>
              </Pressable>
            </View>
            <View className="h-1 bg-surface rounded-full overflow-hidden">
              <View
                className="h-full bg-primary rounded-full"
                style={{ width: `${progress}%` }}
              />
            </View>
          </View>

          {/* AI Avatar with Animation */}
          <Animated.View
            style={{
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
              alignItems: 'center',
            }}
          >
            <View className="w-24 h-24 rounded-full bg-primary/20 items-center justify-center mb-4">
              <View className="w-20 h-20 rounded-full bg-primary items-center justify-center">
                <Text className="text-4xl">🤖</Text>
              </View>
            </View>
          </Animated.View>

          {/* Content */}
          <View className="gap-4 items-center">
            <Text className="text-3xl font-bold text-foreground text-center">{step.title}</Text>
            <Text className="text-base text-muted text-center leading-relaxed">
              {step.description}
            </Text>
          </View>

          {/* Visual Highlight (if applicable) */}
          {step.screen && (
            <View className="bg-surface rounded-2xl p-6 gap-3 border border-primary">
              <Text className="text-sm font-semibold text-foreground text-center">
                Möchtest du diese Funktion jetzt ausprobieren?
              </Text>
              <Pressable
                onPress={handleVisitScreen}
                className="bg-primary rounded-lg p-3 items-center"
              >
                <Text className="text-background font-bold">Zur Funktion gehen</Text>
              </Pressable>
            </View>
          )}

          {/* Navigation Buttons */}
          <View className="gap-3 flex-row">
            {currentStep > 0 && (
              <Pressable
                onPress={() => setCurrentStep(currentStep - 1)}
                className="flex-1 bg-surface rounded-lg p-3 items-center border border-border"
              >
                <Text className="text-foreground font-bold">← Zurück</Text>
              </Pressable>
            )}
            <Pressable
              onPress={handleNext}
              className={`flex-1 rounded-lg p-3 items-center ${
                isLastStep ? 'bg-primary' : 'bg-primary'
              }`}
            >
              <Text className="text-background font-bold">
                {isLastStep ? 'Fertig!' : 'Weiter →'}
              </Text>
            </Pressable>
          </View>

          {/* Step Indicators */}
          <View className="flex-row justify-center gap-2 mt-4">
            {TOUR_STEPS.map((_, idx) => (
              <Pressable
                key={idx}
                onPress={() => setCurrentStep(idx)}
                className={`w-2 h-2 rounded-full ${
                  idx === currentStep ? 'bg-primary w-6' : 'bg-border'
                }`}
              />
            ))}
          </View>

          {/* Hint */}
          <View className="bg-surface rounded-xl p-4 gap-2 mt-4">
            <Text className="text-xs font-semibold text-muted">💡 Tipp</Text>
            <Text className="text-xs text-muted">
              Du kannst diese Tour jederzeit neu starten, indem du in den Einstellungen auf "Tour neu starten" tippst.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
