import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface ConsentState {
  /** Grundlegende App-Nutzung und lokale Datenspeicherung */
  essentialData: boolean;
  /** KI-Analyse (Daten werden an Server uebertragen) */
  aiAnalysis: boolean;
  /** Push-Benachrichtigungen */
  pushNotifications: boolean;
  /** Kamera- und Fotobibliothek-Zugriff */
  cameraAccess: boolean;
  /** Standort-Tracking (GPS fuer Spaziergaenge) */
  locationTracking: boolean;
  /** Kalender-Zugriff */
  calendarAccess: boolean;
  /** Zeitstempel der letzten Einwilligung */
  consentTimestamp: string;
  /** Version der Datenschutzerklaerung bei Einwilligung */
  privacyPolicyVersion: string;
  /** Ob der Consent-Dialog bereits angezeigt wurde */
  consentGiven: boolean;
}

const DEFAULT_CONSENT: ConsentState = {
  essentialData: false,
  aiAnalysis: false,
  pushNotifications: false,
  cameraAccess: false,
  locationTracking: false,
  calendarAccess: false,
  consentTimestamp: "",
  privacyPolicyVersion: "",
  consentGiven: false,
};

const CONSENT_STORAGE_KEY = "dsgvo_consent";
const PRIVACY_POLICY_VERSION = "1.0.0";

interface ConsentActions {
  updateConsent: (updates: Partial<ConsentState>) => Promise<void>;
  giveFullConsent: () => Promise<void>;
  giveMinimalConsent: () => Promise<void>;
  revokeConsent: (key: keyof ConsentState) => Promise<void>;
  revokeAllConsent: () => Promise<void>;
  exportConsentData: () => ConsentState;
  hasConsent: (key: keyof ConsentState) => boolean;
  loadConsent: () => Promise<void>;
}

type ConsentStore = ConsentState & ConsentActions;

const ConsentContext = createContext<ConsentStore | null>(null);

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConsentState>(DEFAULT_CONSENT);

  const saveConsent = async (consent: ConsentState) => {
    try {
      await AsyncStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
    } catch (error) {
      console.error("Error saving consent:", error);
    }
  };

  const loadConsent = async () => {
    try {
      const stored = await AsyncStorage.getItem(CONSENT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ConsentState;
        setState(parsed);
      }
    } catch (error) {
      console.error("Error loading consent:", error);
    }
  };

  useEffect(() => {
    loadConsent();
  }, []);

  const actions: ConsentActions = {
    updateConsent: async (updates) => {
      const newState = {
        ...state,
        ...updates,
        consentTimestamp: new Date().toISOString(),
        privacyPolicyVersion: PRIVACY_POLICY_VERSION,
        consentGiven: true,
      };
      setState(newState);
      await saveConsent(newState);
    },

    giveFullConsent: async () => {
      const newState: ConsentState = {
        essentialData: true,
        aiAnalysis: true,
        pushNotifications: true,
        cameraAccess: true,
        locationTracking: true,
        calendarAccess: true,
        consentTimestamp: new Date().toISOString(),
        privacyPolicyVersion: PRIVACY_POLICY_VERSION,
        consentGiven: true,
      };
      setState(newState);
      await saveConsent(newState);
    },

    giveMinimalConsent: async () => {
      const newState: ConsentState = {
        essentialData: true,
        aiAnalysis: false,
        pushNotifications: false,
        cameraAccess: false,
        locationTracking: false,
        calendarAccess: false,
        consentTimestamp: new Date().toISOString(),
        privacyPolicyVersion: PRIVACY_POLICY_VERSION,
        consentGiven: true,
      };
      setState(newState);
      await saveConsent(newState);
    },

    revokeConsent: async (key) => {
      if (key === "consentTimestamp" || key === "privacyPolicyVersion" || key === "consentGiven") return;
      const newState = {
        ...state,
        [key]: false,
        consentTimestamp: new Date().toISOString(),
      };
      setState(newState);
      await saveConsent(newState);
    },

    revokeAllConsent: async () => {
      const newState: ConsentState = {
        ...DEFAULT_CONSENT,
        consentTimestamp: new Date().toISOString(),
        privacyPolicyVersion: PRIVACY_POLICY_VERSION,
        consentGiven: true,
      };
      setState(newState);
      await saveConsent(newState);
    },

    exportConsentData: () => {
      return { ...state };
    },

    hasConsent: (key) => {
      return !!state[key];
    },

    loadConsent,
  };

  return (
    <ConsentContext.Provider value={{ ...state, ...actions }}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error("useConsent must be used within a ConsentProvider");
  }
  return context;
}

export { PRIVACY_POLICY_VERSION };
