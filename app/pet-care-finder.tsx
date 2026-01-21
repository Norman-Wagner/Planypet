import { ScrollView, Text, View, Pressable, TextInput, Linking, Alert } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { GlassCard } from "@/components/ui/glass-card";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface CareProvider {
  id: string;
  name: string;
  type: "sitter" | "pension" | "daycare";
  rating: number;
  reviews: number;
  distance: string;
  price: string;
  phone: string;
  email: string;
  address: string;
  specialties: string[];
  isFavorite: boolean;
}

const MOCK_PROVIDERS: CareProvider[] = [
  {
    id: "1",
    name: "Tierbetreuung Müller",
    type: "sitter",
    rating: 4.9,
    reviews: 127,
    distance: "1.2 km",
    price: "€ 15/Tag",
    phone: "+49 123 456789",
    email: "info@mueller-tierbetreuung.de",
    address: "Hauptstraße 12, 10115 Berlin",
    specialties: ["Hunde", "Katzen"],
    isFavorite: false,
  },
  {
    id: "2",
    name: "Tierpension Sonnenhof",
    type: "pension",
    rating: 4.8,
    reviews: 89,
    distance: "3.5 km",
    price: "€ 25/Tag",
    phone: "+49 123 987654",
    email: "kontakt@sonnenhof-pension.de",
    address: "Waldweg 45, 10115 Berlin",
    specialties: ["Hunde", "Katzen", "Kleintiere"],
    isFavorite: true,
  },
  {
    id: "3",
    name: "Hundetagesstätte Wuff & Co",
    type: "daycare",
    rating: 4.7,
    reviews: 156,
    distance: "2.1 km",
    price: "€ 20/Tag",
    phone: "+49 123 555666",
    email: "info@wuff-und-co.de",
    address: "Parkstraße 78, 10115 Berlin",
    specialties: ["Hunde"],
    isFavorite: false,
  },
  {
    id: "4",
    name: "Mobile Tierbetreuung Schmidt",
    type: "sitter",
    rating: 4.9,
    reviews: 203,
    distance: "0.8 km",
    price: "€ 12/Besuch",
    phone: "+49 123 777888",
    email: "schmidt@mobile-tierbetreuung.de",
    address: "Bergstraße 23, 10115 Berlin",
    specialties: ["Katzen", "Kleintiere", "Fische"],
    isFavorite: false,
  },
];

