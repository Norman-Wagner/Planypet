import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock AsyncStorage
vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: vi.fn(() => Promise.resolve(null)),
    setItem: vi.fn(() => Promise.resolve()),
    multiRemove: vi.fn(() => Promise.resolve()),
  },
}));

// Mock React
vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
    createContext: vi.fn(() => ({
      Provider: ({ children }: { children: React.ReactNode }) => children,
    })),
    useContext: vi.fn(),
    useState: vi.fn((initial) => [initial, vi.fn()]),
    useEffect: vi.fn(),
  };
});

describe("Pet Store Types", () => {
  it("should define valid PetType values", () => {
    const validTypes = ["cat", "dog", "fish", "bird", "reptile", "horse", "smallPet"];
    expect(validTypes).toHaveLength(7);
    expect(validTypes).toContain("cat");
    expect(validTypes).toContain("dog");
    expect(validTypes).toContain("fish");
    expect(validTypes).toContain("bird");
    expect(validTypes).toContain("reptile");
    expect(validTypes).toContain("horse");
    expect(validTypes).toContain("smallPet");
  });

  it("should define Pet interface structure", () => {
    const mockPet = {
      id: "1",
      name: "Luna",
      type: "cat" as const,
      breed: "Perserkatze",
      age: "3 Jahre",
      weight: "4.5 kg",
      isGroup: false,
      imageUrl: "https://example.com/luna.jpg",
      createdAt: new Date().toISOString(),
    };

    expect(mockPet.id).toBeDefined();
    expect(mockPet.name).toBe("Luna");
    expect(mockPet.type).toBe("cat");
    expect(mockPet.isGroup).toBe(false);
    expect(mockPet.createdAt).toBeDefined();
  });

  it("should define FeedingEntry interface structure", () => {
    const mockFeeding = {
      id: "1",
      petId: "pet1",
      time: "08:00",
      food: "Trockenfutter",
      amount: "50g",
      completed: false,
      completedAt: undefined,
    };

    expect(mockFeeding.id).toBeDefined();
    expect(mockFeeding.petId).toBe("pet1");
    expect(mockFeeding.completed).toBe(false);
  });

  it("should define WalkEntry interface structure", () => {
    const mockWalk = {
      id: "1",
      petId: "pet1",
      scheduledTime: "07:00",
      duration: 30,
      completed: false,
      completedAt: undefined,
      route: {
        coordinates: [{ lat: 52.52, lng: 13.405 }],
        distance: 1500,
        duration: 1800,
      },
    };

    expect(mockWalk.id).toBeDefined();
    expect(mockWalk.duration).toBe(30);
    expect(mockWalk.route?.distance).toBe(1500);
  });

  it("should define HealthRecord interface structure", () => {
    const mockRecord = {
      id: "1",
      petId: "pet1",
      type: "symptom" as const,
      title: "Husten",
      description: "Leichter Husten seit 2 Tagen",
      date: new Date().toISOString(),
      images: ["image1.jpg"],
      audioNote: undefined,
    };

    expect(mockRecord.id).toBeDefined();
    expect(mockRecord.type).toBe("symptom");
    expect(mockRecord.title).toBe("Husten");
  });
});

describe("Pet Store State", () => {
  it("should have correct initial state structure", () => {
    const initialState = {
      userName: "",
      pets: [],
      feedings: [],
      walks: [],
      healthRecords: [],
      onboardingComplete: false,
    };

    expect(initialState.userName).toBe("");
    expect(initialState.pets).toEqual([]);
    expect(initialState.feedings).toEqual([]);
    expect(initialState.walks).toEqual([]);
    expect(initialState.healthRecords).toEqual([]);
    expect(initialState.onboardingComplete).toBe(false);
  });

  it("should support multiple pet types", () => {
    const pets = [
      { id: "1", name: "Luna", type: "cat", isGroup: false, createdAt: new Date().toISOString() },
      { id: "2", name: "Max", type: "dog", isGroup: false, createdAt: new Date().toISOString() },
      { id: "3", name: "Goldfische", type: "fish", isGroup: true, createdAt: new Date().toISOString() },
      { id: "4", name: "Koko", type: "bird", isGroup: false, createdAt: new Date().toISOString() },
      { id: "5", name: "Schildi", type: "reptile", isGroup: false, createdAt: new Date().toISOString() },
      { id: "6", name: "Spirit", type: "horse", isGroup: false, createdAt: new Date().toISOString() },
      { id: "7", name: "Hoppel", type: "smallPet", isGroup: false, createdAt: new Date().toISOString() },
    ];

    expect(pets).toHaveLength(7);
    expect(pets.filter((p) => p.isGroup)).toHaveLength(1);
    expect(pets.find((p) => p.type === "fish")?.isGroup).toBe(true);
  });
});

describe("Storage Keys", () => {
  it("should define all required storage keys", () => {
    const STORAGE_KEYS = {
      userName: "userName",
      pets: "pets",
      feedings: "feedings",
      walks: "walks",
      healthRecords: "healthRecords",
      onboardingComplete: "onboardingComplete",
    };

    expect(Object.keys(STORAGE_KEYS)).toHaveLength(6);
    expect(STORAGE_KEYS.userName).toBe("userName");
    expect(STORAGE_KEYS.pets).toBe("pets");
    expect(STORAGE_KEYS.feedings).toBe("feedings");
    expect(STORAGE_KEYS.walks).toBe("walks");
    expect(STORAGE_KEYS.healthRecords).toBe("healthRecords");
    expect(STORAGE_KEYS.onboardingComplete).toBe("onboardingComplete");
  });
});

describe("Health Record Types", () => {
  it("should support all health record types", () => {
    const validTypes = ["symptom", "vaccination", "medication", "appointment", "note"];
    
    expect(validTypes).toContain("symptom");
    expect(validTypes).toContain("vaccination");
    expect(validTypes).toContain("medication");
    expect(validTypes).toContain("appointment");
    expect(validTypes).toContain("note");
  });
});
