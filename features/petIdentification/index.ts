/**
 * Pet Identification Module
 * Handles microchip, tax tag, QR code, and pet identification
 */

export interface PetIdentification {
  microchipNumber: string; // Exactly 15 digits
  taxTagNumber?: string;
  qrCode?: string;
  tagPhotoUrl?: string;
  registrationStatus: RegistrationStatus;
}

export interface RegistrationStatus {
  registry: string;
  status: "pending" | "registered" | "failed";
  registeredAt?: string;
  registryId?: string;
}

/**
 * Validate microchip number
 * Must be exactly 15 digits
 */
export function validateMicrochip(microchip: string): boolean {
  const cleaned = microchip.replace(/\D/g, "");
  return cleaned.length === 15;
}

/**
 * Format microchip number for display
 * Example: 123456789012345 -> 123 456 789 012 345
 */
export function formatMicrochip(microchip: string): string {
  const cleaned = microchip.replace(/\D/g, "");
  if (cleaned.length !== 15) return microchip;
  return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9, 12)} ${cleaned.slice(12, 15)}`;
}

/**
 * Extract raw digits from formatted microchip
 */
export function extractMicrochipDigits(microchip: string): string {
  return microchip.replace(/\D/g, "");
}

export default {
  validateMicrochip,
  formatMicrochip,
  extractMicrochipDigits,
};
