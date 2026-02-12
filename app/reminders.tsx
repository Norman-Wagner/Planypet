import { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, Pressable, TextInput, Alert, StyleSheet, Platform, Switch } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import * as Notifications from "expo-notifications";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { usePetStore } from "@/lib/pet-store";
import { useConsent } from "@/lib/consent-store";
import { scheduleFeedingReminder, scheduleWalkReminder, scheduleVetReminder, cancelNotification } from "@/hooks/use-notifications";

interface Reminder {
  id: string;
  petId: string;
  petName: string;
  type: "feeding" | "walk" | "vet" | "medication" | "custom";
  title: string;
  time: string; // HH:MM format
  days: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  enabled: boolean;
  notificationId?: string;
  createdAt: string;
}

const REMINDERS_KEY = "planypet_reminders";
const DAY_LABELS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

const REMINDER_TYPES = [
  { type: "feeding" as const, label: "Fuetterung", icon: "fork.knife" as any, color: "#FFB74D" },
  { type: "walk" as const, label: "Gassi", icon: "figure.walk" as any, color: "#66BB6A" },
  { type: "vet" as const, label: "Tierarzt", icon: "cross.case.fill" as any, color: "#EF5350" },
  { type: "medication" as const, label: "Medikament", icon: "pills.fill" as any, color: "#AB47BC" },
  { type: "custom" as const, label: "Sonstiges", icon: "bell.fill" as any, color: "#42A5F5" },
];

