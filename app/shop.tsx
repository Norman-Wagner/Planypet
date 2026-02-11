import { ScrollView, Text, View, Pressable, TextInput, Linking, Alert, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { usePetStore } from "@/lib/pet-store";

interface Product { id: string; name: string; category: "food" | "toy" | "health" | "accessory"; price: string; rating: number; amazonLink: string; inStock: boolean; }

const MOCK_PRODUCTS: Product[] = [
  { id: "1", name: "Premium Katzenfutter 10kg", category: "food", price: "29,99", rating: 4.8, amazonLink: "https://www.amazon.de/s?k=katzenfutter", inStock: true },
  { id: "2", name: "Hundespielzeug Set", category: "toy", price: "19,99", rating: 4.6, amazonLink: "https://www.amazon.de/s?k=hundespielzeug", inStock: true },
  { id: "3", name: "Vitamin-Tabletten fuer Katzen", category: "health", price: "14,99", rating: 4.7, amazonLink: "https://www.amazon.de/s?k=katzen+vitamine", inStock: true },
  { id: "4", name: "Hundehalsband LED", category: "accessory", price: "12,99", rating: 4.5, amazonLink: "https://www.amazon.de/s?k=hundehalsband+led", inStock: true },
  { id: "5", name: "Fischfutter Premium 500g", category: "food", price: "8,99", rating: 4.9, amazonLink: "https://www.amazon.de/s?k=fischfutter", inStock: true },
  { id: "6", name: "Kaninchenfutter Bio 5kg", category: "food", price: "24,99", rating: 4.8, amazonLink: "https://www.amazon.de/s?k=kaninchenfutter", inStock: false },
];

const catLabel: Record<string, string> = { food: "Futter", toy: "Spielzeug", health: "Gesundheit", accessory: "Zubehoer" };
const catIcon: Record<string, string> = { food: "fork.knife", toy: "sportscourt.fill", health: "cross.fill", accessory: "bag.fill" };
const catColor: Record<string, string> = { food: "#66BB6A", toy: "#FFB74D", health: "#EF5350", accessory: "#42A5F5" };

export default function ShopScreen() {
  const insets = useSafeAreaInsets();
  const { pets } = usePetStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filtered = MOCK_PRODUCTS.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = !selectedCategory || p.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const openAmazon = (link: string, name: string) => {
    Alert.alert("Zu Amazon", `Moechtest du "${name}" auf Amazon ansehen?`, [
      { text: "Abbrechen", style: "cancel" },
      { text: "Oeffnen", onPress: () => Linking.openURL(link) },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0F" }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40, paddingHorizontal: 20 }}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [s.backBtn, pressed && { opacity: 0.6 }]}>
          <IconSymbol name="chevron.left" size={20} color="#D4A843" />
          <Text style={s.backText}>Zurueck</Text>
        </Pressable>
        <View style={s.header}>
          <Text style={s.headerTitle}>Shop</Text>
          <Text style={s.headerSub}>Empfehlungen fuer dein Tier</Text>
          <View style={s.goldDivider} />
        </View>

        {/* Search */}
        <View style={s.searchBar}>
          <IconSymbol name="magnifyingglass" size={18} color="#4A4A4A" />
          <TextInput value={searchQuery} onChangeText={setSearchQuery} placeholder="Produkte suchen..." placeholderTextColor="#4A4A4A" style={s.searchInput} />
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 24 }}>
          <Pressable onPress={() => setSelectedCategory(null)} style={({ pressed }) => [s.catBtn, !selectedCategory && s.catBtnActive, pressed && { opacity: 0.7 }]}>
            <Text style={[s.catText, !selectedCategory && s.catTextActive]}>Alle</Text>
          </Pressable>
          {(["food", "toy", "health", "accessory"] as const).map((cat) => (
            <Pressable key={cat} onPress={() => setSelectedCategory(cat)} style={({ pressed }) => [s.catBtn, selectedCategory === cat && s.catBtnActive, pressed && { opacity: 0.7 }]}>
              <Text style={[s.catText, selectedCategory === cat && s.catTextActive]}>{catLabel[cat]}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {pets.length > 0 && !searchQuery && !selectedCategory && (
          <Text style={{ fontSize: 12, fontWeight: "400", color: "#6B6B6B", marginBottom: 16 }}>Empfohlen fuer {pets.map((p) => p.name).join(", ")}</Text>
        )}

        {/* Products */}
        {filtered.length === 0 ? (
          <View style={[s.card, { padding: 40, alignItems: "center" }]}>
            <IconSymbol name="magnifyingglass" size={32} color="#4A4A4A" />
            <Text style={{ fontSize: 13, color: "#6B6B6B", marginTop: 12 }}>Keine Produkte gefunden</Text>
          </View>
        ) : (
          filtered.map((product) => (
            <Pressable key={product.id} onPress={() => openAmazon(product.amazonLink, product.name)} style={({ pressed }) => [s.card, { marginBottom: 8 }, pressed && { opacity: 0.8 }]}>
              <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 14 }}>
                <View style={[s.prodIcon, { backgroundColor: `${catColor[product.category]}12` }]}>
                  <IconSymbol name={catIcon[product.category] as any} size={20} color={catColor[product.category]} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.prodName}>{product.name}</Text>
                  <Text style={s.prodMeta}>{product.rating} · Amazon</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                    <Text style={s.prodPrice}>{product.price} EUR</Text>
                    {!product.inStock && <View style={s.outBadge}><Text style={s.outText}>Nicht verfuegbar</Text></View>}
                  </View>
                </View>
                <IconSymbol name="chevron.right" size={14} color="#4A4A4A" />
              </View>
            </Pressable>
          ))
        )}

        <View style={s.disclaimer}>
          <IconSymbol name="info.circle.fill" size={16} color="#D4A843" />
          <Text style={s.disclaimerText}>Die Produkte werden ueber Amazon verkauft. Planypet erhaelt moeglicherweise eine kleine Provision bei Kaeufen ueber diese Links.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  backBtn: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 },
  backText: { fontSize: 14, fontWeight: "500", color: "#D4A843", letterSpacing: 0.5 },
  header: { marginBottom: 32 },
  headerTitle: { fontSize: 28, fontWeight: "300", color: "#FAFAF8", letterSpacing: 2 },
  headerSub: { fontSize: 12, fontWeight: "400", color: "#6B6B6B", letterSpacing: 1, marginTop: 4 },
  goldDivider: { width: 40, height: 1, backgroundColor: "#D4A843", marginTop: 16 },
  searchBar: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "#141418", borderWidth: 1, borderColor: "rgba(212,168,67,0.08)", paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16 },
  searchInput: { flex: 1, fontSize: 14, color: "#FAFAF8", letterSpacing: 0.3 },
  catBtn: { paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: "rgba(212,168,67,0.1)" },
  catBtnActive: { borderColor: "#D4A843", backgroundColor: "rgba(212,168,67,0.08)" },
  catText: { fontSize: 12, fontWeight: "500", color: "#6B6B6B", letterSpacing: 0.5 },
  catTextActive: { color: "#D4A843" },
  card: { backgroundColor: "#141418", padding: 16, borderWidth: 1, borderColor: "rgba(212,168,67,0.08)" },
  prodIcon: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  prodName: { fontSize: 15, fontWeight: "500", color: "#FAFAF8", letterSpacing: 0.3 },
  prodMeta: { fontSize: 12, fontWeight: "400", color: "#6B6B6B", marginTop: 2 },
  prodPrice: { fontSize: 18, fontWeight: "300", color: "#D4A843", letterSpacing: 0.5 },
  outBadge: { backgroundColor: "rgba(239,83,80,0.1)", paddingHorizontal: 10, paddingVertical: 3 },
  outText: { fontSize: 11, fontWeight: "500", color: "#EF5350" },
  disclaimer: { flexDirection: "row", gap: 10, marginTop: 24, backgroundColor: "rgba(212,168,67,0.05)", padding: 16, borderWidth: 1, borderColor: "rgba(212,168,67,0.1)" },
  disclaimerText: { flex: 1, fontSize: 12, fontWeight: "400", color: "#6B6B6B", lineHeight: 18 },
});
