import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert, ActivityIndicator, Switch } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { usePetStore } from '@/lib/pet-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ChipData {
  id: string;
  petId: string;
  chipNumber: string;
  chipType: 'ISO11784' | 'ISO14443' | 'other';
  registeredDatabases: string[];
  registrationDate: string;
  isVerified: boolean;
  emailSent: boolean;
}

const CHIP_DATABASES = [
  { id: 'tasso', name: 'Tasso (Deutschland)', url: 'https://www.tasso.net' },
  { id: 'findefix', name: 'Findefix (Deutschland)', url: 'https://www.findefix.de' },
  { id: 'tierzentrale', name: 'Tierzentrale (Deutschland)', url: 'https://www.tierzentrale.de' },
  { id: 'europetnet', name: 'Europetnet (International)', url: 'https://www.europetnet.org' },
  { id: 'amicanimal', name: 'Amichanimal (International)', url: 'https://www.amichanimal.net' },
  { id: 'petlink', name: 'PetLink (USA/Kanada)', url: 'https://www.petlink.net' },
  { id: 'akcreunite', name: 'AKC Reunite (USA)', url: 'https://www.akcreunite.org' },
  { id: 'microchipregistry', name: 'Microchip Registry (USA)', url: 'https://www.microchipregistry.org' },
  { id: 'australianpetregistry', name: 'Australian Pet Registry', url: 'https://www.australianpetregistry.com.au' },
];

