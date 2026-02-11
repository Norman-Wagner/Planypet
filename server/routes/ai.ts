import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";

const analyzeSymptomInput = z.object({
  petType: z.enum(["cat", "dog", "fish", "bird", "reptile", "horse", "smallPet"]),
  petName: z.string(),
  symptoms: z.string(),
  duration: z.string().optional(),
  images: z.array(z.string()).optional(),
});

const generateReminderInput = z.object({
  petName: z.string(),
  petType: z.enum(["cat", "dog", "fish", "bird", "reptile", "horse", "smallPet"]),
  lastFed: z.string().optional(),
  lastWalk: z.string().optional(),
  supplies: z.array(z.object({ name: z.string(), level: z.number() })).optional(),
});

export const aiRouter = router({
  /**
   * Analyze pet symptoms using AI
   */
  analyzeSymptom: publicProcedure
    .input(analyzeSymptomInput)
    .mutation(async ({ input }) => {
      const petTypeMap: Record<string, string> = {
        cat: "Katze",
        dog: "Hund",
        fish: "Fisch",
        bird: "Vogel",
        reptile: "Reptil",
        horse: "Pferd",
        smallPet: "Kleintier",
      };

      const prompt = `Du bist ein Tiergesundheits-Assistent. Analysiere folgende Symptome:

Tierart: ${petTypeMap[input.petType]}
Tiername: ${input.petName}
Symptome: ${input.symptoms}
${input.duration ? `Dauer: ${input.duration}` : ""}

Gib eine kurze, verständliche Einschätzung:
1. Was könnte die Ursache sein? (2-3 mögliche Erklärungen)
2. Ist ein Tierarztbesuch empfohlen? (Ja/Nein mit Begründung)
3. Was kann der Besitzer sofort tun?

WICHTIG: Betone, dass dies keine tierärztliche Diagnose ersetzt. Bei Unsicherheit immer zum Tierarzt!

Antworte auf Deutsch, freundlich und verständlich.`;

      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content:
              "Du bist ein hilfreicher Tiergesundheits-Assistent. Gib praktische Ratschläge, aber betone immer, dass du keine tierärztliche Diagnose ersetzt.",
          },
          { role: "user", content: prompt },
        ],
        maxTokens: 500,
      });

      const messageContent = response.choices[0]?.message?.content;
      const analysis = typeof messageContent === "string" ? messageContent : "Keine Analyse verfügbar.";

      return {
        analysis,
        disclaimer:
          "Wichtig: Diese Einschätzung ersetzt keine tierärztliche Diagnose. Bei Unsicherheit oder sich verschlimmernden Symptomen bitte sofort einen Tierarzt aufsuchen!",
        recommendVet: analysis.toLowerCase().includes("tierarzt"),
      };
    }),

  /**
   * Generate proactive reminders based on pet care data
   */
  generateReminder: publicProcedure
    .input(generateReminderInput)
    .mutation(async ({ input }) => {
      const petTypeMap: Record<string, string> = {
        cat: "Katze",
        dog: "Hund",
        fish: "Fisch",
        bird: "Vogel",
        reptile: "Reptil",
        horse: "Pferd",
        smallPet: "Kleintier",
      };

      let context = `Tier: ${input.petName} (${petTypeMap[input.petType]})\n`;
      if (input.lastFed) context += `Letzte Fütterung: ${input.lastFed}\n`;
      if (input.lastWalk) context += `Letzter Spaziergang: ${input.lastWalk}\n`;
      if (input.supplies && input.supplies.length > 0) {
        context += `Vorräte:\n`;
        input.supplies.forEach((s) => {
          context += `- ${s.name}: ${s.level}% verbleibend\n`;
        });
      }

      const prompt = `Basierend auf diesen Daten, generiere eine freundliche, proaktive Erinnerung:

${context}

Die Erinnerung sollte:
- Kurz und persönlich sein (1-2 Sätze)
- Den Tiernamen verwenden
- Konkret sein (z.B. "Hast du Luna schon gefüttert?" statt "Vergiss nicht zu füttern")
- Bei niedrigen Vorräten Nachbestellung vorschlagen

Antworte NUR mit der Erinnerung, ohne Erklärung.`;

      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content:
              "Du bist ein freundlicher Haustier-Assistent. Generiere kurze, persönliche Erinnerungen für Tierbesitzer.",
          },
          { role: "user", content: prompt },
        ],
        maxTokens: 100,
      });

      const messageContent2 = response.choices[0]?.message?.content;
      const reminder = typeof messageContent2 === "string" ? messageContent2 : "Zeit, sich um dein Haustier zu kümmern!";

      return {
        reminder: reminder.replace(/^["']|["']$/g, ""), // Remove quotes if present
      };
    }),

  /**
   * Suggest supply reorder based on usage patterns
   */
  suggestReorder: publicProcedure
    .input(
      z.object({
        petType: z.enum(["cat", "dog", "fish", "bird", "reptile", "horse", "smallPet"]),
        supplies: z.array(
          z.object({
            name: z.string(),
            level: z.number(),
            lastRefill: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const petTypeMap: Record<string, string> = {
        cat: "Katze",
        dog: "Hund",
        fish: "Fisch",
        bird: "Vogel",
        reptile: "Reptil",
        horse: "Pferd",
        smallPet: "Kleintier",
      };

      const suppliesText = input.supplies
        .map((s) => `- ${s.name}: ${s.level}% ${s.lastRefill ? `(zuletzt aufgefüllt: ${s.lastRefill})` : ""}`)
        .join("\n");

      const prompt = `Tierart: ${petTypeMap[input.petType]}

Aktuelle Vorräte:
${suppliesText}

Gib eine kurze Empfehlung:
1. Was sollte bald nachbestellt werden?
2. Welche Menge ist sinnvoll?
3. Gibt es Tipps zur Lagerung?

Antworte kurz und praktisch auf Deutsch.`;

      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: "Du bist ein Haustier-Vorrats-Assistent. Gib praktische Nachbestell-Empfehlungen.",
          },
          { role: "user", content: prompt },
        ],
        maxTokens: 300,
      });

      const messageContent3 = response.choices[0]?.message?.content;
      const suggestion = typeof messageContent3 === "string" ? messageContent3 : "Überprüfe deine Vorräte regelmäßig.";

      return {
        suggestion,
        lowStockItems: input.supplies.filter((s) => s.level < 30).map((s) => s.name),
      };
    }),
});
