import { useState, useEffect } from "react";
import * as Calendar from "expo-calendar";
import { Platform, Alert } from "react-native";

interface CalendarEvent {
  title: string;
  startDate: Date;
  endDate: Date;
  notes?: string;
  location?: string;
  alarms?: { relativeOffset: number }[];
}

export function useCalendar() {
  const [hasPermission, setHasPermission] = useState(false);
  const [defaultCalendarId, setDefaultCalendarId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await Calendar.requestCalendarPermissionsAsync();
        setHasPermission(status === "granted");

        if (status === "granted") {
          const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
          const defaultCal = calendars.find((cal) => cal.allowsModifications) || calendars[0];
          if (defaultCal) {
            setDefaultCalendarId(defaultCal.id);
          }
        }
      }
    })();
  }, []);

  const requestPermission = async () => {
    if (Platform.OS === "web") {
      Alert.alert("Nicht verfügbar", "Kalender-Sync ist auf Web nicht verfügbar");
      return false;
    }

    const { status } = await Calendar.requestCalendarPermissionsAsync();
    setHasPermission(status === "granted");

    if (status === "granted") {
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const defaultCal = calendars.find((cal) => cal.allowsModifications) || calendars[0];
      if (defaultCal) {
        setDefaultCalendarId(defaultCal.id);
      }
    }

    return status === "granted";
  };

  const addEventToCalendar = async (event: CalendarEvent): Promise<boolean> => {
    try {
      if (Platform.OS === "web") {
        Alert.alert("Nicht verfügbar", "Kalender-Sync ist auf Web nicht verfügbar");
        return false;
      }

      if (!hasPermission) {
        const granted = await requestPermission();
        if (!granted) {
          Alert.alert("Berechtigung erforderlich", "Bitte erlaube den Zugriff auf deinen Kalender");
          return false;
        }
      }

      if (!defaultCalendarId) {
        Alert.alert("Fehler", "Kein Kalender gefunden");
        return false;
      }

      const eventId = await Calendar.createEventAsync(defaultCalendarId, {
        title: event.title,
        startDate: event.startDate,
        endDate: event.endDate,
        notes: event.notes,
        location: event.location,
        alarms: event.alarms || [{ relativeOffset: -60 }], // 1 hour before
      });

      return !!eventId;
    } catch (error) {
      console.error("Error adding event to calendar:", error);
      Alert.alert("Fehler", "Termin konnte nicht zum Kalender hinzugefügt werden");
      return false;
    }
  };

  const addVetAppointmentToCalendar = async (
    petName: string,
    date: Date,
    reason: string,
    location?: string
  ) => {
    const endDate = new Date(date.getTime() + 60 * 60 * 1000); // 1 hour duration

    return addEventToCalendar({
      title: `Tierarzt: ${petName}`,
      startDate: date,
      endDate,
      notes: `Grund: ${reason}`,
      location,
      alarms: [
        { relativeOffset: -24 * 60 }, // 1 day before
        { relativeOffset: -60 }, // 1 hour before
      ],
    });
  };

  const addVaccinationToCalendar = async (petName: string, date: Date, vaccineName: string) => {
    const endDate = new Date(date.getTime() + 30 * 60 * 1000); // 30 minutes duration

    return addEventToCalendar({
      title: `Impfung: ${petName}`,
      startDate: date,
      endDate,
      notes: `Impfung: ${vaccineName}`,
      alarms: [
        { relativeOffset: -7 * 24 * 60 }, // 1 week before
        { relativeOffset: -24 * 60 }, // 1 day before
      ],
    });
  };

  return {
    hasPermission,
    requestPermission,
    addEventToCalendar,
    addVetAppointmentToCalendar,
    addVaccinationToCalendar,
  };
}
