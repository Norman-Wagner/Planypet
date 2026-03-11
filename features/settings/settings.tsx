import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import * as Notifications from "expo-notifications";

export default function SettingsScreen() {
  const colors = useColors();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  });
  const [notificationSettings, setNotificationSettings] = useState({
    feedingReminders: true,
    walkReminders: true,
    healthAlerts: true,
    communityUpdates: false,
  });
  const [loading, setLoading] = useState(false);

  // Fetch user data
  const { data: user } = trpc.auth.me.useQuery();

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        emergencyContactName: user.emergencyContactName || "",
        emergencyContactPhone: user.emergencyContactPhone || "",
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // In a real app, you would call an API to save user data
      // For now, we'll just show a success message
      Alert.alert("Erfolg", "Profildaten wurden gespeichert!");
    } catch (error) {
      Alert.alert("Fehler", "Profildaten konnten nicht gespeichert werden");
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationToggle = async (key: string) => {
    const newSettings = {
      ...notificationSettings,
      [key]: !notificationSettings[key as keyof typeof notificationSettings],
    };
    setNotificationSettings(newSettings);

    // Request permissions if enabling notifications
    if (newSettings[key as keyof typeof notificationSettings]) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Benachrichtigungen",
          "Bitte aktiviere Benachrichtigungen in den Einstellungen"
        );
        setNotificationSettings({
          ...notificationSettings,
          [key]: false,
        });
      }
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground mb-2">Einstellungen</Text>
          <Text className="text-muted">Verwalte dein Profil und Benachrichtigungen</Text>
        </View>

        {/* Profile Section */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-foreground mb-4">Profil</Text>

          <View className="gap-3 bg-surface rounded-lg p-4 border border-border">
            {/* Name */}
            <View>
              <Text className="text-sm text-muted mb-1">Name</Text>
              <TextInput
                className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                placeholder="Dein Name"
                value={userData.name}
                onChangeText={(text) => setUserData({ ...userData, name: text })}
                placeholderTextColor={colors.muted}
              />
            </View>

            {/* Email */}
            <View>
              <Text className="text-sm text-muted mb-1">E-Mail</Text>
              <TextInput
                className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                placeholder="deine@email.de"
                value={userData.email}
                onChangeText={(text) => setUserData({ ...userData, email: text })}
                editable={false}
                placeholderTextColor={colors.muted}
              />
            </View>

            {/* Phone */}
            <View>
              <Text className="text-sm text-muted mb-1">Telefon</Text>
              <TextInput
                className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                placeholder="+49 123 456789"
                value={userData.phone}
                onChangeText={(text) => setUserData({ ...userData, phone: text })}
                placeholderTextColor={colors.muted}
              />
            </View>

            {/* Address */}
            <View>
              <Text className="text-sm text-muted mb-1">Adresse</Text>
              <TextInput
                className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                placeholder="Straße, Hausnummer, PLZ, Stadt"
                value={userData.address}
                onChangeText={(text) => setUserData({ ...userData, address: text })}
                placeholderTextColor={colors.muted}
                multiline
              />
            </View>

            {/* Emergency Contact */}
            <View className="border-t border-border pt-3 mt-3">
              <Text className="text-sm font-semibold text-foreground mb-3">
                Notfallkontakt
              </Text>

              <View className="gap-3">
                <View>
                  <Text className="text-sm text-muted mb-1">Name</Text>
                  <TextInput
                    className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                    placeholder="Name der Kontaktperson"
                    value={userData.emergencyContactName}
                    onChangeText={(text) =>
                      setUserData({ ...userData, emergencyContactName: text })
                    }
                    placeholderTextColor={colors.muted}
                  />
                </View>

                <View>
                  <Text className="text-sm text-muted mb-1">Telefon</Text>
                  <TextInput
                    className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                    placeholder="+49 123 456789"
                    value={userData.emergencyContactPhone}
                    onChangeText={(text) =>
                      setUserData({ ...userData, emergencyContactPhone: text })
                    }
                    placeholderTextColor={colors.muted}
                  />
                </View>
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              className="bg-primary rounded-lg py-3 items-center mt-4"
              onPress={handleSaveProfile}
              disabled={loading}
            >
              <Text className="text-background font-semibold">
                {loading ? "Wird gespeichert..." : "Profil speichern"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notifications Section */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-foreground mb-4">Benachrichtigungen</Text>

          <View className="gap-3 bg-surface rounded-lg p-4 border border-border">
            {/* Feeding Reminders */}
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-foreground font-semibold">Fütterungserinnerungen</Text>
                <Text className="text-sm text-muted">Erinnerung zu Fütterungszeiten</Text>
              </View>
              <Switch
                value={notificationSettings.feedingReminders}
                onValueChange={() => handleNotificationToggle("feedingReminders")}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>

            {/* Walk Reminders */}
            <View className="flex-row justify-between items-center border-t border-border pt-3">
              <View className="flex-1">
                <Text className="text-foreground font-semibold">Gassi-Erinnerungen</Text>
                <Text className="text-sm text-muted">Erinnerung zu Gassi-Zeiten</Text>
              </View>
              <Switch
                value={notificationSettings.walkReminders}
                onValueChange={() => handleNotificationToggle("walkReminders")}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>

            {/* Health Alerts */}
            <View className="flex-row justify-between items-center border-t border-border pt-3">
              <View className="flex-1">
                <Text className="text-foreground font-semibold">Gesundheitswarnungen</Text>
                <Text className="text-sm text-muted">Wichtige Gesundheitsmitteilungen</Text>
              </View>
              <Switch
                value={notificationSettings.healthAlerts}
                onValueChange={() => handleNotificationToggle("healthAlerts")}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>

            {/* Community Updates */}
            <View className="flex-row justify-between items-center border-t border-border pt-3">
              <View className="flex-1">
                <Text className="text-foreground font-semibold">Community-Updates</Text>
                <Text className="text-sm text-muted">Nachrichten und Challenges</Text>
              </View>
              <Switch
                value={notificationSettings.communityUpdates}
                onValueChange={() => handleNotificationToggle("communityUpdates")}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>
          </View>
        </View>

        {/* About Section */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-foreground mb-4">Über</Text>

          <View className="gap-3 bg-surface rounded-lg p-4 border border-border">
            <View className="flex-row justify-between items-center">
              <Text className="text-foreground">App-Version</Text>
              <Text className="text-muted">1.0.0</Text>
            </View>

            <TouchableOpacity className="border-t border-border pt-3">
              <Text className="text-primary font-semibold">Datenschutzerklärung</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text className="text-primary font-semibold">Nutzungsbedingungen</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text className="text-primary font-semibold">Kontakt & Support</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity className="bg-error rounded-lg py-3 items-center mb-6">
          <Text className="text-background font-semibold">Abmelden</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}
