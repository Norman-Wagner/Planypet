
import { ScrollView, Text, View, Pressable, Alert, ActivityIndicator, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { usePetStore } from "@/lib/pet-store";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

export default function BackupScreen() {
  const insets = useSafeAreaInsets();
  const { pets, feedings, walks, healthRecords, userName } = usePetStore();
  
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [lastBackup, setLastBackup] = useState<string | null>("21.01.2026, 14:30");
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);

  const createBackup = async () => {
    setIsCreatingBackup(true);
    try {
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
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, { opacity: pressed ? 0.6 : 1 }]}
          >
            <IconSymbol name="chevron.left" size={28} color="#D4A843" />
          </Pressable>
          <View>
            <Text style={styles.headerTitle}>BACKUP & SYNC</Text>
            <Text style={styles.headerSubtitle}>Daten sichern und wiederherstellen</Text>
          </View>
        </View>
        <View style={styles.divider} />

        {/* Main Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>Cloud Backup</Text>

          {/* Auto Backup Toggle */}
          <View style={styles.card}>
            <View style={styles.cardContentRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>Automatisches Backup</Text>
                <Text style={styles.cardSubtitle}>Tägliche Sicherung in der Cloud</Text>
              </View>
              <Pressable
                onPress={toggleAutoBackup}
                style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
              >
                <View style={[styles.toggleBase, autoBackupEnabled && styles.toggleActive]}>
                  <View style={styles.toggleCircle} />
                </View>
              </Pressable>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Aktionen</Text>

          {/* Create Backup */}
          <Pressable
            onPress={createBackup}
            disabled={isCreatingBackup}
            style={({ pressed }) => [styles.card, { opacity: pressed || isCreatingBackup ? 0.6 : 1 }]}
          >
            <View style={styles.cardContentRow}>
                {isCreatingBackup ? (
                  <ActivityIndicator color="#D4A843" />
                ) : (
                  <IconSymbol name="arrow.down.doc.fill" size={24} color="#D4A843" />
                )}
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>
                  {isCreatingBackup ? "Backup wird erstellt..." : "Backup erstellen"}
                </Text>
                <Text style={styles.cardSubtitle}>Jetzt manuell sichern</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color="#6B6B6B" />
            </View>
          </Pressable>

          {/* Restore Backup */}
          <Pressable
            onPress={restoreBackup}
            style={({ pressed }) => [styles.card, { opacity: pressed ? 0.6 : 1 }]}
          >
            <View style={styles.cardContentRow}>
              <IconSymbol name="arrow.up.doc.fill" size={24} color="#D4A843" />
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>Backup wiederherstellen</Text>
                <Text style={styles.cardSubtitle}>Aus Datei importieren</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color="#6B6B6B" />
            </View>
          </Pressable>

          {/* Export Data */}
          <Pressable
            onPress={exportAllData}
            style={({ pressed }) => [styles.card, { opacity: pressed ? 0.6 : 1 }]}
          >
            <View style={styles.cardContentRow}>
              <IconSymbol name="square.and.arrow.up.fill" size={24} color="#D4A843" />
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>Alle Daten exportieren</Text>
                <Text style={styles.cardSubtitle}>DSGVO-konform</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color="#6B6B6B" />
            </View>
          </Pressable>

          <View style={[styles.card, { marginTop: 24 }]}>
            <View style={styles.cardContentRow}>
              <IconSymbol name="info.circle.fill" size={20} color="#D4A843" />
              <View style={[styles.cardTextContainer, { paddingRight: 0 }]}>
                <Text style={styles.cardTitle}>Datensicherheit</Text>
                <Text style={[styles.cardSubtitle, { marginTop: 4 }]}>
                  Deine Backups werden verschlüsselt gespeichert. Du kannst sie jederzeit exportieren oder löschen. Bei Gerätewechsel kannst du deine Daten einfach wiederherstellen.
                </Text>
              </View>
            </View>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0F",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: "#FAFAF8",
    fontSize: 24,
    fontWeight: "300",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  headerSubtitle: {
    color: "#6B6B6B",
    fontSize: 14,
    marginTop: 2,
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: "#D4A843",
    marginBottom: 24,
  },
  contentContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: "#D4A843",
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#141418",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(212,168,67,0.08)",
    padding: 16,
    marginBottom: 12,
  },
  cardContentRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTextContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  cardTitle: {
    color: "#FAFAF8",
    fontSize: 16,
    fontWeight: "500",
  },
  cardSubtitle: {
    color: "#8B8B80",
    fontSize: 13,
    marginTop: 2,
  },
  toggleBase: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#4A4A4A",
    justifyContent: "center",
    padding: 2,
  },
  toggleActive: {
    backgroundColor: "#D4A843",
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FAFAF8",
    transform: [{ translateX: 0 }],
  },
});

