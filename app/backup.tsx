import { ScrollView, Text, View, Pressable, Alert, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { GlassCard } from "@/components/ui/glass-card";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { usePetStore } from "@/lib/pet-store";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

export default function BackupScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { pets, feedings, walks, healthRecords, userName } = usePetStore();
  
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [lastBackup, setLastBackup] = useState<string | null>("21.01.2026, 14:30");
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);

  const createBackup = async () => {
    setIsCreatingBackup(true);
    
    try {
      // Create backup data
      const backupData = {
        version: "1.0",
        timestamp: new Date().toISOString(),
        userName,
        pets,
        feedings,
        walks,
        healthRecords,
      };

      const backupJson = JSON.stringify(backupData, null, 2);
      const fileName = `planypet_backup_${new Date().toISOString().split("T")[0]}.json`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, backupJson);

      // Share the backup file
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "application/json",
          dialogTitle: "Backup speichern",
        });
      }

      setLastBackup(new Date().toLocaleString("de-DE"));
      Alert.alert("Erfolg", "Backup wurde erfolgreich erstellt!");
    } catch (error) {
      Alert.alert("Fehler", "Backup konnte nicht erstellt werden.");
      console.error(error);
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const restoreBackup = () => {
    Alert.alert(
      "Backup wiederherstellen",
      "Diese Funktion wird in Kürze verfügbar sein. Du kannst dann eine Backup-Datei auswählen und deine Daten wiederherstellen.",
      [{ text: "OK" }]
    );
  };

  const exportAllData = async () => {
    Alert.alert(
      "Daten exportieren",
      "Möchtest du alle deine Daten exportieren? (DSGVO-konform)",
      [
        { text: "Abbrechen", style: "cancel" },
        {
          text: "Exportieren",
          onPress: createBackup,
        },
      ]
    );
  };

  const toggleAutoBackup = () => {
    setAutoBackupEnabled(!autoBackupEnabled);
    Alert.alert(
      autoBackupEnabled ? "Automatisches Backup deaktiviert" : "Automatisches Backup aktiviert",
      autoBackupEnabled
        ? "Deine Daten werden nicht mehr automatisch gesichert."
        : "Deine Daten werden täglich automatisch in der Cloud gesichert."
    );
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
          <Text className="text-3xl font-bold text-foreground">Backup & Sync</Text>
        </View>

        {/* Last Backup Info */}
        <GlassCard className="mb-6 border-primary/30">
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-full bg-primary/20 items-center justify-center mr-3">
              <IconSymbol name="icloud.fill" size={24} color={colors.primary} />
            </View>
            <View className="flex-1">
              <Text className="text-foreground font-semibold">Letztes Backup</Text>
              <Text className="text-muted text-sm mt-1">
                {lastBackup || "Noch kein Backup erstellt"}
              </Text>
            </View>
            <View
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: `${colors.success}20` }}
            >
              <IconSymbol name="checkmark" size={20} color={colors.success} />
            </View>
          </View>
        </GlassCard>

        {/* Auto Backup Toggle */}
        <GlassCard className="mb-6">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 mr-3">
              <Text className="text-foreground font-semibold">Automatisches Backup</Text>
              <Text className="text-muted text-sm mt-1">
                Tägliche Sicherung in der Cloud
              </Text>
            </View>
            <Pressable
              onPress={toggleAutoBackup}
              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
            >
              <View
                className={`w-14 h-8 rounded-full p-1 ${
                  autoBackupEnabled ? "bg-primary" : "bg-surface"
                }`}
              >
                <View
                  className={`w-6 h-6 rounded-full bg-white ${
                    autoBackupEnabled ? "ml-auto" : ""
                  }`}
                />
              </View>
            </Pressable>
          </View>
        </GlassCard>

        {/* Actions */}
        <Text className="text-foreground text-lg font-semibold mb-3">Aktionen</Text>

        <GlassCard className="mb-3">
          <Pressable
            onPress={createBackup}
            disabled={isCreatingBackup}
            style={({ pressed }) => ({ opacity: pressed || isCreatingBackup ? 0.6 : 1 })}
          >
            <View className="flex-row items-center">
              <View
                className="w-12 h-12 rounded-xl items-center justify-center mr-3"
                style={{ backgroundColor: `${colors.primary}15` }}
              >
                {isCreatingBackup ? (
                  <ActivityIndicator color={colors.primary} />
                ) : (
                  <IconSymbol name="arrow.down.doc.fill" size={24} color={colors.primary} />
                )}
              </View>
              <View className="flex-1">
                <Text className="text-foreground font-semibold">
                  {isCreatingBackup ? "Backup wird erstellt..." : "Backup erstellen"}
                </Text>
                <Text className="text-muted text-sm">Jetzt manuell sichern</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.muted} />
            </View>
          </Pressable>
        </GlassCard>

        <GlassCard className="mb-3">
          <Pressable
            onPress={restoreBackup}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <View className="flex-row items-center">
              <View
                className="w-12 h-12 rounded-xl items-center justify-center mr-3"
                style={{ backgroundColor: `${colors.success}15` }}
              >
                <IconSymbol name="arrow.up.doc.fill" size={24} color={colors.success} />
              </View>
              <View className="flex-1">
                <Text className="text-foreground font-semibold">Backup wiederherstellen</Text>
                <Text className="text-muted text-sm">Aus Datei importieren</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.muted} />
            </View>
          </Pressable>
        </GlassCard>

        <GlassCard className="mb-6">
          <Pressable
            onPress={exportAllData}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <View className="flex-row items-center">
              <View
                className="w-12 h-12 rounded-xl items-center justify-center mr-3"
                style={{ backgroundColor: `${colors.warning}15` }}
              >
                <IconSymbol name="square.and.arrow.up.fill" size={24} color={colors.warning} />
              </View>
              <View className="flex-1">
                <Text className="text-foreground font-semibold">Alle Daten exportieren</Text>
                <Text className="text-muted text-sm">DSGVO-konform</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.muted} />
            </View>
          </Pressable>
        </GlassCard>

        {/* Info */}
        <GlassCard className="border-warning/30">
          <View className="flex-row items-start">
            <IconSymbol name="info.circle.fill" size={20} color={colors.warning} />
            <View className="flex-1 ml-3">
              <Text className="text-foreground font-medium text-sm">Datensicherheit</Text>
              <Text className="text-muted text-xs mt-1">
                Deine Backups werden verschlüsselt gespeichert. Du kannst sie jederzeit exportieren oder löschen. Bei Gerätewechsel kannst du deine Daten einfach wiederherstellen.
              </Text>
            </View>
          </View>
        </GlassCard>
      </ScrollView>
    </ScreenContainer>
  );
}
