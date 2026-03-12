import React, { useState, useRef, useEffect } from "react";
import {
  ScrollView,
  Text,
  View,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { usePetStore } from "@/store/PetStore";
import {
  PetAdvisorMessage,
  buildPetAdvisorPrompt,
  formatPetContext,
  getProductRecommendations,
  formatProductRecommendation,
  generateCostSavingTips,
} from "@/lib/ai-pet-advisor";
import { cn } from "@/lib/utils";

interface AIPetAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIPetAdvisorModal({ isOpen, onClose }: AIPetAdvisorModalProps) {
  const store = usePetStore();
  const activePet = store.getActivePet();
  const [messages, setMessages] = useState<PetAdvisorMessage[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content: `Hallo! Ich bin dein virtueller Haustierberater. Ich helfe dir, die beste Pflege für ${activePet?.name || "dein Haustier"} zu gewährleisten. Wie kann ich dir heute helfen?`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || !activePet) return;

    // Add user message
    const userMessage: PetAdvisorMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Simulate AI response (in production, call actual LLM)
      const response = await generateAdvisorResponse(input, activePet);

      const assistantMessage: PetAdvisorMessage = {
        id: `msg-${Date.now()}-ai`,
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !activePet) return null;

  return (
    <View className="absolute inset-0 bg-black/50 flex-1 items-center justify-end z-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="w-full h-4/5 bg-gradient-to-br from-slate-900 to-blue-950 rounded-t-3xl flex flex-col"
      >
        {/* Header */}
        <View className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex-row items-center justify-between rounded-t-3xl">
          <View>
            <Text className="text-white text-lg font-bold">Haustierberater</Text>
            <Text className="text-blue-100 text-xs mt-0.5">{activePet.name}</Text>
          </View>
          <Pressable onPress={onClose} className="p-2">
            <Text className="text-white text-2xl">×</Text>
          </Pressable>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-4 py-4"
          contentContainerStyle={{ gap: 12 }}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              className={cn(
                "max-w-xs rounded-2xl px-4 py-3",
                message.role === "user"
                  ? "self-end bg-gradient-to-r from-blue-500 to-blue-600"
                  : "self-start bg-white/10 border border-white/20"
              )}
            >
              <Text
                className={cn(
                  "text-sm leading-relaxed",
                  message.role === "user" ? "text-white" : "text-blue-50"
                )}
              >
                {message.content}
              </Text>
            </View>
          ))}

          {isLoading && (
            <View className="self-start flex-row items-center gap-2 bg-white/10 rounded-2xl px-4 py-3 border border-white/20">
              <ActivityIndicator size="small" color="#93c5fd" />
              <Text className="text-blue-200 text-sm">Denke nach...</Text>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View className="px-4 py-4 border-t border-white/10 flex-row gap-2">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Stelle eine Frage..."
            placeholderTextColor="#64748b"
            className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2.5 text-white text-sm"
            editable={!isLoading}
          />
          <Pressable
            onPress={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className={cn(
              "w-10 h-10 rounded-full items-center justify-center",
              input.trim() && !isLoading
                ? "bg-gradient-to-r from-blue-500 to-blue-600"
                : "bg-white/10"
            )}
          >
            <Text className="text-white text-lg font-bold">→</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

/**
 * Generate advisor response based on user input
 */
async function generateAdvisorResponse(userInput: string, pet: any): Promise<string> {
  const lowerInput = userInput.toLowerCase();

  // Check for product recommendations
  if (
    lowerInput.includes("produkt") ||
    lowerInput.includes("kaufen") ||
    lowerInput.includes("empfehlung")
  ) {
    const products = getProductRecommendations(pet.species);
    if (products.length > 0) {
      return `Hier sind meine Produktempfehlungen für ${pet.name}:\n\n${formatProductRecommendation(products[0])}`;
    }
  }

  // Check for cost-saving tips
  if (
    lowerInput.includes("sparen") ||
    lowerInput.includes("kosten") ||
    lowerInput.includes("günstig")
  ) {
    const tips = generateCostSavingTips(pet.species);
    return `Hier sind meine Tipps zum Sparen bei der Haustierpflege:\n\n${tips.map((t) => `• ${t}`).join("\n")}`;
  }

  // Check for feeding advice
  if (lowerInput.includes("fütter") || lowerInput.includes("essen")) {
    return `Für ${pet.name} empfehle ich:\n\n• Hochwertige Nahrung mit ausreichend Proteinen\n• Regelmäßige Fütterungszeiten (2-3x täglich je nach Alter)\n• Frisches Wasser immer verfügbar\n• Vermeidung von Menschenessen\n\nMöchtest du spezifische Futterempfehlungen?`;
  }

  // Check for health advice
  if (
    lowerInput.includes("gesundheit") ||
    lowerInput.includes("krank") ||
    lowerInput.includes("symptom")
  ) {
    return `Für die Gesundheit von ${pet.name} empfehle ich:\n\n• Regelmäßige Tierarztbesuche (mindestens 1x jährlich)\n• Impfungen und Parasitenbekämpfung\n• Tägliche Bewegung und mentale Stimulation\n• Zahnpflege\n\nBei Symptomen oder Bedenken konsultiere bitte deinen Tierarzt.`;
  }

  // Default response
  return `Das ist eine gute Frage! Für ${pet.name} kann ich dir bei folgenden Themen helfen:\n\n• Ernährung und Fütterung\n• Gesundheit und Vorsorge\n• Produktempfehlungen\n• Kosteneinsparungen\n• Pflege und Hygiene\n\nWas interessiert dich am meisten?`;
}

/**
 * Blue paw button to open advisor
 */
export function AIPetAdvisorButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="absolute bottom-8 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 items-center justify-center shadow-lg active:scale-95"
    >
      <Text className="text-white text-xl font-bold">P</Text>
    </Pressable>
  );
}
