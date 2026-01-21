import { ScrollView, Text, View, Pressable, TextInput, Alert } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { usePetStore } from "@/lib/pet-store";

interface Supply {
  id: string;
  name: string;
  category: "food" | "medication" | "accessory";
  quantity: number;
  unit: string;
  lowStockThreshold: number;
  expiryDate?: string;
  notes?: string;
}

export default function SuppliesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { pets } = usePetStore();
  
  // Mock data - in real app, this would be stored in pet store
  const [supplies, setSupplies] = useState<Supply[]>([
    {
      id: "1",
      name: "Trockenfutter Premium",
      category: "food",
      quantity: 3,
      unit: "kg",
      lowStockThreshold: 2,
      expiryDate: "2026-06-15",
    },
    {
      id: "2",
      name: "Nassfutter Huhn",
      category: "food",
      quantity: 12,
      unit: "Dosen",
      lowStockThreshold: 5,
      expiryDate: "2026-03-20",
    },
    {
      id: "3",
      name: "Wurmkur",
      category: "medication",
      quantity: 2,
      unit: "Tabletten",
      lowStockThreshold: 1,
      expiryDate: "2025-12-31",
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);

  const getLowStockItems = () => {
    return supplies.filter((s) => s.quantity <= s.lowStockThreshold);
  };

  const getExpiringItems = () => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    return supplies.filter((s) => {
      if (!s.expiryDate) return false;
      const expiryDate = new Date(s.expiryDate);
      return expiryDate <= thirtyDaysFromNow && expiryDate >= now;
    });
  };

  const getCategoryIcon = (category: Supply["category"]) => {
    switch (category) {
      case "food":
        return "cube.box.fill";
      case "medication":
        return "cross.case.fill";
      case "accessory":
        return "bag.fill";
    }
  };

  const getCategoryColor = (category: Supply["category"]) => {
    switch (category) {
      case "food":
        return colors.warning;
      case "medication":
        return colors.error;
      case "accessory":
        return colors.primary;
    }
  };

  const handleAddSupply = () => {
    Alert.alert("Vorrat hinzufügen", "Diese Funktion wird bald verfügbar sein");
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setSupplies((prev) =>
      prev.map((s) => (s.id === id ? { ...s, quantity: Math.max(0, s.quantity + delta) } : s))
    );
  };

  const lowStockItems = getLowStockItems();
  const expiringItems = getExpiringItems();

  return (
    <ScreenContainer className="p-6">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center flex-1">
            <Pressable
              onPress={() => router.back()}
              className="mr-4"
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              <IconSymbol name="chevron.left" size={28} color={colors.primary} />
            </Pressable>
            <Text className="text-3xl font-bold text-foreground">Vorräte</Text>
          </View>
          <Pressable
            onPress={handleAddSupply}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <View className="w-10 h-10 rounded-full bg-primary items-center justify-center">
              <Text className="text-white text-2xl font-bold">+</Text>
            </View>
          </Pressable>
        </View>

        {/* Warnings */}
        {lowStockItems.length > 0 && (
          <GlassCard className="p-4 mb-4 border-l-4 border-warning">
            <View className="flex-row items-center mb-2">
              <IconSymbol name="exclamationmark.triangle.fill" size={20} color={colors.warning} />
              <Text className="text-foreground font-semibold ml-2">Niedriger Bestand</Text>
            </View>
            {lowStockItems.map((item) => (
              <Text key={item.id} className="text-muted text-sm ml-7">
                • {item.name}: {item.quantity} {item.unit}
              </Text>
            ))}
          </GlassCard>
        )}

        {expiringItems.length > 0 && (
          <GlassCard className="p-4 mb-4 border-l-4 border-error">
            <View className="flex-row items-center mb-2">
              <IconSymbol name="clock.fill" size={20} color={colors.error} />
              <Text className="text-foreground font-semibold ml-2">Läuft bald ab</Text>
            </View>
            {expiringItems.map((item) => (
              <Text key={item.id} className="text-muted text-sm ml-7">
                • {item.name}: {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString("de-DE") : ""}
              </Text>
            ))}
          </GlassCard>
        )}

        {/* Supplies List */}
        <Text className="text-foreground text-lg font-semibold mb-3">Alle Vorräte</Text>

        {supplies.map((supply) => (
          <GlassCard key={supply.id} className="p-4 mb-3">
            <View className="flex-row items-start">
              <View
                className="w-12 h-12 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: `${getCategoryColor(supply.category)}20` }}
              >
                <IconSymbol
                  name={getCategoryIcon(supply.category) as any}
                  size={24}
                  color={getCategoryColor(supply.category)}
                />
              </View>

              <View className="flex-1">
                <Text className="text-foreground font-semibold text-base">{supply.name}</Text>
                <Text className="text-muted text-sm mt-1">
                  {supply.quantity} {supply.unit}
                  {supply.expiryDate && ` • MHD: ${new Date(supply.expiryDate).toLocaleDateString("de-DE")}`}
                </Text>
                {supply.quantity <= supply.lowStockThreshold && (
                  <Text className="text-warning text-xs mt-1">⚠️ Niedriger Bestand</Text>
                )}
              </View>

              <View className="flex-row items-center gap-2">
                <Pressable
                  onPress={() => handleUpdateQuantity(supply.id, -1)}
                  className="w-8 h-8 rounded-full bg-error/20 items-center justify-center"
                  style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                >
                  <Text className="text-error font-bold">−</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleUpdateQuantity(supply.id, 1)}
                  className="w-8 h-8 rounded-full bg-success/20 items-center justify-center"
                  style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                >
                  <Text className="text-success font-bold">+</Text>
                </Pressable>
              </View>
            </View>
          </GlassCard>
        ))}

        {/* Shopping List */}
        {lowStockItems.length > 0 && (
          <View className="mt-6">
            <Text className="text-foreground text-lg font-semibold mb-3">Einkaufsliste</Text>
            <GlassCard className="p-4">
              {lowStockItems.map((item, index) => (
                <View key={item.id} className="flex-row items-center py-2">
                  <View className="w-5 h-5 rounded border-2 border-primary mr-3" />
                  <Text className="text-foreground flex-1">{item.name}</Text>
                  <Text className="text-muted text-sm">
                    {item.lowStockThreshold - item.quantity} {item.unit}
                  </Text>
                </View>
              ))}
              <GradientButton
                title="Einkaufsliste teilen"
                onPress={() => Alert.alert("Teilen", "Einkaufsliste wird geteilt...")}
                className="mt-4"
              />
            </GlassCard>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
