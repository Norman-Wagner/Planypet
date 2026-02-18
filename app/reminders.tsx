import React, { useState, useCallback, useEffect } from "react";
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
  time: string;
  days: number[];
  enabled: boolean;
  notificationId?: string;
  createdAt: string;
  snoozedUntil?: number;
}

interface VetReminder {
  id: string;
  petId: string;
  petName: string;
  type: "vaccination" | "dental" | "checkup";
  dueDate: string;
  completed: boolean;
  notes: string;
}

const REMINDERS_KEY = "planypet_reminders";
const VET_REMINDERS_KEY = "planypet_vet_reminders";
const DAY_LABELS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
const SNOOZE_OPTIONS = [
  { label: "5 Min", value: 5 },
  { label: "15 Min", value: 15 },
  { label: "30 Min", value: 30 },
];

const REMINDER_TYPES = [
  { type: "feeding" as const, label: "Fütterung", icon: "fork.knife" as any, color: "#FFB74D" },
  { type: "walk" as const, label: "Gassi", icon: "figure.walk" as any, color: "#66BB6A" },
  { type: "vet" as const, label: "Tierarzt", icon: "cross.case.fill" as any, color: "#EF5350" },
  { type: "medication" as const, label: "Medikament", icon: "pills.fill" as any, color: "#AB47BC" },
  { type: "custom" as const, label: "Sonstiges", icon: "bell.fill" as any, color: "#42A5F5" },
];

const VET_REMINDER_TYPES = [
  { type: "vaccination" as const, label: "Impfung", icon: "syringe.fill" as any },
  { type: "dental" as const, label: "Zahnreinigung", icon: "tooth.fill" as any },
  { type: "checkup" as const, label: "Untersuchung", icon: "heart.fill" as any },
];

