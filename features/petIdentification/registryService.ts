/**
 * Pet Identification & Registry Service
 * Handles microchip validation, QR code generation, and registry integration
 */

export function validateMicrochip(microchip: string): boolean {
  // Microchip must be exactly 15 digits
  const cleanChip = microchip.replace(/\D/g, "");
  return cleanChip.length === 15;
}

export function generateQRCode(microchip: string): string {
  // Generate a simple QR code representation
  // In production, use a QR code library like 'qrcode.react'
  return `QR:${microchip}`;
}

export interface RegistryData {
  microchip: string;
  petName: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  country: string;
}

export const registries = {
  DE: {
    TASSO: {
      name: "TASSO e.V.",
      url: "https://www.tasso.net",
      email: "info@tasso.net",
      cost: "kostenlos",
    },
    FINDEFIX: {
      name: "FINDEFIX",
      url: "https://www.findefix.de",
      email: "info@findefix.de",
      cost: "kostenlos",
    },
    TIERMELDEZENTRALE: {
      name: "Tiermeldezentrale",
      url: "https://www.tiermeldezentrale.de",
      email: "info@tiermeldezentrale.de",
      cost: "kostenlos",
    },
  },
  US: {
    HOMEAGAIN: {
      name: "HomeAgain",
      url: "https://www.homeagain.com",
      email: "support@homeagain.com",
      cost: "kostenpflichtig",
    },
    AKC_REUNITE: {
      name: "AKC Reunite",
      url: "https://www.akcreunite.org",
      email: "support@akcreunite.org",
      cost: "kostenpflichtig",
    },
  },
  GB: {
    PETLOG: {
      name: "Petlog",
      url: "https://www.petlog.org.uk",
      email: "support@petlog.org.uk",
      cost: "kostenpflichtig",
    },
  },
  SG: {
    AVS: {
      name: "AVS Registry",
      url: "https://www.avsregistry.org",
      email: "support@avsregistry.org",
      cost: "kostenpflichtig",
    },
  },
};

export function getRegistriesByCountry(countryCode: string) {
  return registries[countryCode as keyof typeof registries] || {};
}

export function generateRegistrationEmail(registryId: string, data: RegistryData): {
  to: string;
  subject: string;
  body: string;
} | null {
  const registry = Object.values(registries)
    .flatMap((r) => Object.values(r))
    .find((r) => r.name.toLowerCase() === registryId.toLowerCase());

  if (!registry) return null;

  return {
    to: registry.email,
    subject: `Chipregistrierung - ${data.petName}`,
    body: `
Hallo,

ich möchte mein Tier mit folgenden Daten registrieren:

Chipnummer: ${data.microchip}
Tiername: ${data.petName}
Besitzername: ${data.ownerName}
Email: ${data.ownerEmail}
Telefon: ${data.ownerPhone}
Land: ${data.country}

Bitte registrieren Sie mein Tier in Ihrer Datenbank.

Vielen Dank!
    `,
  };
}
