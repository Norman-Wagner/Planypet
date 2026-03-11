import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Pet {
  id: string;
  name: string;
  animalType: string;
  breed?: string;
  age?: string;
  weight?: number;
  microchip?: string;
  color?: string;
  photo?: string;
  createdAt: Date;
}

interface PetStore {
  pets: Pet[];
  addPet: (pet: Omit<Pet, "id" | "createdAt">) => void;
  updatePet: (id: string, pet: Partial<Pet>) => void;
  deletePet: (id: string) => void;
  getPet: (id: string) => Pet | undefined;
  getAllPets: () => Pet[];
}

export const usePetStore = create<PetStore>()(
  persist(
    (set, get) => ({
      pets: [],

      addPet: (pet: Omit<Pet, "id" | "createdAt">) => {
        const newPet: Pet = {
          ...pet,
          id: Date.now().toString(),
          createdAt: new Date(),
        };
        set((state: PetStore) => ({
          pets: [...state.pets, newPet],
        }));
      },

      updatePet: (id: string, updates: Partial<Pet>) => {
        set((state: PetStore) => ({
          pets: state.pets.map((pet: Pet) => (pet.id === id ? { ...pet, ...updates } : pet)),
        }));
      },

      deletePet: (id: string) => {
        set((state: PetStore) => ({
          pets: state.pets.filter((pet: Pet) => pet.id !== id),
        }));
      },

      getPet: (id: string) => {
        return get().pets.find((pet: Pet) => pet.id === id);
      },

      getAllPets: (): Pet[] => {
        return get().pets;
      },
    }),
    {
      name: "pet-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
