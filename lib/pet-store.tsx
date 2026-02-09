import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type PetType = 
  // Haustiere
  | "cat" | "dog" | "rabbit" | "hamster" | "guinea_pig" | "chinchilla" | "degu" | "rat" | "mouse" | "ferret"
  // Vögel
  | "parakeet" | "canary" | "cockatiel" | "parrot" | "finch" | "lovebird"
  // Reptilien
  | "bearded_dragon" | "leopard_gecko" | "corn_snake" | "ball_python" | "iguana" | "chameleon" | "tortoise"
  // Amphibien
  | "axolotl" | "frog" | "newt"
  // Fische
  | "fish" | "goldfish" | "betta"
  // Nutztiere
  | "horse" | "cow" | "sheep" | "goat" | "pig" | "chicken" | "duck";

export interface Pet {
  id: string;
  name: string;
  type: PetType;
  breed?: string;
  age?: string;
  weight?: string;
  isGroup: boolean;
  imageUrl?: string;
  createdAt: string;
}

export interface FeedingEntry {
  id: string;
  petId: string;
  time: string;
  food: string;
  amount: string;
  completed: boolean;
  completedAt?: string;
}

export interface WalkEntry {
  id: string;
  petId: string;
  scheduledTime: string;
  duration: number; // minutes
  completed: boolean;
  completedAt?: string;
  route?: {
    coordinates: { lat: number; lng: number }[];
    distance: number; // meters
    duration: number; // seconds
  };
}

export interface HealthRecord {
  id: string;
  petId: string;
  type: "symptom" | "vaccination" | "medication" | "appointment" | "note";
  title: string;
  description?: string;
  date: string;
  images?: string[];
  audioNote?: string;
}

interface PetStoreState {
  userName: string;
  pets: Pet[];
  feedings: FeedingEntry[];
  walks: WalkEntry[];
  healthRecords: HealthRecord[];
  onboardingComplete: boolean;
}

interface PetStoreActions {
  setUserName: (name: string) => void;
  addPet: (pet: Omit<Pet, "id" | "createdAt">) => void;
  updatePet: (id: string, updates: Partial<Pet>) => void;
  deletePet: (id: string) => void;
  addFeeding: (feeding: Omit<FeedingEntry, "id">) => void;
  completeFeeding: (id: string) => void;
  addWalk: (walk: Omit<WalkEntry, "id">) => void;
  completeWalk: (id: string, route?: WalkEntry["route"]) => void;
  addHealthRecord: (record: Omit<HealthRecord, "id">) => void;
  setOnboardingComplete: (complete: boolean) => void;
  loadData: () => Promise<void>;
  clearAllData: () => Promise<void>;
}

type PetStore = PetStoreState & PetStoreActions;

const PetStoreContext = createContext<PetStore | null>(null);

const STORAGE_KEYS = {
  userName: "userName",
  pets: "pets",
  feedings: "feedings",
  walks: "walks",
  healthRecords: "healthRecords",
  onboardingComplete: "onboardingComplete",
};

