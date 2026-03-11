/**
 * Unified Pet Data Model
 * Central data structure for all pet-related information
 */

export interface Vaccination {
  id: string;
  name: string;
  date: string;
  expiryDate?: string;
  veterinarian?: string;
  notes?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  notes?: string;
}

export interface FeedingSchedule {
  id: string;
  time: string; // HH:mm format
  amount: string;
  foodType: string;
  notes?: string;
}

export interface FeedingEvent {
  id: string;
  timestamp: string;
  amount: string;
  notes?: string;
  performedBy: string; // User name who performed the feeding
}

export interface WalkSchedule {
  id: string;
  time: string; // HH:mm format
  duration: number; // minutes
  notes?: string;
}

export interface WalkEvent {
  id: string;
  timestamp: string;
  duration: number; // minutes
  distance: number; // km
  route?: string; // encoded route or description
  weather?: {
    temperature: number;
    condition: string;
    humidity?: number;
  };
  performedBy: string; // User name who performed the walk
  notes?: string;
}

export interface PetIdentification {
  microchip?: string; // 15-digit microchip number
  taxTag?: string;
  qrCode?: string; // QR code data/URL
  registeredAt?: string; // Registry name (TASSO, FINDEFIX, etc.)
  registrationDate?: string;
  registrationStatus?: "pending" | "confirmed" | "failed";
}

export interface FamilyMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "parent" | "child" | "vet" | "staff";
  permissions: string[];
  joinedAt: string;
}

export interface Pet {
  id: string;
  name: string;
  species: "dog" | "cat" | "rabbit" | "bird" | "other";
  breed?: string;
  birthday?: string;
  weight?: number; // kg
  photo?: string; // URL or local path

  // Identification
  identification: PetIdentification;

  // Feeding
  feeding: {
    schedules: FeedingSchedule[];
    lastFeeding?: FeedingEvent;
    feedingHistory: FeedingEvent[];
  };

  // Walking
  walking: {
    schedules: WalkSchedule[];
    lastWalk?: WalkEvent;
    walkHistory: WalkEvent[];
  };

  // Health
  health: {
    vaccinations: Vaccination[];
    medications: Medication[];
    allergies?: string[];
    notes?: string;
  };

  // Family
  family: {
    owner: string; // User ID of owner
    members: FamilyMember[];
  };

  // Metadata
  createdAt: string;
  updatedAt: string;
  lostPetMode?: {
    enabled: boolean;
    reportedAt?: string;
    description?: string;
  };
}

export interface ActivityEvent {
  id: string;
  petId: string;
  type: "feeding" | "walking" | "medication" | "care" | "alert" | "vaccination";
  title: string;
  description: string;
  timestamp: string;
  performedBy: string;
  data?: Record<string, any>; // Additional event-specific data
}

export interface PetStoreState {
  pets: Record<string, Pet>; // petId -> Pet
  activePetId?: string;
  activities: ActivityEvent[];
  loading: boolean;
  error?: string;
}
