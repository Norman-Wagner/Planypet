import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

interface Product {
  id: string;
  name: string;
  category: "food" | "toys" | "accessories" | "health";
  price: number;
  supplier: string;
  rating: number;
  inStock: boolean;
  lastOrdered?: string;
}

interface CartItem {
  productId: string;
  quantity: number;
}

const CATEGORIES = {
  food: "🍖 Futter",
  toys: "🎾 Spielzeug",
  accessories: "🦴 Zubehör",
  health: "💊 Gesundheit",
};

const SUPPLIERS = ["Amazon", "Fressnapf", "Zooplus", "Bitiba", "Hundeland"];

export default function MarketplaceScreen() {
  const colors = useColors();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "food" | "toys" | "accessories" | "health" | "all"
  >("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products] = useState<Product[]>([
    {
      id: "1",
      name: "Premium Hundefutter",
      category: "food",
      price: 24.99,
      supplier: "Fressnapf",
      rating: 4.8,
      inStock: true,
      lastOrdered: "2026-02-15",
    },
    {
      id: "2",
      name: "Kausnack Zahnpflege",
      category: "food",
      price: 12.99,
      supplier: "Zooplus",
      rating: 4.6,
      inStock: true,
    },
    {
      id: "3",
      name: "Tennisball Set",
      category: "toys",
      price: 8.99,
      supplier: "Amazon",
      rating: 4.5,
      inStock: true,
    },
    {
      id: "4",
      name: "Halsband mit GPS",
      category: "accessories",
      price: 79.99,
      supplier: "Bitiba",
      rating: 4.7,
      inStock: true,
    },
    {
      id: "5",
      name: "Vitamin-Ergänzung",
      category: "health",
      price: 19.99,
      supplier: "Hundeland",
      rating: 4.9,
      inStock: true,
    },
    {
      id: "6",
      name: "Leckerli-Spender",
      category: "toys",
      price: 15.99,
      supplier: "Zooplus",
      rating: 4.4,
      inStock: false,
    },
  ]);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (productId: string) => {
    const existingItem = cart.find((item) => item.productId === productId);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { productId, quantity: 1 }]);
    }
    Alert.alert("Erfolg", "Produkt zum Warenkorb hinzugefügt");
  };

  const cartTotal = cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="pb-6">
        {/* Header */}
        <View className="mb-4">
          <Text className="text-3xl font-bold text-foreground mb-2">
            Marktplatz
          </Text>
          <Text className="text-muted">
            Futter & Zubehör von verschiedenen Anbietern
          </Text>
        </View>

        {/* Search Bar */}
        <View className="mb-4">
          <View className="flex-row items-center bg-surface border border-border rounded-lg px-3 py-2">
            <IconSymbol name="magnifyingglass" size={20} color={colors.muted} />
            <TextInput
              className="flex-1 ml-2 text-foreground"
              placeholder="Suche nach Produkten..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.muted}
            />
          </View>
        </View>

        {/* Category Filter */}
        <View className="mb-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="gap-2"
          >
            <TouchableOpacity
              className={`px-4 py-2 rounded-full ${
                selectedCategory === "all"
                  ? "bg-primary"
                  : "bg-surface border border-border"
              }`}
              onPress={() => setSelectedCategory("all")}
            >
              <Text
                className={
                  selectedCategory === "all"
                    ? "text-background font-semibold"
                    : "text-foreground"
                }
              >
                Alle
              </Text>
            </TouchableOpacity>
            {(Object.entries(CATEGORIES) as [Product["category"], string][]).map(
              ([category, label]) => (
                <TouchableOpacity
                  key={category}
                  className={`px-4 py-2 rounded-full ${
                    selectedCategory === category
                      ? "bg-primary"
                      : "bg-surface border border-border"
                  }`}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text
                    className={
                      selectedCategory === category
                        ? "text-background font-semibold"
                        : "text-foreground"
                    }
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </ScrollView>
        </View>

        {/* Products List */}
        <FlatList
          data={filteredProducts}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              className="bg-surface rounded-lg border border-border p-4 mb-3"
              style={{ opacity: item.inStock ? 1 : 0.5 }}
            >
              <View className="flex-row justify-between items-start gap-3 mb-2">
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-foreground mb-1">
                    {item.name}
                  </Text>
                  <View className="flex-row items-center gap-2 mb-2">
                    <Text className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                      {CATEGORIES[item.category]}
                    </Text>
                    <View className="flex-row items-center gap-1">
                      <IconSymbol name="star.fill" size={14} color="#FFD700" />
                      <Text className="text-xs text-muted">{item.rating}</Text>
                    </View>
                  </View>
                  <Text className="text-sm text-muted mb-1">{item.supplier}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-xl font-bold text-primary">
                    €{item.price.toFixed(2)}
                  </Text>
                  {item.lastOrdered && (
                    <Text className="text-xs text-muted">
                      Zuletzt: {item.lastOrdered}
                    </Text>
                  )}
                </View>
              </View>

              {/* Add to Cart Button */}
              <TouchableOpacity
                className={`py-2 rounded-lg items-center ${
                  item.inStock
                    ? "bg-primary"
                    : "bg-muted/30"
                }`}
                onPress={() => handleAddToCart(item.id)}
                disabled={!item.inStock}
              >
                <Text
                  className={
                    item.inStock
                      ? "text-background font-semibold"
                      : "text-muted font-semibold"
                  }
                >
                  {item.inStock ? "🛒 Warenkorb" : "Nicht verfügbar"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />

        {/* Cart Summary */}
        {cart.length > 0 && (
          <View className="bg-primary/10 border border-primary rounded-lg p-4 mt-6">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-semibold text-foreground">
                Warenkorb ({cart.length} Artikel)
              </Text>
              <Text className="text-2xl font-bold text-primary">
                €{cartTotal.toFixed(2)}
              </Text>
            </View>
            <TouchableOpacity className="bg-primary rounded-lg py-3 items-center">
              <Text className="text-background font-semibold">
                Zur Kasse
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Info Box */}
        <View className="bg-info/10 border border-info rounded-lg p-4 mt-6">
          <Text className="text-sm text-info font-semibold mb-2">
            ℹ️ Über den Marktplatz
          </Text>
          <Text className="text-xs text-info leading-relaxed">
            Wir durchsuchen verschiedene Marktplätze und zeigen dir die besten
            Angebote. Deine Bestellungen werden intern erfasst, um dir später
            personalisierte Empfehlungen zu geben.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
