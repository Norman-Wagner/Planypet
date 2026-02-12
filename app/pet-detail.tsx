import { useState } from "react";
import { View, Text, ScrollView, TextInput, Pressable, Image, Alert, StyleSheet, Platform, ActionSheetIOS } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePets, type Pet } from "@/lib/pet-store";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useConsent } from "@/lib/consent-store";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

export default function PetDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { petId } = useLocalSearchParams<{ petId: string }>();
  const { pets, updatePet } = usePets();
  const { cameraAccess } = useConsent();
  
  const pet = pets.find(p => p.id === petId);
  
  const [name, setName] = useState(pet?.name || "");
  const [breed, setBreed] = useState(pet?.breed || "");
  const [weight, setWeight] = useState(pet?.weight?.toString() || "");
  const [birthDate, setBirthDate] = useState(pet?.birthDate || "");
  const [preferences, setPreferences] = useState(pet?.preferences || "");
  const [photoUrl, setPhotoUrl] = useState(pet?.photoUrl || "");
  const [isSaved, setIsSaved] = useState(false);

  const handlePickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Berechtigung benoetigt", "Bitte erlaube den Zugriff auf deine Fotobibliothek in den Einstellungen.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setPhotoUrl(result.assets[0].uri);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Berechtigung benoetigt", "Bitte erlaube den Zugriff auf deine Kamera in den Einstellungen.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setPhotoUrl(result.assets[0].uri);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  };

  const handlePhotoAction = () => {
    if (!cameraAccess) {
      Alert.alert(
        "Einwilligung erforderlich",
        "Bitte aktiviere den Kamera- und Fotozugriff im Datenschutz-Center (Einstellungen), um Fotos hinzuzufuegen.",
        [
          { text: "Abbrechen", style: "cancel" },
          { text: "Zu Einstellungen", onPress: () => router.push("/privacy-center") },
        ]
      );
      return;
    }

    if (Platform.OS === "ios") {
      const options = photoUrl
        ? ["Foto aufnehmen", "Aus Galerie waehlen", "Foto entfernen", "Abbrechen"]
        : ["Foto aufnehmen", "Aus Galerie waehlen", "Abbrechen"];
      const cancelIndex = options.length - 1;
      const destructiveIndex = photoUrl ? 2 : undefined;

      ActionSheetIOS.showActionSheetWithOptions(
        { options, cancelButtonIndex: cancelIndex, destructiveButtonIndex: destructiveIndex },
        (index) => {
          if (index === 0) handleTakePhoto();
          else if (index === 1) handlePickFromGallery();
          else if (index === 2 && photoUrl) setPhotoUrl("");
        }
      );
    } else {
      // Android / Web: Use Alert as action sheet
      const buttons: any[] = [
        { text: "Foto aufnehmen", onPress: handleTakePhoto },
        { text: "Aus Galerie waehlen", onPress: handlePickFromGallery },
      ];
      if (photoUrl) {
        buttons.push({ text: "Foto entfernen", style: "destructive", onPress: () => setPhotoUrl("") });
      }
      buttons.push({ text: "Abbrechen", style: "cancel" });
      Alert.alert("Foto aendern", "Waehle eine Option", buttons);
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
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
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

        {/* Photo - Premium circular with gold border */}
        <View style={s.photoSection}>
          <Pressable
            onPress={handlePhotoAction}
            style={({ pressed }) => [s.photoOuter, pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }]}
          >
            <LinearGradient
              colors={["#D4A843", "#B8860B", "#8B6914"]}
              style={s.photoBorder}
            >
              <View style={s.photoInner}>
                {photoUrl ? (
                  <Image source={{ uri: photoUrl }} style={s.photoImage} />
                ) : (
                  <View style={s.photoPlaceholder}>
                    <IconSymbol name="camera.fill" size={32} color="#D4A843" />
                  </View>
                )}
              </View>
            </LinearGradient>
          </Pressable>
          <Pressable onPress={handlePhotoAction} style={({ pressed }) => pressed && { opacity: 0.6 }}>
            <Text style={s.photoLabel}>{photoUrl ? "Foto aendern" : "Foto hinzufuegen"}</Text>
          </Pressable>
          {pet?.name ? (
            <Text style={s.petNameDisplay}>{pet.name}</Text>
          ) : null}
        </View>

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

  photoSection: {
    alignItems: "center",
    marginBottom: 8,
  },
  photoOuter: {
    shadowColor: "#D4A843",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  photoBorder: {
    width: 152,
    height: 152,
    borderRadius: 76,
    alignItems: "center",
    justifyContent: "center",
  },
  photoInner: {
    width: 144,
    height: 144,
    borderRadius: 72,
    backgroundColor: "#141418",
    overflow: "hidden",
  },
  photoImage: { width: "100%", height: "100%" },
  photoPlaceholder: { flex: 1, alignItems: "center", justifyContent: "center" },
  photoLabel: {
    fontSize: 13, fontWeight: "500", color: "#D4A843",
    letterSpacing: 0.5, marginTop: 12,
  },
  petNameDisplay: {
    fontSize: 22, fontWeight: "300", color: "#FAFAF8",
    letterSpacing: 2, marginTop: 8,
  },

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
