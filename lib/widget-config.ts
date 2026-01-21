/**
 * Widget Configuration for Planypet
 * 
 * This file prepares the configuration for iOS and Android home screen widgets.
 * Actual widget implementation requires native code modules that will be added
 * when building for production.
 * 
 * iOS: Uses WidgetKit (requires Swift/Objective-C module)
 * Android: Uses App Widgets (requires Kotlin/Java module)
 */

export interface WidgetData {
  petName: string;
  petType: string;
  nextFeeding: {
    time: string;
    type: string;
  } | null;
  nextWalk: {
    time: string;
  } | null;
  lowSupplies: string[];
  lastUpdated: string;
}

export interface WidgetConfig {
  // Small widget (2x2)
  small: {
    showPetName: boolean;
    showNextFeeding: boolean;
    showQuickAction: boolean;
  };
  // Medium widget (4x2)
  medium: {
    showPetName: boolean;
    showNextFeeding: boolean;
    showNextWalk: boolean;
    showLowSupplies: boolean;
    showQuickActions: boolean;
  };
  // Large widget (4x4)
  large: {
    showAllPets: boolean;
    showSchedule: boolean;
    showWeather: boolean;
    showQuickActions: boolean;
  };
}

// Default widget configuration
export const defaultWidgetConfig: WidgetConfig = {
  small: {
    showPetName: true,
    showNextFeeding: true,
    showQuickAction: true,
  },
  medium: {
    showPetName: true,
    showNextFeeding: true,
    showNextWalk: true,
    showLowSupplies: true,
    showQuickActions: true,
  },
  large: {
    showAllPets: true,
    showSchedule: true,
    showWeather: true,
    showQuickActions: true,
  },
};

/**
 * Prepare widget data from app state
 * This function is called to update the widget with current data
 */
export function prepareWidgetData(
  pets: Array<{ id: string; name: string; type: string }>,
  feedings: Array<{ petId: string; time: string; type: string; completed: boolean }>,
  walks: Array<{ petId: string; scheduledTime: string; completed: boolean }>,
  supplies: Array<{ name: string; quantity: number; minQuantity: number }>
): WidgetData | null {
  if (pets.length === 0) return null;

  const primaryPet = pets[0];
  
  // Find next uncompleted feeding
  const nextFeeding = feedings
    .filter(f => f.petId === primaryPet.id && !f.completed)
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())[0];

  // Find next uncompleted walk
  const nextWalk = walks
    .filter(w => w.petId === primaryPet.id && !w.completed)
    .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())[0];

  // Find low supplies
  const lowSupplies = supplies
    .filter(s => s.quantity <= s.minQuantity)
    .map(s => s.name);

  return {
    petName: primaryPet.name,
    petType: primaryPet.type,
    nextFeeding: nextFeeding ? {
      time: nextFeeding.time,
      type: nextFeeding.type,
    } : null,
    nextWalk: nextWalk ? {
      time: nextWalk.scheduledTime,
    } : null,
    lowSupplies,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Widget Quick Actions
 * These are the actions available from the widget
 */
export const widgetQuickActions = {
  markFed: {
    id: "mark_fed",
    title: "Gefüttert",
    icon: "checkmark.circle.fill",
    deepLink: "planypet://feeding/mark-complete",
  },
  startWalk: {
    id: "start_walk",
    title: "Gassi starten",
    icon: "figure.walk",
    deepLink: "planypet://walk/start",
  },
  addSymptom: {
    id: "add_symptom",
    title: "Symptom",
    icon: "plus.circle.fill",
    deepLink: "planypet://health/add-symptom",
  },
  emergency: {
    id: "emergency",
    title: "Notfall",
    icon: "exclamationmark.triangle.fill",
    deepLink: "planypet://emergency",
  },
};

/**
 * Widget appearance configuration
 */
export const widgetAppearance = {
  colors: {
    primary: "#0066CC",
    secondary: "#00A3FF",
    background: "#FFFFFF",
    backgroundDark: "#1A1A2E",
    text: "#11181C",
    textDark: "#ECEDEE",
    accent: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
  },
  fonts: {
    title: "SF Pro Display",
    body: "SF Pro Text",
  },
  cornerRadius: 16,
  padding: 12,
};

/**
 * Instructions for native widget implementation
 * 
 * iOS (WidgetKit):
 * 1. Create a Widget Extension target in Xcode
 * 2. Use App Groups to share data between app and widget
 * 3. Implement TimelineProvider for widget updates
 * 4. Use SwiftUI for widget views
 * 
 * Android (App Widgets):
 * 1. Create AppWidgetProvider class
 * 2. Define widget layout in XML
 * 3. Use SharedPreferences for data sharing
 * 4. Implement onUpdate for widget refresh
 * 
 * Both platforms:
 * - Update widget data when app state changes
 * - Schedule periodic updates for time-sensitive data
 * - Handle deep links for quick actions
 */
