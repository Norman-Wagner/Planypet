/**
 * AI Pet Advisor Service
 * Provides intelligent pet care recommendations using LLM
 */

import { Pet } from "@/store/types";

export interface PetAdvisorMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface PetAdvisorContext {
  petId: string;
  petName: string;
  species: string;
  breed?: string;
  age?: number;
  recentActivities: string[];
  healthHistory: string[];
}

export interface ProductRecommendation {
  name: string;
  category: string;
  description: string;
  priceRange: string;
  retailers: { name: string; url: string; price?: string }[];
  benefits: string[];
}

/**
 * Build system prompt for pet advisor based on pet context
 */
export function buildPetAdvisorPrompt(context: PetAdvisorContext): string {
  return `Du bist ein virtueller Begleiter und Experte in einer Haustier-App, die Benutzern hilft, die beste Pflege für ihre Haustiere zu gewährleisten.

KONTEXT ZUM HAUSTIER:
- Name: ${context.petName}
- Art: ${context.species}
- Rasse: ${context.breed || "Unbekannt"}
- Alter: ${context.age ? `${context.age} Jahre` : "Unbekannt"}
- Letzte Aktivitäten: ${context.recentActivities.join(", ") || "Keine"}
- Gesundheitshistorie: ${context.healthHistory.join(", ") || "Keine"}

DEINE ROLLE:
Agiere als freundlicher und informierter Haustierberater. Du sollst:
1. Hilfreiche Tipps zur Haustierpflege geben
2. Konkrete Produktempfehlungen machen
3. Preisvergleiche durchführen
4. Möglichkeiten aufzeigen, wie der Benutzer mit Haustierausgaben Geld sparen kann
5. Immer in einem freundlichen und zugänglichen Tonfall antworten

AUSGABEFORMAT:
- Fließtext mit klaren Handlungsempfehlungen
- Tipps und Anweisungen in Listenform für bessere Übersichtlichkeit
- Konkrete Produktempfehlungen mit Preisen
- Praktische Sparmaßnahmen

Antworte immer basierend auf den spezifischen Bedürfnissen von ${context.petName}.`;
}

/**
 * Format pet context from Pet object
 */
export function formatPetContext(pet: Pet, recentActivities: string[] = [], healthHistory: string[] = []): PetAdvisorContext {
  return {
    petId: pet.id,
    petName: pet.name,
    species: pet.species,
    breed: pet.breed,
    age: pet.birthday ? calculateAge(pet.birthday) : undefined,
    recentActivities,
    healthHistory,
  };
}

/**
 * Calculate age from birthday
 */
function calculateAge(birthday: string): number {
  const birthDate = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return Math.max(0, age);
}

/**
 * Sample product recommendations by species and category
 */
