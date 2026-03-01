/**
 * Pet Properties Schema
 * - Weather tolerances (rain, snow, temperature)
 * - Chip registration data
 * - Health preferences
 */

export interface PetProperties {
  // Basic info
  id: string;
  name: string;
  species: 'dog' | 'cat' | 'rabbit' | 'hamster' | 'bird' | 'fish' | 'reptile' | 'horse' | 'other';
  breed?: string;
  age?: number;
  weight?: number;

  // Weather tolerances (0-100 scale)
  rainTolerance: number; // 0 = hates rain, 100 = loves rain
  snowTolerance: number; // 0 = hates snow, 100 = loves snow
  windTolerance: number; // 0 = sensitive to wind, 100 = loves wind
  
  // Temperature preferences (Celsius)
  minComfortableTemp: number; // Default: 5°C for dogs
  maxComfortableTemp: number; // Default: 25°C for dogs
  
  // Health & allergies
  allergies: string[];
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    reason: string;
  }>;
  
  // Chip registration
  chipRegistered: boolean;
  chipNumber?: string;
  chipRegisteredDatabases: Array<{
    name: string; // 'Tasso', 'Findefix', 'Planypet', etc.
    registeredAt: Date;
    registrationNumber?: string;
  }>;
  
  // Planypet chip database
  planypetChipData?: {
    chipNumber: string;
    registeredAt: Date;
    ownerName: string;
    ownerPhone: string;
    ownerEmail: string;
    ownerAddress: string;
    alternateContact?: {
      name: string;
      phone: string;
    };
    notes?: string;
  };
  
  // Health conditions
  healthConditions: Array<{
    condition: string;
    diagnosedDate: Date;
    notes: string;
  }>;
  
  // Behavioral traits
  behaviorNotes?: string;
  socialWithOtherPets: boolean;
  socialWithPeople: boolean;
  
  // Activity level (0-100)
  activityLevel: number;
  
  // Special needs
  specialNeeds: string[];
}

/**
 * Default pet properties by species
 */
export const DEFAULT_PET_PROPERTIES: Record<string, Partial<PetProperties>> = {
  dog: {
    rainTolerance: 40,
    snowTolerance: 60,
    windTolerance: 70,
    minComfortableTemp: 5,
    maxComfortableTemp: 25,
    activityLevel: 70,
  },
  cat: {
    rainTolerance: 20,
    snowTolerance: 30,
    windTolerance: 40,
    minComfortableTemp: 10,
    maxComfortableTemp: 28,
    activityLevel: 50,
  },
  rabbit: {
    rainTolerance: 10,
    snowTolerance: 20,
    windTolerance: 30,
    minComfortableTemp: 10,
    maxComfortableTemp: 24,
    activityLevel: 60,
  },
  hamster: {
    rainTolerance: 0,
    snowTolerance: 0,
    windTolerance: 10,
    minComfortableTemp: 18,
    maxComfortableTemp: 24,
    activityLevel: 40,
  },
  bird: {
    rainTolerance: 30,
    snowTolerance: 10,
    windTolerance: 50,
    minComfortableTemp: 15,
    maxComfortableTemp: 28,
    activityLevel: 60,
  },
  fish: {
    rainTolerance: 0,
    snowTolerance: 0,
    windTolerance: 0,
    minComfortableTemp: 18,
    maxComfortableTemp: 26,
    activityLevel: 20,
  },
  reptile: {
    rainTolerance: 20,
    snowTolerance: 0,
    windTolerance: 20,
    minComfortableTemp: 20,
    maxComfortableTemp: 30,
    activityLevel: 30,
  },
  horse: {
    rainTolerance: 70,
    snowTolerance: 60,
    windTolerance: 80,
    minComfortableTemp: 0,
    maxComfortableTemp: 28,
    activityLevel: 80,
  },
};

/**
 * Chip registration database types
 */
export const CHIP_DATABASES = [
  { id: 'tasso', name: 'Tasso', country: 'Germany', url: 'https://www.tasso.net' },
  { id: 'findefix', name: 'Findefix', country: 'Germany', url: 'https://www.findefix.de' },
  { id: 'planypet', name: 'Planypet', country: 'Germany', url: 'https://planypet.app' },
  { id: 'petlog', name: 'Petlog', country: 'UK', url: 'https://www.petlog.org.uk' },
  { id: 'aafco', name: 'AAFCO', country: 'USA', url: 'https://www.aafco.org' },
  { id: 'microchip', name: 'Microchip Registry', country: 'USA', url: 'https://www.microchipregistry.org' },
  { id: 'europetnet', name: 'EuroPetNet', country: 'Europe', url: 'https://www.europetnet.org' },
];
