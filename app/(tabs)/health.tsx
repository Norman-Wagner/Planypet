import { ScrollView, Text, View, Pressable, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { router } from "expo-router";

import { GlassCard } from "@/components/ui/glass-card";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { PetAvatar } from "@/components/ui/pet-avatar";
import { useColors } from "@/hooks/use-colors";
import { usePetStore } from "@/lib/pet-store";
import { useCalendar } from "@/hooks/use-calendar";

export default function HealthScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { pets, healthRecords } = usePetStore();
  const { hasPermission, addVetAppointmentToCalendar, addVaccinationToCalendar } = useCalendar();

  const handleAddVaccinationToCalendar = async () => {
    const success = await addVaccinationToCalendar(
      "Luna",
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      "Tollwut-Auffrischung"
    );
    if (success) {
      Alert.alert("Erfolg", "Impftermin wurde zu deinem Kalender hinzugefügt");
    }
  };

  return (
    <View className="flex-1">
      {/* Gradient Background */}
      <LinearGradient
        colors={["#0066CC", "#00A3FF", "#F0F7FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 0.6 }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />
      
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ 
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 100,
          paddingHorizontal: 20,
        }}
      >
        {/* Header */}
        <View className="mb-6">
          <Text className="text-white text-2xl font-bold">Gesundheit</Text>
          <Text className="text-white/70 text-base">Gesundheitsakten & Tierarzt-Modus</Text>
        </View>

        {/* Tierarzt-Modus Button */}
        <Pressable
          onPress={() => router.push("/vet-mode")}
          style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] })}
        >
          <LinearGradient
            colors={["#10B981", "#34D399"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 16, marginBottom: 16 }}
          >
            <View className="p-5 flex-row items-center">
              <View className="w-14 h-14 rounded-full bg-white/20 items-center justify-center mr-4">
                <IconSymbol name="stethoscope" size={28} color="#FFFFFF" />
              </View>
              <View className="flex-1">
                <Text className="text-white text-lg font-bold">Tierarzt-Modus</Text>
                <Text className="text-white/80 text-sm">Alle Daten kompakt für den Arztbesuch</Text>
              </View>
              <IconSymbol name="chevron.right" size={24} color="#FFFFFF" />
            </View>
          </LinearGradient>
        </Pressable>

        {/* Quick Actions */}
        <View className="flex-row gap-3 mb-6">
          <Pressable 
            className="flex-1"
            onPress={() => router.push("/add-symptom")}
            style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] })}
          >
            <GlassCard className="items-center py-4">
              <View className="w-12 h-12 rounded-full bg-error/20 items-center justify-center mb-2">
                <IconSymbol name="camera.fill" size={24} color={colors.error} />
              </View>
              <Text className="text-foreground font-medium text-sm">Symptom</Text>
              <Text className="text-foreground font-medium text-sm">dokumentieren</Text>
            </GlassCard>
          </Pressable>
          <Pressable 
            className="flex-1"
            style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] })}
          >
            <GlassCard className="items-center py-4">
              <View className="w-12 h-12 rounded-full bg-primary/20 items-center justify-center mb-2">
                <IconSymbol name="mic.fill" size={24} color={colors.primary} />
              </View>
              <Text className="text-foreground font-medium text-sm">Sprach-</Text>
              <Text className="text-foreground font-medium text-sm">notiz</Text>
            </GlassCard>
          </Pressable>
          <Pressable 
            className="flex-1"
            style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] })}
          >
            <GlassCard className="items-center py-4">
              <View className="w-12 h-12 rounded-full bg-warning/20 items-center justify-center mb-2">
                <IconSymbol name="doc.text.fill" size={24} color={colors.warning} />
              </View>
              <Text className="text-foreground font-medium text-sm">PDF</Text>
              <Text className="text-foreground font-medium text-sm">Export</Text>
            </GlassCard>
          </Pressable>
        </View>

        {/* Upcoming Appointments */}
        <Text className="text-foreground text-lg font-semibold mb-3">
          Anstehende Termine
        </Text>
        
        <GlassCard className="mb-4">
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-full bg-primary/20 items-center justify-center mr-3">
              <IconSymbol name="syringe.fill" size={24} color={colors.primary} />
            </View>
            <View className="flex-1">
              <Text className="text-foreground font-semibold">Impfung Luna</Text>
              <Text className="text-muted text-sm">Nächste Woche • Tollwut-Auffrischung</Text>
            </View>
            <Pressable
              onPress={handleAddVaccinationToCalendar}
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              <View className="bg-primary/20 px-3 py-2 rounded-full">
                <Text className="text-primary text-xs font-medium">Zum Kalender</Text>
              </View>
            </Pressable>
          </View>
        </GlassCard>

        {/* Health Records */}
        <Text className="text-foreground text-lg font-semibold mb-3 mt-4">
          Gesundheitsakten
        </Text>

        <Pressable
          style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] })}
        >
          <GlassCard className="mb-4">
            <View className="flex-row items-center">
              <PetAvatar name="Luna" type="cat" size="md" />
              <View className="flex-1 ml-3">
                <Text className="text-foreground font-semibold">Luna</Text>
                <Text className="text-muted text-sm">Letzte Untersuchung: 15.12.2025</Text>
              </View>
              <View className="bg-success/20 px-2 py-1 rounded-full">
                <Text className="text-success text-xs font-medium">Gesund</Text>
              </View>
            </View>
          </GlassCard>
        </Pressable>

        <Pressable
          style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] })}
        >
          <GlassCard className="mb-4">
            <View className="flex-row items-center">
              <PetAvatar name="Max" type="dog" size="md" />
              <View className="flex-1 ml-3">
                <Text className="text-foreground font-semibold">Max</Text>
                <Text className="text-muted text-sm">Letzte Untersuchung: 20.11.2025</Text>
              </View>
              <View className="bg-success/20 px-2 py-1 rounded-full">
                <Text className="text-success text-xs font-medium">Gesund</Text>
              </View>
            </View>
          </GlassCard>
        </Pressable>

        {/* AI Disclaimer */}
        <GlassCard className="mt-4 border-warning/30">
          <View className="flex-row items-start">
            <IconSymbol name="info.circle.fill" size={20} color={colors.warning} />
            <View className="flex-1 ml-3">
              <Text className="text-foreground font-medium text-sm">Wichtiger Hinweis</Text>
              <Text className="text-muted text-xs mt-1">
                Die KI-Hinweise in dieser App ersetzen keinen Tierarzt. Bei gesundheitlichen Problemen konsultiere bitte immer einen Fachmann.
              </Text>
            </View>
          </View>
        </GlassCard>
      </ScrollView>
    </View>
  );
}
