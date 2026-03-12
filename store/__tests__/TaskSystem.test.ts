import { describe, it, expect, beforeEach } from "vitest";
import { usePetStore } from "../PetStore";

describe("Task Responsibility System", () => {
  beforeEach(() => {
    const store = usePetStore.getState();
    store.reset();
  });

  describe("Task Creation", () => {
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

    it("should create a feeding task", () => {
      const store = usePetStore.getState();
      const taskId = store.createTask(petId, "feeding", "08:00");

      expect(taskId).toBeDefined();
      const task = store.getTask(taskId);
      expect(task?.type).toBe("feeding");
      expect(task?.status).toBe("pending");
      expect(task?.petId).toBe(petId);
    });

    it("should create a walking task", () => {
      const store = usePetStore.getState();
      const taskId = store.createTask(petId, "walking", "10:30");

      const task = store.getTask(taskId);
      expect(task?.type).toBe("walking");
      expect(task?.scheduledTime).toBe("10:30");
    });

    it("should get all tasks for a pet", () => {
      const store = usePetStore.getState();
      store.createTask(petId, "feeding", "08:00");
      store.createTask(petId, "walking", "10:30");
      store.createTask(petId, "feeding", "18:00");

      const tasks = store.getTasksForPet(petId);
      expect(tasks).toHaveLength(3);
    });

    it("should get only pending tasks", () => {
      const store = usePetStore.getState();
      const task1 = store.createTask(petId, "feeding", "08:00");
      const task2 = store.createTask(petId, "walking", "10:30");
      store.createTask(petId, "feeding", "18:00");

      // Accept one task
      store.acceptTask(task1, "Norman");

      const pendingTasks = store.getPendingTasks(petId);
      expect(pendingTasks).toHaveLength(2);
      expect(pendingTasks.every((t) => t.status === "pending")).toBe(true);
    });
  });

  describe("Task Acceptance (I'll do it)", () => {
    let petId: string;
    let taskId: string;

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
      taskId = store.createTask(petId, "feeding", "08:00");
    });

    it("should accept a task and assign to user", () => {
      const store = usePetStore.getState();
      store.acceptTask(taskId, "Norman");

      const task = store.getTask(taskId);
      expect(task?.status).toBe("accepted");
      expect(task?.assignedTo).toBe("Norman");
      expect(task?.acceptedAt).toBeDefined();
    });

    it("should create activity log entry when task is accepted", () => {
      const store = usePetStore.getState();
      const activitiesBefore = store.getActivities(petId).length;

      store.acceptTask(taskId, "Norman");

      const activitiesAfter = store.getActivities(petId);
      expect(activitiesAfter).toHaveLength(activitiesBefore + 1);

      const lastActivity = activitiesAfter[activitiesAfter.length - 1];
      expect(lastActivity.type).toBe("task_accepted");
      expect(lastActivity.title).toContain("Norman");
      expect(lastActivity.title).toContain("will");
      expect(lastActivity.title).toContain("feeding");
    });

    it("should include task data in activity", () => {
      const store = usePetStore.getState();
      store.acceptTask(taskId, "Sarah");

      const activities = store.getActivities(petId);
      const taskActivity = activities.find((a) => a.type === "task_accepted");

      expect(taskActivity?.data?.taskId).toBe(taskId);
      expect(taskActivity?.data?.taskType).toBe("feeding");
    });
  });

  describe("Task Completion", () => {
    let petId: string;
    let taskId: string;

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
      taskId = store.createTask(petId, "feeding", "08:00");
      store.acceptTask(taskId, "Norman");
    });

    it("should complete an accepted task", () => {
      const store = usePetStore.getState();
      store.completeTask(taskId);

      const task = store.getTask(taskId);
      expect(task?.status).toBe("completed");
      expect(task?.completedAt).toBeDefined();
    });

    it("should create activity log entry when task is completed", () => {
      const store = usePetStore.getState();
      const activitiesBefore = store.getActivities(petId).length;

      store.completeTask(taskId);

      const activitiesAfter = store.getActivities(petId);
      expect(activitiesAfter).toHaveLength(activitiesBefore + 1);

      const lastActivity = activitiesAfter[activitiesAfter.length - 1];
      expect(lastActivity.type).toBe("task_completed");
      expect(lastActivity.title).toContain("Norman");
      expect(lastActivity.title).toContain("fed");
    });

    it("should track who completed the task", () => {
      const store = usePetStore.getState();
      store.completeTask(taskId);

      const activities = store.getActivities(petId);
      const completedActivity = activities.find((a) => a.type === "task_completed");

      expect(completedActivity?.performedBy).toBe("Norman");
    });
  });

  describe("Task Workflow", () => {
    let petId: string;

    beforeEach(() => {
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
      petId = store.getAllPets()[0].id;
    });

    it("should track complete task lifecycle", () => {
      const store = usePetStore.getState();

      // Create task
      const taskId = store.createTask(petId, "feeding", "08:00");
      let task = store.getTask(taskId);
      expect(task?.status).toBe("pending");

      // Accept task
      store.acceptTask(taskId, "Sarah");
      task = store.getTask(taskId);
      expect(task?.status).toBe("accepted");
      expect(task?.assignedTo).toBe("Sarah");

      // Complete task
      store.completeTask(taskId);
      task = store.getTask(taskId);
      expect(task?.status).toBe("completed");

      // Check activity log
      const activities = store.getActivities(petId);
      expect(activities.length).toBeGreaterThanOrEqual(2);

      const acceptedActivity = activities.find((a) => a.type === "task_accepted");
      const completedActivity = activities.find((a) => a.type === "task_completed");

      expect(acceptedActivity).toBeDefined();
      expect(completedActivity).toBeDefined();
    });

    it("should handle multiple tasks for same pet", () => {
      const store = usePetStore.getState();

      // Create multiple tasks
      const feedingTask = store.createTask(petId, "feeding", "08:00");
      const walkingTask = store.createTask(petId, "walking", "10:30");

      // Different people accept different tasks
      store.acceptTask(feedingTask, "Norman");
      store.acceptTask(walkingTask, "Sarah");

      // Complete tasks
      store.completeTask(feedingTask);
      store.completeTask(walkingTask);

      // Check activities
      const activities = store.getActivities(petId);
      const completedActivities = activities.filter((a) => a.type === "task_completed");

      expect(completedActivities).toHaveLength(2);
      expect(completedActivities.some((a) => a.performedBy === "Norman")).toBe(true);
      expect(completedActivities.some((a) => a.performedBy === "Sarah")).toBe(true);
    });
  });
});
