import { Router, Request, Response } from "express";
import {
  buildPetAdvisorPrompt,
  formatPetContext,
  getProductRecommendations,
  generateCostSavingTips,
} from "../../lib/ai-pet-advisor";

const router = Router();

/**
 * POST /api/ai-advisor/chat
 * Send a message to the AI pet advisor
 */
router.post("/chat", async (req: Request, res: Response) => {
  try {
    const { petId, message, petData, recentActivities, healthHistory } = req.body;

    if (!message || !petData) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Format pet context
    const context = formatPetContext(petData, recentActivities || [], healthHistory || []);

    // Build system prompt
    const systemPrompt = buildPetAdvisorPrompt(context);

    // In production, call actual LLM (e.g., OpenAI, Anthropic)
    // For now, return mock response based on message content
    const response = generateMockAdvisorResponse(message, petData);

    res.json({
      success: true,
      response,
      context,
    });
  } catch (error) {
    console.error("Error in AI advisor:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
});

/**
 * GET /api/ai-advisor/products/:species
 * Get product recommendations for a pet species
 */
router.get("/products/:species", (req: Request, res: Response) => {
  try {
    const { species } = req.params;
    const { category } = req.query;

    const products = getProductRecommendations(species, category as string | undefined);

    res.json({
      success: true,
      products,
      count: products.length,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

/**
 * GET /api/ai-advisor/tips/:species
 * Get cost-saving tips for a pet species
 */
router.get("/tips/:species", (req: Request, res: Response) => {
  try {
    const { species } = req.params;

    const tips = generateCostSavingTips(species);

    res.json({
      success: true,
      tips,
      count: tips.length,
    });
  } catch (error) {
    console.error("Error fetching tips:", error);
    res.status(500).json({ error: "Failed to fetch tips" });
  }
});

/**
 * Mock advisor response generator
 * In production, replace with actual LLM call
 */
function generateMockAdvisorResponse(userInput: string, petData: any): string {
  const lowerInput = userInput.toLowerCase();
  const petName = petData.name || "dein Haustier";
  const species = petData.species || "Haustier";

  if (
    lowerInput.includes("produkt") ||
    lowerInput.includes("kaufen") ||
    lowerInput.includes("empfehlung")
  ) {
    const products = getProductRecommendations(species);
    if (products.length > 0) {
      return `Hier sind meine Top-Produktempfehlungen für ${petName}:\n\n1. ${products[0].name}\n   Preis: ${products[0].priceRange}\n   Verfügbar bei: ${products[0].retailers.map((r) => r.name).join(", ")}\n\n2. ${products[1]?.name || "Weitere Produkte verfügbar"}\n\nMöchtest du mehr Details zu einem Produkt?`;
    }
  }

  if (
    lowerInput.includes("sparen") ||
    lowerInput.includes("kosten") ||
    lowerInput.includes("günstig")
  ) {
    const tips = generateCostSavingTips(species);
    return `Hier sind meine besten Tipps zum Sparen bei der Pflege von ${petName}:\n\n${tips.slice(0, 3).map((t, i) => `${i + 1}. ${t}`).join("\n")}\n\nDiese Maßnahmen können dir jährlich 20-30% sparen!`;
  }

  if (lowerInput.includes("fütter") || lowerInput.includes("essen")) {
    return `Für ${petName} empfehle ich:\n\n• Hochwertige Nahrung mit ausreichend Proteinen\n• Regelmäßige Fütterungszeiten (2-3x täglich je nach Alter)\n• Frisches Wasser immer verfügbar\n• Vermeidung von Menschenessen und Schokolade\n\nWie alt ist ${petName}? Dann kann ich dir noch spezifischere Empfehlungen geben.`;
  }

  if (
    lowerInput.includes("gesundheit") ||
    lowerInput.includes("krank") ||
    lowerInput.includes("symptom")
  ) {
    return `Für die Gesundheit von ${petName} empfehle ich:\n\n• Regelmäßige Tierarztbesuche (mindestens 1x jährlich)\n• Impfungen und Parasitenbekämpfung\n• Tägliche Bewegung und mentale Stimulation\n• Zahnpflege und Nagelpflege\n\nBei Symptomen oder Bedenken konsultiere bitte deinen Tierarzt. Ich kann keine medizinische Diagnose stellen.`;
  }

  if (lowerInput.includes("pflege") || lowerInput.includes("hygiene")) {
    return `Pflegetipps für ${petName}:\n\n• Regelmäßiges Bürsten (3-4x pro Woche)\n• Baden bei Bedarf (monatlich oder weniger)\n• Ohren und Augen reinigen\n• Zahnpflege täglich\n• Nagelpflege alle 4-6 Wochen\n\nWelcher Aspekt der Pflege interessiert dich am meisten?`;
  }

  return `Das ist eine gute Frage! Ich kann dir bei vielen Themen rund um ${petName} helfen:\n\n• Ernährung und Fütterung\n• Gesundheit und Vorsorge\n• Produktempfehlungen und Preisvergleiche\n• Kosteneinsparungen\n• Pflege und Hygiene\n• Verhalten und Training\n\nWas interessiert dich am meisten?`;
}

export default router;