export function PetStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PetStoreState>({
    userName: "",
    pets: [],
    feedings: [],
    walks: [],
    healthRecords: [],
    onboardingComplete: false,
  });

  const saveToStorage = async (key: string, value: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving to storage:", error);
    }
  };

  const loadData = async () => {
    try {
      const pets = await AsyncStorage.getItem(STORAGE_KEYS.pets);
      const feedings = await AsyncStorage.getItem(STORAGE_KEYS.feedings);
      const walks = await AsyncStorage.getItem(STORAGE_KEYS.walks);
      const healthRecords = await AsyncStorage.getItem(STORAGE_KEYS.healthRecords);
      const userName = await AsyncStorage.getItem(STORAGE_KEYS.userName);
      const onboardingComplete = await AsyncStorage.getItem(STORAGE_KEYS.onboardingComplete);

      const parseSafe = (data: string | null) => {
        if (!data) return [];
        try {
          return JSON.parse(data);
        } catch (e) {
          console.warn("Failed to parse data:", e);
          return [];
        }
      };

      setState({
        userName: userName || "",
        pets: parseSafe(pets),
        feedings: parseSafe(feedings),
        walks: parseSafe(walks),
        healthRecords: parseSafe(healthRecords),
        onboardingComplete: onboardingComplete === "true",
      });
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };;

  useEffect(() => {
    loadData();
  }, []);

  const actions: PetStoreActions = {
    setUserName: (name) => {
      setState((prev) => ({ ...prev, userName: name }));
      saveToStorage(STORAGE_KEYS.userName, name);
    },

    addPet: (pet) => {
      const newPet: Pet = {
        ...pet,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      setState((prev) => {
        const newPets = [...prev.pets, newPet];
        saveToStorage(STORAGE_KEYS.pets, newPets);
        return { ...prev, pets: newPets };
      });
    },

    updatePet: (id, updates) => {
      setState((prev) => {
        const newPets = prev.pets.map((p) => (p.id === id ? { ...p, ...updates } : p));
        saveToStorage(STORAGE_KEYS.pets, newPets);
        return { ...prev, pets: newPets };
      });
    },

    deletePet: (id) => {
      setState((prev) => {
        const newPets = prev.pets.filter((p) => p.id !== id);
        saveToStorage(STORAGE_KEYS.pets, newPets);
        return { ...prev, pets: newPets };
      });
    },

    addFeeding: (feeding) => {
      const newFeeding: FeedingEntry = {
        ...feeding,
        id: Date.now().toString(),
      };
      setState((prev) => {
        const newFeedings = [...prev.feedings, newFeeding];
        saveToStorage(STORAGE_KEYS.feedings, newFeedings);
        return { ...prev, feedings: newFeedings };
      });
    },

    completeFeeding: (id) => {
      setState((prev) => {
        const newFeedings = prev.feedings.map((f) =>
          f.id === id ? { ...f, completed: true, completedAt: new Date().toISOString() } : f
        );
        saveToStorage(STORAGE_KEYS.feedings, newFeedings);
        return { ...prev, feedings: newFeedings };
      });
    },

    addWalk: (walk) => {
      const newWalk: WalkEntry = {
        ...walk,
        id: Date.now().toString(),
      };
      setState((prev) => {
        const newWalks = [...prev.walks, newWalk];
        saveToStorage(STORAGE_KEYS.walks, newWalks);
        return { ...prev, walks: newWalks };
      });
    },

    completeWalk: (id, route) => {
      setState((prev) => {
        const newWalks = prev.walks.map((w) =>
          w.id === id ? { ...w, completed: true, completedAt: new Date().toISOString(), route } : w
        );
        saveToStorage(STORAGE_KEYS.walks, newWalks);
        return { ...prev, walks: newWalks };
      });
    },

    addHealthRecord: (record) => {
      const newRecord: HealthRecord = {
        ...record,
        id: Date.now().toString(),
      };
      setState((prev) => {
        const newRecords = [...prev.healthRecords, newRecord];
        saveToStorage(STORAGE_KEYS.healthRecords, newRecords);
        return { ...prev, healthRecords: newRecords };
      });
    },

    setOnboardingComplete: (complete) => {
      setState((prev) => ({ ...prev, onboardingComplete: complete }));
      AsyncStorage.setItem(STORAGE_KEYS.onboardingComplete, complete.toString());
    },

    loadData,

    clearAllData: async () => {
      try {
        await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
        setState({
          userName: "",
          pets: [],
          feedings: [],
          walks: [],
          healthRecords: [],
          onboardingComplete: false,
        });
      } catch (error) {
        console.error("Error clearing data:", error);
      }
    },
  };

  return (
    <PetStoreContext.Provider value={{ ...state, ...actions }}>
      {children}
    </PetStoreContext.Provider>
  );
}

export function usePetStore() {
  const context = useContext(PetStoreContext);
  if (!context) {
    throw new Error("usePetStore must be used within a PetStoreProvider");
  }
  return context;
}
