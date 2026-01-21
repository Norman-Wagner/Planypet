import { useState } from "react";
import { ScrollView, Text, View, Pressable, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { PetAvatar } from "@/components/ui/pet-avatar";
import { useColors } from "@/hooks/use-colors";
import { usePetStore, Pet } from "@/lib/pet-store";

export default function FeedingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { pets, addFeeding, feedings, completeFeeding } = usePetStore();
  
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [foodType, setFoodType] = useState("");
  const [amount, setAmount] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddFeeding = () => {
    if (!selectedPet || !foodType) return;
    
    addFeeding({
      petId: selectedPet.id,
      time: new Date().toISOString(),
      food: foodType,
      amount: amount || "1 Portion",
      completed: false,
    });
    
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    setSelectedPet(null);
    setFoodType("");
    setAmount("");
    setShowAddForm(false);
  };

  const handleCompleteFeeding = (id: string) => {
    completeFeeding(id);
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const pendingFeedings = feedings.filter((f) => !f.completed);
  const completedToday = feedings.filter(
    (f) => f.completed && new Date(f.completedAt || "").toDateString() === new Date().toDateString()
  );

  return (
    <View className="flex-1">
      {/* Gradient Background */}
      <LinearGradient
        colors={["#F59E0B", "#FBBF24", "#F0F7FF"]}
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
            <Text className="text-white text-2xl font-bold">Fütterung</Text>
            <Text className="text-white/70 text-base">Fütterungszeiten verwalten</Text>
          </View>
        </View>

        {/* Quick Feed Buttons */}
        <Text className="text-foreground text-lg font-semibold mb-3">
          Schnell füttern
        </Text>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="mb-6"
          contentContainerStyle={{ gap: 12 }}
        >
          {pets.map((pet) => (
            <Pressable
              key={pet.id}
              onPress={() => {
                setSelectedPet(pet);
                setShowAddForm(true);
              }}
              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] })}
            >
              <GlassCard className="w-28 items-center py-4">
                <PetAvatar name={pet.name} type={pet.type} size="lg" />
                <Text className="text-foreground font-medium mt-2" numberOfLines={1}>
                  {pet.name}
                </Text>
                <Text className="text-primary text-xs font-medium mt-1">Füttern</Text>
              </GlassCard>
            </Pressable>
          ))}
        </ScrollView>

        {/* Add Feeding Form */}
        {showAddForm && selectedPet && (
          <GlassCard className="mb-6">
            <View className="flex-row items-center mb-4">
              <PetAvatar name={selectedPet.name} type={selectedPet.type} size="md" />
              <Text className="text-foreground font-semibold text-lg ml-3">
                {selectedPet.name} füttern
              </Text>
            </View>
            
            <Text className="text-muted text-sm mb-2">Futterart</Text>
            <View className="flex-row gap-2 mb-4">
              {["Nassfutter", "Trockenfutter", "Leckerli", "Wasser"].map((type) => (
                <Pressable
                  key={type}
                  onPress={() => setFoodType(type)}
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                >
                  <View 
                    className={`px-3 py-2 rounded-full ${
                      foodType === type ? "bg-primary" : "bg-surface border border-border"
                    }`}
                  >
                    <Text className={foodType === type ? "text-white font-medium" : "text-foreground"}>
                      {type}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
            
            <Text className="text-muted text-sm mb-2">Menge (optional)</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="z.B. 150g oder 1 Portion"
              placeholderTextColor={colors.muted}
              className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground mb-4"
            />
            
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => {
                  setShowAddForm(false);
                  setSelectedPet(null);
                }}
                className="flex-1 py-3 rounded-xl border border-border items-center"
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                <Text className="text-muted font-medium">Abbrechen</Text>
              </Pressable>
              <View className="flex-1">
                <GradientButton
                  title="Speichern"
                  onPress={handleAddFeeding}
                  disabled={!foodType}
                />
              </View>
            </View>
          </GlassCard>
        )}

        {/* Pending Feedings */}
        <Text className="text-foreground text-lg font-semibold mb-3">
          Anstehende Fütterungen
        </Text>
        
        {pendingFeedings.length === 0 ? (
          <GlassCard className="items-center py-6 mb-6">
            <IconSymbol name="checkmark.circle.fill" size={40} color={colors.success} />
            <Text className="text-foreground font-medium mt-2">Alle gefüttert!</Text>
            <Text className="text-muted text-sm">Keine ausstehenden Fütterungen</Text>
          </GlassCard>
        ) : (
          pendingFeedings.map((feeding) => {
            const pet = pets.find((p) => p.id === feeding.petId);
            return (
              <GlassCard key={feeding.id} className="mb-3">
                <View className="flex-row items-center">
                  {pet && <PetAvatar name={pet.name} type={pet.type} size="md" />}
                  <View className="flex-1 ml-3">
                    <Text className="text-foreground font-semibold">{pet?.name || "Tier"}</Text>
                    <Text className="text-muted text-sm">{feeding.food} • {feeding.amount}</Text>
                  </View>
                  <Pressable
                    onPress={() => handleCompleteFeeding(feeding.id)}
                    className="bg-success/20 px-4 py-2 rounded-full"
                    style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                  >
                    <Text className="text-success font-medium">Erledigt</Text>
                  </Pressable>
                </View>
              </GlassCard>
            );
          })
        )}

        {/* Today's Completed */}
        {completedToday.length > 0 && (
          <>
            <Text className="text-foreground text-lg font-semibold mb-3 mt-4">
              Heute erledigt
            </Text>
            {completedToday.map((feeding) => {
              const pet = pets.find((p) => p.id === feeding.petId);
              return (
                <GlassCard key={feeding.id} className="mb-3 opacity-70">
                  <View className="flex-row items-center">
                    {pet && <PetAvatar name={pet.name} type={pet.type} size="md" />}
                    <View className="flex-1 ml-3">
                      <Text className="text-foreground font-semibold">{pet?.name || "Tier"}</Text>
                      <Text className="text-muted text-sm">{feeding.food} • {feeding.amount}</Text>
                    </View>
                    <IconSymbol name="checkmark.circle.fill" size={24} color={colors.success} />
                  </View>
                </GlassCard>
              );
            })}
          </>
        )}
      </ScrollView>
    </View>
  );
}