export const PRODUCT_DATABASE: Record<string, ProductRecommendation[]> = {
  dog: [
    {
      name: "Premium Hundefutter",
      category: "Ernährung",
      description: "Hochwertiges Trockenfutter mit ausgewogener Nährstoffzusammensetzung",
      priceRange: "€25-60 pro 10kg",
      retailers: [
        { name: "Amazon", url: "https://amazon.de", price: "€35-50" },
        { name: "Fressnapf", url: "https://fressnapf.de", price: "€30-45" },
        { name: "Zooplus", url: "https://zooplus.de", price: "€28-48" },
      ],
      benefits: ["Bessere Verdauung", "Glänzeres Fell", "Mehr Energie"],
    },
    {
      name: "Hundebürste & Pflegeset",
      category: "Pflege",
      description: "Professionelle Bürsten und Pflegeutensilien für Fellpflege",
      priceRange: "€15-40",
      retailers: [
        { name: "Amazon", url: "https://amazon.de", price: "€18-35" },
        { name: "Fressnapf", url: "https://fressnapf.de", price: "€20-38" },
      ],
      benefits: ["Weniger Haarverlust", "Gesünderes Fell", "Stressabbau"],
    },
    {
      name: "Intelligenzspielzeug",
      category: "Beschäftigung",
      description: "Interaktive Spielzeuge zur mentalen Stimulation",
      priceRange: "€10-30",
      retailers: [
        { name: "Amazon", url: "https://amazon.de", price: "€12-25" },
        { name: "Zooplus", url: "https://zooplus.de", price: "€10-28" },
      ],
      benefits: ["Bessere mentale Gesundheit", "Weniger Zerstörungsdrang", "Mehr Spaß"],
    },
  ],
  cat: [
    {
      name: "Premium Katzenfutter",
      category: "Ernährung",
      description: "Hochwertiges Nass- oder Trockenfutter für Katzen",
      priceRange: "€20-50 pro 10kg",
      retailers: [
        { name: "Amazon", url: "https://amazon.de", price: "€25-45" },
        { name: "Fressnapf", url: "https://fressnapf.de", price: "€22-42" },
      ],
      benefits: ["Bessere Nierenfunktion", "Glänzeres Fell", "Optimale Gewicht"],
    },
    {
      name: "Kratzbrett & Möbel",
      category: "Möbel",
      description: "Kratzmöbel zur Zahnpflege und Entspannung",
      priceRange: "€20-100",
      retailers: [
        { name: "Amazon", url: "https://amazon.de", price: "€25-80" },
        { name: "Zooplus", url: "https://zooplus.de", price: "€20-90" },
      ],
      benefits: ["Schutz von Möbeln", "Natürliches Verhalten", "Entspannung"],
    },
  ],
};

/**
 * Get product recommendations for a pet species
 */
export function getProductRecommendations(species: string, category?: string): ProductRecommendation[] {
  const products = PRODUCT_DATABASE[species.toLowerCase()] || [];
  
  if (category) {
    return products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }
  
  return products;
}

/**
 * Format product recommendations for display
 */
export function formatProductRecommendation(product: ProductRecommendation): string {
  const retailers = product.retailers
    .map((r) => `${r.name}${r.price ? ` (${r.price})` : ""}`)
    .join(" • ");

  return `**${product.name}**
Kategorie: ${product.category}
${product.description}

Preisbereich: ${product.priceRange}
Verfügbar bei: ${retailers}

Vorteile:
${product.benefits.map((b) => `• ${b}`).join("\n")}`;
}

/**
 * Generate cost-saving tips based on pet species
 */
export function generateCostSavingTips(species: string): string[] {
  const tips: Record<string, string[]> = {
    dog: [
      "Kaufen Sie Hundefutter in größeren Mengen für Mengenrabatte",
      "Nutzen Sie Abonnementdienste für regelmäßige Lieferungen (oft 10-15% Rabatt)",
      "Vergleichen Sie Preise zwischen Online-Händlern (Amazon, Zooplus, Fressnapf)",
      "Investieren Sie in hochwertige Zahnpflege, um teure Zahnbehandlungen zu vermeiden",
      "Nutzen Sie DIY-Pflegeangebote statt teurer Hundesalons",
      "Kaufen Sie Spielzeug in Großmengen oder teilen Sie mit anderen Hundebesitzern",
    ],
    cat: [
      "Wechseln Sie zu Trockenfutter für bessere Kosteneffizienz",
      "Kaufen Sie Katzenstreu in Großmengen online",
      "Nutzen Sie Abonnementdienste für regelmäßige Lieferungen",
      "Investieren Sie in Kratzmöbel, um Möbelschäden zu vermeiden",
      "Führen Sie regelmäßige Zahnpflege durch, um teure Behandlungen zu vermeiden",
    ],
  };

  return tips[species.toLowerCase()] || [
    "Vergleichen Sie Preise zwischen verschiedenen Einzelhandelsketten",
    "Nutzen Sie Online-Abonnementdienste für regelmäßige Lieferungen",
    "Investieren Sie in Prävention, um teure Tierarztbesuche zu vermeiden",
  ];
}
