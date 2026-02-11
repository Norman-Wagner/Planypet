import { useState } from "react";
import { ScrollView, Text, View, Pressable, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { PetAvatar } from "@/components/ui/pet-avatar";
import { VoiceInput } from "@/components/ui/voice-input";
import { usePetStore, Pet } from "@/lib/pet-store";
import { useImagePicker } from "@/hooks/use-image-picker";
import { Image } from "expo-image";

export default function AddSymptomScreen() {
  const insets = useSafeAreaInsets();
  const { pets, addHealthRecord } = usePetStore();

  const [selectedPet, setSelectedPet] = useState<Pet | null>(pets[0] || null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [recordType, setRecordType] = useState<"symptom" | "vaccination" | "medication" | "note">("symptom");
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const { pickImage, takePhoto, isUploading } = useImagePicker();

  const handleAnalyze = async () => {
    if (!selectedPet || !description) {
      Alert.alert("Fehler", "Bitte beschreibe die Symptome");
      return;
    }

    setIsAnalyzing(true);
    try {
      // Simulate AI analysis
      setTimeout(() => {
        const analysis = `Basierend auf den beschriebenen Symptomen könnte es sich um folgende Ursachen handeln:\n\n1. Ernährungsbedingte Beschwerden\n2. Leichte Infektion\n3. Stress oder Umstellungsreaktion\n\nEmpfehlung: Bei anhaltenden oder sich verschlimmernden Symptomen bitte einen Tierarzt aufsuchen!`;
        setAiAnalysis(analysis);
        setIsAnalyzing(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to analyze symptoms:", error);
      setIsAnalyzing(false);
      Alert.alert("Fehler", "KI-Analyse konnte nicht durchgeführt werden");
    }
  };

  const handleSave = () => {
    if (!selectedPet || !title) return;

    addHealthRecord({
      petId: selectedPet.id,
      type: recordType,
      title,
      description: description || undefined,
      date: new Date().toISOString(),
    });

    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    router.back();
  };

  const handleVoiceTranscript = (text: string) => {
    setDescription((prev) => (prev ? `${prev} ${text}` : text));
    setShowVoiceInput(false);
  };

  const handleTakePhoto = async () => {
    const uri = await takePhoto();
    if (uri) {
      setPhotos((prev) => [...prev, uri]);
    }
  };

  const handlePickImage = async () => {
    const uri = await pickImage();
    if (uri) {
      setPhotos((prev) => [...prev, uri]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const recordTypes = [
    { key: "symptom", label: "Symptom", icon: "exclamationmark.triangle.fill" },
    { key: "vaccination", label: "Impfung", icon: "syringe.fill" },
    { key: "medication", label: "Medikament", icon: "pill.fill" },
    { key: "note", label: "Notiz", icon: "doc.text.fill" },
  ] as const;

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingTop: insets.top + 20,
            paddingBottom: insets.bottom + 40,
            paddingHorizontal: 20,
          }}
        >
          {/* Header */}
          <View style={styles.headerContainer}>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [styles.backButton, { opacity: pressed ? 0.7 : 1 }]}
            >
              <IconSymbol name="chevron.left" size={24} color="#D4A843" />
            </Pressable>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>Eintrag hinzufügen</Text>
              <Text style={styles.headerSubtitle}>Gesundheitsdaten dokumentieren</Text>
            </View>
          </View>
          <View style={styles.divider} />

          {/* Pet Selector */}
          <Text style={styles.sectionTitle}>Für welches Tier?</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 24 }}
            contentContainerStyle={{ gap: 12 }}
          >
            {pets.map((pet) => (
              <Pressable
                key={pet.id}
                onPress={() => setSelectedPet(pet)}
                style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] })}
              >
                <View style={[styles.card, styles.petCard, selectedPet?.id === pet.id && styles.selectedCard]}>
                  <PetAvatar name={pet.name} type={pet.type} size="md" />
                  <Text style={styles.petName} numberOfLines={1}>
                    {pet.name}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>

          {/* Record Type */}
          <Text style={styles.sectionTitle}>Art des Eintrags</Text>
          <View style={styles.recordTypeContainer}>
            {recordTypes.map(({ key, label, icon }) => (
              <Pressable
                key={key}
                onPress={() => setRecordType(key)}
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                <View style={[styles.recordTypeButton, recordType === key && styles.activeRecordTypeButton]}>
                  <IconSymbol
                    name={icon as any}
                    size={16}
                    color={recordType === key ? "#0A0A0F" : "#D4A843"}
                  />
                  <Text style={[styles.recordTypeLabel, recordType === key && styles.activeRecordTypeLabel]}>
                    {label}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          {/* Title Input */}
          <View style={[styles.card, { marginBottom: 16 }]}>
            <Text style={styles.inputLabel}>Titel / Bezeichnung *</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder={
                recordType === "symptom" ? "z.B. Husten, Appetitlosigkeit" :
                recordType === "vaccination" ? "z.B. Tollwut, Staupe" :
                recordType === "medication" ? "z.B. Antibiotikum, Schmerzmittel" :
                "z.B. Tierarztbesuch, Beobachtung"
              }
              placeholderTextColor="#6B6B6B"
              style={styles.textInput}
              returnKeyType="next"
            />
          </View>

          {/* Description Input */}
          <View style={[styles.card, { marginBottom: 24 }]}>
            <Text style={styles.inputLabel}>Beschreibung (optional)</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Weitere Details, Beobachtungen, Dosierung..."
              placeholderTextColor="#6B6B6B"
              style={[styles.textInput, { minHeight: 100, textAlignVertical: "top" }]}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Voice Input */}
          {showVoiceInput && (
            <View style={[styles.card, { marginBottom: 24, alignItems: 'center', paddingVertical: 24 }]}>
              <VoiceInput onTranscript={handleVoiceTranscript} placeholder="Halte gedrückt zum Sprechen" />
              <Pressable onPress={() => setShowVoiceInput(false)} style={{ marginTop: 16 }}>
                <Text style={{ color: '#8B8B80', fontSize: 12 }}>Abbrechen</Text>
              </Pressable>
            </View>
          )}

          {/* Photos */}
          {photos.length > 0 && (
            <View style={{ marginBottom: 24 }}>
              <Text style={styles.sectionTitle}>Fotos ({photos.length})</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                {photos.map((uri, index) => (
                  <View key={index} style={{ position: 'relative' }}>
                    <Image source={{ uri }} style={{ width: 100, height: 100, borderRadius: 12 }} />
                    <Pressable
                      onPress={() => handleRemovePhoto(index)}
                      style={({ pressed }) => [styles.removePhotoButton, { opacity: pressed ? 0.7 : 1 }]}
                    >
                      <Text style={styles.removePhotoText}>×</Text>
                    </Pressable>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Media Buttons */}
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
            <Pressable
              style={({ pressed }) => [{ flex: 1, opacity: pressed || isUploading ? 0.5 : 1 }]}
              onPress={handleTakePhoto}
              disabled={isUploading}
            >
              <View style={[styles.card, styles.mediaButton]}>
                <IconSymbol name="camera.fill" size={24} color="#D4A843" />
                <Text style={styles.mediaButtonText}>Foto aufnehmen</Text>
              </View>
            </Pressable>
            <Pressable
              style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.8 : 1 }]}
              onPress={() => setShowVoiceInput(true)}
            >
              <View style={[styles.card, styles.mediaButton]}>
                <IconSymbol name="mic.fill" size={24} color="#D4A843" />
                <Text style={styles.mediaButtonText}>Spracheingabe</Text>
              </View>
            </Pressable>
          </View>

          {/* AI Analysis Button */}
          {recordType === "symptom" && description && (
            <View style={{ marginBottom: 24 }}>
              <Pressable
                onPress={handleAnalyze}
                disabled={isAnalyzing}
                style={({ pressed }) => [styles.actionButton, { opacity: pressed || isAnalyzing ? 0.7 : 1 }]}
              >
                {isAnalyzing ? (
                  <ActivityIndicator color="#0A0A0F" />
                ) : (
                  <Text style={styles.actionButtonText}>{isAnalyzing ? "Analysiere..." : "Mit KI analysieren"}</Text>
                )}
              </Pressable>
            </View>
          )}

          {/* AI Analysis Result */}
          {aiAnalysis && (
            <View style={[styles.card, { marginBottom: 24, borderColor: 'rgba(212, 168, 67, 0.2)' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
                <IconSymbol name="sparkles" size={20} color="#D4A843" style={{ marginRight: 8, marginTop: 2 }} />
                <Text style={styles.aiTitle}>KI-Analyse</Text>
              </View>
              <Text style={styles.aiText}>{aiAnalysis}</Text>
            </View>
          )}

          {/* Save Button */}
          <Pressable
            onPress={handleSave}
            disabled={!selectedPet || !title}
            style={({ pressed }) => [styles.actionButton, { opacity: pressed || !selectedPet || !title ? 0.7 : 1 }]}
          >
            <Text style={styles.actionButtonText}>Speichern</Text>
          </Pressable>

          {/* Disclaimer */}
          <View style={[styles.card, { marginTop: 24, flexDirection: 'row', alignItems: 'flex-start', backgroundColor: 'transparent', borderWidth: 0 }]}>
            <IconSymbol name="info.circle.fill" size={20} color="#8B8B80" style={{ marginRight: 12, marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#FAFAF8', fontWeight: '600', fontSize: 14, marginBottom: 4 }}>Hinweis</Text>
              <Text style={{ color: '#8B8B80', fontSize: 12, lineHeight: 18 }}>
                Diese Dokumentation ersetzt keinen Tierarztbesuch. Bei akuten Symptomen kontaktiere bitte sofort einen Tierarzt.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#141418',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(212,168,67,0.08)',
  },
  headerTitle: {
    color: '#FAFAF8',
    fontSize: 24,
    fontWeight: '300',
    letterSpacing: 2,
  },
  headerSubtitle: {
    color: '#6B6B6B',
    fontSize: 14,
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: '#D4A843',
    marginBottom: 24,
    marginLeft: 52, // Align with title
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D4A843',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#141418',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(212,168,67,0.08)',
    padding: 16,
  },
  petCard: {
    width: 100,
    alignItems: 'center',
    paddingVertical: 12,
  },
  selectedCard: {
    borderColor: '#D4A843',
    borderWidth: 1.5,
  },
  petName: {
    color: '#FAFAF8',
    fontWeight: '500',
    marginTop: 8,
    fontSize: 13,
  },
  recordTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  recordTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#141418',
    borderWidth: 1,
    borderColor: 'rgba(212,168,67,0.08)',
  },
  activeRecordTypeButton: {
    backgroundColor: '#D4A843',
    borderColor: '#D4A843',
  },
  recordTypeLabel: {
    marginLeft: 8,
    fontWeight: '500',
    color: '#FAFAF8',
    fontSize: 14,
  },
  activeRecordTypeLabel: {
    color: '#0A0A0F',
  },
  inputLabel: {
    color: '#8B8B80',
    fontSize: 12,
    marginBottom: 8,
  },
  textInput: {
    color: '#FAFAF8',
    fontSize: 16,
    paddingVertical: 4,
  },
  removePhotoButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(10, 10, 15, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removePhotoText: {
    color: '#FAFAF8',
    fontSize: 14,
    fontWeight: 'bold',
  },
  mediaButton: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  mediaButtonText: {
    color: '#FAFAF8',
    fontWeight: '500',
    fontSize: 13,
  },
  actionButton: {
    backgroundColor: '#D4A843',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#0A0A0F',
    fontSize: 16,
    fontWeight: '600',
  },
  aiTitle: {
    color: '#FAFAF8',
    fontWeight: '600',
    fontSize: 16,
    flex: 1,
  },
  aiText: {
    color: '#BDBDAF',
    fontSize: 14,
    lineHeight: 22,
  },
});
