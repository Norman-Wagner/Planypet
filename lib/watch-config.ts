/**
 * Smartwatch Configuration for Planypet
 * 
 * This file prepares the configuration for Apple Watch and Wear OS companions.
 * Actual watch app implementation requires native code modules.
 * 
 * Apple Watch: Uses WatchKit/SwiftUI (requires Xcode)
 * Wear OS: Uses Jetpack Compose for Wear OS (requires Android Studio)
 */

// Watch Complications (Apple Watch) / Tiles (Wear OS)
export interface WatchComplication {
  id: string;
  type: "small" | "medium" | "large" | "circular";
  title: string;
  data: {
    icon: string;
    value: string;
    label: string;
    color: string;
  };
}

// Watch App Screens
export interface WatchScreen {
  id: string;
  title: string;
  icon: string;
  features: string[];
}

// Watch Quick Actions
export interface WatchQuickAction {
  id: string;
  title: string;
  icon: string;
  hapticType: "success" | "warning" | "error" | "click";
  action: string;
}

/**
 * Apple Watch Complications Configuration
 */
export const appleWatchComplications: WatchComplication[] = [
  {
    id: "next_feeding",
    type: "circular",
    title: "Nächste Fütterung",
    data: {
      icon: "fork.knife",
      value: "12:00",
      label: "Fütterung",
      color: "#0066CC",
    },
  },
  {
    id: "next_walk",
    type: "circular",
    title: "Nächster Spaziergang",
    data: {
      icon: "figure.walk",
      value: "15:00",
      label: "Gassi",
      color: "#10B981",
    },
  },
  {
    id: "pet_status",
    type: "medium",
    title: "Tier-Status",
    data: {
      icon: "pawprint.fill",
      value: "Luna",
      label: "Alles OK",
      color: "#10B981",
    },
  },
];

/**
 * Wear OS Tiles Configuration
 */
export const wearOSTiles: WatchComplication[] = [
  {
    id: "daily_overview",
    type: "large",
    title: "Tagesübersicht",
    data: {
      icon: "calendar",
      value: "3 Aufgaben",
      label: "Heute",
      color: "#0066CC",
    },
  },
  {
    id: "quick_actions",
    type: "medium",
    title: "Schnellaktionen",
    data: {
      icon: "bolt",
      value: "Tippen",
      label: "Aktion",
      color: "#F59E0B",
    },
  },
];

/**
 * Watch App Screens
 */
export const watchScreens: WatchScreen[] = [
  {
    id: "home",
    title: "Übersicht",
    icon: "house.fill",
    features: [
      "Nächste Fütterung anzeigen",
      "Nächster Spaziergang",
      "Wetter für Gassi",
      "Schnellaktionen",
    ],
  },
  {
    id: "walk_tracking",
    title: "Gassi-Tracking",
    icon: "figure.walk",
    features: [
      "GPS-Tracking starten/stoppen",
      "Live-Distanz anzeigen",
      "Dauer anzeigen",
      "Herzfrequenz (wenn verfügbar)",
    ],
  },
  {
    id: "reminders",
    title: "Erinnerungen",
    icon: "bell.fill",
    features: [
      "Fütterungserinnerungen",
      "Gassi-Erinnerungen",
      "Medikamenten-Erinnerungen",
      "Als erledigt markieren",
    ],
  },
  {
    id: "emergency",
    title: "Notfall",
    icon: "exclamationmark.triangle.fill",
    features: [
      "Notfallkontakte anrufen",
      "Standort teilen",
      "Giftköder-Warnung",
    ],
  },
];

/**
 * Watch Quick Actions
 */
export const watchQuickActions: WatchQuickAction[] = [
  {
    id: "mark_fed",
    title: "Gefüttert",
    icon: "checkmark.circle.fill",
    hapticType: "success",
    action: "planypet://feeding/complete",
  },
  {
    id: "start_walk",
    title: "Gassi starten",
    icon: "play.fill",
    hapticType: "click",
    action: "planypet://walk/start",
  },
  {
    id: "stop_walk",
    title: "Gassi beenden",
    icon: "stop.fill",
    hapticType: "success",
    action: "planypet://walk/stop",
  },
  {
    id: "water_given",
    title: "Wasser gegeben",
    icon: "drop.fill",
    hapticType: "success",
    action: "planypet://water/complete",
  },
];

/**
 * Watch App Communication Protocol
 * Defines how the phone app and watch app communicate
 */
export interface WatchMessage {
  type: "sync" | "action" | "notification" | "request";
  payload: Record<string, unknown>;
  timestamp: string;
}

export const watchMessageTypes = {
  // Phone to Watch
  SYNC_DATA: "sync_data",
  PUSH_NOTIFICATION: "push_notification",
  UPDATE_COMPLICATIONS: "update_complications",
  
  // Watch to Phone
  ACTION_COMPLETED: "action_completed",
  REQUEST_SYNC: "request_sync",
  WALK_STARTED: "walk_started",
  WALK_ENDED: "walk_ended",
  EMERGENCY_TRIGGERED: "emergency_triggered",
};

/**
 * Watch App Data Model
 * Simplified data structure for watch display
 */
export interface WatchPetData {
  id: string;
  name: string;
  type: string;
  emoji: string;
  nextFeeding: string | null;
  nextWalk: string | null;
  healthStatus: "good" | "attention" | "urgent";
}

/**
 * Watch App Appearance
 */
export const watchAppearance = {
  colors: {
    primary: "#0066CC",
    secondary: "#00A3FF",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    background: "#000000",
    surface: "#1A1A2E",
    text: "#FFFFFF",
    textMuted: "#9BA1A6",
  },
  fonts: {
    appleWatch: "SF Compact",
    wearOS: "Roboto",
  },
};

/**
 * Watch Workout Integration (for Gassi-Tracking)
 */
export const workoutConfig = {
  appleWatch: {
    workoutType: "HKWorkoutActivityTypeWalking",
    locationTracking: true,
    heartRateMonitoring: true,
    calorieTracking: true,
  },
  wearOS: {
    exerciseType: "EXERCISE_TYPE_WALKING",
    locationTracking: true,
    heartRateMonitoring: true,
    stepCounting: true,
  },
};

/**
 * Instructions for native watch app implementation
 * 
 * Apple Watch (WatchKit/SwiftUI):
 * 1. Create Watch App target in Xcode
 * 2. Use WatchConnectivity for phone-watch communication
 * 3. Implement ComplicationController for complications
 * 4. Use HealthKit for workout tracking
 * 5. Use CoreLocation for GPS tracking
 * 
 * Wear OS (Jetpack Compose):
 * 1. Create Wear OS module in Android Studio
 * 2. Use Data Layer API for phone-watch communication
 * 3. Implement TileService for tiles
 * 4. Use Health Services for workout tracking
 * 5. Use Fused Location Provider for GPS
 * 
 * Both platforms:
 * - Keep watch app lightweight and focused
 * - Sync essential data only
 * - Provide haptic feedback for actions
 * - Support offline mode with local caching
 */
