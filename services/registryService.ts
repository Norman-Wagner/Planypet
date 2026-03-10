/**
 * Registry Service
 * Handles microchip registration workflows
 */

import { getRegistryById, getRegistriesByCountry } from "@/data/petRegistries";
import * as Linking from "expo-linking";
// import * as MailComposer from "expo-mail-composer"; // Not available in Expo SDK 54

export interface RegistrationData {
  ownerName: string;
  ownerEmail: string;
  ownerPhone?: string;
  petName: string;
  petSpecies: string;
  microchipNumber: string;
  petBirthDate?: string;
  petBreed?: string;
}

export interface BackupRegistryEntry {
  id: string;
  petName: string;
  microchipNumber: string;
  ownerEmail: string;
  ownerPhone?: string;
  country: string;
  registeredAt: string;
  lostPetStatus: "active" | "found" | "inactive";
  publicFinderPageUrl: string;
}

/**
 * Generate pre-filled email for manual registration
 */
export function generateRegistrationEmail(
  registryId: string,
  data: RegistrationData
): { to: string; subject: string; body: string } | null {
  const registry = getRegistryById(registryId);
  if (!registry || !registry.email) return null;

  const subject = `Microchip Registration - ${data.petName}`;
  const body = `
Dear ${registry.name},

I would like to register my pet's microchip.

Owner Information:
Name: ${data.ownerName}
Email: ${data.ownerEmail}
Phone: ${data.ownerPhone || "Not provided"}

Pet Information:
Name: ${data.petName}
Species: ${data.petSpecies}
Breed: ${data.petBreed || "Not provided"}
Birth Date: ${data.petBirthDate || "Not provided"}
Microchip Number: ${data.microchipNumber}

Please confirm receipt of this registration.

Best regards,
${data.ownerName}
  `.trim();

  return {
    to: registry.email,
    subject,
    body,
  };
}

/**
 * Send registration email
 */
export async function sendRegistrationEmail(
  registryId: string,
  data: RegistrationData
): Promise<boolean> {
  const emailData = generateRegistrationEmail(registryId, data);
  if (!emailData) return false;

  try {
    // Use mailto URL to open email client
    const mailtoUrl = `mailto:${emailData.to}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`;
    await Linking.openURL(mailtoUrl);
    return true;
  } catch (error) {
    console.error("Error sending registration email:", error);
    return false;
  }
}

/**
 * Open registry website for manual registration
 */
export async function openRegistryWebsite(registryId: string): Promise<boolean> {
  const registry = getRegistryById(registryId);
  if (!registry) return false;

  try {
    await Linking.openURL(registry.website);
    return true;
  } catch (error) {
    console.error("Error opening registry website:", error);
    return false;
  }
}

/**
 * Create Planypet Backup Registry entry
 */
export function createBackupRegistryEntry(
  data: RegistrationData,
  country: string
): BackupRegistryEntry {
  const id = `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const publicFinderPageUrl = `https://planypet.app/finder/${id}`;

  return {
    id,
    petName: data.petName,
    microchipNumber: data.microchipNumber,
    ownerEmail: data.ownerEmail,
    ownerPhone: data.ownerPhone,
    country,
    registeredAt: new Date().toISOString(),
    lostPetStatus: "active",
    publicFinderPageUrl,
  };
}

/**
 * Get registries for user's country
 */
export function getRecommendedRegistries(countryCode: string) {
  return getRegistriesByCountry(countryCode);
}

export default {
  generateRegistrationEmail,
  sendRegistrationEmail,
  openRegistryWebsite,
  createBackupRegistryEntry,
  getRecommendedRegistries,
};
