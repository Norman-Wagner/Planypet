
import React, { useState } from 'react';
import { ScrollView, Text, View, Pressable, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { usePetStore } from '@/lib/pet-store';

interface Supply {
  id: string;
  name: string;
  category: 'food' | 'medication' | 'accessory';
  quantity: number;
  unit: string;
  lowStockThreshold: number;
  expiryDate?: string;
  notes?: string;
}

const DESIGN_COLORS = {
  background: '#0A0A0F',
  gold: '#D4A843',
  card: '#141418',
  cardBorder: 'rgba(212, 168, 67, 0.08)',
  textPrimary: '#FAFAF8',
  textSecondary: '#8B8B80',
  textMuted: '#6B6B6B',
  textDim: '#4A4A4A',
  success: '#4CAF50', // A suitable success color
  error: '#F44336',   // A suitable error color
};

export default function SuppliesScreen() {
  const insets = useSafeAreaInsets();
  const { pets } = usePetStore();

  // Mock data
  const [supplies, setSupplies] = useState<Supply[]>([
    { id: '1', name: 'Trockenfutter Premium', category: 'food', quantity: 3, unit: 'kg', lowStockThreshold: 2, expiryDate: '2026-06-15' },
    { id: '2', name: 'Nassfutter Huhn', category: 'food', quantity: 12, unit: 'Dosen', lowStockThreshold: 5, expiryDate: '2026-03-20' },
    { id: '3', name: 'Wurmkur', category: 'medication', quantity: 2, unit: 'Tabletten', lowStockThreshold: 1, expiryDate: '2025-12-31' },
  ]);

  const getLowStockItems = () => supplies.filter((s) => s.quantity <= s.lowStockThreshold);

  const getExpiringItems = () => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    return supplies.filter((s) => {
      if (!s.expiryDate) return false;
      const expiryDate = new Date(s.expiryDate);
      return expiryDate <= thirtyDaysFromNow && expiryDate >= now;
    });
  };

  const getCategoryIcon = (category: Supply['category']) => {
    switch (category) {
      case 'food': return 'cube.box.fill';
      case 'medication': return 'cross.case.fill';
      case 'accessory': return 'bag.fill';
    }
  };

  const handleAddSupply = () => {
    Alert.alert('Vorrat hinzufügen', 'Diese Funktion wird bald verfügbar sein');
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setSupplies((prev) =>
      prev.map((s) => (s.id === id ? { ...s, quantity: Math.max(0, s.quantity + delta) } : s))
    );
  };

  const lowStockItems = getLowStockItems();
  const expiringItems = getExpiringItems();

  const renderWarningCard = (title: string, items: { id: string; name: string; details: string }[], icon: string) => (
    <View style={styles.card}>
      <View style={styles.warningHeader}>
        <IconSymbol name={icon} size={18} color={DESIGN_COLORS.gold} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {items.map((item) => (
        <Text key={item.id} style={styles.warningItemText}>
          • {item.name}: {item.details}
        </Text>
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
            <IconSymbol name="chevron.left" size={26} color={DESIGN_COLORS.gold} />
          </Pressable>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>VORRÄTE</Text>
            <Text style={styles.headerSubtitle}>Futter, Medizin & Zubehör</Text>
            <View style={styles.goldDivider} />
          </View>
          <Pressable onPress={handleAddSupply} style={({ pressed }) => [styles.addButton, { opacity: pressed ? 0.7 : 1 }]}>
             <IconSymbol name="plus" size={20} color={DESIGN_COLORS.background} />
          </Pressable>
        </View>

        <View style={styles.contentPadding}>
          {/* Warnings */}
          {lowStockItems.length > 0 && renderWarningCard(
            'Niedriger Bestand',
            lowStockItems.map(item => ({ id: item.id, name: item.name, details: `${item.quantity} ${item.unit}` })),
            'exclamationmark.triangle.fill'
          )}

          {expiringItems.length > 0 && renderWarningCard(
            'Läuft bald ab',
            expiringItems.map(item => ({ id: item.id, name: item.name, details: new Date(item.expiryDate!).toLocaleDateString('de-DE') })),
            'clock.fill'
          )}

          {/* Supplies List */}
          <Text style={[styles.sectionTitle, { marginTop: 20, marginBottom: 12 }]}>Alle Vorräte</Text>
          {supplies.map((supply) => (
            <View key={supply.id} style={styles.card}>
              <View style={styles.supplyItemContainer}>
                <View style={[styles.categoryIconContainer, { backgroundColor: `${DESIGN_COLORS.gold}20` }]}>
                  <IconSymbol name={getCategoryIcon(supply.category) as any} size={22} color={DESIGN_COLORS.gold} />
                </View>
                <View style={styles.supplyInfoContainer}>
                  <Text style={styles.supplyName}>{supply.name}</Text>
                  <Text style={styles.supplyDetails}>
                    {supply.quantity} {supply.unit}
                    {supply.expiryDate && ` • MHD: ${new Date(supply.expiryDate).toLocaleDateString('de-DE')}`}
                  </Text>
                  {supply.quantity <= supply.lowStockThreshold && (
                    <Text style={styles.lowStockWarning}>Niedriger Bestand</Text>
                  )}
                </View>
                <View style={styles.quantityButtonsContainer}>
                  <Pressable onPress={() => handleUpdateQuantity(supply.id, -1)} style={({ pressed }) => [styles.quantityButton, { opacity: pressed ? 0.7 : 1, backgroundColor: `${DESIGN_COLORS.error}20` }]}>
                    <IconSymbol name="minus" size={16} color={DESIGN_COLORS.error} />
                  </Pressable>
                  <Pressable onPress={() => handleUpdateQuantity(supply.id, 1)} style={({ pressed }) => [styles.quantityButton, { opacity: pressed ? 0.7 : 1, backgroundColor: `${DESIGN_COLORS.success}20` }]}>
                    <IconSymbol name="plus" size={16} color={DESIGN_COLORS.success} />
                  </Pressable>
                </View>
              </View>
            </View>
          ))}

          {/* Shopping List */}
          {lowStockItems.length > 0 && (
            <View style={{ marginTop: 24 }}>
              <Text style={styles.sectionTitle}>Einkaufsliste</Text>
              <View style={styles.card}>
                {lowStockItems.map((item) => (
                  <View key={item.id} style={styles.shoppingListItem}>
                    <View style={styles.checkbox} />
                    <Text style={styles.shoppingItemText}>{item.name}</Text>
                    <Text style={styles.shoppingItemQuantity}>
                      {item.lowStockThreshold - item.quantity} {item.unit}
                    </Text>
                  </View>
                ))}
                <Pressable style={({ pressed }) => [styles.shareButton, { opacity: pressed ? 0.8 : 1 }]} onPress={() => Alert.alert('Teilen', 'Einkaufsliste wird geteilt...')}>
                    <Text style={styles.shareButtonText}>Einkaufsliste teilen</Text>
                    <IconSymbol name="square.and.arrow.up" size={16} color={DESIGN_COLORS.background} />
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DESIGN_COLORS.background,
  },
  contentPadding: {
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginBottom: 10,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    color: DESIGN_COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '300',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  headerSubtitle: {
    color: DESIGN_COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  goldDivider: {
    height: 1,
    width: 40,
    backgroundColor: DESIGN_COLORS.gold,
    marginTop: 10,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: DESIGN_COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: DESIGN_COLORS.gold,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: DESIGN_COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: DESIGN_COLORS.cardBorder,
    padding: 16,
    marginBottom: 12,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  warningItemText: {
    color: DESIGN_COLORS.textSecondary,
    fontSize: 13,
    marginLeft: 26, // Align with title
    lineHeight: 18,
  },
  supplyItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  supplyInfoContainer: {
    flex: 1,
  },
  supplyName: {
    color: DESIGN_COLORS.textPrimary,
    fontWeight: '600',
    fontSize: 16,
  },
  supplyDetails: {
    color: DESIGN_COLORS.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  lowStockWarning: {
    color: DESIGN_COLORS.gold,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 5,
  },
  quantityButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shoppingListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: DESIGN_COLORS.cardBorder,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: DESIGN_COLORS.gold,
    marginRight: 12,
  },
  shoppingItemText: {
    flex: 1,
    color: DESIGN_COLORS.textPrimary,
    fontSize: 15,
  },
  shoppingItemQuantity: {
    color: DESIGN_COLORS.textSecondary,
    fontSize: 14,
  },
  shareButton: {
    backgroundColor: DESIGN_COLORS.gold,
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  shareButtonText: {
    color: DESIGN_COLORS.background,
    fontWeight: '600',
    fontSize: 16,
  },
});
