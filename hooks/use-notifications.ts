import { useState, useEffect } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import Constants from "expo-constants";

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const [notification, setNotification] = useState<Notifications.Notification | undefined>();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token));
  }, []);

  return {
    expoPushToken,
    notification,
    scheduleNotification,
    cancelNotification,
    cancelAllNotifications,
  };
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#0066CC",
    });
  }

  if (!Device.isDevice) {
    console.log("Push notifications only work on physical devices");
    return undefined;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync({});
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Failed to get push token for push notification!");
    return undefined;
  }

  try {
    const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
    if (!projectId) {
      throw new Error("Project ID not found");
    }

    const token = (
      await Notifications.getExpoPushTokenAsync({
        projectId,
      })
    ).data;

    return token;
  } catch (error) {
    console.error("Error getting push token:", error);
    return undefined;
  }
}

export async function scheduleNotification(options: {
  title: string;
  body: string;
  data?: Record<string, any>;
  trigger: Notifications.NotificationTriggerInput;
}) {
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: options.title,
      body: options.body,
      data: options.data,
      sound: true,
    },
    trigger: options.trigger,
  });

  return id;
}

export async function cancelNotification(notificationId: string) {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// Helper to schedule feeding reminder
export async function scheduleFeedingReminder(petName: string, time: Date) {
  return scheduleNotification({
    title: `Fuetterungszeit fuer ${petName}`,
    body: `Es ist Zeit, ${petName} zu füttern.`,
    data: { type: "feeding", petName },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: time },
  });
}

// Helper to schedule walk reminder
export async function scheduleWalkReminder(petName: string, time: Date) {
  return scheduleNotification({
    title: `Gassi-Zeit fuer ${petName}`,
    body: `${petName} freut sich auf einen Spaziergang.`,
    data: { type: "walk", petName },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: time },
  });
}

// Helper to schedule vet appointment reminder
export async function scheduleVetReminder(petName: string, time: Date, description?: string) {
  return scheduleNotification({
    title: `Tierarzttermin fuer ${petName}`,
    body: description || `Vergiss nicht den Tierarzttermin für ${petName}.`,
    data: { type: "vet", petName },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: time },
  });
}
