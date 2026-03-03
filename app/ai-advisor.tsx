import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Modal,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  screen: string;
  tips: string[];
}

const TOUR_STEPS: TourStep[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    description: "Dein Überblick über alle Aktivitäten und nächsten Aufgaben",
    icon: "house.fill",
    screen: "/(tabs)",
    tips: [
      "Hier siehst du dein aktives Haustier",
      "Schnelle Zugriffe auf Fütterung, Gassi und Gesundheit",
      "Alle Features sind von hier aus erreichbar",
    ],
  },
  {
    id: "feeding",
    title: "Fütterung & Ernährung",
    description: "Verwalte Fütterungszeiten und Futterbestand",
    icon: "fork.knife",
    screen: "/feeding-nutrition",
    tips: [
      "Erstelle einen Fütterungsplan für dein Tier",
      "Verfolge den Futterbestand",
      "Erhalte Benachrichtigungen bei niedrigem Bestand",
      "Sieh Nährwertinformationen ein",
    ],
  },
  {
    id: "health",
    title: "Gesundheitsakten",
    description: "Dokumentiere Impfungen, Medikamente und Symptome",
    icon: "heart.fill",
    screen: "/health-records",
    tips: [
      "Speichere Impftermine und Impfpässe",
      "Dokumentiere Symptome mit Fotos/Videos",
      "Verfolge Medikamentengaben",
      "Teile Gesundheitsdaten mit Tierarzt",
    ],
  },
  {
    id: "gps",
    title: "GPS-Tracking",
    description: "Verfolge Spaziergänge und Routen deines Tieres",
    icon: "location.fill",
    screen: "/gps-tracking-new",
    tips: [
      "Zeichne Gassi-Routen auf",
      "Sieh Wetter- und Temperaturempfehlungen",
      "Verfolge Distanz und Dauer",
      "Speichere Lieblingsstrecken",
    ],
  },
  {
    id: "ai-symptom",
    title: "KI-Symptom-Analyse",
    description: "Lasse die KI Symptome analysieren (ersetzt nicht den Tierarzt)",
    icon: "stethoscope",
    screen: "/ai-symptom",
    tips: [
      "Beschreibe Symptome oder lade Fotos hoch",
      "Erhalte KI-gestützte Einschätzungen",
      "Wichtig: Konsultiere immer einen Tierarzt",
      "Nutze dies als Informationshilfe",
    ],
  },
  {
    id: "breed",
    title: "Rasse-Scanner",
    description: "Erkenne Tierrassen mit KI-Fotoerkennung",
    icon: "camera.fill",
    screen: "/breed-scanner-ai",
    tips: [
      "Mache ein Foto deines Tieres",
      "Die KI erkennt die Rasse automatisch",
      "Erhalte rassenspezifische Pflegetipps",
      "Perfekt für Mischlingshunde und -katzen",
    ],
  },
  {
    id: "community",
    title: "Community & Freunde",
    description: "Verbinde dich mit anderen Tierbesitzern",
    icon: "person.2.fill",
    screen: "/community-social",
    tips: [
      "Teile Fotos deiner Tiere",
      "Nimm an Challenges teil und verdiene Punkte",
      "Erreiche Status: Messing, Bronze, Silber, Gold",
      "Lerne von anderen Tierbesitzern",
    ],
  },
  {
    id: "marketplace",
    title: "Marktplatz",
    description: "Finde Tierärzte, Trainer, Groomer und Produkte",
    icon: "bag.fill",
    screen: "/marketplace-services",
    tips: [
      "Suche Tierärzte in deiner Nähe",
      "Finde Hundetrainer und Groomer",
      "Kaufe Futter und Zubehör",
      "Vergleiche Preise und Bewertungen",
    ],
  },
];

