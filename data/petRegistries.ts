/**
 * Global Pet Registries Database
 * Supports microchip registration in multiple countries
 */

export interface Registry {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  website: string;
  email?: string;
  phone?: string;
  supportsAutoSubmit: boolean;
  apiEndpoint?: string;
  description: string;
  languages: string[];
}

export const petRegistries: Record<string, Registry[]> = {
  DE: [
    {
      id: "tasso",
      name: "TASSO e.V.",
      country: "Germany",
      countryCode: "DE",
      website: "https://www.tasso.net",
      email: "info@tasso.net",
      phone: "+49 (0)6190 937 000",
      supportsAutoSubmit: false,
      description: "Largest pet registry in Germany. Free registration.",
      languages: ["de", "en"],
    },
    {
      id: "findefix",
      name: "FINDEFIX",
      country: "Germany",
      countryCode: "DE",
      website: "https://www.findefix.de",
      email: "info@findefix.de",
      phone: "+49 (0)228 912 60 0",
      supportsAutoSubmit: false,
      description: "German pet registry run by Deutsche Tierschutzbund.",
      languages: ["de", "en"],
    },
    {
      id: "tiermeldezentrale",
      name: "Tiermeldezentrale",
      country: "Germany",
      countryCode: "DE",
      website: "https://www.tiermeldezentrale.de",
      email: "info@tiermeldezentrale.de",
      supportsAutoSubmit: false,
      description: "German pet registry and lost pet database.",
      languages: ["de"],
    },
  ],
  US: [
    {
      id: "homeagain",
      name: "HomeAgain",
      country: "USA",
      countryCode: "US",
      website: "https://www.homeagain.com",
      email: "support@homeagain.com",
      phone: "1-888-HOMEAGAIN",
      supportsAutoSubmit: false,
      description: "Leading pet microchip registry in the USA.",
      languages: ["en"],
    },
    {
      id: "akc_reunite",
      name: "AKC Reunite",
      country: "USA",
      countryCode: "US",
      website: "https://www.akcreunite.org",
      email: "support@akcreunite.org",
      phone: "1-800-252-7894",
      supportsAutoSubmit: false,
      description: "American Kennel Club pet recovery service.",
      languages: ["en"],
    },
  ],
  GB: [
    {
      id: "petlog",
      name: "Petlog",
      country: "United Kingdom",
      countryCode: "GB",
      website: "https://www.petlog.org.uk",
      email: "support@petlog.org.uk",
      phone: "+44 (0)844 463 6262",
      supportsAutoSubmit: false,
      description: "UK's largest pet microchip registry.",
      languages: ["en"],
    },
  ],
  SG: [
    {
      id: "avs_registry",
      name: "AVS Registry",
      country: "Singapore",
      countryCode: "SG",
      website: "https://www.avs.org.sg",
      email: "registry@avs.org.sg",
      phone: "+65 6471 1088",
      supportsAutoSubmit: false,
      description: "Animal and Veterinary Service pet registry.",
      languages: ["en"],
    },
  ],
};

/**
 * Get registries for a specific country
 */
export function getRegistriesByCountry(countryCode: string): Registry[] {
  return petRegistries[countryCode.toUpperCase()] || [];
}

/**
 * Get all available registries
 */
export function getAllRegistries(): Registry[] {
  return Object.values(petRegistries).flat();
}

/**
 * Find registry by ID
 */
export function getRegistryById(registryId: string): Registry | undefined {
  return getAllRegistries().find((r) => r.id === registryId);
}

/**
 * Get country code from user location (requires geolocation)
 * Returns default "DE" if unable to determine
 */
export function getCountryCodeFromLocation(): string {
  // This would be implemented with actual geolocation
  // For now, return default
  return "DE";
}

export default {
  petRegistries,
  getRegistriesByCountry,
  getAllRegistries,
  getRegistryById,
  getCountryCodeFromLocation,
};
