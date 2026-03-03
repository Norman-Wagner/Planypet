import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { usePetStore } from "@/lib/pet-store";

interface FeedingSchedule {
  id: string;
  time: string;
  amount: string;
  foodType: string;
  completed: boolean;
}

export default function FeedingNutritionScreen() {
  const insets = useSafeAreaInsets();
  const { pets } = usePetStore();
  const [activeTab, setActiveTab] = useState<"schedule" | "inventory" | "nutrition">("schedule");
  const [showAddModal, setShowAddModal] = useState(false);
  const [feedingTime, setFeedingTime] = useState("");
  const [feedingAmount, setFeedingAmount] = useState("");
  const [foodType, setFoodType] = useState("");
  const [schedule, setSchedule] = useState<FeedingSchedule[]>([
    {
      id: "1",
      time: "08:00",
      amount: "200g",
      foodType: "Trockenfutter Premium",
      completed: true,
    },
    {
      id: "2",
      time: "18:00",
      amount: "200g",
      foodType: "Trockenfutter Premium",
      completed: false,
    },
  ]);

  const [inventory, setInventory] = useState([
    {
      id: "1",
      name: "Premium Trockenfutter",
      amount: "3.5 kg",
      status: "OK",
      reorderLink: "https://amazon.de/...",
    },
    {
      id: "2",
      name: "Nassfutter Huhn",
      amount: "2 Dosen",
      status: "niedrig",
      reorderLink: "https://amazon.de/...",
    },
  ]);

  const activePet = pets[0];

  const handleAddFeeding = () => {
    if (feedingTime && feedingAmount && foodType) {
      const newFeeding: FeedingSchedule = {
        id: Date.now().toString(),
        time: feedingTime,
        amount: feedingAmount,
        foodType: foodType,
        completed: false,
      };
      setSchedule([...schedule, newFeeding]);
      setFeedingTime("");
      setFeedingAmount("");
      setFoodType("");
      setShowAddModal(false);
    }
  };

  const toggleFeedingComplete = (id: string) => {
    setSchedule(
      schedule.map((f) => (f.id === id ? { ...f, completed: !f.completed } : f))
    );
  };

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
            <Text className="text-white/70 text-sm">Für</Text>
            <Text className="text-white text-2xl font-bold">
              {activePet?.name || "Dein Tier"}
            </Text>
          </View>
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 bg-white/20 rounded-lg items-center justify-center"
          >
            <IconSymbol size={20} name="xmark" color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Tab Navigation */}
        <View className="flex-row gap-2 mb-6">
          {[
            { id: "schedule", label: "Zeitplan", icon: "clock.fill" },
            { id: "inventory", label: "Bestand", icon: "cube.box.fill" },
            { id: "nutrition", label: "Nährwerte", icon: "heart.fill" },
          ].map((tab) => (
            <Pressable
              key={tab.id}
              onPress={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex-row items-center justify-center gap-2 py-3 px-4 rounded-lg ${
                activeTab === tab.id
                  ? "bg-white/20 border border-white"
                  : "bg-white/5 border border-white/10"
              }`}
            >
              <IconSymbol
                size={16}
                name={tab.icon as any}
                color={activeTab === tab.id ? "#FFFFFF" : "rgba(255,255,255,0.6)"}
              />
              <Text
                className={`text-xs font-semibold ${
                  activeTab === tab.id ? "text-white" : "text-white/60"
                }`}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Schedule Tab */}
        {activeTab === "schedule" && (
          <View>
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white text-lg font-bold">Fütterungsplan</Text>
              <Pressable
                onPress={() => setShowAddModal(true)}
                className="w-10 h-10 bg-white/20 rounded-lg items-center justify-center"
              >
                <IconSymbol size={20} name="plus" color="#FFFFFF" />
              </Pressable>
            </View>

            <View className="gap-3">
              {schedule.map((feeding) => (
                <Pressable
                  key={feeding.id}
                  onPress={() => toggleFeedingComplete(feeding.id)}
                  className="bg-white/10 rounded-2xl p-4 border border-white/20"
                >
                  <View className="flex-row items-center gap-4">
                    <View
                      className={`w-12 h-12 rounded-lg items-center justify-center ${
                        feeding.completed
                          ? "bg-green-500/30"
                          : "bg-white/20"
                      }`}
                    >
                      <IconSymbol
                        size={24}
                        name={feeding.completed ? "checkmark.circle.fill" : "fork.knife"}
                        color={feeding.completed ? "#4ADE80" : "#FFFFFF"}
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-white font-semibold">
                        {feeding.time} Uhr
                      </Text>
                      <Text className="text-white/70 text-sm">
                        {feeding.amount} • {feeding.foodType}
                      </Text>
                    </View>
                    {feeding.completed && (
                      <View className="px-3 py-1 bg-green-500/30 rounded-full">
                        <Text className="text-green-300 text-xs font-semibold">
                          Erledigt
                        </Text>
                      </View>
                    )}
                  </View>
                </Pressable>
              ))}
            </View>

            {/* Daily Summary */}
            <View className="bg-white/10 rounded-2xl p-4 mt-6 border border-white/20">
              <Text className="text-white font-semibold mb-3">Heute</Text>
              <View className="gap-2">
                <View className="flex-row justify-between">
                  <Text className="text-white/70">Fütterungen geplant:</Text>
                  <Text className="text-white font-semibold">{schedule.length}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-white/70">Abgeschlossen:</Text>
                  <Text className="text-green-300 font-semibold">
                    {schedule.filter((f) => f.completed).length}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-white/70">Gesamtmenge:</Text>
                  <Text className="text-white font-semibold">400g</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Inventory Tab */}
        {activeTab === "inventory" && (
          <View>
            <Text className="text-white text-lg font-bold mb-4">Futterbestand</Text>

            <View className="gap-3">
              {inventory.map((item) => (
                <View
                  key={item.id}
                  className="bg-white/10 rounded-2xl p-4 border border-white/20"
                >
                  <View className="flex-row items-start justify-between mb-3">
                    <View className="flex-1">
                      <Text className="text-white font-semibold">{item.name}</Text>
                      <Text className="text-white/70 text-sm">{item.amount}</Text>
                    </View>
                    <View
                      className={`px-3 py-1 rounded-full ${
                        item.status === "OK"
                          ? "bg-green-500/30"
                          : "bg-orange-500/30"
                      }`}
                    >
                      <Text
                        className={`text-xs font-semibold ${
                          item.status === "OK"
                            ? "text-green-300"
                            : "text-orange-300"
                        }`}
                      >
                        {item.status === "OK" ? "OK" : "Niedrig"}
                      </Text>
                    </View>
                  </View>

                  {item.status === "niedrig" && (
                    <Pressable className="bg-white/20 rounded-lg py-2 px-3 flex-row items-center justify-center gap-2">
                      <IconSymbol size={16} name="bag.fill" color="#FFFFFF" />
                      <Text className="text-white text-sm font-semibold">
                        Nachbestellen
                      </Text>
                    </Pressable>
                  )}
                </View>
              ))}
            </View>

            {/* Low Stock Warning */}
            <View className="bg-orange-500/20 rounded-2xl p-4 mt-6 border border-orange-500/30">
              <View className="flex-row gap-3">
                <View className="w-8 h-8 bg-orange-500/30 rounded items-center justify-center">
                  <IconSymbol size={16} name="exclamationmark.circle.fill" color="#FCA5A5" />
                </View>
                <View className="flex-1">
                  <Text className="text-orange-200 font-semibold text-sm mb-1">
                    Bestand niedrig
                  </Text>
                  <Text className="text-orange-100 text-xs">
                    Nassfutter Huhn läuft bald aus. Jetzt nachbestellen.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Nutrition Tab */}
        {activeTab === "nutrition" && (
          <View>
            <Text className="text-white text-lg font-bold mb-4">
              Nährwertinformationen
            </Text>

            <View className="gap-3">
              {[
                { label: "Protein", value: "28%", icon: "heart.fill" },
                { label: "Fett", value: "15%", icon: "flame.fill" },
                { label: "Ballaststoffe", value: "4%", icon: "leaf.fill" },
                { label: "Asche", value: "8%", icon: "cube.fill" },
              ].map((nutrient, idx) => (
                <View
                  key={idx}
                  className="bg-white/10 rounded-2xl p-4 border border-white/20"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">
                      <View className="w-10 h-10 bg-white/20 rounded-lg items-center justify-center">
                        <IconSymbol
                          size={20}
                          name={nutrient.icon as any}
                          color="#FFFFFF"
                        />
                      </View>
                      <Text className="text-white font-semibold">
                        {nutrient.label}
                      </Text>
                    </View>
                    <Text className="text-white text-lg font-bold">
                      {nutrient.value}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <View className="bg-white/10 rounded-2xl p-4 mt-6 border border-white/20">
              <Text className="text-white font-semibold mb-2">Hinweis</Text>
              <Text className="text-white/70 text-sm">
                Die Nährwertangaben basieren auf dem aktuellen Futter. Konsultiere
                deinen Tierarzt für tierartspezifische Empfehlungen.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Add Feeding Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <LinearGradient
          colors={["#1E5A96", "#0F3A5F"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        >
          <View
            style={{ paddingTop: insets.top }}
            className="flex-1 justify-center px-6"
          >
            <View className="bg-white/10 rounded-3xl p-6 border border-white/20">
              <Text className="text-white text-2xl font-bold mb-6">
                Fütterung hinzufügen
              </Text>

              <View className="gap-4 mb-6">
                <View>
                  <Text className="text-white font-semibold mb-2">Uhrzeit</Text>
                  <TextInput
                    placeholder="08:00"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    value={feedingTime}
                    onChangeText={setFeedingTime}
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                  />
                </View>

                <View>
                  <Text className="text-white font-semibold mb-2">Menge</Text>
                  <TextInput
                    placeholder="200g"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    value={feedingAmount}
                    onChangeText={setFeedingAmount}
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                  />
                </View>

                <View>
                  <Text className="text-white font-semibold mb-2">Futtertyp</Text>
                  <TextInput
                    placeholder="z.B. Premium Trockenfutter"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    value={foodType}
                    onChangeText={setFoodType}
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                  />
                </View>
              </View>

              <View className="gap-3 flex-row">
                <Pressable
                  onPress={() => setShowAddModal(false)}
                  className="flex-1 bg-white/10 rounded-lg py-3 border border-white/20"
                >
                  <Text className="text-white font-semibold text-center">
                    Abbrechen
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleAddFeeding}
                  className="flex-1 bg-white rounded-lg py-3"
                >
                  <Text className="text-blue-600 font-bold text-center">
                    Hinzufügen
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </LinearGradient>
      </Modal>
    </LinearGradient>
  );
}
