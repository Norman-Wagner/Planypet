
import { ScrollView, Text, View, Pressable, TextInput, Linking, Alert, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { IconSymbol } from "@/components/ui/icon-symbol";

const design = {
  background: '#0A0A0F',
  gold: '#D4A843',
  card: '#141418',
  cardBorder: 'rgba(212,168,67,0.08)',
  textPrimary: '#FAFAF8',
  textSecondary: '#8B8B80',
  textMuted: '#6B6B6B',
  textDimmer: '#4A4A4A',
};

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
      case "sitter": return "Tiersitter";
      case "pension": return "Tierpension";
      case "daycare": return "Tagesstätte";
      default: return type;
    }
  };

  const getTypeIcon = (type: string): any => {
    switch (type) {
      case "sitter": return "person.fill";
      case "pension": return "house.fill";
      case "daycare": return "building.2.fill";
      default: return "person.2.fill";
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20, paddingHorizontal: 24 }}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <IconSymbol name="chevron.left" size={28} color={design.gold} />
          </Pressable>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>TIERBETREUUNG</Text>
            <Text style={styles.headerSubtitle}>Professionelle Betreuer in deiner Nähe finden</Text>
            <View style={styles.headerDivider} />
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchCard}>
          <IconSymbol name="magnifyingglass" size={20} color={design.textMuted} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Suche nach Name oder Tierart..."
            placeholderTextColor={design.textMuted}
            style={styles.searchInput}
          />
        </View>

        {/* Type Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={{ gap: 8 }}
        >
          <Pressable
            onPress={() => setSelectedType(null)}
            style={({ pressed }) => [styles.filterButton, selectedType === null && styles.filterButtonActive, { opacity: pressed ? 0.8 : 1 }]}
          >
            <Text style={[styles.filterButtonText, selectedType === null && styles.filterButtonTextActive]}>Alle</Text>
          </Pressable>
          {["sitter", "pension", "daycare"].map((type) => (
            <Pressable
              key={type}
              onPress={() => setSelectedType(type)}
              style={({ pressed }) => [styles.filterButton, selectedType === type && styles.filterButtonActive, { opacity: pressed ? 0.8 : 1 }]}
            >
              <Text style={[styles.filterButtonText, selectedType === type && styles.filterButtonTextActive]}>{getTypeLabel(type)}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Providers */}
        {filteredProviders.length === 0 ? (
          <View style={[styles.card, styles.emptyStateContainer]}>
            <IconSymbol name="magnifyingglass" size={48} color={design.textMuted} />
            <Text style={styles.emptyStateText}>Keine Anbieter gefunden</Text>
          </View>
        ) : (
          <View style={{ gap: 12 }}>
            {filteredProviders.map((provider) => (
              <View key={provider.id} style={styles.card}>
                <View style={styles.providerCardInner}>
                  <View style={[styles.providerIconContainer, { backgroundColor: `${design.gold}15` }]}>
                    <IconSymbol name={getTypeIcon(provider.type)} size={24} color={design.gold} />
                  </View>
                  <View style={styles.providerDetails}>
                    <View style={styles.providerHeader}>
                      <Text style={styles.providerName}>{provider.name}</Text>
                      <Pressable onPress={() => toggleFavorite(provider.id)} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
                        <IconSymbol name={provider.isFavorite ? "heart.fill" : "heart"} size={20} color={provider.isFavorite ? design.gold : design.textMuted} />
                      </Pressable>
                    </View>
                    <View style={styles.ratingContainer}>
                      <IconSymbol name="star.fill" size={12} color={design.gold} />
                      <Text style={styles.ratingText}>{provider.rating} ({provider.reviews} Bewertungen)</Text>
                    </View>
                    <View style={styles.locationContainer}>
                      <IconSymbol name="location.fill" size={12} color={design.textMuted} />
                      <Text style={styles.locationText}>{provider.distance} • {provider.price}</Text>
                    </View>
                    <View style={styles.specialtiesContainer}>
                      {provider.specialties.map((specialty, idx) => (
                        <View key={idx} style={styles.specialtyBadge}>
                          <Text style={styles.specialtyText}>{specialty}</Text>
                        </View>
                      ))}
                    </View>
                    <Pressable onPress={() => handleContact(provider)} style={({ pressed }) => [styles.contactButton, { opacity: pressed ? 0.8 : 1 }]}>
                      <Text style={styles.contactButtonText}>Kontakt aufnehmen</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Info */}
        <View style={[styles.card, styles.infoCard]}>
            <IconSymbol name="info.circle.fill" size={20} color={design.gold} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Hinweis</Text>
              <Text style={styles.infoText}>Die Anbieter sind Beispiele. In der finalen Version werden echte Anbieter in deiner Nähe angezeigt.</Text>
            </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: design.background,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 0, // Removed padding from here
  },
  headerTitleContainer: {
    marginLeft: 16,
  },
  headerTitle: {
    color: design.textPrimary,
    fontSize: 28,
    fontWeight: '300',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  headerSubtitle: {
    color: design.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  headerDivider: {
    height: 1,
    width: 40,
    backgroundColor: design.gold,
    marginTop: 8,
  },
  searchCard: {
    backgroundColor: design.card,
    borderColor: design.cardBorder,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    color: design.textPrimary,
    fontSize: 16,
  },
  filterScroll: {
    marginBottom: 24,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: design.card,
    borderColor: design.cardBorder,
    borderWidth: 1,
  },
  filterButtonActive: {
    backgroundColor: design.gold,
    borderColor: design.gold,
  },
  filterButtonText: {
    color: design.textSecondary,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: design.background,
  },
  card: {
    backgroundColor: design.card,
    borderColor: design.cardBorder,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  emptyStateContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    color: design.textMuted,
    textAlign: 'center',
    marginTop: 16,
  },
  providerCardInner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  providerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  providerDetails: {
    flex: 1,
  },
  providerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  providerName: {
    color: design.textPrimary,
    fontWeight: '600',
    fontSize: 17,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    color: design.textSecondary,
    fontSize: 13,
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    color: design.textMuted,
    fontSize: 12,
    marginLeft: 4,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  specialtyBadge: {
    backgroundColor: `${design.gold}20`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  specialtyText: {
    color: design.gold,
    fontSize: 12,
    fontWeight: '500',
  },
  contactButton: {
    marginTop: 12,
    backgroundColor: design.gold,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  contactButtonText: {
    color: design.background,
    fontWeight: '600',
    fontSize: 14,
  },
  infoCard: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderColor: `${design.gold}30`,
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    color: design.textPrimary,
    fontWeight: '600',
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  infoText: {
    color: design.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
});
