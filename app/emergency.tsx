import { useState } from "react";
import { ScrollView, Text, View, Pressable, Linking, Alert, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { PetAvatar } from "@/components/ui/pet-avatar";
import { useColors } from "@/hooks/use-colors";
import { usePetStore, Pet } from "@/lib/pet-store";

// Demo poison bait warnings
const poisonWarnings = [
  {
    id: "1",
    location: "Stadtpark, Nähe Spielplatz",
    date: "Heute, 14:30",
    type: "Köder mit Nägeln",
    distance: "1.2 km",
  },
  {
    id: "2",
    location: "Waldweg am Fluss",
    date: "Gestern, 10:15",
    type: "Verdächtiges Fleisch",
    distance: "3.5 km",
  },
];

export default function EmergencyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { pets } = usePetStore();
  
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [showLostPetForm, setShowLostPetForm] = useState(false);

  const handleCallVet = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    // In a real app, this would open phone with vet number
    Alert.alert(
      "Tierarzt anrufen",
      "Möchtest du den Notfall-Tierarzt anrufen?",
      [
        { text: "Abbrechen", style: "cancel" },
        { text: "Anrufen", onPress: () => Linking.openURL("tel:+49123456789") },
      ]
    );
  };

  const handleReportLostPet = (pet: Pet) => {
    setSelectedPet(pet);
    setShowLostPetForm(true);
    
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  const handleTassoLink = () => {
    Linking.openURL("https://www.tasso.net/");
  };

  const handleFindeFix = () => {
    Linking.openURL("https://www.findefix.com/");
  };

  return (
    <View className="flex-1">
      {/* Gradient Background */}
      <LinearGradient
        colors={["#EF4444", "#F87171", "#F0F7FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 0.6 }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />
      
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ 
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 40,
          paddingHorizontal: 20,
        }}
      >
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-3"
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <IconSymbol name="chevron.left" size={24} color="#FFFFFF" />
          </Pressable>
          <View className="flex-1">
            <Text className="text-white text-2xl font-bold">Notfall-Hilfe</Text>
            <Text className="text-white/70 text-base">Schnelle Hilfe im Ernstfall</Text>
          </View>
        </View>

        {/* Emergency Call Button */}
        <Pressable
          onPress={handleCallVet}
          style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] })}
        >
          <GlassCard className="mb-6 border-2 border-error">
            <View className="flex-row items-center">
              <View className="w-16 h-16 rounded-full bg-error items-center justify-center mr-4">
                <IconSymbol name="phone.fill" size={32} color="#FFFFFF" />
              </View>
              <View className="flex-1">
                <Text className="text-error text-xl font-bold">Notfall-Tierarzt</Text>
                <Text className="text-foreground">24/7 Notdienst anrufen</Text>
              </View>
              <IconSymbol name="chevron.right" size={24} color={colors.error} />
            </View>
          </GlassCard>
        </Pressable>

        {/* Lost Pet Section */}
        <Text className="text-foreground text-lg font-semibold mb-3">
          Tier vermisst?
        </Text>
        
        <GlassCard className="mb-4">
          <Text className="text-foreground font-medium mb-3">Wähle das vermisste Tier:</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            {pets.map((pet) => (
              <Pressable
                key={pet.id}
                onPress={() => handleReportLostPet(pet)}
                style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] })}
              >
                <View className="items-center">
                  <PetAvatar name={pet.name} type={pet.type} size="lg" />
                  <Text className="text-foreground font-medium mt-1 text-sm">{pet.name}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </GlassCard>

        {/* Lost Pet Form */}
        {showLostPetForm && selectedPet && (
          <GlassCard className="mb-4 border-warning">
            <View className="flex-row items-center mb-4">
              <PetAvatar name={selectedPet.name} type={selectedPet.type} size="lg" />
              <View className="flex-1 ml-3">
                <Text className="text-foreground text-lg font-bold">{selectedPet.name} vermisst</Text>
                <Text className="text-muted text-sm">Melde dein Tier bei diesen Diensten:</Text>
              </View>
            </View>
            
            <View className="gap-3">
              <Pressable
                onPress={handleTassoLink}
                style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
              >
                <View className="flex-row items-center bg-primary/10 p-4 rounded-xl">
                  <View className="w-12 h-12 rounded-full bg-primary/20 items-center justify-center mr-3">
                    <Text className="text-2xl">🔍</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-foreground font-semibold">TASSO</Text>
                    <Text className="text-muted text-sm">Europas größtes Haustierregister</Text>
                  </View>
                  <IconSymbol name="chevron.right" size={20} color={colors.primary} />
                </View>
              </Pressable>
              
              <Pressable
                onPress={handleFindeFix}
                style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
              >
                <View className="flex-row items-center bg-success/10 p-4 rounded-xl">
                  <View className="w-12 h-12 rounded-full bg-success/20 items-center justify-center mr-3">
                    <Text className="text-2xl">📍</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-foreground font-semibold">FINDEFIX</Text>
                    <Text className="text-muted text-sm">Deutscher Tierschutzbund</Text>
                  </View>
                  <IconSymbol name="chevron.right" size={20} color={colors.success} />
                </View>
              </Pressable>
            </View>
            
            <Pressable
              onPress={() => setShowLostPetForm(false)}
              className="mt-4"
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Text className="text-muted text-center">Abbrechen</Text>
            </Pressable>
          </GlassCard>
        )}

        {/* Poison Bait Warnings */}
        <View className="flex-row items-center justify-between mb-3 mt-4">
          <Text className="text-foreground text-lg font-semibold">
            Giftköder-Warnungen
          </Text>
          <View className="bg-error/20 px-2 py-1 rounded-full">
            <Text className="text-error text-xs font-medium">{poisonWarnings.length} aktiv</Text>
          </View>
        </View>
        
        {poisonWarnings.map((warning) => (
          <GlassCard key={warning.id} className="mb-3 border-warning/50">
            <View className="flex-row items-start">
              <View className="w-12 h-12 rounded-full bg-warning/20 items-center justify-center mr-3">
                <IconSymbol name="exclamationmark.triangle.fill" size={24} color={colors.warning} />
              </View>
              <View className="flex-1">
                <Text className="text-foreground font-semibold">{warning.type}</Text>
                <Text className="text-muted text-sm">{warning.location}</Text>
                <View className="flex-row mt-1">
                  <Text className="text-muted text-xs">{warning.date}</Text>
                  <Text className="text-muted text-xs mx-2">•</Text>
                  <Text className="text-warning text-xs font-medium">{warning.distance} entfernt</Text>
                </View>
              </View>
            </View>
          </GlassCard>
        ))}

        {/* Emergency Contacts */}
        <Text className="text-foreground text-lg font-semibold mb-3 mt-4">
          Notfallkontakte
        </Text>
        
        <GlassCard className="mb-3">
          <Pressable
            onPress={() => Linking.openURL("tel:112")}
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
          >
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-error/20 items-center justify-center mr-3">
                <IconSymbol name="phone.fill" size={24} color={colors.error} />
              </View>
              <View className="flex-1">
                <Text className="text-foreground font-semibold">Notruf</Text>
                <Text className="text-muted text-sm">112</Text>
              </View>
            </View>
          </Pressable>
        </GlassCard>

        <GlassCard className="mb-3">
          <Pressable
            onPress={() => Linking.openURL("tel:+4915735990000")}
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
          >
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-primary/20 items-center justify-center mr-3">
                <IconSymbol name="phone.fill" size={24} color={colors.primary} />
              </View>
              <View className="flex-1">
                <Text className="text-foreground font-semibold">Giftnotruf</Text>
                <Text className="text-muted text-sm">+49 157 3599 0000</Text>
              </View>
            </View>
          </Pressable>
        </GlassCard>

        {/* Disclaimer */}
        <GlassCard className="mt-4 border-warning/30">
          <View className="flex-row items-start">
            <IconSymbol name="info.circle.fill" size={20} color={colors.warning} />
            <View className="flex-1 ml-3">
              <Text className="text-foreground font-medium text-sm">Wichtig</Text>
              <Text className="text-muted text-xs mt-1">
                Bei akuten Vergiftungen oder schweren Verletzungen sofort den Tierarzt oder die Tierklinik aufsuchen. Jede Minute zählt!
              </Text>
            </View>
          </View>
        </GlassCard>
      </ScrollView>
    </View>
  );
}
