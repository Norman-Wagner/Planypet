import {
  ScrollView,
  Text,
  View,
  Pressable,
  Image,
  Dimensions,
  Alert,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { usePetStore } from "@/lib/pet-store";
import { useImagePicker } from "@/hooks/use-image-picker";

const { width } = Dimensions.get("window");
const imageSize = (width - 40) / 3; // 3 columns with 8px gap

interface Photo {
  id: string;
  uri: string;
  petId: string;
  petName: string;
  date: string;
}

export default function PhotoAlbumScreen() {
  const insets = useSafeAreaInsets();
  const { pets } = usePetStore();
  const { pickImage, takePhoto } = useImagePicker();

  const [selectedPet, setSelectedPet] = useState<string | null>(null);

  // Mock data
  const [photos, setPhotos] = useState<Photo[]>([
    {
      id: "1",
      uri: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400",
      petId: "1",
      petName: "Luna",
      date: "2026-01-15",
    },
    {
      id: "2",
      uri: "https://images.unsplash.com/photo-1573865526739-10c1de0ac5b4?w=400",
      petId: "1",
      petName: "Luna",
      date: "2026-01-14",
    },
    {
      id: "3",
      uri: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400",
      petId: "2",
      petName: "Max",
      date: "2026-01-13",
    },
    {
      id: "4",
      uri: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400",
      petId: "2",
      petName: "Max",
      date: "2026-01-12",
    },
    {
      id: "5",
      uri: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400",
      petId: "1",
      petName: "Luna",
      date: "2026-01-11",
    },
    {
      id: "6",
      uri: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400",
      petId: "2",
      petName: "Max",
      date: "2026-01-10",
    },
  ]);

  const filteredPhotos = selectedPet
    ? photos.filter((p) => p.petId === selectedPet)
    : photos;

  const handleAddPhoto = async () => {
    Alert.alert("Foto hinzufügen", "Wähle eine Option", [
      {
        text: "Kamera",
        onPress: async () => {
          const uri = await takePhoto();
          if (uri) {
            // In a real app, you would create a new photo object and add it to the state
            Alert.alert("Erfolg", "Foto wurde hinzugefügt");
          }
        },
      },
      {
        text: "Galerie",
        onPress: async () => {
          const uri = await pickImage();
          if (uri) {
            Alert.alert("Erfolg", "Foto wurde hinzugefügt");
          }
        },
      },
      { text: "Abbrechen", style: "cancel" },
    ]);
  };

  const handlePhotoPress = (photo: Photo) => {
    Alert.alert(
      photo.petName,
      `Aufgenommen am ${new Date(photo.date).toLocaleDateString("de-DE")}`,
      [
        {
          text: "Teilen",
          onPress: () => Alert.alert("Teilen", "Foto wird geteilt..."),
        },
        {
          text: "Löschen",
          style: "destructive",
          onPress: () => {
            setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
          },
        },
        { text: "Schließen", style: "cancel" },
      ]
    );
  };

  const handleSlideshow = () => {
    Alert.alert("Diashow", "Diashow-Funktion wird bald verfügbar sein");
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20, paddingHorizontal: 16 }}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
            <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.backButton, { opacity: pressed ? 0.7 : 1 }]}>
                <IconSymbol name="chevron.left" size={24} color="#D4A843" />
            </Pressable>
            <View>
                <Text style={styles.headerTitle}>FOTOALBUM</Text>
                <Text style={styles.headerSubtitle}>Ihre schönsten Momente</Text>
                <View style={styles.headerDivider} />
            </View>
            <Pressable onPress={handleAddPhoto} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }, styles.addButton]}>
                <IconSymbol name="plus" size={22} color="#0A0A0F" />
            </Pressable>
        </View>

        {/* Stats */}
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Übersicht</Text>
            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{photos.length}</Text>
                    <Text style={styles.statLabel}>Fotos</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{pets.length}</Text>
                    <Text style={styles.statLabel}>Tiere</Text>
                </View>
                <Pressable onPress={handleSlideshow} style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.8 : 1 }]}>
                    <View style={[styles.statCard, { alignItems: 'center', justifyContent: 'center'}]}>
                        <IconSymbol name="play.fill" size={20} color="#D4A843" />
                        <Text style={[styles.statLabel, {color: '#D4A843', marginTop: 4}]}>Diashow</Text>
                    </View>
                </Pressable>
            </View>
        </View>

        {/* Filter */}
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Filter</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                <Pressable onPress={() => setSelectedPet(null)} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
                    <View style={[styles.filterButton, selectedPet === null && styles.filterButtonActive]}>
                        <Text style={[styles.filterButtonText, selectedPet === null && styles.filterButtonTextActive]}>Alle</Text>
                    </View>
                </Pressable>
                {pets.map((pet) => (
                    <Pressable key={pet.id} onPress={() => setSelectedPet(pet.id.toString())} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
                        <View style={[styles.filterButton, selectedPet === pet.id.toString() && styles.filterButtonActive]}>
                            <Text style={[styles.filterButtonText, selectedPet === pet.id.toString() && styles.filterButtonTextActive]}>{pet.name}</Text>
                        </View>
                    </Pressable>
                ))}
            </ScrollView>
        </View>

        {/* Photo Grid */}
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Galerie</Text>
            {filteredPhotos.length === 0 ? (
                <View style={[styles.card, styles.emptyStateContainer]}>
                    <IconSymbol name="photo.on.rectangle.angled" size={32} color="#6B6B6B" />
                    <Text style={styles.emptyStateText}>Keine Fotos gefunden</Text>
                    <Text style={styles.emptyStateSubText}>Fügen Sie neue Bilder über die Plus-Schaltfläche hinzu.</Text>
                </View>
            ) : (
                <View style={styles.photoGridContainer}>
                    {filteredPhotos.map((photo) => (
                        <Pressable key={photo.id} onPress={() => handlePhotoPress(photo)} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1, width: imageSize, height: imageSize })}>
                            <Image source={{ uri: photo.uri }} style={styles.photoImage} resizeMode="cover" />
                            <View style={styles.photoOverlay}>
                                <Text style={styles.photoPetName}>{photo.petName}</Text>
                            </View>
                        </Pressable>
                    ))}
                </View>
            )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0F",
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 16,
  },
  backButton: {
    position: 'absolute',
    left: -8, // Visually align chevron
    top: 12,
    zIndex: 1,
  },
  headerTitle: {
    color: "#FAFAF8",
    fontSize: 22,
    fontWeight: "300",
    letterSpacing: 2,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  headerSubtitle: {
    color: "#6B6B6B",
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
  headerDivider: {
    width: 40,
    height: 1,
    backgroundColor: "#D4A843",
    alignSelf: 'center',
    marginTop: 8,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D4A843',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: "#D4A843",
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  card: {
    backgroundColor: "#141418",
    borderWidth: 1,
    borderColor: "rgba(212, 168, 67, 0.08)",
    borderRadius: 16,
    padding: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#141418",
    borderWidth: 1,
    borderColor: "rgba(212, 168, 67, 0.08)",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  statValue: {
    color: "#FAFAF8",
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statLabel: {
    color: "#8B8B80",
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#141418",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(212, 168, 67, 0.08)",
  },
  filterButtonActive: {
    backgroundColor: "#D4A843",
    borderColor: "#D4A843",
  },
  filterButtonText: {
    color: "#FAFAF8",
    fontWeight: "500",
  },
  filterButtonTextActive: {
    color: "#0A0A0F",
  },
  photoGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  photoImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  photoPetName: {
    color: "#FAFAF8",
    fontSize: 10,
    fontWeight: "bold",
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    color: "#8B8B80",
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
  },
  emptyStateSubText: {
    color: "#6B6B6B",
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: '80%',
  },
});