export default function RemindersScreen() {
  const insets = useSafeAreaInsets();
  const store = usePetStore();
  const { pushNotifications } = useConsent();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newType, setNewType] = useState<Reminder["type"]>("feeding");
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("08:00");
  const [newDays, setNewDays] = useState<number[]>([1, 2, 3, 4, 5]); // Mon-Fri
  const [selectedPetId, setSelectedPetId] = useState(store.pets[0]?.id || "");

  const loadReminders = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(REMINDERS_KEY);
      if (stored) setReminders(JSON.parse(stored));
    } catch (e) {
      console.error("Error loading reminders:", e);
    }
  }, []);

  useEffect(() => {
    loadReminders();
  }, [loadReminders]);

  const saveReminders = async (updated: Reminder[]) => {
    setReminders(updated);
    await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(updated));
  };

  const scheduleReminderNotification = async (reminder: Reminder): Promise<string | undefined> => {
    if (!pushNotifications) return undefined;
    
    try {
      const [hours, minutes] = reminder.time.split(":").map(Number);
      const now = new Date();
      const triggerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
      if (triggerDate <= now) {
        triggerDate.setDate(triggerDate.getDate() + 1);
      }

      let notifId: string | undefined;
      switch (reminder.type) {
        case "feeding":
          notifId = await scheduleFeedingReminder(reminder.petName, triggerDate);
          break;
        case "walk":
          notifId = await scheduleWalkReminder(reminder.petName, triggerDate);
          break;
        case "vet":
          notifId = await scheduleVetReminder(reminder.petName, triggerDate, reminder.title);
          break;
        default:
          notifId = await Notifications.scheduleNotificationAsync({
            content: {
              title: reminder.title,
              body: `Erinnerung fuer ${reminder.petName}`,
              sound: true,
            },
            trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: triggerDate },
          });
      }
      return notifId;
    } catch (e) {
      console.error("Error scheduling notification:", e);
      return undefined;
    }
  };

  const handleAddReminder = async () => {
    if (!newTitle.trim() && newType === "custom") {
      Alert.alert("Fehler", "Bitte gib einen Titel ein");
      return;
    }
    const pet = store.pets.find(p => p.id === selectedPetId);
    const typeInfo = REMINDER_TYPES.find(t => t.type === newType);
    const title = newType === "custom" ? newTitle : `${typeInfo?.label} - ${pet?.name || "Tier"}`;

    const reminder: Reminder = {
      id: Date.now().toString(),
      petId: selectedPetId,
      petName: pet?.name || "Tier",
      type: newType,
      title,
      time: newTime,
      days: newDays,
      enabled: true,
      createdAt: new Date().toISOString(),
    };

    const notifId = await scheduleReminderNotification(reminder);
    reminder.notificationId = notifId;

    const updated = [...reminders, reminder];
    await saveReminders(updated);

    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    setShowAdd(false);
    setNewTitle("");
    setNewTime("08:00");
    setNewDays([1, 2, 3, 4, 5]);
  };

  const handleToggleReminder = async (id: string) => {
    const updated = reminders.map(r => {
      if (r.id === id) {
        if (r.enabled && r.notificationId) {
          cancelNotification(r.notificationId);
        }
        return { ...r, enabled: !r.enabled };
      }
      return r;
    });
    await saveReminders(updated);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleDeleteReminder = (id: string) => {
    Alert.alert("Erinnerung loeschen", "Moechtest du diese Erinnerung wirklich loeschen?", [
      { text: "Abbrechen", style: "cancel" },
      {
        text: "Loeschen",
        style: "destructive",
        onPress: async () => {
          const reminder = reminders.find(r => r.id === id);
          if (reminder?.notificationId) {
            await cancelNotification(reminder.notificationId);
          }
          const updated = reminders.filter(r => r.id !== id);
          await saveReminders(updated);
          if (Platform.OS !== "web") {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        },
      },
    ]);
  };

  const toggleDay = (day: number) => {
    setNewDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort());
  };

  if (!pushNotifications) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0A0A0F" }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 40, paddingTop: insets.top }}>
          <Pressable onPress={() => router.back()} style={[s.backBtn, { position: "absolute", top: insets.top + 16, left: 20 }]}>
            <IconSymbol name="chevron.left" size={20} color="#D4A843" />
            <Text style={s.backText}>Zurueck</Text>
          </Pressable>
          <IconSymbol name="bell.slash.fill" size={48} color="#4A4A4A" />
          <Text style={[s.headerTitle, { marginTop: 20, textAlign: "center" }]}>Benachrichtigungen deaktiviert</Text>
          <Text style={[s.headerSub, { textAlign: "center", marginTop: 8 }]}>
            Bitte aktiviere Push-Benachrichtigungen im Datenschutz-Center, um Erinnerungen zu nutzen.
          </Text>
          <Pressable
            onPress={() => router.push("/privacy-center")}
            style={({ pressed }) => [s.consentBtn, pressed && { opacity: 0.7 }]}
          >
            <Text style={s.consentBtnText}>Zum Datenschutz-Center</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0F" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 100,
          paddingHorizontal: 20,
        }}
      >
        {/* Back */}
        <Pressable onPress={() => router.back()} style={({ pressed }) => [s.backBtn, pressed && { opacity: 0.6 }]}>
          <IconSymbol name="chevron.left" size={20} color="#D4A843" />
          <Text style={s.backText}>Zurueck</Text>
        </Pressable>

        {/* Header */}
        <View style={s.header}>
          <Text style={s.headerTitle}>Erinnerungen</Text>
          <Text style={s.headerSub}>Fuetterung, Gassi, Tierarzt & mehr</Text>
          <View style={s.goldDivider} />
        </View>

        {/* Add Button */}
        <Pressable
          onPress={() => setShowAdd(!showAdd)}
          style={({ pressed }) => [s.addBtn, pressed && { opacity: 0.7 }]}
        >
          <IconSymbol name={showAdd ? "xmark" : "plus"} size={16} color="#D4A843" />
          <Text style={s.addBtnText}>{showAdd ? "Abbrechen" : "Neue Erinnerung"}</Text>
        </Pressable>

        {/* Add Form */}
        {showAdd && (
          <View style={s.addForm}>
            {/* Type Selection */}
            <Text style={s.formLabel}>Art</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
              {REMINDER_TYPES.map(rt => (
                <Pressable
                  key={rt.type}
                  onPress={() => setNewType(rt.type)}
                  style={[s.typeChip, newType === rt.type && { borderColor: rt.color, backgroundColor: `${rt.color}15` }]}
                >
                  <IconSymbol name={rt.icon} size={14} color={newType === rt.type ? rt.color : "#6B6B6B"} />
                  <Text style={[s.typeChipText, newType === rt.type && { color: rt.color }]}>{rt.label}</Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Pet Selection */}
            {store.pets.length > 1 && (
              <>
                <Text style={[s.formLabel, { marginTop: 16 }]}>Tier</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                  {store.pets.map(pet => (
                    <Pressable
                      key={pet.id}
                      onPress={() => setSelectedPetId(pet.id)}
                      style={[s.typeChip, selectedPetId === pet.id && { borderColor: "#D4A843", backgroundColor: "rgba(212,168,67,0.1)" }]}
                    >
                      <Text style={[s.typeChipText, selectedPetId === pet.id && { color: "#D4A843" }]}>{pet.name}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </>
            )}

            {/* Title (for custom) */}
            {newType === "custom" && (
              <>
                <Text style={[s.formLabel, { marginTop: 16 }]}>Titel</Text>
                <TextInput
                  value={newTitle}
                  onChangeText={setNewTitle}
                  placeholder="z.B. Krallen schneiden"
                  placeholderTextColor="#4A4A4A"
                  style={s.formInput}
                  returnKeyType="done"
                />
              </>
            )}

            {/* Time */}
            <Text style={[s.formLabel, { marginTop: 16 }]}>Uhrzeit</Text>
            <TextInput
              value={newTime}
              onChangeText={setNewTime}
              placeholder="HH:MM"
              placeholderTextColor="#4A4A4A"
              style={s.formInput}
              keyboardType="numbers-and-punctuation"
              returnKeyType="done"
            />

            {/* Days */}
            <Text style={[s.formLabel, { marginTop: 16 }]}>Tage</Text>
            <View style={{ flexDirection: "row", gap: 6 }}>
              {DAY_LABELS.map((label, i) => (
                <Pressable
                  key={i}
                  onPress={() => toggleDay(i)}
                  style={[s.dayChip, newDays.includes(i) && s.dayChipActive]}
                >
                  <Text style={[s.dayChipText, newDays.includes(i) && s.dayChipTextActive]}>{label}</Text>
                </Pressable>
              ))}
            </View>

            {/* Save */}
            <Pressable
              onPress={handleAddReminder}
              style={({ pressed }) => [s.saveBtn, pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }]}
            >
              <Text style={s.saveBtnText}>Erinnerung erstellen</Text>
            </Pressable>
          </View>
        )}

        {/* Reminders List */}
        {reminders.length === 0 && !showAdd && (
          <View style={s.emptyState}>
            <IconSymbol name="bell.fill" size={40} color="#2A2A30" />
            <Text style={s.emptyText}>Noch keine Erinnerungen</Text>
            <Text style={s.emptySub}>Erstelle Erinnerungen fuer Fuetterung, Gassi oder Tierarzttermine</Text>
          </View>
        )}

        {reminders.map(reminder => {
          const typeInfo = REMINDER_TYPES.find(t => t.type === reminder.type);
          return (
            <Pressable
              key={reminder.id}
              onLongPress={() => handleDeleteReminder(reminder.id)}
              style={[s.reminderCard, !reminder.enabled && { opacity: 0.5 }]}
            >
              <View style={[s.reminderIcon, { backgroundColor: `${typeInfo?.color || "#D4A843"}15` }]}>
                <IconSymbol name={typeInfo?.icon || ("bell.fill" as any)} size={18} color={typeInfo?.color || "#D4A843"} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.reminderTitle}>{reminder.title}</Text>
                <Text style={s.reminderSub}>
                  {reminder.time} | {reminder.days.map(d => DAY_LABELS[d]).join(", ")}
                </Text>
              </View>
              <Switch
                value={reminder.enabled}
                onValueChange={() => handleToggleReminder(reminder.id)}
                trackColor={{ false: "#2A2A30", true: "#D4A843" }}
                thumbColor="#FAFAF8"
              />
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  backBtn: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 },
  backText: { fontSize: 14, fontWeight: "500", color: "#D4A843", letterSpacing: 0.5 },

  header: { marginBottom: 24 },
  headerTitle: { fontSize: 28, fontWeight: "300", color: "#FAFAF8", letterSpacing: 2 },
  headerSub: { fontSize: 12, fontWeight: "400", color: "#6B6B6B", letterSpacing: 1, marginTop: 4 },
  goldDivider: { width: 40, height: 1, backgroundColor: "#D4A843", marginTop: 16 },

  addBtn: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "rgba(212,168,67,0.08)", borderWidth: 1,
    borderColor: "rgba(212,168,67,0.15)", paddingVertical: 14, paddingHorizontal: 20,
    justifyContent: "center", marginBottom: 16,
  },
  addBtnText: { fontSize: 13, fontWeight: "500", color: "#D4A843", letterSpacing: 1 },

  addForm: {
    backgroundColor: "#141418", borderWidth: 1,
    borderColor: "rgba(212,168,67,0.08)", padding: 20, marginBottom: 20,
  },
  formLabel: {
    fontSize: 11, fontWeight: "600", color: "#D4A843",
    letterSpacing: 2, textTransform: "uppercase", marginBottom: 8,
  },
  formInput: {
    backgroundColor: "#0A0A0F", borderWidth: 1,
    borderColor: "rgba(212,168,67,0.1)", paddingHorizontal: 16,
    paddingVertical: 12, fontSize: 15, fontWeight: "400",
    color: "#FAFAF8", letterSpacing: 0.3,
  },

  typeChip: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1,
    borderColor: "rgba(212,168,67,0.1)", backgroundColor: "#0A0A0F",
  },
  typeChipText: { fontSize: 12, fontWeight: "500", color: "#6B6B6B", letterSpacing: 0.5 },

  dayChip: {
    flex: 1, alignItems: "center", paddingVertical: 10,
    borderWidth: 1, borderColor: "rgba(212,168,67,0.1)", backgroundColor: "#0A0A0F",
  },
  dayChipActive: { borderColor: "#D4A843", backgroundColor: "rgba(212,168,67,0.1)" },
  dayChipText: { fontSize: 11, fontWeight: "500", color: "#6B6B6B" },
  dayChipTextActive: { color: "#D4A843" },

  saveBtn: {
    marginTop: 20, backgroundColor: "rgba(212,168,67,0.1)",
    borderWidth: 1, borderColor: "rgba(212,168,67,0.2)",
    paddingVertical: 16, alignItems: "center",
  },
  saveBtnText: {
    fontSize: 13, fontWeight: "600", color: "#D4A843",
    letterSpacing: 2, textTransform: "uppercase",
  },

  emptyState: { alignItems: "center", marginTop: 60, gap: 12 },
  emptyText: { fontSize: 16, fontWeight: "300", color: "#6B6B6B", letterSpacing: 1 },
  emptySub: { fontSize: 12, fontWeight: "400", color: "#4A4A4A", textAlign: "center", maxWidth: 260 },

  reminderCard: {
    flexDirection: "row", alignItems: "center", gap: 14,
    backgroundColor: "#141418", borderWidth: 1,
    borderColor: "rgba(212,168,67,0.08)", padding: 16, marginBottom: 10,
  },
  reminderIcon: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: "center", justifyContent: "center",
  },
  reminderTitle: { fontSize: 14, fontWeight: "500", color: "#FAFAF8", letterSpacing: 0.3 },
  reminderSub: { fontSize: 11, fontWeight: "400", color: "#6B6B6B", marginTop: 2 },

  consentBtn: {
    marginTop: 24, backgroundColor: "rgba(212,168,67,0.1)",
    borderWidth: 1, borderColor: "rgba(212,168,67,0.2)",
    paddingVertical: 14, paddingHorizontal: 24,
  },
  consentBtnText: { fontSize: 13, fontWeight: "500", color: "#D4A843", letterSpacing: 1 },
});
