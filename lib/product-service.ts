/**
 * Product Recommendation and Price Comparison Service
 */

export interface PriceComparison {
  retailer: string;
  price: string;
  url: string;
  inStock: boolean;
  rating?: number;
  reviews?: number;
}

export interface ProductDetail {
  id: string;
  name: string;
  category: string;
  species: string[];
  description: string;
  benefits: string[];
  priceComparisons: PriceComparison[];
  averagePrice: string;
  bestDeal: PriceComparison;
  savingsTips: string[];
}

/**
 * Comprehensive product database with price comparisons
 */
export const PRODUCT_CATALOG: Record<string, ProductDetail[]> = {
  dog: [
    {
      id: "dog-food-premium",
      name: "Premium Hundefutter - Trockenfutter",
      category: "Ernährung",
      species: ["dog"],
      description: "Hochwertiges Trockenfutter mit ausgewogener Nährstoffzusammensetzung, ideal für erwachsene Hunde",
      benefits: [
        "Bessere Verdauung",
        "Glänzeres Fell",
        "Mehr Energie",
        "Längere Sättigung",
        "Zahngesundheit",
      ],
      priceComparisons: [
        {
          retailer: "Amazon",
          price: "€35-50 (10kg)",
          url: "https://amazon.de/s?k=hundefutter",
          inStock: true,
          rating: 4.5,
          reviews: 1250,
        },
        {
          retailer: "Fressnapf",
          price: "€30-45 (10kg)",
          url: "https://www.fressnapf.de",
          inStock: true,
          rating: 4.3,
          reviews: 890,
        },
        {
          retailer: "Zooplus",
          price: "€28-48 (10kg)",
          url: "https://www.zooplus.de",
          inStock: true,
          rating: 4.6,
          reviews: 2100,
        },
        {
          retailer: "Futter24",
          price: "€32-46 (10kg)",
          url: "https://www.futter24.de",
          inStock: true,
          rating: 4.2,
          reviews: 450,
        },
      ],
      averagePrice: "€31-47",
      bestDeal: {
        retailer: "Zooplus",
        price: "€28-48 (10kg)",
        url: "https://www.zooplus.de",
        inStock: true,
        rating: 4.6,
        reviews: 2100,
      },
      savingsTips: [
        "Abonnement bei Zooplus: 10-15% Rabatt auf regelmäßige Lieferungen",
        "Großmengen kaufen: 20kg Säcke sind günstiger pro kg",
        "Saisonale Angebote: Besondere Rabatte im Januar und Juli",
        "Cashback-Programme: Bis zu 5% Rückerstattung bei ausgewählten Plattformen",
      ],
    },
    {
      id: "dog-brush-set",
      name: "Hundebürste & Pflegeset",
      category: "Pflege",
      species: ["dog"],
      description: "Professionelle Bürsten und Pflegeutensilien für Fellpflege und Gesundheit",
      benefits: [
        "Weniger Haarverlust",
        "Gesünderes Fell",
        "Stressabbau für Hund",
        "Früherkennung von Hautproblemen",
        "Bindungsaufbau",
      ],
      priceComparisons: [
        {
          retailer: "Amazon",
          price: "€18-35",
          url: "https://amazon.de/s?k=hundebürste",
          inStock: true,
          rating: 4.4,
          reviews: 890,
        },
        {
          retailer: "Fressnapf",
          price: "€20-38",
          url: "https://www.fressnapf.de",
          inStock: true,
          rating: 4.2,
          reviews: 320,
        },
        {
          retailer: "Zooplus",
          price: "€15-32",
          url: "https://www.zooplus.de",
          inStock: true,
          rating: 4.5,
          reviews: 1200,
        },
      ],
      averagePrice: "€17-35",
      bestDeal: {
        retailer: "Zooplus",
        price: "€15-32",
        url: "https://www.zooplus.de",
        inStock: true,
        rating: 4.5,
        reviews: 1200,
      },
      savingsTips: [
        "Sets sind günstiger als einzelne Bürsten",
        "Hochwertige Bürsten halten länger und sparen Geld",
        "DIY-Pflege statt Hundesalon: 50-70€ pro Besuch sparen",
      ],
    },
    {
      id: "dog-toys-interactive",
      name: "Intelligenzspielzeug für Hunde",
      category: "Beschäftigung",
      species: ["dog"],
      description: "Interaktive Spielzeuge zur mentalen Stimulation und Verhaltensförderung",
      benefits: [
        "Bessere mentale Gesundheit",
        "Weniger Zerstörungsdrang",
        "Mehr Spaß und Engagement",
        "Reduzierte Langeweile",
        "Bessere Schlafqualität",
      ],
      priceComparisons: [
        {
          retailer: "Amazon",
          price: "€12-25",
          url: "https://amazon.de/s?k=hundespielzeug",
          inStock: true,
          rating: 4.3,
          reviews: 2100,
        },
        {
          retailer: "Zooplus",
          price: "€10-28",
          url: "https://www.zooplus.de",
          inStock: true,
          rating: 4.5,
          reviews: 1800,
        },
      ],
      averagePrice: "€11-26",
      bestDeal: {
        retailer: "Zooplus",
        price: "€10-28",
        url: "https://www.zooplus.de",
        inStock: true,
        rating: 4.5,
        reviews: 1800,
      },
      savingsTips: [
        "Mehrere günstige Spielzeuge statt ein teures",
        "DIY-Spielzeuge aus Haushaltsmaterialien",
        "Spielzeuge regelmäßig wechseln für Abwechslung",
      ],
    },
  ],
  cat: [
    {
      id: "cat-food-premium",
      name: "Premium Katzenfutter",
      category: "Ernährung",
      species: ["cat"],
      description: "Hochwertiges Nass- oder Trockenfutter speziell für Katzen",
      benefits: [
        "Bessere Nierenfunktion",
        "Glänzeres Fell",
        "Optimales Gewicht",
        "Bessere Verdauung",
        "Zahngesundheit",
      ],
      priceComparisons: [
        {
          retailer: "Amazon",
          price: "€25-45 (10kg)",
          url: "https://amazon.de/s?k=katzenfutter",
          inStock: true,
          rating: 4.4,
          reviews: 1450,
        },
        {
          retailer: "Fressnapf",
          price: "€22-42 (10kg)",
          url: "https://www.fressnapf.de",
          inStock: true,
          rating: 4.2,
          reviews: 720,
        },
        {
          retailer: "Zooplus",
          price: "€20-40 (10kg)",
          url: "https://www.zooplus.de",
          inStock: true,
          rating: 4.6,
          reviews: 2300,
        },
      ],
      averagePrice: "€22-42",
      bestDeal: {
        retailer: "Zooplus",
        price: "€20-40 (10kg)",
        url: "https://www.zooplus.de",
        inStock: true,
        rating: 4.6,
        reviews: 2300,
      },
      savingsTips: [
        "Trockenfutter ist günstiger als Nassfutter",
        "Abonnement-Rabatte: 10-15% bei regelmäßigen Lieferungen",
        "Großmengen kaufen für bessere Preise",
      ],
    },
    {
      id: "cat-scratching-post",
      name: "Kratzbrett & Kratzmöbel",
      category: "Möbel",
      species: ["cat"],
      description: "Kratzmöbel zur Zahnpflege, Entspannung und Verhaltensförderung",
      benefits: [
        "Schutz von Möbeln",
        "Natürliches Verhalten",
        "Entspannung und Stressabbau",
        "Zahnpflege",
        "Markierungsverhalten",
      ],
      priceComparisons: [
        {
          retailer: "Amazon",
          price: "€25-80",
          url: "https://amazon.de/s?k=kratzbaum",
          inStock: true,
          rating: 4.3,
          reviews: 1800,
        },
        {
          retailer: "Zooplus",
          price: "€20-90",
          url: "https://www.zooplus.de",
          inStock: true,
          rating: 4.5,
          reviews: 2400,
        },
        {
          retailer: "Fressnapf",
          price: "€28-85",
          url: "https://www.fressnapf.de",
          inStock: true,
          rating: 4.1,
          reviews: 650,
        },
      ],
      averagePrice: "€24-85",
      bestDeal: {
        retailer: "Zooplus",
        price: "€20-90",
        url: "https://www.zooplus.de",
        inStock: true,
        rating: 4.5,
        reviews: 2400,
      },
      savingsTips: [
        "Qualität zahlt sich aus: Bessere Kratzbäume halten länger",
        "Mehrere kleine Kratzbäume statt ein großer",
        "DIY-Kratzbrett aus Karton (kostenlos!)",
      ],
    },
  ],
};

