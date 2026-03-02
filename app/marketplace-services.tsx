import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";

interface Provider {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  distance: number;
  price: string;
  phone: string;
}

export default function MarketplaceServicesScreen() {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: "Alle", icon: "star.fill" },
    { id: "vet", label: "Tierarzt", icon: "stethoscope" },
    { id: "trainer", label: "Trainer", icon: "figure.walk" },
    { id: "groomer", label: "Groomer", icon: "scissors" },
    { id: "telehealth", label: "Telemedizin", icon: "video.fill" },
  ];

  const providers: Provider[] = [
    {
      id: "1",
      name: "Dr. Schmidt Tierarztpraxis",
      category: "vet",
      rating: 4.8,
      reviews: 156,
      distance: 0.8,
      price: "€40-80",
      phone: "+49 123 456789",
    },
    {
      id: "2",
      name: "Max Hundetrainer",
      category: "trainer",
      rating: 4.9,
      reviews: 89,
      distance: 1.2,
      price: "€50-100",
      phone: "+49 123 456790",
    },
    {
      id: "3",
      name: "Bella Grooming Studio",
      category: "groomer",
      rating: 4.7,
      reviews: 124,
      distance: 0.5,
      price: "€30-60",
      phone: "+49 123 456791",
    },
    {
      id: "4",
      name: "TeleVet Online",
      category: "telehealth",
      rating: 4.6,
      reviews: 203,
      distance: 0,
      price: "€25-50",
      phone: "+49 123 456792",
    },
    {
      id: "5",
      name: "Dr. Müller Tierarztpraxis",
      category: "vet",
      rating: 4.9,
      reviews: 178,
      distance: 1.5,
      price: "€45-85",
      phone: "+49 123 456793",
    },
  ];

  const filteredProviders =
    activeCategory === "all"
      ? providers
      : providers.filter((p) => p.category === activeCategory);

  const renderProvider = ({ item }: { item: Provider }) => (
    <Pressable className="bg-white/10 rounded-2xl p-4 border border-white/20 mb-3">
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1">
          <Text className="text-white font-bold text-lg">{item.name}</Text>
          <View className="flex-row items-center gap-2 mt-1">
            <View className="flex-row items-center gap-1">
              <IconSymbol size={14} name="star.fill" color="#F39C12" />
              <Text className="text-white/80 text-xs">
                {item.rating} ({item.reviews})
              </Text>
            </View>
            {item.distance > 0 && (
              <Text className="text-white/60 text-xs">
                {item.distance} km entfernt
              </Text>
            )}
          </View>
        </View>
        <View className="items-end">
          <Text className="text-white font-semibold text-sm">{item.price}</Text>
          <Text className="text-white/60 text-xs mt-1">pro Besuch</Text>
        </View>
      </View>

      <View className="flex-row gap-2">
        <Pressable className="flex-1 py-2 rounded-lg bg-white/20 items-center justify-center">
          <View className="flex-row items-center gap-1">
            <IconSymbol size={14} name="phone.fill" color="#FFFFFF" />
            <Text className="text-white text-xs font-semibold">Anrufen</Text>
          </View>
        </Pressable>
        <Pressable className="flex-1 py-2 rounded-lg bg-white/20 items-center justify-center">
          <View className="flex-row items-center gap-1">
            <IconSymbol size={14} name="envelope.fill" color="#FFFFFF" />
            <Text className="text-white text-xs font-semibold">Nachricht</Text>
          </View>
        </Pressable>
        <Pressable className="flex-1 py-2 rounded-lg bg-white/20 items-center justify-center">
          <View className="flex-row items-center gap-1">
            <IconSymbol size={14} name="calendar" color="#FFFFFF" />
            <Text className="text-white text-xs font-semibold">Termin</Text>
          </View>
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <LinearGradient
      colors={["#F39C12", "#D68910"]}
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
              Dienstleistungen
            </Text>
            <Text className="text-white text-2xl font-bold">Marktplatz</Text>
          </View>
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
          >
            <IconSymbol size={20} name="xmark" color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-6"
        >
          <View className="flex-row gap-2">
            {categories.map((cat) => (
              <Pressable
                key={cat.id}
                onPress={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full ${
                  activeCategory === cat.id
                    ? "bg-white"
                    : "bg-white/20 border border-white/30"
                }`}
              >
                <Text
                  className={`font-semibold ${
                    activeCategory === cat.id ? "text-orange-600" : "text-white"
                  }`}
                >
                  {cat.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {/* Results Count */}
        <Text className="text-white/70 text-sm mb-4">
          {filteredProviders.length} Anbieter gefunden
        </Text>

        {/* Providers List */}
        <FlatList
          data={filteredProviders}
          renderItem={renderProvider}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={{ marginBottom: 16 }}
        />

        {/* Search Tips */}
        <View className="bg-white/10 rounded-2xl p-4 border border-white/20 mb-6">
          <View className="flex-row gap-3">
            <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
              <IconSymbol size={20} name="lightbulb.fill" color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-semibold text-sm mb-1">
                Tipp
              </Text>
              <Text className="text-white/70 text-xs">
                Nutzen Sie die Filterfunktion, um Dienstleistungen in Ihrer Nähe
                zu finden.
              </Text>
            </View>
          </View>
        </View>

        {/* Liability Disclaimer */}
        <View className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <Text className="text-white/60 text-xs leading-relaxed">
            <Text className="font-semibold">Hinweis:</Text> Planypet ist nicht
            verantwortlich für die Qualität der Dienstleistungen. Überprüfen
            Sie die Bewertungen und Qualifikationen vor der Buchung.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
