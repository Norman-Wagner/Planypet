import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert, ActivityIndicator } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { usePetStore } from '@/lib/pet-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SupplyItem {
  id: string;
  petId: string;
  name: string;
  brand: string;
  quantity: number;
  unit: string;
  minimumStock: number;
  displayMode: 'dashboard-only' | 'always' | 'custom';
  reminderEnabled: boolean;
  lastPrice?: number;
  marketplaceLinks?: Array<{ name: string; url: string; price: number }>;
  createdAt: string;
}

export default function SuppliesManagementScreen() {
  const colors = useColors();
  const { pets } = usePetStore();
  const [supplies, setSupplies] = useState<SupplyItem[]>([]);
  const [selectedPet, setSelectedPet] = useState(pets[0]?.id || '');
  const [isAdding, setIsAdding] = useState(false);
  const [newSupply, setNewSupply] = useState({
    name: '',
    brand: '',
    quantity: 0,
    unit: 'kg',
    minimumStock: 0,
    displayMode: 'always' as 'dashboard-only' | 'always' | 'custom',
    reminderEnabled: false,
  });
  const [searchingMarketplace, setSearchingMarketplace] = useState(false);

  useEffect(() => {
    loadSupplies();
  }, []);

  const loadSupplies = async () => {
    try {
      const stored = await AsyncStorage.getItem('supplies');
      if (stored) setSupplies(JSON.parse(stored));
    } catch (error) {
      console.error('Error loading supplies:', error);
    }
  };

  const searchMarketplaces = async (productName: string, brand: string) => {
    setSearchingMarketplace(true);
    try {
      // Simulate KI-powered marketplace search
      // In production: Call backend API that searches multiple marketplaces
      const mockResults = [
        { name: 'Amazon', url: `https://amazon.de/s?k=${productName}`, price: 15.99 },
        { name: 'Fressnapf', url: `https://fressnapf.de/search?q=${productName}`, price: 14.99 },
        { name: 'Zooplus', url: `https://zooplus.de/search?q=${productName}`, price: 13.99 },
        { name: 'eBay', url: `https://ebay.de/sch/i.html?_nkw=${productName}`, price: 16.49 },
      ];
      
      return mockResults;
    } catch (error) {
      console.error('Marketplace search error:', error);
      return [];
    } finally {
      setSearchingMarketplace(false);
    }
  };

  const addSupply = async () => {
    if (!newSupply.name.trim() || !selectedPet) {
      Alert.alert('Fehler', 'Bitte alle Felder ausfüllen');
      return;
    }

    setSearchingMarketplace(true);
    try {
      // Search marketplaces
      const marketplaceLinks = await searchMarketplaces(newSupply.name, newSupply.brand);

      const supply: SupplyItem = {
        id: Date.now().toString(),
        petId: selectedPet,
        ...newSupply,
        marketplaceLinks,
        createdAt: new Date().toISOString(),
      };

      const updated = [...supplies, supply];
      setSupplies(updated);
      await AsyncStorage.setItem('supplies', JSON.stringify(updated));

      Alert.alert('Erfolg', `${newSupply.name} hinzugefügt!\n\nGefundene Angebote: ${marketplaceLinks.length}`);
      
      setNewSupply({
        name: '',
        brand: '',
        quantity: 0,
        unit: 'kg',
        minimumStock: 0,
        displayMode: 'always',
        reminderEnabled: false,
      });
      setIsAdding(false);
    } catch (error) {
      Alert.alert('Fehler', 'Produkt konnte nicht hinzugefügt werden');
    } finally {
      setSearchingMarketplace(false);
    }
  };

  const updateSupplyQuantity = async (id: string, newQuantity: number) => {
    const updated = supplies.map(s => s.id === id ? { ...s, quantity: newQuantity } : s);
    setSupplies(updated);
    await AsyncStorage.setItem('supplies', JSON.stringify(updated));
  };

  const deleteSupply = async (id: string) => {
    const updated = supplies.filter(s => s.id !== id);
    setSupplies(updated);
    await AsyncStorage.setItem('supplies', JSON.stringify(updated));
  };

  const lowStockSupplies = supplies.filter(s => s.quantity < s.minimumStock);

  return (
    <ScreenContainer className="p-6 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Vorratsverwaltung</Text>
            <Text className="text-base text-muted">Verwalte Futter und Bedarf</Text>
          </View>

          {/* Low Stock Alert */}
          {lowStockSupplies.length > 0 && (
            <View className="bg-warning/10 border border-warning rounded-xl p-4 gap-2">
              <Text className="font-bold text-warning">⚠️ {lowStockSupplies.length} Produkt(e) unter Mindestbestand</Text>
              {lowStockSupplies.map(s => (
                <Text key={s.id} className="text-sm text-muted">{s.name}: {s.quantity} {s.unit}</Text>
              ))}
            </View>
          )}

          {/* Pet Selector */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Tier auswählen</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
              {pets.map(pet => (
                <Pressable
                  key={pet.id}
                  onPress={() => setSelectedPet(pet.id)}
                  className={`px-4 py-2 rounded-full ${selectedPet === pet.id ? 'bg-primary' : 'bg-surface'}`}
                >
                  <Text className={selectedPet === pet.id ? 'text-background font-bold' : 'text-foreground'}>
                    {pet.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Add Supply Button */}
          <Pressable
            onPress={() => setIsAdding(!isAdding)}
            className="bg-primary rounded-xl p-4 items-center"
          >
            <Text className="text-lg font-bold text-background">
              {isAdding ? 'Abbrechen' : '+ Produkt hinzufügen'}
            </Text>
          </Pressable>

          {/* Add Supply Form */}
          {isAdding && (
            <View className="bg-surface rounded-xl p-6 gap-4">
              <TextInput
                placeholder="Produktname (z.B. Hundefutter)"
                placeholderTextColor="#6B6B6B"
                value={newSupply.name}
                onChangeText={(text) => setNewSupply({ ...newSupply, name: text })}
                className="bg-background text-foreground p-3 rounded-lg border border-border"
              />

              <TextInput
                placeholder="Marke (z.B. Royal Canin)"
                placeholderTextColor="#6B6B6B"
                value={newSupply.brand}
                onChangeText={(text) => setNewSupply({ ...newSupply, brand: text })}
                className="bg-background text-foreground p-3 rounded-lg border border-border"
              />

              <View className="flex-row gap-3">
                <TextInput
                  placeholder="Menge"
                  placeholderTextColor="#6B6B6B"
                  keyboardType="decimal-pad"
                  value={newSupply.quantity.toString()}
                  onChangeText={(text) => setNewSupply({ ...newSupply, quantity: parseFloat(text) || 0 })}
                  className="flex-1 bg-background text-foreground p-3 rounded-lg border border-border"
                />
                <TextInput
                  placeholder="Einheit"
                  placeholderTextColor="#6B6B6B"
                  value={newSupply.unit}
                  onChangeText={(text) => setNewSupply({ ...newSupply, unit: text })}
                  className="flex-1 bg-background text-foreground p-3 rounded-lg border border-border"
                />
              </View>

              <TextInput
                placeholder="Mindestbestand"
                placeholderTextColor="#6B6B6B"
                keyboardType="decimal-pad"
                value={newSupply.minimumStock.toString()}
                onChangeText={(text) => setNewSupply({ ...newSupply, minimumStock: parseFloat(text) || 0 })}
                className="bg-background text-foreground p-3 rounded-lg border border-border"
              />

              {/* Display Mode */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">Anzeigemodus</Text>
                {(['always', 'dashboard-only', 'custom'] as const).map(mode => (
                  <Pressable
                    key={mode}
                    onPress={() => setNewSupply({ ...newSupply, displayMode: mode })}
                    className={`p-3 rounded-lg border ${newSupply.displayMode === mode ? 'border-primary bg-primary/10' : 'border-border'}`}
                  >
                    <Text className="text-foreground font-semibold">
                      {mode === 'always' ? 'Immer anzeigen' : mode === 'dashboard-only' ? 'Nur Dashboard' : 'Benutzerdefiniert'}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* Reminder Toggle */}
              <Pressable
                onPress={() => setNewSupply({ ...newSupply, reminderEnabled: !newSupply.reminderEnabled })}
                className={`p-3 rounded-lg border ${newSupply.reminderEnabled ? 'border-primary bg-primary/10' : 'border-border'}`}
              >
                <Text className="text-foreground font-semibold">
                  {newSupply.reminderEnabled ? '🔔 Erinnerung aktiviert' : '🔕 Erinnerung deaktiviert'}
                </Text>
              </Pressable>

              {/* Add Button */}
              <Pressable
                onPress={addSupply}
                disabled={searchingMarketplace}
                className="bg-primary rounded-lg p-3 items-center"
              >
                {searchingMarketplace ? (
                  <ActivityIndicator color="#0A0A0F" />
                ) : (
                  <Text className="text-background font-bold">Speichern & Marktplätze durchsuchen</Text>
                )}
              </Pressable>
            </View>
          )}

          {/* Supplies List */}
          <View className="gap-3">
            {supplies.filter(s => s.petId === selectedPet).map(supply => (
              <View key={supply.id} className="bg-surface rounded-xl p-4 gap-3">
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-foreground">{supply.name}</Text>
                    <Text className="text-sm text-muted">{supply.brand}</Text>
                  </View>
                  <Pressable onPress={() => deleteSupply(supply.id)}>
                    <Text className="text-lg text-error">✕</Text>
                  </Pressable>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-sm text-muted">Bestand: {supply.quantity} {supply.unit}</Text>
                  <Text className={`text-sm font-bold ${supply.quantity < supply.minimumStock ? 'text-error' : 'text-success'}`}>
                    Min: {supply.minimumStock} {supply.unit}
                  </Text>
                </View>

                {/* Marketplace Links */}
                {supply.marketplaceLinks && supply.marketplaceLinks.length > 0 && (
                  <View className="gap-2">
                    <Text className="text-xs font-semibold text-muted">Beste Angebote:</Text>
                    {supply.marketplaceLinks.slice(0, 2).map((link, idx) => (
                      <Pressable key={idx} className="bg-background rounded-lg p-2 flex-row justify-between items-center">
                        <Text className="text-sm text-foreground font-semibold">{link.name}</Text>
                        <Text className="text-sm text-primary font-bold">{link.price.toFixed(2)}€</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
