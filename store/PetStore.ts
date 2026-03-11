import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Pet,
  PetStoreState,
  FeedingEvent,
  WalkEvent,
  ActivityEvent,
  FeedingSchedule,
  WalkSchedule,
  Vaccination,
  Medication,
  FamilyMember,
} from "./types";

interface PetStoreActions {
  // Pet Management
  addPet: (pet: Omit<Pet, "id" | "createdAt" | "updatedAt">) => void;
  updatePet: (petId: string, updates: Partial<Pet>) => void;
  deletePet: (petId: string) => void;
  getPet: (petId: string) => Pet | undefined;
  getAllPets: () => Pet[];
  setActivePet: (petId: string) => void;
  getActivePet: () => Pet | undefined;

  // Feeding Management
  addFeedingSchedule: (petId: string, schedule: Omit<FeedingSchedule, "id">) => void;
  removeFeedingSchedule: (petId: string, scheduleId: string) => void;
  recordFeeding: (petId: string, event: Omit<FeedingEvent, "id" | "timestamp">) => void;
  getFeedingHistory: (petId: string) => FeedingEvent[];

  // Walking Management
  addWalkSchedule: (petId: string, schedule: Omit<WalkSchedule, "id">) => void;
  removeWalkSchedule: (petId: string, scheduleId: string) => void;
  recordWalk: (petId: string, event: Omit<WalkEvent, "id" | "timestamp">) => void;
  getWalkHistory: (petId: string) => WalkEvent[];

  // Health Management
  addVaccination: (petId: string, vaccination: Omit<Vaccination, "id">) => void;
  removeVaccination: (petId: string, vaccinationId: string) => void;
  addMedication: (petId: string, medication: Omit<Medication, "id">) => void;
  removeMedication: (petId: string, medicationId: string) => void;

  // Identification
  updateIdentification: (petId: string, identification: Partial<Pet["identification"]>) => void;

  // Family Management
  addFamilyMember: (petId: string, member: Omit<FamilyMember, "id" | "joinedAt">) => void;
  removeFamilyMember: (petId: string, memberId: string) => void;
  getFamilyMembers: (petId: string) => FamilyMember[];

  // Activity Feed
  addActivity: (activity: Omit<ActivityEvent, "id">) => void;
  getActivities: (petId?: string) => ActivityEvent[];
  clearActivities: () => void;

  // Lost Pet Mode
  enableLostPetMode: (petId: string, description: string) => void;
  disableLostPetMode: (petId: string) => void;

  // Utility
  reset: () => void;
}

type PetStore = PetStoreState & PetStoreActions;

const generateId = () => Math.random().toString(36).substring(2, 11);

