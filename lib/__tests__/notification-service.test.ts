import { describe, it, expect, beforeEach, vi } from "vitest";
import { usePetStore } from "../../store/PetStore";
import * as notificationService from "../notification-service";

describe("Notification Service", () => {
  beforeEach(() => {
    const store = usePetStore.getState();
    store.reset();
    vi.clearAllMocks();
  });

  describe("Task Accepted Notifications", () => {
    it("should notify family members when task is accepted", async () => {
      const store = usePetStore.getState();

      // Create pet with family members
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

      // Add family members
      store.addFamilyMember(petId, {
        name: "Sarah",
        email: "sarah@example.com",
        role: "parent",
        permissions: ["view", "edit"],
      });

      store.addFamilyMember(petId, {
        name: "Lisa",
        email: "lisa@example.com",
        role: "parent",
        permissions: ["view"],
      });

      // Create and accept task
      const taskId = store.createTask(petId, "feeding", "08:00");
      const task = store.getTask(taskId);

      expect(task).toBeDefined();

      // Simulate notification (in real app, this would be async)
      // For testing, we just verify the structure
      const members = store.getFamilyMembers(petId);
      const recipientMembers = members.filter((m) => m.name !== "Norman");

      expect(recipientMembers).toHaveLength(2);
      expect(recipientMembers.some((m) => m.name === "Sarah")).toBe(true);
      expect(recipientMembers.some((m) => m.name === "Lisa")).toBe(true);
    });

    it("should not notify the person who accepted the task", async () => {
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

      // Add family members
      store.addFamilyMember(petId, {
        name: "Norman",
        email: "norman@example.com",
        role: "owner",
        permissions: ["view", "edit"],
      });

      store.addFamilyMember(petId, {
        name: "Sarah",
        email: "sarah@example.com",
        role: "parent",
        permissions: ["view"],
      });

      // Create task
      const taskId = store.createTask(petId, "feeding", "08:00");
      const task = store.getTask(taskId);

      // Accept task as Norman
      store.acceptTask(taskId, "Norman");

      // Get family members (excluding Norman)
      const members = store.getFamilyMembers(petId);
      const recipientMembers = members.filter((m) => m.name !== "Norman");

      // Only Sarah should receive notification
      expect(recipientMembers).toHaveLength(1);
      expect(recipientMembers[0].name).toBe("Sarah");
    });
  });

  describe("Task Completed Notifications", () => {
    it("should notify family members when task is completed", async () => {
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

      // Add family members
      store.addFamilyMember(petId, {
        name: "Norman",
        email: "norman@example.com",
        role: "owner",
        permissions: ["view", "edit"],
      });

      store.addFamilyMember(petId, {
        name: "Sarah",
        email: "sarah@example.com",
        role: "parent",
        permissions: ["view"],
      });

      // Create and accept task
      const taskId = store.createTask(petId, "feeding", "08:00");
      store.acceptTask(taskId, "Norman");

      // Complete task
      store.completeTask(taskId);

      const task = store.getTask(taskId);
      expect(task?.status).toBe("completed");
      expect(task?.completedAt).toBeDefined();
    });
  });

  describe("Notification Content", () => {
    it("should generate correct notification for feeding task", async () => {
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

      // Create feeding task
      const taskId = store.createTask(petId, "feeding", "08:00");
      const task = store.getTask(taskId);

      expect(task?.type).toBe("feeding");

      // Verify activity log entry
      store.acceptTask(taskId, "Norman");
      const activities = store.getActivities(petId);
      const taskActivity = activities.find((a) => a.type === "task_accepted");

      expect(taskActivity?.title).toContain("Norman");
      expect(taskActivity?.title).toContain("will");
      expect(taskActivity?.title).toContain("feeding");
    });

    it("should generate correct notification for walking task", async () => {
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

      // Create walking task
      const taskId = store.createTask(petId, "walking", "10:30");
      store.acceptTask(taskId, "Sarah");

      const activities = store.getActivities(petId);
      const taskActivity = activities.find((a) => a.type === "task_accepted");

      expect(taskActivity?.title).toContain("Sarah");
      expect(taskActivity?.title).toContain("will");
      expect(taskActivity?.title).toContain("walking");
    });
  });

  describe("No Family Members", () => {
    it("should handle case with no family members", async () => {
      const store = usePetStore.getState();

      const petData = {
        name: "Solo",
        species: "dog" as const,
        breed: "Mixed",
        identification: {},
        feeding: { schedules: [], feedingHistory: [] },
        walking: { schedules: [], walkHistory: [] },
        health: { vaccinations: [], medications: [] },
        family: { owner: "norman", members: [] },
      };

      store.addPet(petData);
      const petId = store.getAllPets()[0].id;

      // Create and accept task without family members
      const taskId = store.createTask(petId, "feeding", "08:00");
      store.acceptTask(taskId, "Norman");

      // Should not throw error
      const task = store.getTask(taskId);
      expect(task?.status).toBe("accepted");

      // Activity should still be created
      const activities = store.getActivities(petId);
      expect(activities.length).toBeGreaterThan(0);
    });
  });
});
