import {
  ScrollView,
  Text,
  View,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useState, useRef, useEffect } from "react";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { usePetStore } from "@/lib/pet-store";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const PET_TIPS: Record<string, string[]> = {
  dog: [
    "Hunde benoetigen taeglich mindestens 30-60 Minuten Bewegung, je nach Rasse und Alter.",
    "Regelmaessige Zahnpflege kann die Lebenserwartung deines Hundes um bis zu 3 Jahre verlaengern.",
    "Achte darauf, dass dein Hund immer Zugang zu frischem Wasser hat, besonders im Sommer.",
    "Sozialisierung in den ersten 16 Lebenswochen ist entscheidend fuer das Verhalten deines Hundes.",
    "Schokolade, Weintrauben und Zwiebeln sind fuer Hunde giftig und muessen vermieden werden.",
  ],
  cat: [
    "Katzen sind Meister darin, Schmerzen zu verbergen. Achte auf subtile Verhaltensaenderungen.",
    "Eine Katze sollte pro Tag etwa 60ml Wasser pro Kilogramm Koerpergewicht trinken.",
    "Katzen brauchen taeglich Spielzeit, um geistig und koerperlich fit zu bleiben.",
    "Mehrere Kratzbaeume an verschiedenen Stellen schuetzen deine Moebel und halten die Katze gluecklich.",
    "Lilien sind extrem giftig fuer Katzen -- bereits geringe Mengen koennen toedlich sein.",
  ],
  default: [
    "Regelmaessige Tierarztbesuche sind der Schluessel zur Gesundheit deines Haustieres.",
    "Eine ausgewogene Ernaehrung ist die Basis fuer ein langes und gesundes Tierleben.",
    "Beobachte das Fress- und Trinkverhalten deines Tieres -- Veraenderungen koennen auf Krankheiten hindeuten.",
    "Stress kann bei Tieren zu ernsthaften Gesundheitsproblemen fuehren. Sorge fuer eine ruhige Umgebung.",
    "Dokumentiere Symptome und Verhaltensaenderungen, um dem Tierarzt eine bessere Diagnose zu ermoeglichen.",
  ],
};

