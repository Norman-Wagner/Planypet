import { ScrollView, View, Text, Pressable, TextInput } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { PremiumFeatureCard } from '@/components/premium-feature-card';
import { LiabilityDisclaimer, DISCLAIMERS } from '@/components/liability-disclaimer';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';

/**
 * AI ADVISOR SCREEN
 * - Expert recommendations
 * - Nutrition, health, behavior, training
 * - Weather-specific advice
 * - Breed-specific tips
 */

export default function AIAdvisorScreen() {
  const [question, setQuestion] = useState('');
  const [advice, setAdvice] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;

    setLoading(true);
    // TODO: Call aiAdvisorService.getAdvice()
    setLoading(false);
  };

  const quickQuestions = [
    {
      icon: 'restaurant',
      title: 'Ernährung',
      question: 'Welche Ernährung ist optimal für Luna?',
      color: '#f59e0b',
    },
    {
      icon: 'favorite',
      title: 'Gesundheit',
      question: 'Luna zeigt Symptome - was sollte ich tun?',
      color: '#ef4444',
    },
    {
      icon: 'school',
      title: 'Training',
      question: 'Wie kann ich Luna trainieren?',
      color: '#a855f7',
    },
    {
      icon: 'pets',
      title: 'Rasse',
      question: 'Tipps für Labrador Retriever?',
      color: '#3b82f6',
    },
  ];

  return (
    <ScreenContainer className="bg-black">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-8">
          {/* HEADER */}
          <View className="items-center pt-4">
            <View className="w-16 h-16 bg-purple-600 rounded-full items-center justify-center mb-4">
              <MaterialIcons name="psychology" size={32} color="white" />
            </View>
            <Text className="text-3xl font-bold text-white">KI-Ratgeber</Text>
            <Text className="text-sm text-gray-400 mt-1">Experten-Tipps für Luna</Text>
          </View>

          {/* QUESTION INPUT */}
          <View className="bg-gray-900 rounded-2xl p-4 border border-gray-700">
            <TextInput
              placeholder="Stelle eine Frage..."
              placeholderTextColor="#6b7280"
              value={question}
              onChangeText={setQuestion}
              multiline
              numberOfLines={3}
              className="text-white text-base"
              style={{ minHeight: 80 }}
            />
            <Pressable
              onPress={handleAsk}
              disabled={loading || !question.trim()}
              className="mt-3 bg-purple-600 rounded-lg py-3 items-center"
            >
              <Text className="text-white font-semibold">
                {loading ? 'Wird bearbeitet...' : 'Fragen'}
              </Text>
            </Pressable>
          </View>

          {/* QUICK QUESTIONS */}
          <View>
            <Text className="text-white font-bold text-lg mb-3">Schnelle Fragen</Text>
            <View className="gap-3">
              {quickQuestions.map((q, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => setQuestion(q.question)}
                  className="bg-gray-900 rounded-xl p-4 border border-gray-700 flex-row items-center gap-3"
                >
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center"
                    style={{ backgroundColor: q.color }}
                  >
                    <MaterialIcons name={q.icon as any} size={24} color="white" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-semibold">{q.title}</Text>
                    <Text className="text-gray-400 text-sm">{q.question}</Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color="#6b7280" />
                </Pressable>
              ))}
            </View>
          </View>

          {/* AI RESPONSE */}
          {advice && (
            <PremiumFeatureCard
              title="KI-Antwort"
              color="#a855f7"
              disclaimer={DISCLAIMERS.AI_ADVISOR}
            >
              <Text className="text-white text-sm leading-relaxed mt-4">{advice.advice}</Text>

              {advice.recommendations.length > 0 && (
                <View className="mt-4 pt-4 border-t border-white border-opacity-20">
                  <Text className="text-white font-semibold mb-2">Empfehlungen:</Text>
                  {advice.recommendations.map((rec: string, idx: number) => (
                    <View key={idx} className="flex-row items-start gap-2 mb-2">
                      <MaterialIcons name="check-circle" size={16} color="#10b981" />
                      <Text className="text-white text-sm flex-1">{rec}</Text>
                    </View>
                  ))}
                </View>
              )}

              {advice.warnings.length > 0 && (
                <View className="mt-4 pt-4 border-t border-white border-opacity-20">
                  <Text className="text-white font-semibold mb-2">Warnungen:</Text>
                  {advice.warnings.map((warning: string, idx: number) => (
                    <View key={idx} className="flex-row items-start gap-2 mb-2">
                      <MaterialIcons name="warning" size={16} color="#ef4444" />
                      <Text className="text-white text-sm flex-1">{warning}</Text>
                    </View>
                  ))}
                </View>
              )}

              {advice.followUpQuestions && advice.followUpQuestions.length > 0 && (
                <View className="mt-4 pt-4 border-t border-white border-opacity-20">
                  <Text className="text-white font-semibold mb-2">Weitere Fragen:</Text>
                  {advice.followUpQuestions.map((fq: string, idx: number) => (
                    <Pressable
                      key={idx}
                      onPress={() => setQuestion(fq)}
                      className="py-2 px-3 bg-purple-600 bg-opacity-30 rounded-lg mb-2"
                    >
                      <Text className="text-white text-sm">{fq}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </PremiumFeatureCard>
          )}

          {/* ADVISOR CATEGORIES */}
          <View>
            <Text className="text-white font-bold text-lg mb-3">Beratungs-Kategorien</Text>
            <View className="gap-2">
              {[
                { icon: 'restaurant', title: 'Ernährung & Fütterung', color: '#f59e0b' },
                { icon: 'favorite', title: 'Gesundheit & Medizin', color: '#ef4444' },
                { icon: 'school', title: 'Training & Verhalten', color: '#a855f7' },
                { icon: 'pets', title: 'Rasse-Spezifisch', color: '#3b82f6' },
                { icon: 'cloud', title: 'Wetter & Aktivitäten', color: '#06b6d4' },
                { icon: 'psychology', title: 'Psychologie & Wohlbefinden', color: '#10b981' },
              ].map((cat, idx) => (
                <Pressable
                  key={idx}
                  className="bg-gray-900 rounded-xl p-4 border border-gray-700 flex-row items-center gap-3"
                >
                  <View
                    className="w-10 h-10 rounded-lg items-center justify-center"
                    style={{ backgroundColor: cat.color }}
                  >
                    <MaterialIcons name={cat.icon as any} size={20} color="white" />
                  </View>
                  <Text className="text-white font-semibold flex-1">{cat.title}</Text>
                  <MaterialIcons name="chevron-right" size={20} color="#6b7280" />
                </Pressable>
              ))}
            </View>
          </View>

          {/* DISCLAIMER */}
          <LiabilityDisclaimer
            title="KI-Ratgeber Hinweis"
            text={DISCLAIMERS.AI_ADVISOR}
            compact={true}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
