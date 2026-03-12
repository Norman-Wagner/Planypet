import { describe, it, expect } from "vitest";
import {
  buildPetAdvisorPrompt,
  formatPetContext,
  getProductRecommendations,
  generateCostSavingTips,
} from "../ai-pet-advisor";
import {
  getProductDetails,
  getProductsBySpecies,
  getProductsByCategory,
  findBestDeals,
  calculateSavings,
} from "../product-service";

describe("AI Pet Advisor Service", () => {
  describe("Pet Context Formatting", () => {
    it("should format pet context correctly", () => {
      const pet = {
        id: "pet-1",
        name: "Max",
        species: "dog" as const,
        breed: "Labrador",
        birthday: "2020-01-15",
        weight: 30,
        photo: "",
        identification: {},
        feeding: { schedules: [], feedingHistory: [] },
        walking: { schedules: [], walkHistory: [] },
        health: { vaccinations: [], medications: [] },
        family: { owner: "Norman", members: [] },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const context = formatPetContext(pet, ["Fütterung"], ["Impfung"]);

      expect(context.petName).toBe("Max");
      expect(context.species).toBe("dog");
      expect(context.breed).toBe("Labrador");
      expect(context.recentActivities).toContain("Fütterung");
      expect(context.healthHistory).toContain("Impfung");
    });

    it("should build advisor prompt with pet context", () => {
      const context = {
        petId: "pet-1",
        petName: "Bella",
        species: "cat",
        breed: "Persian",
        age: 3,
        recentActivities: ["Fütterung", "Spielen"],
        healthHistory: ["Zahnreinigung"],
      };

      const prompt = buildPetAdvisorPrompt(context);

      expect(prompt).toContain("Bella");
      expect(prompt).toContain("cat");
      expect(prompt).toContain("Persian");
      expect(prompt).toContain("Haustierberater");
    });
  });

  describe("Product Recommendations", () => {
    it("should get product recommendations for dog", () => {
      const products = getProductRecommendations("dog");
      expect(products.length).toBeGreaterThan(0);
      expect(products[0].category).toBeDefined();
    });

    it("should get product recommendations for cat", () => {
      const products = getProductRecommendations("cat");
      expect(products.length).toBeGreaterThan(0);
    });

    it("should filter products by category", () => {
      const products = getProductRecommendations("dog", "Ernährung");
      expect(products.length).toBeGreaterThan(0);
      expect(products.every((p) => p.category === "Ernährung")).toBe(true);
    });
  });

  describe("Cost-Saving Tips", () => {
    it("should generate cost-saving tips for dogs", () => {
      const tips = generateCostSavingTips("dog");
      expect(tips.length).toBeGreaterThan(0);
      expect(tips[0]).toContain("Hundefutter");
    });

    it("should generate cost-saving tips for cats", () => {
      const tips = generateCostSavingTips("cat");
      expect(tips.length).toBeGreaterThan(0);
    });

    it("should generate default tips for unknown species", () => {
      const tips = generateCostSavingTips("unknown");
      expect(tips.length).toBeGreaterThan(0);
    });
  });
});

describe("Product Service", () => {
  describe("Product Database", () => {
    it("should get product details by ID", () => {
      const product = getProductDetails("dog-food-premium");
      expect(product).toBeDefined();
      expect(product?.name).toContain("Hundefutter");
    });

    it("should get products by species", () => {
      const products = getProductsBySpecies("dog");
      expect(products.length).toBeGreaterThan(0);
      expect(products.every((p) => p.species.includes("dog"))).toBe(true);
    });

    it("should get products by category", () => {
      const products = getProductsByCategory("dog", "Ernährung");
      expect(products.length).toBeGreaterThan(0);
      expect(products.every((p) => p.category === "Ernährung")).toBe(true);
    });
  });

  describe("Price Comparisons", () => {
    it("should find best deals", () => {
      const deals = findBestDeals("dog");
      expect(deals.length).toBeGreaterThan(0);
      expect(deals[0].bestDeal).toBeDefined();
      expect(deals[0].bestDeal.retailer).toBeDefined();
    });

    it("should have price comparisons for each product", () => {
      const products = getProductsBySpecies("dog");
      expect(products.every((p) => p.priceComparisons.length > 0)).toBe(true);
    });

    it("should have best deal marked", () => {
      const products = getProductsBySpecies("cat");
      expect(products.every((p) => p.bestDeal.retailer)).toBe(true);
    });
  });

  describe("Savings Calculation", () => {
    it("should calculate potential savings", () => {
      const products = getProductsBySpecies("dog");
      const savings = calculateSavings(products);

      expect(savings.totalSpend).toBeGreaterThan(0);
      expect(savings.potentialSavings).toBeGreaterThanOrEqual(0);
      expect(savings.percentageSavings).toBeGreaterThanOrEqual(0);
      expect(savings.percentageSavings).toBeLessThanOrEqual(100);
    });

    it("should provide savings tips", () => {
      const products = getProductsBySpecies("dog");
      expect(products.every((p) => p.savingsTips.length > 0)).toBe(true);
      expect(products[0].savingsTips[0]).toBeDefined();
    });
  });

  describe("Product Details", () => {
    it("should have complete product information", () => {
      const product = getProductDetails("dog-food-premium");
      expect(product?.id).toBeDefined();
      expect(product?.name).toBeDefined();
      expect(product?.category).toBeDefined();
      expect(product?.description).toBeDefined();
      expect(product?.benefits.length).toBeGreaterThan(0);
      expect(product?.priceComparisons.length).toBeGreaterThan(0);
      expect(product?.averagePrice).toBeDefined();
      expect(product?.bestDeal).toBeDefined();
      expect(product?.savingsTips.length).toBeGreaterThan(0);
    });

    it("should have valid price comparisons", () => {
      const product = getProductDetails("cat-food-premium");
      expect(product?.priceComparisons.every((p) => p.retailer && p.price && p.url)).toBe(true);
    });
  });
});
