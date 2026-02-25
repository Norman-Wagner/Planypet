import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  address: string;
  city: string;
  zipCode: string;
  isComplete: boolean;
}

const MANDATORY_FIELDS = ['name', 'email', 'phone', 'birthDate', 'address'];

export default function UserProfileScreen() {
  const colors = useColors();
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    address: '',
    city: '',
    zipCode: '',
    isComplete: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [completionPercent, setCompletionPercent] = useState(0);

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    calculateCompletion();
  }, [profile]);

  const loadProfile = async () => {
    try {
      const stored = await AsyncStorage.getItem('userProfile');
      if (stored) {
        const data = JSON.parse(stored);
        setProfile(data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const calculateCompletion = () => {
    const filled = MANDATORY_FIELDS.filter(field => profile[field as keyof UserProfile]).length;
    const percent = Math.round((filled / MANDATORY_FIELDS.length) * 100);
    setCompletionPercent(percent);
  };

  const isMandatoryFieldsFilled = MANDATORY_FIELDS.every(field => profile[field as keyof UserProfile]);

  const saveProfile = async () => {
    if (!isMandatoryFieldsFilled) {
      Alert.alert(
        'Pflichtfelder erforderlich',
        'Bitte fülle alle Pflichtfelder aus:\n- Name\n- E-Mail\n- Telefon\n- Geburtsdatum\n- Adresse'
      );
      return;
    }

    setIsSaving(true);
    try {
      const updatedProfile = { ...profile, isComplete: true };
      await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      Alert.alert('Erfolg', 'Profil gespeichert!');
    } catch (error) {
      Alert.alert('Fehler', 'Profil konnte nicht gespeichert werden');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFieldChange = (field: keyof UserProfile, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  return (
    <ScreenContainer className="p-6 bg-background">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="gap-6">
            {/* Header */}
            <View className="gap-2">
              <Text className="text-3xl font-bold text-foreground">Mein Profil</Text>
              <Text className="text-base text-muted">Deine persönlichen Daten</Text>
            </View>

            {/* Completion Progress */}
            <View className="bg-surface rounded-xl p-4 gap-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-sm font-semibold text-foreground">Profil-Vollständigkeit</Text>
                <Text className="text-lg font-bold text-primary">{completionPercent}%</Text>
              </View>
              <View className="h-2 bg-background rounded-full overflow-hidden">
                <View
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${completionPercent}%` }}
                />
              </View>
              {!isMandatoryFieldsFilled && (
                <Text className="text-xs text-warning">
                  ⚠️ Alle Pflichtfelder müssen ausgefüllt sein, um die App zu nutzen
                </Text>
              )}
            </View>

            {/* Mandatory Fields */}
            <View className="gap-4">
              <Text className="text-sm font-bold text-foreground">Pflichtfelder *</Text>

              {/* Name */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">Name</Text>
                <TextInput
                  placeholder="Vor- und Nachname"
                  placeholderTextColor="#6B6B6B"
                  value={profile.name}
                  onChangeText={(text) => handleFieldChange('name', text)}
                  className="bg-surface text-foreground p-3 rounded-lg border border-border"
                />
              </View>

              {/* Email */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">E-Mail</Text>
                <TextInput
                  placeholder="deine@email.de"
                  placeholderTextColor="#6B6B6B"
                  keyboardType="email-address"
                  value={profile.email}
                  onChangeText={(text) => handleFieldChange('email', text)}
                  className="bg-surface text-foreground p-3 rounded-lg border border-border"
                />
              </View>

              {/* Phone */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">Telefon</Text>
                <TextInput
                  placeholder="+49 123 456789"
                  placeholderTextColor="#6B6B6B"
                  keyboardType="phone-pad"
                  value={profile.phone}
                  onChangeText={(text) => handleFieldChange('phone', text)}
                  className="bg-surface text-foreground p-3 rounded-lg border border-border"
                />
              </View>

              {/* Birth Date */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">Geburtsdatum</Text>
                <TextInput
                  placeholder="TT.MM.YYYY"
                  placeholderTextColor="#6B6B6B"
                  value={profile.birthDate}
                  onChangeText={(text) => handleFieldChange('birthDate', text)}
                  className="bg-surface text-foreground p-3 rounded-lg border border-border"
                />
              </View>

              {/* Address */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">Adresse</Text>
                <TextInput
                  placeholder="Straße und Hausnummer"
                  placeholderTextColor="#6B6B6B"
                  value={profile.address}
                  onChangeText={(text) => handleFieldChange('address', text)}
                  className="bg-surface text-foreground p-3 rounded-lg border border-border"
                />
              </View>
            </View>

            {/* Optional Fields */}
            <View className="gap-4">
              <Text className="text-sm font-bold text-foreground">Optionale Felder</Text>

              {/* City */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">Stadt</Text>
                <TextInput
                  placeholder="Deine Stadt"
                  placeholderTextColor="#6B6B6B"
                  value={profile.city}
                  onChangeText={(text) => handleFieldChange('city', text)}
                  className="bg-surface text-foreground p-3 rounded-lg border border-border"
                />
              </View>

              {/* Zip Code */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">Postleitzahl</Text>
                <TextInput
                  placeholder="12345"
                  placeholderTextColor="#6B6B6B"
                  keyboardType="number-pad"
                  value={profile.zipCode}
                  onChangeText={(text) => handleFieldChange('zipCode', text)}
                  className="bg-surface text-foreground p-3 rounded-lg border border-border"
                />
              </View>
            </View>

            {/* Save Button */}
            <Pressable
              onPress={saveProfile}
              disabled={isSaving || !isMandatoryFieldsFilled}
              className={`rounded-xl p-4 items-center ${isMandatoryFieldsFilled ? 'bg-primary' : 'bg-muted'}`}
            >
              <Text className="text-lg font-bold text-background">
                {isSaving ? 'Wird gespeichert...' : 'Profil speichern'}
              </Text>
            </Pressable>

            {/* Info */}
            <View className="bg-surface rounded-xl p-4 gap-2">
              <Text className="text-sm font-semibold text-foreground">ℹ️ Hinweis</Text>
              <Text className="text-xs text-muted">
                Deine Daten werden lokal auf deinem Gerät gespeichert und nicht an externe Server übertragen. Sie sind erforderlich für die Chip-Registrierung und Notfall-Benachrichtigungen.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