export default function AIChatScreen() {
  const insets = useSafeAreaInsets();
  const { pets, userName } = usePetStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const primaryPet = pets[0];
  const petType = primaryPet?.type || "default";
  const tips = PET_TIPS[petType] || PET_TIPS.default;

  useEffect(() => {
    // Welcome message
    const welcome: Message = {
      id: "welcome",
      role: "assistant",
      content: primaryPet
        ? `Willkommen, ${userName || "Tierfreund"}. Ich bin dein persoenlicher KI-Assistent fuer ${primaryPet.name}. Stelle mir Fragen zur Pflege, Gesundheit oder Ernaehrung -- ich helfe dir gerne.`
        : `Willkommen. Ich bin dein persoenlicher KI-Assistent fuer Tierpflege. Stelle mir Fragen zur Gesundheit, Ernaehrung oder Pflege deiner Tiere.`,
      timestamp: new Date(),
    };
    setMessages([welcome]);
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const query = userMsg.content.toLowerCase();
      let response = "";

      if (query.includes("futter") || query.includes("ernaehrung") || query.includes("fressen")) {
        response = primaryPet
          ? `Fuer ${primaryPet.name} empfehle ich hochwertiges Futter, das auf die spezifischen Beduerfnisse abgestimmt ist. Achte auf einen hohen Fleischanteil und vermeide kuenstliche Zusatzstoffe. Die Futtermenge sollte dem Gewicht und Aktivitaetslevel angepasst werden.`
          : "Eine ausgewogene Ernaehrung ist entscheidend. Achte auf hochwertiges Futter mit hohem Fleischanteil und vermeide kuenstliche Zusatzstoffe.";
      } else if (query.includes("krank") || query.includes("symptom") || query.includes("tierarzt")) {
        response = "Bei Krankheitssymptomen empfehle ich, zeitnah einen Tierarzt aufzusuchen. Dokumentiere die Symptome mit Datum und Uhrzeit -- das hilft bei der Diagnose. Du kannst den Symptom-Tracker in der App nutzen, um alles festzuhalten.";
      } else if (query.includes("impf") || query.includes("vorsorge")) {
        response = "Regelmaessige Impfungen sind essenziell. Die Grundimmunisierung sollte im Welpenalter beginnen. Danach sind jaehrliche Auffrischungen empfohlen. Pruefe den Impfkalender in der Gesundheitsakte deines Tieres.";
      } else if (query.includes("training") || query.includes("erziehung")) {
        response = "Positive Verstaerkung ist die effektivste Trainingsmethode. Belohne gewuenschtes Verhalten sofort und sei konsequent. Kurze Trainingseinheiten von 5-10 Minuten sind effektiver als lange Sessions.";
      } else {
        response = tips[Math.floor(Math.random() * tips.length)];
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0F" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={[s.header, { paddingTop: insets.top + 12 }]}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [s.backBtn, pressed && { opacity: 0.6 }]}
          >
            <IconSymbol name="chevron.left" size={20} color="#D4A843" />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={s.headerTitle}>KI-Assistent</Text>
            <Text style={s.headerSub}>Persoenliche Tierberatung</Text>
          </View>
          <LinearGradient
            colors={["#D4A843", "#B8860B"]}
            style={s.headerIcon}
          >
            <IconSymbol name="crown.fill" size={18} color="#0A0A0F" />
          </LinearGradient>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 20, paddingBottom: 20 }}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                s.messageBubble,
                msg.role === "user" ? s.userBubble : s.assistantBubble,
              ]}
            >
              {msg.role === "assistant" && (
                <View style={s.assistantAvatar}>
                  <IconSymbol name="crown.fill" size={12} color="#D4A843" />
                </View>
              )}
              <View
                style={[
                  s.messageContent,
                  msg.role === "user" ? s.userContent : s.assistantContent,
                ]}
              >
                <Text
                  style={[
                    s.messageText,
                    msg.role === "user" ? s.userText : s.assistantText,
                  ]}
                >
                  {msg.content}
                </Text>
              </View>
            </View>
          ))}

          {isTyping && (
            <View style={[s.messageBubble, s.assistantBubble]}>
              <View style={s.assistantAvatar}>
                <IconSymbol name="crown.fill" size={12} color="#D4A843" />
              </View>
              <View style={s.assistantContent}>
                <ActivityIndicator color="#D4A843" size="small" />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick Actions */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8, paddingBottom: 8 }}
        >
          {[
            "Ernaehrungstipps",
            "Gesundheitscheck",
            "Impfplan",
            "Trainingstipps",
          ].map((action) => (
            <Pressable
              key={action}
              onPress={() => {
                const userMsg: Message = {
                  id: Date.now().toString(),
                  role: "user",
                  content: action,
                  timestamp: new Date(),
                };
                setMessages((prev) => [...prev, userMsg]);
                setIsTyping(true);
                const petTips = PET_TIPS[petType] || PET_TIPS.default;
                setTimeout(() => {
                  const aiMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: petTips[Math.floor(Math.random() * petTips.length)],
                    timestamp: new Date(),
                  };
                  setMessages((prev) => [...prev, aiMsg]);
                  setIsTyping(false);
                }, 1200 + Math.random() * 800);
              }}
              style={({ pressed }) => [s.quickAction, pressed && { opacity: 0.7 }]}
            >
              <Text style={s.quickActionText}>{action}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Input */}
        <View style={[s.inputContainer, { paddingBottom: insets.bottom + 12 }]}>
          <View style={s.inputRow}>
            <TextInput
              style={s.textInput}
              placeholder="Frage stellen..."
              placeholderTextColor="#4A4A4A"
              value={input}
              onChangeText={setInput}
              returnKeyType="send"
              onSubmitEditing={sendMessage}
              multiline={false}
            />
            <Pressable
              onPress={sendMessage}
              style={({ pressed }) => [
                s.sendButton,
                !input.trim() && { opacity: 0.3 },
                pressed && { opacity: 0.7 },
              ]}
              disabled={!input.trim()}
            >
              <LinearGradient
                colors={["#D4A843", "#B8860B"]}
                style={s.sendGradient}
              >
                <IconSymbol name="paperplane.fill" size={18} color="#0A0A0F" />
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(212,168,67,0.08)",
    gap: 12,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 16, fontWeight: "500", color: "#FAFAF8", letterSpacing: 1 },
  headerSub: { fontSize: 11, fontWeight: "400", color: "#6B6B6B", letterSpacing: 0.5, marginTop: 2 },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  messageBubble: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 10,
  },
  userBubble: { justifyContent: "flex-end" },
  assistantBubble: { justifyContent: "flex-start" },

  assistantAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(212,168,67,0.1)",
    borderWidth: 1,
    borderColor: "rgba(212,168,67,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },

  messageContent: {
    maxWidth: "75%",
    padding: 14,
  },
  userContent: {
    backgroundColor: "rgba(212,168,67,0.12)",
    borderWidth: 1,
    borderColor: "rgba(212,168,67,0.2)",
    marginLeft: "auto",
  },
  assistantContent: {
    backgroundColor: "#141418",
    borderWidth: 1,
    borderColor: "rgba(212,168,67,0.08)",
  },

  messageText: { fontSize: 14, lineHeight: 22 },
  userText: { color: "#FAFAF8", fontWeight: "400" },
  assistantText: { color: "#C8C8C0", fontWeight: "400" },

  quickAction: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(212,168,67,0.15)",
    backgroundColor: "rgba(212,168,67,0.05)",
  },
  quickActionText: { fontSize: 12, fontWeight: "500", color: "#D4A843", letterSpacing: 0.5 },

  inputContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(212,168,67,0.08)",
    backgroundColor: "#0A0A0F",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  textInput: {
    flex: 1,
    height: 46,
    backgroundColor: "#141418",
    borderWidth: 1,
    borderColor: "rgba(212,168,67,0.1)",
    paddingHorizontal: 16,
    fontSize: 14,
    color: "#FAFAF8",
    letterSpacing: 0.3,
  },
  sendButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    overflow: "hidden",
  },
  sendGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