export const usePetStore = create<PetStore>()(
  persist(
    (set, get) => ({
      // Initial state
      pets: {},
      activities: [],
      loading: false,

      // Pet Management
      addPet: (pet) => {
        const petId = generateId();
        const newPet: Pet = {
          ...pet,
          id: petId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          pets: { ...state.pets, [petId]: newPet },
          activePetId: petId,
        }));
      },

      updatePet: (petId, updates) => {
        set((state) => {
          const pet = state.pets[petId];
          if (!pet) return state;
          return {
            pets: {
              ...state.pets,
              [petId]: {
                ...pet,
                ...updates,
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },

      deletePet: (petId) => {
        set((state) => {
          const { [petId]: _, ...remaining } = state.pets;
          return {
            pets: remaining,
            activePetId: state.activePetId === petId ? undefined : state.activePetId,
          };
        });
      },

      getPet: (petId) => {
        return get().pets[petId];
      },

      getAllPets: () => {
        return Object.values(get().pets);
      },

      setActivePet: (petId) => {
        set({ activePetId: petId });
      },

      getActivePet: () => {
        const { activePetId, pets } = get();
        return activePetId ? pets[activePetId] : undefined;
      },

      // Feeding Management
      addFeedingSchedule: (petId, schedule) => {
        set((state) => {
          const pet = state.pets[petId];
          if (!pet) return state;
          return {
            pets: {
              ...state.pets,
              [petId]: {
                ...pet,
                feeding: {
                  ...pet.feeding,
                  schedules: [...pet.feeding.schedules, { ...schedule, id: generateId() }],
                },
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },

      removeFeedingSchedule: (petId, scheduleId) => {
        set((state) => {
          const pet = state.pets[petId];
          if (!pet) return state;
          return {
            pets: {
              ...state.pets,
              [petId]: {
                ...pet,
                feeding: {
                  ...pet.feeding,
                  schedules: pet.feeding.schedules.filter((s) => s.id !== scheduleId),
                },
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },

      recordFeeding: (petId, event) => {
        const feedingEvent: FeedingEvent = {
          ...event,
          id: generateId(),
          timestamp: new Date().toISOString(),
        };

        set((state) => {
          const pet = state.pets[petId];
          if (!pet) return state;

          const updatedPet: Pet = {
            ...pet,
            feeding: {
              ...pet.feeding,
              lastFeeding: feedingEvent,
              feedingHistory: [feedingEvent, ...pet.feeding.feedingHistory],
            },
            updatedAt: new Date().toISOString(),
          };

          return {
            pets: { ...state.pets, [petId]: updatedPet },
            activities: [
              ...state.activities,
              {
                id: generateId(),
                petId,
                type: "feeding" as const,
                title: `${event.performedBy} fed ${pet.name}`,
                description: `${pet.name} received ${event.amount}`,
                timestamp: feedingEvent.timestamp,
                performedBy: event.performedBy,
                data: { feedingEventId: feedingEvent.id },
              },
            ],
          };
        });
      },

      getFeedingHistory: (petId) => {
        const pet = get().pets[petId];
        return pet?.feeding.feedingHistory || [];
      },

      // Walking Management
      addWalkSchedule: (petId, schedule) => {
        set((state) => {
          const pet = state.pets[petId];
          if (!pet) return state;
          return {
            pets: {
              ...state.pets,
              [petId]: {
                ...pet,
                walking: {
                  ...pet.walking,
                  schedules: [...pet.walking.schedules, { ...schedule, id: generateId() }],
                },
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },

      removeWalkSchedule: (petId, scheduleId) => {
        set((state) => {
          const pet = state.pets[petId];
          if (!pet) return state;
          return {
            pets: {
              ...state.pets,
              [petId]: {
                ...pet,
                walking: {
                  ...pet.walking,
                  schedules: pet.walking.schedules.filter((s) => s.id !== scheduleId),
                },
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },

      recordWalk: (petId, event) => {
        const walkEvent: WalkEvent = {
          ...event,
          id: generateId(),
          timestamp: new Date().toISOString(),
        };

        set((state) => {
          const pet = state.pets[petId];
          if (!pet) return state;

          const updatedPet: Pet = {
            ...pet,
            walking: {
              ...pet.walking,
              lastWalk: walkEvent,
              walkHistory: [walkEvent, ...pet.walking.walkHistory],
            },
            updatedAt: new Date().toISOString(),
          };

          return {
            pets: { ...state.pets, [petId]: updatedPet },
            activities: [
              ...state.activities,
              {
                id: generateId(),
                petId,
                type: "walking" as const,
                title: `${event.performedBy} walked ${pet.name}`,
                description: `${event.distance} km in ${event.duration} minutes`,
                timestamp: walkEvent.timestamp,
                performedBy: event.performedBy,
                data: { walkEventId: walkEvent.id, distance: event.distance, duration: event.duration },
              },
            ],
          };
        });
      },

      getWalkHistory: (petId) => {
        const pet = get().pets[petId];
        return pet?.walking.walkHistory || [];
      },

      // Health Management
      addVaccination: (petId, vaccination) => {
        set((state) => {
          const pet = state.pets[petId];
          if (!pet) return state;
          return {
            pets: {
              ...state.pets,
              [petId]: {
                ...pet,
                health: {
                  ...pet.health,
                  vaccinations: [...pet.health.vaccinations, { ...vaccination, id: generateId() }],
                },
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },

      removeVaccination: (petId, vaccinationId) => {
        set((state) => {
          const pet = state.pets[petId];
          if (!pet) return state;
          return {
            pets: {
              ...state.pets,
              [petId]: {
                ...pet,
                health: {
                  ...pet.health,
                  vaccinations: pet.health.vaccinations.filter((v) => v.id !== vaccinationId),
                },
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },

      addMedication: (petId, medication) => {
        set((state) => {
          const pet = state.pets[petId];
          if (!pet) return state;
          return {
            pets: {
              ...state.pets,
              [petId]: {
                ...pet,
                health: {
                  ...pet.health,
                  medications: [...pet.health.medications, { ...medication, id: generateId() }],
                },
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },

      removeMedication: (petId, medicationId) => {
        set((state) => {
          const pet = state.pets[petId];
          if (!pet) return state;
          return {
            pets: {
              ...state.pets,
              [petId]: {
                ...pet,
                health: {
                  ...pet.health,
                  medications: pet.health.medications.filter((m) => m.id !== medicationId),
                },
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },

      // Identification
      updateIdentification: (petId, identification) => {
        set((state) => {
          const pet = state.pets[petId];
          if (!pet) return state;
          return {
            pets: {
              ...state.pets,
              [petId]: {
                ...pet,
                identification: { ...pet.identification, ...identification },
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },

      // Family Management
      addFamilyMember: (petId, member) => {
        set((state) => {
          const pet = state.pets[petId];
          if (!pet) return state;
          return {
            pets: {
              ...state.pets,
              [petId]: {
                ...pet,
                family: {
                  ...pet.family,
                  members: [
                    ...pet.family.members,
                    { ...member, id: generateId(), joinedAt: new Date().toISOString() },
                  ],
                },
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },

      removeFamilyMember: (petId, memberId) => {
        set((state) => {
          const pet = state.pets[petId];
          if (!pet) return state;
          return {
            pets: {
              ...state.pets,
              [petId]: {
                ...pet,
                family: {
                  ...pet.family,
                  members: pet.family.members.filter((m) => m.id !== memberId),
                },
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },

      getFamilyMembers: (petId) => {
        const pet = get().pets[petId];
        return pet?.family.members || [];
      },

      // Activity Feed
      addActivity: (activity) => {
        set((state) => ({
          activities: [
            {
              ...activity,
              id: generateId(),
            },
            ...state.activities,
          ],
        }));
      },

      getActivities: (petId) => {
        const activities = get().activities;
        return petId ? activities.filter((a) => a.petId === petId) : activities;
      },

      clearActivities: () => {
        set({ activities: [] });
      },

      // Lost Pet Mode
      enableLostPetMode: (petId, description) => {
        set((state) => {
          const pet = state.pets[petId];
          if (!pet) return state;
          return {
            pets: {
              ...state.pets,
              [petId]: {
                ...pet,
                lostPetMode: {
                  enabled: true,
                  reportedAt: new Date().toISOString(),
                  description,
                },
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },

      disableLostPetMode: (petId) => {
        set((state) => {
          const pet = state.pets[petId];
          if (!pet) return state;
          return {
            pets: {
              ...state.pets,
              [petId]: {
                ...pet,
                lostPetMode: { enabled: false },
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },

      // Utility
      reset: () => {
        set({
          pets: {},
          activePetId: undefined,
          activities: [],
          loading: false,
          error: undefined,
        });
      },
    }),
    {
      name: "planypet-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        pets: state.pets,
        activePetId: state.activePetId,
        activities: state.activities,
      }),
      skipHydration: true,
    }
  )
);