export default function ChipRegistrationScreen() {
  const colors = useColors();
  const { pets } = usePetStore();
  const [selectedPet, setSelectedPet] = useState(pets[0]?.id || '');
  const [chipNumber, setChipNumber] = useState('');
  const [chipType, setChipType] = useState<'ISO11784' | 'ISO14443' | 'other'>('ISO11784');
  const [selectedDatabases, setSelectedDatabases] = useState<string[]>([]);
  const [consentGiven, setConsentGiven] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registeredChips, setRegisteredChips] = useState<ChipData[]>([]);

  const toggleDatabase = (dbId: string) => {
    setSelectedDatabases(prev =>
      prev.includes(dbId) ? prev.filter(id => id !== dbId) : [...prev, dbId]
    );
  };

  const registerChip = async () => {
    if (!chipNumber.trim()) {
      Alert.alert('Fehler', 'Bitte Chip-Nummer eingeben');
      return;
    }

    if (!consentGiven) {
      Alert.alert('Fehler', 'Bitte Zustimmung zur Registrierung geben');
      return;
    }

    if (selectedDatabases.length === 0) {
      Alert.alert('Fehler', 'Bitte mindestens eine Datenbank auswählen');
      return;
    }

    setIsRegistering(true);
    try {
      // Simulate database upload
      const chipData: ChipData = {
        id: Date.now().toString(),
        petId: selectedPet,
        chipNumber,
        chipType,
        registeredDatabases: selectedDatabases,
        registrationDate: new Date().toISOString(),
        isVerified: true,
        emailSent: true,
      };

      // Save to local storage
      const existing = registeredChips;
      const updated = [...existing, chipData];
      setRegisteredChips(updated);
      await AsyncStorage.setItem('chipRegistrations', JSON.stringify(updated));

      // Simulate email sending
      await sendRegistrationEmails(chipData);

      Alert.alert(
        'Erfolg',
        `Chip registriert!\n\nRegistriert in: ${selectedDatabases.length} Datenbanken\n\nBestätigungsemail wurde versendet.`
      );

      setChipNumber('');
      setSelectedDatabases([]);
      setConsentGiven(false);
    } catch (error) {
      Alert.alert('Fehler', 'Registrierung fehlgeschlagen');
    } finally {
      setIsRegistering(false);
    }
  };

  const sendRegistrationEmails = async (chipData: ChipData) => {
    // In production: Call backend API to send emails
    // Email 1: Confirmation to user
    // Email 2: Parallel send to all co-users
    console.log('Sending registration emails for chip:', chipData.chipNumber);
    
    // Simulate API call
    return new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <ScreenContainer className="p-6 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Chip-Registrierung</Text>
            <Text className="text-base text-muted">Registriere den Chip deines Tieres</Text>
          </View>

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

          {/* Chip Number */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Chip-Nummer</Text>
            <TextInput
              placeholder="z.B. 900000000000001"
              placeholderTextColor="#6B6B6B"
              value={chipNumber}
              onChangeText={setChipNumber}
              className="bg-surface text-foreground p-3 rounded-lg border border-border"
            />
          </View>

          {/* Chip Type */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Chip-Typ</Text>
            {(['ISO11784', 'ISO14443', 'other'] as const).map(type => (
              <Pressable
                key={type}
                onPress={() => setChipType(type)}
                className={`p-3 rounded-lg border ${chipType === type ? 'border-primary bg-primary/10' : 'border-border'}`}
              >
                <Text className="text-foreground font-semibold">
                  {type === 'ISO11784' ? 'ISO 11784 (Standard)' : type === 'ISO14443' ? 'ISO 14443' : 'Sonstiges'}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Database Selection */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">Registrierungsdatenbanken</Text>
            {CHIP_DATABASES.map(db => (
              <Pressable
                key={db.id}
                onPress={() => toggleDatabase(db.id)}
                className={`p-3 rounded-lg border flex-row items-center justify-between ${
                  selectedDatabases.includes(db.id) ? 'border-primary bg-primary/10' : 'border-border'
                }`}
              >
                <Text className="text-foreground font-semibold flex-1">{db.name}</Text>
                <View className={`w-5 h-5 rounded border-2 ${
                  selectedDatabases.includes(db.id) ? 'bg-primary border-primary' : 'border-border'
                }`}>
                  {selectedDatabases.includes(db.id) && (
                    <Text className="text-background text-center">✓</Text>
                  )}
                </View>
              </Pressable>
            ))}
          </View>

          {/* Consent */}
          <View className="bg-surface rounded-xl p-4 gap-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-sm font-semibold text-foreground">Zustimmung erforderlich</Text>
                <Text className="text-xs text-muted mt-1">
                  Ich stimme der Registrierung meines Tieres in den ausgewählten Datenbanken zu.
                </Text>
              </View>
              <Switch
                value={consentGiven}
                onValueChange={setConsentGiven}
                trackColor={{ false: '#3A3A42', true: '#D4A843' }}
                thumbColor={consentGiven ? '#0A0A0F' : '#6B6B6B'}
              />
            </View>
          </View>

          {/* Register Button */}
          <Pressable
            onPress={registerChip}
            disabled={isRegistering || !consentGiven}
            className={`rounded-xl p-4 items-center ${consentGiven && !isRegistering ? 'bg-primary' : 'bg-muted'}`}
          >
            {isRegistering ? (
              <ActivityIndicator color="#0A0A0F" />
            ) : (
              <Text className="text-lg font-bold text-background">
                In {selectedDatabases.length} Datenbanken registrieren
              </Text>
            )}
          </Pressable>

          {/* Registered Chips */}
          {registeredChips.length > 0 && (
            <View className="gap-3">
              <Text className="text-sm font-semibold text-foreground">Registrierte Chips</Text>
              {registeredChips.map(chip => (
                <View key={chip.id} className="bg-surface rounded-xl p-4 gap-2">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-lg font-bold text-foreground">
                      {pets.find(p => p.id === chip.petId)?.name}
                    </Text>
                    {chip.isVerified && (
                      <Text className="text-sm font-bold text-success">✓ Verifiziert</Text>
                    )}
                  </View>
                  <Text className="text-sm text-muted">Chip: {chip.chipNumber}</Text>
                  <Text className="text-xs text-muted">
                    Registriert: {new Date(chip.registrationDate).toLocaleDateString('de-DE')}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Info */}
          <View className="bg-surface rounded-xl p-4 gap-2">
            <Text className="text-sm font-semibold text-foreground">ℹ️ Wichtig</Text>
            <Text className="text-xs text-muted">
              Die Chip-Registrierung ist entscheidend für die Wiedervereinigung mit deinem Tier, falls es verloren geht. Eine Bestätigungsemail wird an deine hinterlegte E-Mail-Adresse versendet.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
