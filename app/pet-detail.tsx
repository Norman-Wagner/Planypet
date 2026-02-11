import { useState } from "react";
import { View, Text, ScrollView, TextInput, Pressable, Image, Alert, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePets, type Pet } from "@/lib/pet-store";
import { IconSymbol } from "@/components/ui/icon-symbol";
import * as ImagePicker from "expo-image-picker";

export default function PetDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { petId } = useLocalSearchParams<{ petId: string }>();
  const { pets, updatePet } = usePets();
  
  const pet = pets.find(p => p.id === petId);
  
  const [name, setName] = useState(pet?.name || "");
  const [breed, setBreed] = useState(pet?.breed || "");
  const [weight, setWeight] = useState(pet?.weight?.toString() || "");
  const [birthDate, setBirthDate] = useState(pet?.birthDate || "");
  const [preferences, setPreferences] = useState(pet?.preferences || "");
  const [photoUrl, setPhotoUrl] = useState(pet?.photoUrl || "");
  const [isSaved, setIsSaved] = useState(false);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setPhotoUrl(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Fehler", "Bitte gib einen Namen ein");
      return;
    }
    const updatedPet: Pet = {
      ...pet,
      id: petId || Date.now().toString(),
      name,
      type: pet?.type || "cat",
      breed,
      weight: weight ? parseFloat(weight) : undefined,
      birthDate,
      preferences,
      photoUrl,
      isGroup: pet?.isGroup || false,
      createdAt: pet?.createdAt || new Date().toISOString(),
    };
    await updatePet(updatedPet);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0F" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 100,
          paddingHorizontal: 20,
        }}
      >
        {/* Back Button */}
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [s.backBtn, pressed && { opacity: 0.6 }]}
        >
          <IconSymbol name="chevron.left" size={20} color="#D4A843" />
          <Text style={s.backText}>Zurueck</Text>
        </Pressable>

        {/* Header */}
        <View style={s.header}>
          <Text style={s.headerTitle}>Tier-Profil</Text>
          <Text style={s.headerSub}>Alle Informationen ueber dein Tier</Text>
          <View style={s.goldDivider} />
        </View>

        {/* Photo */}
        <Pressable
          onPress={handlePickImage}
          style={({ pressed }) => [s.photoCard, pressed && { opacity: 0.8 }]}
        >
          {photoUrl ? (
            <Image source={{ uri: photoUrl }} style={s.photoImage} />
          ) : (
            <View style={s.photoPlaceholder}>
              <IconSymbol name="camera.fill" size={28} color="#D4A843" />
              <Text style={s.photoText}>Foto hinzufuegen</Text>
            </View>
          )}
        </Pressable>

        {/* Form Fields */}
        <View style={{ gap: 20, marginTop: 24 }}>
          <FormField label="Name" value={name} onChangeText={setName} placeholder="z.B. Luna" />
          <FormField label="Rasse" value={breed} onChangeText={setBreed} placeholder="z.B. Labrador Retriever" />
          <FormField label="Gewicht (kg)" value={weight} onChangeText={setWeight} placeholder="z.B. 25" keyboardType="decimal-pad" />
          <FormField label="Geburtsdatum" value={birthDate} onChangeText={setBirthDate} placeholder="z.B. 15.03.2020" />
          <FormField label="Vorlieben & Besonderheiten" value={preferences} onChangeText={setPreferences} placeholder="z.B. Liebt Spielzeug, mag keine Katzen" multiline />
        </View>

        {/* Save Button */}
        <Pressable
          onPress={handleSave}
          style={({ pressed }) => [
            s.saveBtn,
            isSaved && { backgroundColor: "rgba(102,187,106,0.15)", borderColor: "rgba(102,187,106,0.3)" },
            pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
          ]}
        >
          <Text style={[s.saveBtnText, isSaved && { color: "#66BB6A" }]}>
            {isSaved ? "Gespeichert" : "Speichern"}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function FormField({ label, value, onChangeText, placeholder, multiline, keyboardType }: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  multiline?: boolean;
  keyboardType?: "default" | "decimal-pad";
}) {
  return (
    <View>
      <Text style={s.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#4A4A4A"
        style={[s.fieldInput, multiline && { height: 100, textAlignVertical: "top" }]}
        multiline={multiline}
        keyboardType={keyboardType}
        returnKeyType={multiline ? "default" : "done"}
      />
    </View>
  );
}

const s = StyleSheet.create({
  backBtn: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 },
  backText: { fontSize: 14, fontWeight: "500", color: "#D4A843", letterSpacing: 0.5 },

  header: { marginBottom: 24 },
  headerTitle: { fontSize: 28, fontWeight: "300", color: "#FAFAF8", letterSpacing: 2 },
  headerSub: { fontSize: 12, fontWeight: "400", color: "#6B6B6B", letterSpacing: 1, marginTop: 4 },
  goldDivider: { width: 40, height: 1, backgroundColor: "#D4A843", marginTop: 16 },

  photoCard: {
    height: 180,
    backgroundColor: "#141418",
    borderWidth: 1,
    borderColor: "rgba(212,168,67,0.1)",
    overflow: "hidden",
  },
  photoImage: { width: "100%", height: "100%" },
  photoPlaceholder: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
  photoText: { fontSize: 13, fontWeight: "400", color: "#6B6B6B", letterSpacing: 0.5 },

  fieldLabel: {
    fontSize: 11, fontWeight: "600", color: "#D4A843",
    letterSpacing: 2, textTransform: "uppercase", marginBottom: 8,
  },
  fieldInput: {
    backgroundColor: "#141418",
    borderWidth: 1,
    borderColor: "rgba(212,168,67,0.1)",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontWeight: "400",
    color: "#FAFAF8",
    letterSpacing: 0.3,
  },

  saveBtn: {
    marginTop: 32,
    backgroundColor: "rgba(212,168,67,0.1)",
    borderWidth: 1,
    borderColor: "rgba(212,168,67,0.2)",
    paddingVertical: 18,
    alignItems: "center",
  },
  saveBtnText: {
    fontSize: 14, fontWeight: "600", color: "#D4A843",
    letterSpacing: 3, textTransform: "uppercase",
  },
});
