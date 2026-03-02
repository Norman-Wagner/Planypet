import { describe, it, expect, vi } from "vitest";
import { aiRouter } from "./ai";
import * as llm from "../_core/llm";

// Mock the LLM module
vi.mock("../_core/llm", () => ({
  invokeLLM: vi.fn(),
}));

describe("AI Router", () => {
  it("should have analyzeSymptom procedure", () => {
    expect(aiRouter._def.procedures.analyzeSymptom).toBeDefined();
  });

  it("should have generateReminder procedure", () => {
    expect(aiRouter._def.procedures.generateReminder).toBeDefined();
  });

  it("should have suggestReorder procedure", () => {
    expect(aiRouter._def.procedures.suggestReorder).toBeDefined();
  });

  it("should handle analyzeSymptom with valid input", async () => {
    const mockLLMResponse = {
      id: "test-id",
      created: Date.now(),
      model: "gemini-2.5-flash",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant" as const,
            content: "Test analysis result",
          },
          finish_reason: "stop",
        },
      ],
    };

    vi.mocked(llm.invokeLLM).mockResolvedValue(mockLLMResponse);

    const caller = aiRouter.createCaller({} as any);
    const result = await caller.analyzeSymptom({
      petType: "dog",
      petName: "Luna",
      symptoms: "Husten und Niesen",
      duration: "2 Tage",
    });

    expect(result.analysis).toBe("Test analysis result");
    expect(result.disclaimer).toContain("tierärztliche Diagnose");
    expect(typeof result.recommendVet).toBe("boolean");
  });

  it("should handle generateReminder with valid input", async () => {
    const mockLLMResponse = {
      id: "test-id",
      created: Date.now(),
      model: "gemini-2.5-flash",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant" as const,
            content: "Hast du Luna schon gefüttert?",
          },
          finish_reason: "stop",
        },
      ],
    };

    vi.mocked(llm.invokeLLM).mockResolvedValue(mockLLMResponse);

    const caller = aiRouter.createCaller({} as any);
    const result = await caller.generateReminder({
      petName: "Luna",
      petType: "dog",
      lastFed: "vor 6 Stunden",
    });

    expect(result.reminder).toBe("Hast du Luna schon gefüttert?");
  });

  it("should handle suggestReorder with low stock items", async () => {
    const mockLLMResponse = {
      id: "test-id",
      created: Date.now(),
      model: "gemini-2.5-flash",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant" as const,
            content: "Du solltest bald Hundefutter nachbestellen.",
          },
          finish_reason: "stop",
        },
      ],
    };

    vi.mocked(llm.invokeLLM).mockResolvedValue(mockLLMResponse);

    const caller = aiRouter.createCaller({} as any);
    const result = await caller.suggestReorder({
      petType: "dog",
      supplies: [
        { name: "Hundefutter", level: 20 },
        { name: "Leckerlis", level: 50 },
      ],
    });

    expect(result.suggestion).toBe("Du solltest bald Hundefutter nachbestellen.");
    expect(result.lowStockItems).toEqual(["Hundefutter"]);
  });

  it("should handle content as array in LLM response", async () => {
    const mockLLMResponse = {
      id: "test-id",
      created: Date.now(),
      model: "gemini-2.5-flash",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant" as const,
            content: [{ type: "text" as const, text: "Array content" }],
          },
          finish_reason: "stop",
        },
      ],
    };

    vi.mocked(llm.invokeLLM).mockResolvedValue(mockLLMResponse);

    const caller = aiRouter.createCaller({} as any);
    const result = await caller.analyzeSymptom({
      petType: "cat",
      petName: "Mimi",
      symptoms: "Erbrechen",
    });

    // Should fallback to default message when content is not a string
    expect(result.analysis).toBe("Keine Analyse verfügbar.");
  });
});
