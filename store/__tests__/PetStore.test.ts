import { describe, it, expect, beforeEach } from "vitest";
import { usePetStore } from "../PetStore";

describe("PetStore - Unified Pet Data Architecture", () => {
  beforeEach(() => {
    const store = usePetStore.getState();
    store.reset();
  });

  describe("Pet Management", () => {
    it("should add a new pet", () => {
      const store = usePetStore.getState();
      const petData = {
        name: "Max",
        species: "dog" as const,
        breed: "Labrador",
        identification: {},
        feeding: { schedules: [], feedingHistory: [] },
        walking: { schedules: [], walkHistory: [] },
        health: { vaccinations: [], medications: [] },
        family: { owner: "norman", members: [] },
      };
      
      store.addPet(petData);
      const pets = store.getAllPets();
      
      expect(pets).toHaveLength(1);
      expect(pets[0].name).toBe("Max");
      expect(pets[0].species).toBe("dog");
    });

    it("should set active pet", () => {
      const store = usePetStore.getState();
      const petData = {
        name: "Max",
        species: "dog" as const,
        breed: "Labrador",
        identification: {},
        feeding: { schedules: [], feedingHistory: [] },
        walking: { schedules: [], walkHistory: [] },
        health: { vaccinations: [], medications: [] },
        family: { owner: "norman", members: [] },
      };
      
      store.addPet(petData);
      const pets = store.getAllPets();
      store.setActivePet(pets[0].id);

      const activePet = store.getActivePet();
      expect(activePet?.name).toBe("Max");
    });

    it("should update pet data", () => {
      const store = usePetStore.getState();
      const petData = {
        name: "Max",
        species: "dog" as const,
        breed: "Labrador",
        weight: 30,
        identification: {},
        feeding: { schedules: [], feedingHistory: [] },
        walking: { schedules: [], walkHistory: [] },
        health: { vaccinations: [], medications: [] },
        family: { owner: "norman", members: [] },
      };
      
      store.addPet(petData);
      const pets = store.getAllPets();
      store.updatePet(pets[0].id, { weight: 32 });

      const updated = store.getPet(pets[0].id);
      expect(updated?.weight).toBe(32);
    });
  });

  describe("Feeding System", () => {
    let petId: string;

    beforeEach(() => {
      const store = usePetStore.getState();
      const petData = {
        name: "Max",
        species: "dog" as const,
        breed: "Labrador",
        identification: {},
        feeding: { schedules: [], feedingHistory: [] },
        walking: { schedules: [], walkHistory: [] },
        health: { vaccinations: [], medications: [] },
        family: { owner: "norman", members: [] },
      };
      
      store.addPet(petData);
      petId = store.getAllPets()[0].id;
    });

    it("should add feeding schedule", () => {
      const store = usePetStore.getState();
      store.addFeedingSchedule(petId, {
        time: "08:00",
        amount: "200g",
        foodType: "Dry kibble",
      });

      const pet = store.getPet(petId);
      expect(pet?.feeding.schedules).toHaveLength(1);
      expect(pet?.feeding.schedules[0].time).toBe("08:00");
    });

    it("should record feeding event and create activity", () => {
      const store = usePetStore.getState();
      store.recordFeeding(petId, {
        amount: "200g",
        performedBy: "Norman",
      });

      const pet = store.getPet(petId);
      expect(pet?.feeding.lastFeeding).toBeDefined();
      expect(pet?.feeding.feedingHistory).toHaveLength(1);

      const activities = store.getActivities(petId);
      expect(activities.length).toBeGreaterThanOrEqual(1);
      expect(activities[0].type).toBe("feeding");
    });
  });

  describe("Walking System", () => {
    let petId: string;

    beforeEach(() => {
      const store = usePetStore.getState();
      const petData = {
        name: "Max",
        species: "dog" as const,
        breed: "Labrador",
        identification: {},
        feeding: { schedules: [], feedingHistory: [] },
        walking: { schedules: [], walkHistory: [] },
        health: { vaccinations: [], medications: [] },
        family: { owner: "norman", members: [] },
      };
      
      store.addPet(petData);
      petId = store.getAllPets()[0].id;
    });

    it("should add walk schedule", () => {
      const store = usePetStore.getState();
      store.addWalkSchedule(petId, {
        time: "10:30",
        duration: 30,
      });

      const pet = store.getPet(petId);
      expect(pet?.walking.schedules).toHaveLength(1);
      expect(pet?.walking.schedules[0].time).toBe("10:30");
    });

    it("should record walk event with weather data", () => {
      const store = usePetStore.getState();
      store.recordWalk(petId, {
        duration: 45,
        distance: 2.4,
        performedBy: "Norman",
        weather: {
          temperature: 18,
          condition: "Sunny",
          humidity: 65,
        },
      });

      const pet = store.getPet(petId);
      expect(pet?.walking.lastWalk).toBeDefined();
      expect(pet?.walking.lastWalk?.distance).toBe(2.4);
      expect(pet?.walking.lastWalk?.weather?.temperature).toBe(18);

      const activities = store.getActivities(petId);
      expect(activities.length).toBeGreaterThanOrEqual(1);
      expect(activities[0].data?.distance).toBe(2.4);
    });
  });

  describe("Health System", () => {
    let petId: string;

    beforeEach(() => {
      const store = usePetStore.getState();
      const petData = {
        name: "Max",
        species: "dog" as const,
        breed: "Labrador",
        identification: {},
        feeding: { schedules: [], feedingHistory: [] },
        walking: { schedules: [], walkHistory: [] },
        health: { vaccinations: [], medications: [] },
        family: { owner: "norman", members: [] },
      };
      
      store.addPet(petData);
      petId = store.getAllPets()[0].id;
    });

    it("should add vaccination", () => {
      const store = usePetStore.getState();
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);

      store.addVaccination(petId, {
        name: "Rabies",
        date: new Date().toISOString(),
        expiryDate: futureDate.toISOString(),
      });

      const pet = store.getPet(petId);
      expect(pet?.health.vaccinations).toHaveLength(1);
      expect(pet?.health.vaccinations[0].name).toBe("Rabies");
    });

    it("should add medication", () => {
      const store = usePetStore.getState();
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      store.addMedication(petId, {
        name: "Antibiotics",
        dosage: "500mg",
        frequency: "2x daily",
        startDate: new Date().toISOString(),
        endDate: futureDate.toISOString(),
      });

      const pet = store.getPet(petId);
      expect(pet?.health.medications).toHaveLength(1);
      expect(pet?.health.medications[0].name).toBe("Antibiotics");
    });
  });

  describe("Identification System", () => {
    let petId: string;

    beforeEach(() => {
      const store = usePetStore.getState();
      const petData = {
        name: "Max",
        species: "dog" as const,
        breed: "Labrador",
        identification: {},
        feeding: { schedules: [], feedingHistory: [] },
        walking: { schedules: [], walkHistory: [] },
        health: { vaccinations: [], medications: [] },
        family: { owner: "norman", members: [] },
      };
      
      store.addPet(petData);
      petId = store.getAllPets()[0].id;
    });

    it("should update pet identification", () => {
      const store = usePetStore.getState();
      store.updateIdentification(petId, {
        microchip: "123456789012345",
        taxTag: "TAX-2024-001",
        registeredAt: "TASSO",
      });

      const pet = store.getPet(petId);
      expect(pet?.identification.microchip).toBe("123456789012345");
      expect(pet?.identification.taxTag).toBe("TAX-2024-001");
    });
  });

  describe("Family Management", () => {
    let petId: string;

    beforeEach(() => {
      const store = usePetStore.getState();
      const petData = {
        name: "Max",
        species: "dog" as const,
        breed: "Labrador",
        identification: {},
        feeding: { schedules: [], feedingHistory: [] },
        walking: { schedules: [], walkHistory: [] },
        health: { vaccinations: [], medications: [] },
        family: { owner: "norman", members: [] },
      };
      
      store.addPet(petData);
      petId = store.getAllPets()[0].id;
    });

    it("should add family member", () => {
      const store = usePetStore.getState();
      store.addFamilyMember(petId, {
        name: "Sarah",
        email: "sarah@example.com",
        role: "parent",
        permissions: ["view", "edit"],
      });

      const members = store.getFamilyMembers(petId);
      expect(members).toHaveLength(1);
      expect(members[0].name).toBe("Sarah");
    });
  });

  describe("Activity Feed Integration", () => {
    let petId: string;

    beforeEach(() => {
      const store = usePetStore.getState();
      const petData = {
        name: "Max",
        species: "dog" as const,
        breed: "Labrador",
        identification: {},
        feeding: { schedules: [], feedingHistory: [] },
        walking: { schedules: [], walkHistory: [] },
        health: { vaccinations: [], medications: [] },
        family: { owner: "norman", members: [] },
      };
      
      store.addPet(petData);
      petId = store.getAllPets()[0].id;
    });

    it("should track all activities across modules", () => {
      const store = usePetStore.getState();

      // Record feeding
      store.recordFeeding(petId, { amount: "200g", performedBy: "Norman" });

      // Record walk
      store.recordWalk(petId, { duration: 45, distance: 2.4, performedBy: "Norman" });

      const activities = store.getActivities(petId);
      expect(activities.length).toBeGreaterThanOrEqual(2);

      const types = activities.map((a) => a.type);
      expect(types).toContain("feeding");
      expect(types).toContain("walking");
    });
  });
});
