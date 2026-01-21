import { ScrollView, Text, View, Pressable, TextInput, Linking, Alert } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { GlassCard } from "@/components/ui/glass-card";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { usePetStore } from "@/lib/pet-store";

interface Product {
  id: string;
  name: string;
  category: "food" | "toy" | "health" | "accessory";
  petType: string[];
  price: string;
  rating: number;
  amazonLink: string;
  inStock: boolean;
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Premium Katzenfutter 10kg",
    category: "food",
    petType: ["cat"],
    price: "€ 29,99",
    rating: 4.8,
    amazonLink: "https://www.amazon.de/s?k=katzenfutter",
    inStock: true,
  },
  {
    id: "2",
    name: "Hundespielzeug Set",
    category: "toy",
    petType: ["dog"],
    price: "€ 19,99",
    rating: 4.6,
    amazonLink: "https://www.amazon.de/s?k=hundespielzeug",
    inStock: true,
  },
  {
    id: "3",
    name: "Vitamin-Tabletten für Katzen",
    category: "health",
    petType: ["cat"],
    price: "€ 14,99",
    rating: 4.7,
    amazonLink: "https://www.amazon.de/s?k=katzen+vitamine",
    inStock: true,
  },
  {
    id: "4",
    name: "Hundehalsband LED",
    category: "accessory",
    petType: ["dog"],
    price: "€ 12,99",
    rating: 4.5,
    amazonLink: "https://www.amazon.de/s?k=hundehalsband+led",
    inStock: true,
  },
  {
    id: "5",
    name: "Fischfutter Premium 500g",
    category: "food",
    petType: ["fish"],
    price: "€ 8,99",
    rating: 4.9,
    amazonLink: "https://www.amazon.de/s?k=fischfutter",
    inStock: true,
  },
  {
    id: "6",
    name: "Kaninchenfutter Bio 5kg",
    category: "food",
    petType: ["rabbit"],
    price: "€ 24,99",
    rating: 4.8,
    amazonLink: "https://www.amazon.de/s?k=kaninchenfutter",
    inStock: false,
  },
];

export default function ShopScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { pets } = usePetStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAmazon = (link: string, productName: string) => {
    Alert.alert(
      "Zu Amazon",
      `Möchtest du "${productName}" auf Amazon ansehen?`,
      [
        {
          text: "Abbrechen",
          style: "cancel",
        },
        {
          text: "Öffnen",
          onPress: () => Linking.openURL(link),
        },
      ]
    );
  };

  const getCategoryIcon = (category: string): any => {
    switch (category) {
      case "food":
        return "fork.knife";
      case "toy":
        return "sportscourt.fill";
      case "health":
        return "cross.fill";
      case "accessory":
        return "bag.fill";
      default:
        return "cube.box.fill";
    }
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case "food":
        return colors.success;
      case "toy":
        return colors.warning;
      case "health":
        return colors.error;
      case "accessory":
        return colors.primary;
      default:
        return colors.muted;
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
          <Text className="text-3xl font-bold text-foreground">Shop</Text>
        </View>

        {/* Search */}
        <GlassCard className="mb-4">
          <View className="flex-row items-center">
            <IconSymbol name="magnifyingglass" size={20} color={colors.muted} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Produkte suchen..."
              placeholderTextColor={colors.muted}
              className="flex-1 ml-3 text-foreground"
            />
          </View>
        </GlassCard>

        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="mb-6"
          contentContainerStyle={{ gap: 8 }}
        >
          <Pressable
            onPress={() => setSelectedCategory(null)}
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
          >
            <View
              className={`px-4 py-2 rounded-full ${
                selectedCategory === null ? "bg-primary" : "bg-surface"
              }`}
            >
              <Text
                className={`font-medium ${
                  selectedCategory === null ? "text-white" : "text-foreground"
                }`}
              >
                Alle
              </Text>
            </View>
          </Pressable>
          {["food", "toy", "health", "accessory"].map((cat) => (
            <Pressable
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
            >
              <View
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === cat ? "bg-primary" : "bg-surface"
                }`}
              >
                <Text
                  className={`font-medium ${
                    selectedCategory === cat ? "text-white" : "text-foreground"
                  }`}
                >
                  {cat === "food" && "Futter"}
                  {cat === "toy" && "Spielzeug"}
                  {cat === "health" && "Gesundheit"}
                  {cat === "accessory" && "Zubehör"}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {/* Recommendations */}
        {pets.length > 0 && !searchQuery && !selectedCategory && (
          <>
            <Text className="text-foreground text-lg font-semibold mb-3">
              Empfohlen für deine Tiere
            </Text>
            <Text className="text-muted text-sm mb-4">
              Basierend auf {pets.map((p) => p.name).join(", ")}
            </Text>
          </>
        )}

        {/* Products */}
        {filteredProducts.length === 0 ? (
          <GlassCard className="p-8 items-center">
            <IconSymbol name="magnifyingglass" size={48} color={colors.muted} />
            <Text className="text-muted text-center mt-4">
              Keine Produkte gefunden
            </Text>
          </GlassCard>
        ) : (
          <View className="gap-3">
            {filteredProducts.map((product) => (
              <Pressable
                key={product.id}
                onPress={() => handleOpenAmazon(product.amazonLink, product.name)}
                style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] })}
              >
                <GlassCard className="p-4">
                  <View className="flex-row items-start">
                    <View
                      className="w-12 h-12 rounded-xl items-center justify-center mr-3"
                      style={{ backgroundColor: `${getCategoryColor(product.category)}15` }}
                    >
                      <IconSymbol
                        name={getCategoryIcon(product.category)}
                        size={24}
                        color={getCategoryColor(product.category)}
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-foreground font-semibold text-base">
                        {product.name}
                      </Text>
                      <View className="flex-row items-center mt-1">
                        <Text className="text-warning text-sm">★</Text>
                        <Text className="text-muted text-sm ml-1">
                          {product.rating} • Amazon
                        </Text>
                      </View>
                      <View className="flex-row items-center justify-between mt-2">
                        <Text className="text-primary font-bold text-lg">
                          {product.price}
                        </Text>
                        {!product.inStock && (
                          <View className="bg-error/20 px-2 py-1 rounded-full">
                            <Text className="text-error text-xs font-medium">
                              Nicht verfügbar
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <IconSymbol name="chevron.right" size={20} color={colors.muted} />
                  </View>
                </GlassCard>
              </Pressable>
            ))}
          </View>
        )}

        {/* Disclaimer */}
        <GlassCard className="mt-6 border-warning/30">
          <View className="flex-row items-start">
            <IconSymbol name="info.circle.fill" size={20} color={colors.warning} />
            <View className="flex-1 ml-3">
              <Text className="text-foreground font-medium text-sm">Hinweis</Text>
              <Text className="text-muted text-xs mt-1">
                Die Produkte werden über Amazon verkauft. Planypet erhält möglicherweise eine kleine Provision bei Käufen über diese Links.
              </Text>
            </View>
          </View>
        </GlassCard>
      </ScrollView>
    </ScreenContainer>
  );
}
