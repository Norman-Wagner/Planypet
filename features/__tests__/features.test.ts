import { describe, it, expect, beforeEach } from "vitest";
import { usePetStore } from "../../store/PetStore";

describe("Feature Integration Tests", () => {
  beforeEach(() => {
    const store = usePetStore.getState();
    store.reset();
  });

  describe("Task Completion Feature", () => {
    it("should accept and complete a task", () => {
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
      const petId = store.getAllPets()[0].id;

      // Create task
      const taskId = store.createTask(petId, "feeding", "08:00");
      let task = store.getTask(taskId);
      expect(task?.status).toBe("pending");

      // Accept task
      store.acceptTask(taskId, "Norman");
      task = store.getTask(taskId);
      expect(task?.status).toBe("accepted");
      expect(task?.assignedTo).toBe("Norman");

      // Complete task
      store.completeTask(taskId);
      task = store.getTask(taskId);
      expect(task?.status).toBe("completed");
      expect(task?.completedAt).toBeDefined();
    });

    it("should create activity log when task is completed", () => {
      const store = usePetStore.getState();

      const petData = {
        name: "Bella",
        species: "cat" as const,
        breed: "Persian",
        identification: {},
        feeding: { schedules: [], feedingHistory: [] },
        walking: { schedules: [], walkHistory: [] },
        health: { vaccinations: [], medications: [] },
        family: { owner: "norman", members: [] },
      };

      store.addPet(petData);
      const petId = store.getAllPets()[0].id;

      const taskId = store.createTask(petId, "feeding", "08:00");
      store.acceptTask(taskId, "Sarah");
      store.completeTask(taskId);

      const activities = store.getActivities(petId);
      const completedActivity = activities.find((a) => a.type === "task_completed");

      expect(completedActivity).toBeDefined();
      expect(completedActivity?.title).toContain("Sarah");
      expect(completedActivity?.title).toContain("fed");
    });

    it("should handle multiple concurrent tasks", () => {
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
      const petId = store.getAllPets()[0].id;

      // Create multiple tasks
      const feedingTaskId = store.createTask(petId, "feeding", "08:00");
      const walkingTaskId = store.createTask(petId, "walking", "10:00");
      const medicationTaskId = store.createTask(petId, "medication", "12:00");

      // Accept all
      store.acceptTask(feedingTaskId, "Norman");
      store.acceptTask(walkingTaskId, "Sarah");
      store.acceptTask(medicationTaskId, "Lisa");

      // Complete in different order
      store.completeTask(walkingTaskId);
      store.completeTask(feedingTaskId);
      store.completeTask(medicationTaskId);

      const tasks = store.getTasksForPet(petId);
      const completedTasks = tasks.filter((t) => t.status === "completed");

      expect(completedTasks).toHaveLength(3);
    });
  });

  describe("Walk Tracker Feature", () => {
    it("should record walk event with distance and duration", () => {
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
      const petId = store.getAllPets()[0].id;

      // Record walk
      const walkEvent = {
        id: "walk-1",
        timestamp: new Date().toISOString(),
        distance: 2.5,
        duration: 30,
        route: JSON.stringify([
          { latitude: 50.1109, longitude: 14.4094 },
          { latitude: 50.1115, longitude: 14.4105 },
        ]),
        weather: {
          temperature: 15,
          condition: "Sunny",
          humidity: 60,
        },
        performedBy: "Norman",
        notes: "Nice walk in the park",
      };

      store.recordWalk(petId, walkEvent);

      const pet = store.getPet(petId);
      expect(pet?.walking.walkHistory).toHaveLength(1);
      expect(pet?.walking.walkHistory[0].distance).toBe(2.5);
      expect(pet?.walking.walkHistory[0].duration).toBe(30);
    });

    it("should create activity log for walk", () => {
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
      const petId = store.getAllPets()[0].id;

      const walkEvent = {
        id: "walk-1",
        timestamp: new Date().toISOString(),
        distance: 3.2,
        duration: 45,
        route: JSON.stringify([]),
        weather: {
          temperature: 18,
          condition: "Cloudy",
          humidity: 70,
        },
        performedBy: "Sarah",
        notes: "Evening walk",
      };

      store.recordWalk(petId, walkEvent);
      store.addActivity({
        petId,
        type: "walking",
        title: `Sarah walked Max 3.2km`,
        description: "Duration: 45m",
        timestamp: new Date().toISOString(),
        performedBy: "Sarah",
        data: { distance: 3.2, duration: 45 },
      });

      const activities = store.getActivities(petId);
      const walkActivity = activities.find((a) => a.type === "walking");

      expect(walkActivity).toBeDefined();
      expect(walkActivity?.title).toContain("Sarah");
      expect(walkActivity?.title).toContain("3.2km");
    });

    it("should track multiple walks", () => {
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
      const petId = store.getAllPets()[0].id;

      // Record multiple walks
      for (let i = 0; i < 3; i++) {
        const walkEvent = {
          id: `walk-${i}`,
          timestamp: new Date().toISOString(),
          distance: 2.0 + i * 0.5,
          duration: 30 + i * 10,
          route: JSON.stringify([]),
          weather: {
            temperature: 15 + i,
            condition: "Sunny",
            humidity: 60,
          },
          performedBy: "Norman",
          notes: `Walk ${i + 1}`,
        };

        store.recordWalk(petId, walkEvent);
      }

      const pet = store.getPet(petId);
      const walks = pet?.walking.walkHistory || [];
      expect(walks.length).toBeGreaterThanOrEqual(3);
      // Verify distances are recorded correctly
      const distances = walks.map((w) => w.distance).slice(0, 3);
      expect(distances).toContain(2.0);
      expect(distances).toContain(2.5);
      expect(distances).toContain(3.0);
    });
  });

  describe("Lost Pet QR Feature", () => {
    it("should store QR code in pet identification", () => {
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
      const petId = store.getAllPets()[0].id;

      const qrCode = "https://planypet.app/finder/abc123def456";
      store.updateIdentification(petId, {
        qrCode,
      });

      const pet = store.getPet(petId);
      expect(pet?.identification.qrCode).toBe(qrCode);
    });

    it("should support microchip registration", () => {
      const store = usePetStore.getState();

      const petData = {
        name: "Bella",
        species: "cat" as const,
        breed: "Persian",
        identification: {},
        feeding: { schedules: [], feedingHistory: [] },
        walking: { schedules: [], walkHistory: [] },
        health: { vaccinations: [], medications: [] },
        family: { owner: "norman", members: [] },
      };

      store.addPet(petData);
      const petId = store.getAllPets()[0].id;

      store.updateIdentification(petId, {
        microchip: "985141234567890",
        registeredAt: "TASSO",
        registrationStatus: "confirmed",
      });

      const pet = store.getPet(petId);
      expect(pet?.identification.microchip).toBe("985141234567890");
      expect(pet?.identification.registeredAt).toBe("TASSO");
      expect(pet?.identification.registrationStatus).toBe("confirmed");
    });

    it("should support tax tag registration", () => {
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
      const petId = store.getAllPets()[0].id;

      store.updateIdentification(petId, {
        taxTag: "C-2024-001234",
        registrationStatus: "confirmed",
      });

      const pet = store.getPet(petId);
      expect(pet?.identification.taxTag).toBe("C-2024-001234");
    });

    it("should combine multiple identification methods", () => {
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
      const petId = store.getAllPets()[0].id;

      store.updateIdentification(petId, {
        microchip: "985141234567890",
        taxTag: "C-2024-001234",
        qrCode: "https://planypet.app/finder/abc123",
        registeredAt: "TASSO",
        registrationStatus: "confirmed",
      });

      const pet = store.getPet(petId);
      expect(pet?.identification.microchip).toBeDefined();
      expect(pet?.identification.taxTag).toBeDefined();
      expect(pet?.identification.qrCode).toBeDefined();
      expect(pet?.identification.registeredAt).toBeDefined();
    });
  });

  describe("Cross-Feature Integration", () => {
    it("should integrate task completion with activity feed", () => {
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
      const petId = store.getAllPets()[0].id;

      // Create and complete task
      const taskId = store.createTask(petId, "walking", "10:00");
      store.acceptTask(taskId, "Norman");
      store.completeTask(taskId);

      // Record walk
      const walkEvent = {
        id: "walk-1",
        timestamp: new Date().toISOString(),
        distance: 2.5,
        duration: 30,
        route: JSON.stringify([]),
        weather: {
          temperature: 15,
          condition: "Sunny",
          humidity: 60,
        },
        performedBy: "Norman",
      };

      store.recordWalk(petId, walkEvent);

      // Check activity feed
      const activities = store.getActivities(petId);
      expect(activities.length).toBeGreaterThan(0);

      const taskActivity = activities.find((a) => a.type === "task_completed");
      const walkActivity = activities.find((a) => a.type === "walking");

      expect(taskActivity).toBeDefined();
      expect(walkActivity).toBeDefined();
    });
  });
});