export default function AIAdvisorScreen() {
  const insets = useSafeAreaInsets();
  const [tourMode, setTourMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showTourModal, setShowTourModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<TourStep | null>(null);

  const handleStartTour = () => {
    setTourMode(true);
    setCurrentStep(0);
    setShowTourModal(true);
  };

  const handleNextStep = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setTourMode(false);
      setShowTourModal(false);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkipTour = () => {
    setTourMode(false);
    setShowTourModal(false);
  };

  const currentTourStep = TOUR_STEPS[currentStep];

  return (
    <LinearGradient
      colors={["#1E5A96", "#0F3A5F"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 100,
          paddingHorizontal: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-8">
          <View>
            <Text className="text-white text-sm font-medium opacity-80">
              KI-Ratgeber
            </Text>
            <Text className="text-white text-2xl font-bold">Hilfe & Anleitung</Text>
          </View>
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 bg-white/20 rounded-lg items-center justify-center"
          >
            <IconSymbol size={20} name="xmark" color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Start Tour Button */}
        <Pressable
          onPress={handleStartTour}
          className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-6 mb-8 flex-row items-center gap-4"
        >
          <View className="w-16 h-16 bg-white/20 rounded-xl items-center justify-center">
            <IconSymbol size={32} name="sparkles" color="#FFFFFF" />
          </View>
          <View className="flex-1">
            <Text className="text-white font-bold text-lg">Geführte Tour</Text>
            <Text className="text-white/80 text-sm">
              Lerne alle Features kennen
            </Text>
          </View>
          <IconSymbol size={20} name="chevron.right" color="#FFFFFF" />
        </Pressable>

        {/* Topics */}
        <Text className="text-white text-lg font-bold mb-4">Alle Features</Text>

        <View className="gap-3">
          {TOUR_STEPS.map((topic) => (
            <Pressable
              key={topic.id}
              onPress={() => setSelectedTopic(topic)}
              className="bg-white/10 rounded-2xl p-4 border border-white/20 flex-row items-center gap-4"
            >
              <View className="w-12 h-12 bg-white/20 rounded-lg items-center justify-center">
                <IconSymbol
                  size={24}
                  name={topic.icon as any}
                  color="#FFFFFF"
                />
              </View>
              <View className="flex-1">
                <Text className="text-white font-semibold">{topic.title}</Text>
                <Text className="text-white/60 text-sm">
                  {topic.description}
                </Text>
              </View>
              <IconSymbol
                size={20}
                name="chevron.right"
                color="rgba(255,255,255,0.5)"
              />
            </Pressable>
          ))}
        </View>

        {/* FAQ Section */}
        <View className="mt-8">
          <Text className="text-white text-lg font-bold mb-4">
            Häufig gestellte Fragen
          </Text>

          <View className="gap-3">
            {[
              {
                q: "Wie richte ich mein erstes Haustier ein?",
                a: "Gehe zu Dashboard → Tiere → Neues Tier hinzufügen. Folge den Schritten.",
              },
              {
                q: "Kann ich mehrere Tiere verwalten?",
                a: "Ja! Du kannst unbegrenzte Haustiere hinzufügen und zwischen ihnen wechseln.",
              },
              {
                q: "Ist die KI-Symptom-Analyse zuverlässig?",
                a: "Die KI ist eine Informationshilfe. Konsultiere immer einen Tierarzt!",
              },
              {
                q: "Wie funktioniert das Punktesystem?",
                a: "Verdiene Punkte durch Community-Challenges und erreiche Status: Messing, Bronze, Silber, Gold.",
              },
            ].map((faq, idx) => (
              <View
                key={idx}
                className="bg-white/10 rounded-2xl p-4 border border-white/20"
              >
                <Text className="text-white font-semibold mb-2">{faq.q}</Text>
                <Text className="text-white/70 text-sm">{faq.a}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Support */}
        <View className="bg-white/10 rounded-2xl p-4 mt-8 border border-white/20">
          <View className="flex-row gap-3 mb-3">
            <View className="w-8 h-8 bg-white/20 rounded items-center justify-center">
              <IconSymbol size={16} name="questionmark.circle.fill" color="#FFFFFF" />
            </View>
            <Text className="text-white font-semibold flex-1">Weitere Hilfe?</Text>
          </View>
          <Text className="text-white/70 text-sm mb-3">
            Kontaktiere uns unter: Info@wagnerconnect.com oder +49 172 3789980
          </Text>
          <Pressable className="bg-white/20 rounded-lg py-2 px-3 items-center">
            <Text className="text-white text-sm font-semibold">
              Feedback geben
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Tour Modal */}
      <Modal visible={showTourModal} transparent animationType="slide">
        <LinearGradient
          colors={["#1E5A96", "#0F3A5F"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        >
          <View
            style={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }}
            className="flex-1 justify-center px-6"
          >
            <View className="bg-white/10 rounded-3xl p-8 border border-white/20">
              {/* Progress */}
              <View className="mb-6">
                <View className="flex-row gap-1 mb-3">
                  {TOUR_STEPS.map((_, idx) => (
                    <View
                      key={idx}
                      className={`flex-1 h-1 rounded-full ${
                        idx <= currentStep ? "bg-white" : "bg-white/30"
                      }`}
                    />
                  ))}
                </View>
                <Text className="text-white/70 text-xs">
                  Schritt {currentStep + 1} von {TOUR_STEPS.length}
                </Text>
              </View>

              {/* Content */}
              <View className="mb-8">
                <View className="w-20 h-20 bg-white/20 rounded-2xl items-center justify-center mx-auto mb-6">
                  <IconSymbol
                    size={40}
                    name={currentTourStep.icon as any}
                    color="#FFFFFF"
                  />
                </View>

                <Text className="text-white text-3xl font-bold text-center mb-2">
                  {currentTourStep.title}
                </Text>
                <Text className="text-white/70 text-center mb-6">
                  {currentTourStep.description}
                </Text>

                <View className="bg-white/10 rounded-xl p-4 mb-6">
                  <Text className="text-white font-semibold mb-3">Tipps:</Text>
                  {currentTourStep.tips.map((tip, idx) => (
                    <View key={idx} className="flex-row gap-2 mb-2">
                      <Text className="text-white/60">•</Text>
                      <Text className="text-white/70 text-sm flex-1">{tip}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Buttons */}
              <View className="gap-3">
                <Pressable
                  onPress={handleNextStep}
                  className="bg-white rounded-lg py-4 items-center"
                >
                  <Text className="text-blue-600 font-bold text-lg">
                    {currentStep === TOUR_STEPS.length - 1 ? "Fertig" : "Weiter"}
                  </Text>
                </Pressable>

                <View className="flex-row gap-3">
                  {currentStep > 0 && (
                    <Pressable
                      onPress={handlePrevStep}
                      className="flex-1 bg-white/20 rounded-lg py-3 border border-white/20"
                    >
                      <Text className="text-white font-semibold text-center">
                        Zurück
                      </Text>
                    </Pressable>
                  )}

                  <Pressable
                    onPress={handleSkipTour}
                    className={`${
                      currentStep > 0 ? "flex-1" : "w-full"
                    } bg-white/10 rounded-lg py-3 border border-white/20`}
                  >
                    <Text className="text-white/70 font-semibold text-center">
                      Abbrechen
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      </Modal>

      {/* Topic Detail Modal */}
      {selectedTopic && (
        <Modal visible={!!selectedTopic} transparent animationType="slide">
          <LinearGradient
            colors={["#1E5A96", "#0F3A5F"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
          >
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{
                paddingTop: insets.top + 16,
                paddingBottom: insets.bottom + 32,
                paddingHorizontal: 16,
              }}
            >
              <View className="flex-row items-center justify-between mb-8">
                <Text className="text-white text-2xl font-bold">
                  {selectedTopic.title}
                </Text>
                <Pressable
                  onPress={() => setSelectedTopic(null)}
                  className="w-10 h-10 bg-white/20 rounded-lg items-center justify-center"
                >
                  <IconSymbol size={20} name="xmark" color="#FFFFFF" />
                </Pressable>
              </View>

              <View className="bg-white/10 rounded-2xl p-6 border border-white/20 mb-6">
                <Text className="text-white/70 text-lg mb-4">
                  {selectedTopic.description}
                </Text>

                <Text className="text-white font-bold mb-3">Tipps & Tricks:</Text>
                {selectedTopic.tips.map((tip, idx) => (
                  <View key={idx} className="flex-row gap-3 mb-3">
                    <View className="w-6 h-6 bg-white/20 rounded items-center justify-center mt-0.5">
                      <Text className="text-white text-xs font-bold">{idx + 1}</Text>
                    </View>
                    <Text className="text-white/70 text-sm flex-1">{tip}</Text>
                  </View>
                ))}
              </View>

              <Pressable
                onPress={() => {
                  setSelectedTopic(null);
                  router.push(selectedTopic.screen as any);
                }}
                className="bg-white rounded-lg py-4 items-center"
              >
                <Text className="text-blue-600 font-bold text-lg">
                  Zu {selectedTopic.title}
                </Text>
              </Pressable>
            </ScrollView>
          </LinearGradient>
        </Modal>
      )}
    </LinearGradient>
  );
}
