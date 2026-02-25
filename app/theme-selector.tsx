import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { THEMES, THEME_NAMES, ThemeName } from '@/theme-colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ThemeSelectorScreen() {
  const colors = useColors();
  const [selectedTheme, setSelectedTheme] = useState<ThemeName>('dark');
  const [previewTheme, setPreviewTheme] = useState<ThemeName>('dark');
  const [isApplying, setIsApplying] = useState(false);

  const handleThemeSelect = (theme: ThemeName) => {
    setSelectedTheme(theme);
    setPreviewTheme(theme);
  };

  const handleConfirmTheme = async () => {
    setIsApplying(true);
    try {
      await AsyncStorage.setItem('selectedTheme', selectedTheme);
      Alert.alert(
        'Erfolg',
        `Theme "${THEME_NAMES[selectedTheme]}" wurde gespeichert.`,
        [{ text: 'OK' }]
      );
      // Optional: Neustart-Hinweis
      setTimeout(() => {
        Alert.alert(
          'Neustart erforderlich',
          'Die App wird neu gestartet, um das neue Theme anzuwenden.',
          [{ text: 'Neustart' }]
        );
      }, 500);
    } catch (error) {
      Alert.alert('Fehler', 'Theme konnte nicht gespeichert werden.');
    } finally {
      setIsApplying(false);
    }
  };

  const themePreview = THEMES[previewTheme];

  return (
    <ScreenContainer className="p-6 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">
              Farbtheme wählen
            </Text>
            <Text className="text-base text-muted">
              Wähle dein bevorzugtes Farbschema aus
            </Text>
          </View>

          {/* Preview */}
          <View
            className="rounded-2xl p-6 gap-4"
            style={{ backgroundColor: themePreview.background }}
          >
            <Text
              className="text-2xl font-bold"
              style={{ color: themePreview.foreground }}
            >
              Vorschau: {THEME_NAMES[previewTheme]}
            </Text>
            <View className="flex-row gap-3">
              <View
                className="flex-1 rounded-lg p-4"
                style={{ backgroundColor: themePreview.primary }}
              >
                <Text style={{ color: themePreview.background }}>
                  Primär
                </Text>
              </View>
              <View
                className="flex-1 rounded-lg p-4"
                style={{ backgroundColor: themePreview.secondary }}
              >
                <Text style={{ color: themePreview.background }}>
                  Sekundär
                </Text>
              </View>
            </View>
          </View>

          {/* Theme Options */}
          <View className="gap-3">
            {(Object.keys(THEME_NAMES) as ThemeName[]).map((theme) => (
              <Pressable
                key={theme}
                onPress={() => handleThemeSelect(theme)}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <View
                  className={`rounded-xl p-4 border-2 ${
                    selectedTheme === theme
                      ? 'border-primary'
                      : 'border-border'
                  }`}
                  style={{
                    backgroundColor:
                      selectedTheme === theme
                        ? THEMES[theme].surface
                        : colors.surface,
                  }}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1 gap-2">
                      <Text className="text-lg font-semibold text-foreground">
                        {THEME_NAMES[theme]}
                      </Text>
                      <View className="flex-row gap-2">
                        <View
                          className="w-6 h-6 rounded-full"
                          style={{
                            backgroundColor: THEMES[theme].primary,
                          }}
                        />
                        <View
                          className="w-6 h-6 rounded-full"
                          style={{
                            backgroundColor: THEMES[theme].secondary,
                          }}
                        />
                        <View
                          className="w-6 h-6 rounded-full"
                          style={{
                            backgroundColor: THEMES[theme].gradient1,
                          }}
                        />
                      </View>
                    </View>
                    {selectedTheme === theme && (
                      <Text className="text-2xl text-primary">✓</Text>
                    )}
                  </View>
                </View>
              </Pressable>
            ))}
          </View>

          {/* Confirm Button */}
          <Pressable
            onPress={handleConfirmTheme}
            disabled={isApplying}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <View className="bg-primary rounded-xl p-4 items-center">
              <Text className="text-lg font-bold text-background">
                {isApplying ? 'Wird gespeichert...' : 'Theme bestätigen'}
              </Text>
            </View>
          </Pressable>

          {/* Info */}
          <View className="bg-surface rounded-xl p-4 gap-2">
            <Text className="text-sm font-semibold text-foreground">
              ℹ️ Hinweis
            </Text>
            <Text className="text-sm text-muted">
              Das Theme wird sofort angewendet. Ein Neustart der App kann
              erforderlich sein, um alle Änderungen vollständig anzuzeigen.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