/**
 * Get product details with price comparisons
 */
export function getProductDetails(productId: string): ProductDetail | undefined {
  for (const species in PRODUCT_CATALOG) {
    const product = PRODUCT_CATALOG[species].find((p) => p.id === productId);
    if (product) return product;
  }
  return undefined;
}

/**
 * Get all products for a species
 */
export function getProductsBySpecies(species: string): ProductDetail[] {
  return PRODUCT_CATALOG[species.toLowerCase()] || [];
}

/**
 * Get products by category
 */
export function getProductsByCategory(species: string, category: string): ProductDetail[] {
  const products = PRODUCT_CATALOG[species.toLowerCase()] || [];
  return products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
}

/**
 * Find best deals across all retailers
 */
export function findBestDeals(species: string): ProductDetail[] {
  const products = getProductsBySpecies(species);
  return products.sort((a, b) => {
    const priceA = extractNumericPrice(a.bestDeal.price);
    const priceB = extractNumericPrice(b.bestDeal.price);
    return priceA - priceB;
  });
}

/**
 * Extract numeric price from price string
 */
function extractNumericPrice(priceStr: string): number {
  const match = priceStr.match(/€(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

/**
 * Calculate potential savings
 */
export function calculateSavings(products: ProductDetail[]): {
  totalSpend: number;
  potentialSavings: number;
  percentageSavings: number;
} {
  let totalSpend = 0;
  let potentialSavings = 0;

  products.forEach((product) => {
    const avgPrice = extractNumericPrice(product.averagePrice);
    const bestPrice = extractNumericPrice(product.bestDeal.price);
    totalSpend += avgPrice;
    potentialSavings += avgPrice - bestPrice;
  });

  return {
    totalSpend,
    potentialSavings,
    percentageSavings: totalSpend > 0 ? Math.round((potentialSavings / totalSpend) * 100) : 0,
  };
}

/**
 * Format price comparison for display
 */
export function formatPriceComparison(comparison: PriceComparison): string {
  return `${comparison.retailer}: ${comparison.price}${
    comparison.rating ? ` (⭐ ${comparison.rating}/5)` : ""
  }`;
}