export default function RemindersScreen() {
  const insets = useSafeAreaInsets();
  const store = usePetStore();
  const { pushNotifications } = useConsent();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [vetReminders, setVetReminders] = useState<VetReminder[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showVetAdd, setShowVetAdd] = useState(false);
  const [newType, setNewType] = useState<Reminder["type"]>("feeding");
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("08:00");
  const [newDays, setNewDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [selectedPetId, setSelectedPetId] = useState(store.pets[0]?.id || "");
  const [newVetType, setNewVetType] = useState<VetReminder["type"]>("vaccination");
  const [newVetDate, setNewVetDate] = useState(new Date().toISOString().split("T")[0]);
  const [newVetNotes, setNewVetNotes] = useState("");

  const loadReminders = useCallback(async () => {
    try {
      const [stored, vetStored] = await Promise.all([
        AsyncStorage.getItem(REMINDERS_KEY),
        AsyncStorage.getItem(VET_REMINDERS_KEY),
      ]);
      if (stored) setReminders(JSON.parse(stored));
      if (vetStored) setVetReminders(JSON.parse(vetStored));
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

  const saveVetReminders = async (updated: VetReminder[]) => {
    setVetReminders(updated);
    await AsyncStorage.setItem(VET_REMINDERS_KEY, JSON.stringify(updated));
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
              body: `Erinnerung für ${reminder.petName}`,
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

  const handleSnoozeReminder = async (id: string, minutes: number) => {
    const snoozedUntil = Date.now() + minutes * 60 * 1000;
    const updated = reminders.map(r =>
      r.id === id ? { ...r, snoozedUntil } : r
    );
    await saveReminders(updated);
    
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
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
  };

  const handleDeleteReminder = async (id: string) => {
    const reminder = reminders.find(r => r.id === id);
    if (reminder?.notificationId) {
      cancelNotification(reminder.notificationId);
    }
    const updated = reminders.filter(r => r.id !== id);
    await saveReminders(updated);
  };

  const handleAddVetReminder = async () => {
    const pet = store.pets.find(p => p.id === selectedPetId);
    const vetReminder: VetReminder = {
      id: Date.now().toString(),
      petId: selectedPetId,
      petName: pet?.name || "Tier",
      type: newVetType,
      dueDate: newVetDate,
      completed: false,
      notes: newVetNotes,
    };

    const updated = [...vetReminders, vetReminder];
    await saveVetReminders(updated);

    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    setShowVetAdd(false);
    setNewVetType("vaccination");
    setNewVetDate(new Date().toISOString().split("T")[0]);
    setNewVetNotes("");
  };

  const handleToggleVetReminder = async (id: string) => {
    const updated = vetReminders.map(r =>
      r.id === id ? { ...r, completed: !r.completed } : r
    );
    await saveVetReminders(updated);
  };

  const handleDeleteVetReminder = async (id: string) => {
    const updated = vetReminders.filter(r => r.id !== id);
    await saveVetReminders(updated);
  };

  const isSnoozed = (reminder: Reminder) => reminder.snoozedUntil && reminder.snoozedUntil > Date.now();

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0F" }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 40,
          paddingHorizontal: 20,
        }}
      >
        {/* Header */}
        <Pressable
          onPress={() => router.back()}
          style={s.backBtn}
        >
          <IconSymbol name="chevron.left" size={20} color="#D4A843" />
          <Text style={s.backText}>Zurück</Text>
        </Pressable>

        <View style={s.header}>
          <Text style={s.headerTitle}>Erinnerungen</Text>
          <Text style={s.headerSub}>Fütterung, Gassi, Tierarzt</Text>
          <View style={s.goldDivider} />
        </View>

        {/* FEEDING & WALK REMINDERS */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Regelmäßige Erinnerungen</Text>
          <Pressable onPress={() => setShowAdd(!showAdd)}>
            <IconSymbol name="plus.circle.fill" size={24} color="#D4A843" />
          </Pressable>
        </View>

        {showAdd && (
          <View style={s.addForm}>
            <Text style={s.formLabel}>Typ</Text>
            <View style={s.typeGrid}>
              {REMINDER_TYPES.map((t) => (
                <Pressable
                  key={t.type}
                  onPress={() => setNewType(t.type)}
                  style={[
                    s.typeBtn,
                    { borderColor: t.color } as any,
                    newType === t.type && { backgroundColor: t.color },
                  ] as any}
                >
                  <Text style={[s.typeText, newType === t.type && s.typeTextActive]}>
                    {t.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={s.formLabel}>Zeit</Text>
            <TextInput
              style={s.input}
              placeholder="HH:MM"
              value={newTime}
              onChangeText={setNewTime}
              placeholderTextColor="#6B7280"
            />

            <Text style={s.formLabel}>Tage</Text>
            <View style={s.daysGrid}>
              {DAY_LABELS.map((day, idx) => (
                <Pressable
                  key={day}
                  onPress={() =>
                    setNewDays(
                      newDays.includes(idx)
                        ? newDays.filter((d) => d !== idx)
                        : [...newDays, idx]
                    )
                  }
                  style={[
                    s.dayBtn,
                    newDays.includes(idx) && s.dayBtnActive,
                  ] as any}
                >
                  <Text
                    style={[
                      s.dayText,
                      newDays.includes(idx) && s.dayTextActive,
                    ]}
                  >
                    {day}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable onPress={handleAddReminder} style={s.submitBtn}>
              <Text style={s.submitText}>Erinnerung hinzufügen</Text>
            </Pressable>
          </View>
        )}

        {reminders.map((reminder) => (
          <View key={reminder.id} style={[s.card, isSnoozed(reminder) && s.cardSnoozed] as any}>
            <View style={s.reminderHeader}>
              <View style={{ flex: 1 }}>
                <Text style={s.reminderTitle}>{reminder.title}</Text>
                <Text style={s.reminderTime}>{reminder.time} Uhr</Text>
              </View>
              <Switch
                value={reminder.enabled}
                onValueChange={() => handleToggleReminder(reminder.id)}
                trackColor={{ false: "#2A2A2F", true: "#D4A843" }}
                thumbColor={reminder.enabled ? "#0A0A0F" : "#4A4A4A"}
              />
            </View>

            {isSnoozed(reminder) && (
              <Text style={s.snoozedText}>
                Stummgeschaltet bis {new Date(reminder.snoozedUntil!).toLocaleTimeString("de-DE")}
              </Text>
            )}

            <View style={s.snoozeButtons}>
              {SNOOZE_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.value}
                  onPress={() => handleSnoozeReminder(reminder.id, opt.value)}
                  style={s.snoozeBtn}
                >
                  <Text style={s.snoozeText}>{opt.label}</Text>
                </Pressable>
              ))}
              <Pressable
                onPress={() => handleDeleteReminder(reminder.id)}
                style={s.deleteBtn}
              >
                <IconSymbol name="trash" size={16} color="#EF4444" />
              </Pressable>
            </View>
          </View>
        ))}

        {/* VET REMINDERS */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Tierarzt-Termine</Text>
          <Pressable onPress={() => setShowVetAdd(!showVetAdd)}>
            <IconSymbol name="plus.circle.fill" size={24} color="#D4A843" />
          </Pressable>
        </View>

        {showVetAdd && (
          <View style={s.addForm}>
            <Text style={s.formLabel}>Termin-Typ</Text>
            <View style={s.typeGrid}>
              {VET_REMINDER_TYPES.map((t) => (
                <Pressable
                  key={t.type}
                  onPress={() => setNewVetType(t.type)}
                  style={[
                    s.typeBtn,
                    newVetType === t.type && { backgroundColor: "#EF5350" },
                  ] as any}
                >
                  <Text style={[s.typeText, newVetType === t.type && s.typeTextActive]}>
                    {t.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={s.formLabel}>Datum</Text>
            <TextInput
              style={s.input}
              placeholder="YYYY-MM-DD"
              value={newVetDate}
              onChangeText={setNewVetDate}
              placeholderTextColor="#6B7280"
            />

            <Text style={s.formLabel}>Notizen</Text>
            <TextInput
              style={[s.input, s.textarea]}
              placeholder="z.B. Impfstoff, Zahnarzt-Adresse"
              value={newVetNotes}
              onChangeText={setNewVetNotes}
              multiline
              placeholderTextColor="#6B7280"
            />

            <Pressable onPress={handleAddVetReminder} style={s.submitBtn}>
              <Text style={s.submitText}>Termin hinzufügen</Text>
            </Pressable>
          </View>
        )}

        {vetReminders.map((vet) => (
          <View key={vet.id} style={[s.card, vet.completed && s.cardCompleted] as any}>
            <View style={s.reminderHeader}>
              <View style={{ flex: 1 }}>
                <Text style={s.reminderTitle}>{vet.type === "vaccination" ? "Impfung" : vet.type === "dental" ? "Zahnreinigung" : "Untersuchung"}</Text>
                <Text style={s.reminderTime}>{vet.dueDate}</Text>
                {vet.notes && <Text style={s.reminderNotes}>{vet.notes}</Text>}
              </View>
              <Switch
                value={vet.completed}
                onValueChange={() => handleToggleVetReminder(vet.id)}
                trackColor={{ false: "#2A2A2F", true: "#D4A843" }}
                thumbColor={vet.completed ? "#0A0A0F" : "#4A4A4A"}
              />
            </View>

            <Pressable
              onPress={() => handleDeleteVetReminder(vet.id)}
              style={s.deleteBtn}
            >
              <IconSymbol name="trash" size={16} color="#EF4444" />
              <Text style={s.deleteText}>Löschen</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 8,
  },
  backText: {
    color: "#D4A843",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  header: {
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 4,
  },
  headerSub: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 16,
  },
  goldDivider: {
    height: 2,
    backgroundColor: "#D4A843",
    width: 40,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#D4A843",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  addForm: {
    backgroundColor: "#1A1A1F",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2A2A2F",
  },
  formLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#D4A843",
    marginBottom: 8,
    marginTop: 12,
  },
  typeGrid: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  typeBtn: {
    flex: 1,
    minWidth: "45%",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#0A0A0F",
    borderWidth: 2,
    borderColor: "#2A2A2F",
  },
  typeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  typeTextActive: {
    color: "#0A0A0F",
  },
  input: {
    backgroundColor: "#0A0A0F",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2A2A2F",
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#FFF",
    fontSize: 14,
  },
  textarea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  daysGrid: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },
  dayBtn: {
    flex: 1,
    minWidth: "30%",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
    backgroundColor: "#0A0A0F",
    borderWidth: 1,
    borderColor: "#2A2A2F",
  },
  dayBtnActive: {
    backgroundColor: "#D4A843",
    borderColor: "#D4A843",
  },
  dayText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  dayTextActive: {
    color: "#0A0A0F",
  },
  submitBtn: {
    backgroundColor: "#D4A843",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 16,
  },
  submitText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0A0A0F",
  },
  card: {
    backgroundColor: "#1A1A1F",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2A2A2F",
  },
  cardSnoozed: {
    opacity: 0.6,
    borderColor: "#D4A843",
  },
  cardCompleted: {
    opacity: 0.5,
  },
  reminderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  reminderTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 4,
  },
  reminderTime: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  reminderNotes: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  snoozedText: {
    fontSize: 12,
    color: "#D4A843",
    marginBottom: 12,
  },
  snoozeButtons: {
    flexDirection: "row",
    gap: 8,
  },
  snoozeBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
    backgroundColor: "#0A0A0F",
    borderWidth: 1,
    borderColor: "#D4A843",
  },
  snoozeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#D4A843",
  },
  deleteBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
    backgroundColor: "#1F1F1F",
    borderWidth: 1,
    borderColor: "#EF4444",
    flexDirection: "row",
    gap: 4,
  },
  deleteText: {
    fontSize: 12,
    color: "#EF4444",
    fontWeight: "600",
  },
});
