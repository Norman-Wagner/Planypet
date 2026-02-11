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
  weight?: number;
  birthDate?: string;
  preferences?: string;
  photoUrl?: string;
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

export type FamilyRole = 
  | "owner" | "mother" | "father" | "child" | "partner"
  | "boss" | "employee" | "secretary" | "foreman" | "caretaker"
  | "veterinarian" | "trainer" | "other";

export interface FamilyMember {
  id: string;
  name: string;
  role: FamilyRole;
  email?: string;
  phone?: string;
  photoUrl?: string;
  assignedPets: string[]; // pet IDs
  permissions: {
    canFeed: boolean;
    canWalk: boolean;
    canEditHealth: boolean;
    canOrder: boolean;
    canManageFamily: boolean;
  };
  createdAt: string;
}

export interface SupplyItem {
  id: string;
  petId: string;
  name: string;
  category: "food" | "medicine" | "accessory" | "hygiene";
  currentAmount: number;
  unit: string;
  minimumAmount: number;
  autoOrder: boolean;
  lastOrderDate?: string;
  estimatedRunoutDate?: string;
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
  userRole: FamilyRole;
  pets: Pet[];
  feedings: FeedingEntry[];
  walks: WalkEntry[];
  healthRecords: HealthRecord[];
  familyMembers: FamilyMember[];
  supplies: SupplyItem[];
  onboardingComplete: boolean;
}

interface PetStoreActions {
  setUserName: (name: string) => void;
  setUserRole: (role: FamilyRole) => void;
  addFamilyMember: (member: Omit<FamilyMember, "id" | "createdAt">) => void;
  updateFamilyMember: (id: string, updates: Partial<FamilyMember>) => void;
  deleteFamilyMember: (id: string) => void;
  addSupply: (supply: Omit<SupplyItem, "id">) => void;
  updateSupply: (id: string, updates: Partial<SupplyItem>) => void;
  deleteSupply: (id: string) => void;
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
  userRole: "userRole",
  pets: "pets",
  feedings: "feedings",
  walks: "walks",
  healthRecords: "healthRecords",
  familyMembers: "familyMembers",
  supplies: "supplies",
  onboardingComplete: "onboardingComplete",
};

export function PetStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PetStoreState>({
    userName: "",
    userRole: "owner" as FamilyRole,
    pets: [],
    feedings: [],
    walks: [],
    healthRecords: [],
    familyMembers: [],
    supplies: [],
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
      const familyMembers = await AsyncStorage.getItem(STORAGE_KEYS.familyMembers);
      const supplies = await AsyncStorage.getItem(STORAGE_KEYS.supplies);
      const userName = await AsyncStorage.getItem(STORAGE_KEYS.userName);
      const userRole = await AsyncStorage.getItem(STORAGE_KEYS.userRole);
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
        userRole: (userRole || "owner") as FamilyRole,
        pets: parseSafe(pets),
        feedings: parseSafe(feedings),
        walks: parseSafe(walks),
        healthRecords: parseSafe(healthRecords),
        familyMembers: parseSafe(familyMembers),
        supplies: parseSafe(supplies),
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

    setUserRole: (role) => {
      setState((prev) => ({ ...prev, userRole: role }));
      AsyncStorage.setItem(STORAGE_KEYS.userRole, role);
    },

    addFamilyMember: (member) => {
      const newMember: FamilyMember = {
        ...member,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      setState((prev) => {
        const newMembers = [...prev.familyMembers, newMember];
        saveToStorage(STORAGE_KEYS.familyMembers, newMembers);
        return { ...prev, familyMembers: newMembers };
      });
    },

    updateFamilyMember: (id, updates) => {
      setState((prev) => {
        const newMembers = prev.familyMembers.map((m) => (m.id === id ? { ...m, ...updates } : m));
        saveToStorage(STORAGE_KEYS.familyMembers, newMembers);
        return { ...prev, familyMembers: newMembers };
      });
    },

    deleteFamilyMember: (id) => {
      setState((prev) => {
        const newMembers = prev.familyMembers.filter((m) => m.id !== id);
        saveToStorage(STORAGE_KEYS.familyMembers, newMembers);
        return { ...prev, familyMembers: newMembers };
      });
    },

    addSupply: (supply) => {
      const newSupply: SupplyItem = { ...supply, id: Date.now().toString() };
      setState((prev) => {
        const newSupplies = [...prev.supplies, newSupply];
        saveToStorage(STORAGE_KEYS.supplies, newSupplies);
        return { ...prev, supplies: newSupplies };
      });
    },

    updateSupply: (id, updates) => {
      setState((prev) => {
        const newSupplies = prev.supplies.map((s) => (s.id === id ? { ...s, ...updates } : s));
        saveToStorage(STORAGE_KEYS.supplies, newSupplies);
        return { ...prev, supplies: newSupplies };
      });
    },

    deleteSupply: (id) => {
      setState((prev) => {
        const newSupplies = prev.supplies.filter((s) => s.id !== id);
        saveToStorage(STORAGE_KEYS.supplies, newSupplies);
        return { ...prev, supplies: newSupplies };
      });
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
          userRole: "owner" as FamilyRole,
          pets: [],
          feedings: [],
          walks: [],
          healthRecords: [],
          familyMembers: [],
          supplies: [],
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

// Alias für einfacheren Zugriff
export function usePets() {
  const store = usePetStore();
  return {
    pets: store.pets,
    addPet: store.addPet,
    updatePet: (pet: Pet) => store.updatePet(pet.id, pet),
    deletePet: store.deletePet,
  };
}