export default function PetCareFinderScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [providers, setProviders] = useState(MOCK_PROVIDERS);

  const filteredProviders = providers.filter((provider) => {
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = !selectedType || provider.type === selectedType;
    return matchesSearch && matchesType;
  });

  const toggleFavorite = (id: string) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  };

  const handleContact = (provider: CareProvider) => {
    Alert.alert(
      provider.name,
      "Wie möchtest du Kontakt aufnehmen?",
      [
        {
          text: "Anrufen",
          onPress: () => Linking.openURL(`tel:${provider.phone}`),
        },
        {
          text: "E-Mail",
          onPress: () => Linking.openURL(`mailto:${provider.email}`),
        },
        {
          text: "Abbrechen",
          style: "cancel",
        },
      ]
    );
  };

  const getTypeLabel = (type: string): string => {
    switch (type) {
      case "sitter":
        return "Tiersitter";
      case "pension":
        return "Tierpension";
      case "daycare":
        return "Tagesstätte";
      default:
        return type;
    }
  };

  const getTypeIcon = (type: string): any => {
    switch (type) {
      case "sitter":
        return "person.fill";
      case "pension":
        return "house.fill";
      case "daycare":
        return "building.2.fill";
      default:
        return "person.2.fill";
    }
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <Pressable
            onPress={() => router.back()}
            className="mr-4"
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <IconSymbol name="chevron.left" size={28} color={colors.primary} />
          </Pressable>
          <Text className="text-3xl font-bold text-foreground">Tierbetreuung</Text>
        </View>

        {/* Search */}
        <GlassCard className="mb-4">
          <View className="flex-row items-center">
            <IconSymbol name="magnifyingglass" size={20} color={colors.muted} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Suche nach Name oder Tierart..."
              placeholderTextColor={colors.muted}
              className="flex-1 ml-3 text-foreground"
            />
          </View>
        </GlassCard>

        {/* Type Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="mb-6"
          contentContainerStyle={{ gap: 8 }}
        >
          <Pressable
            onPress={() => setSelectedType(null)}
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
          >
            <View
              className={`px-4 py-2 rounded-full ${
                selectedType === null ? "bg-primary" : "bg-surface"
              }`}
            >
              <Text
                className={`font-medium ${
                  selectedType === null ? "text-white" : "text-foreground"
                }`}
              >
                Alle
              </Text>
            </View>
          </Pressable>
          {["sitter", "pension", "daycare"].map((type) => (
            <Pressable
              key={type}
              onPress={() => setSelectedType(type)}
              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
            >
              <View
                className={`px-4 py-2 rounded-full ${
                  selectedType === type ? "bg-primary" : "bg-surface"
                }`}
              >
                <Text
                  className={`font-medium ${
                    selectedType === type ? "text-white" : "text-foreground"
                  }`}
                >
                  {getTypeLabel(type)}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {/* Providers */}
        {filteredProviders.length === 0 ? (
          <GlassCard className="p-8 items-center">
            <IconSymbol name="magnifyingglass" size={48} color={colors.muted} />
            <Text className="text-muted text-center mt-4">
              Keine Anbieter gefunden
            </Text>
          </GlassCard>
        ) : (
          <View className="gap-3">
            {filteredProviders.map((provider) => (
              <GlassCard key={provider.id} className="p-4">
                <View className="flex-row items-start">
                  <View
                    className="w-12 h-12 rounded-xl items-center justify-center mr-3"
                    style={{ backgroundColor: `${colors.primary}15` }}
                  >
                    <IconSymbol
                      name={getTypeIcon(provider.type)}
                      size={24}
                      color={colors.primary}
                    />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-foreground font-semibold text-base flex-1">
                        {provider.name}
                      </Text>
                      <Pressable
                        onPress={() => toggleFavorite(provider.id)}
                        style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                      >
                        <IconSymbol
                          name={provider.isFavorite ? "heart.fill" : "heart"}
                          size={20}
                          color={provider.isFavorite ? colors.error : colors.muted}
                        />
                      </Pressable>
                    </View>
                    <View className="flex-row items-center mt-1">
                      <Text className="text-warning text-sm">★</Text>
                      <Text className="text-muted text-sm ml-1">
                        {provider.rating} ({provider.reviews} Bewertungen)
                      </Text>
                    </View>
                    <View className="flex-row items-center mt-1">
                      <IconSymbol name="location.fill" size={12} color={colors.muted} />
                      <Text className="text-muted text-xs ml-1">
                        {provider.distance} • {provider.price}
                      </Text>
                    </View>
                    <View className="flex-row flex-wrap gap-1 mt-2">
                      {provider.specialties.map((specialty, idx) => (
                        <View
                          key={idx}
                          className="bg-primary/10 px-2 py-1 rounded-full"
                        >
                          <Text className="text-primary text-xs">{specialty}</Text>
                        </View>
                      ))}
                    </View>
                    <Pressable
                      onPress={() => handleContact(provider)}
                      className="mt-3"
                      style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
                    >
                      <View className="bg-primary px-4 py-2 rounded-full items-center">
                        <Text className="text-white font-medium text-sm">
                          Kontakt aufnehmen
                        </Text>
                      </View>
                    </Pressable>
                  </View>
                </View>
              </GlassCard>
            ))}
          </View>
        )}

        {/* Info */}
        <GlassCard className="mt-6 border-warning/30">
          <View className="flex-row items-start">
            <IconSymbol name="info.circle.fill" size={20} color={colors.warning} />
            <View className="flex-1 ml-3">
              <Text className="text-foreground font-medium text-sm">Hinweis</Text>
              <Text className="text-muted text-xs mt-1">
                Die Anbieter sind Beispiele. In der finalen Version werden echte Anbieter in deiner Nähe angezeigt.
              </Text>
            </View>
          </View>
        </GlassCard>
      </ScrollView>
    </ScreenContainer>
  );
}
