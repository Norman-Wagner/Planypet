import { ScrollView, Text, View, Pressable, Image, Dimensions, Alert } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { GlassCard } from "@/components/ui/glass-card";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { usePetStore } from "@/lib/pet-store";
import { useImagePicker } from "@/hooks/use-image-picker";

const { width } = Dimensions.get("window");
const imageSize = (width - 60) / 3; // 3 columns with padding

interface Photo {
  id: string;
  uri: string;
  petId: string;
  petName: string;
  date: string;
}

export default function PhotoAlbumScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { pets } = usePetStore();
  const { pickImage, takePhoto } = useImagePicker();
  
  const [selectedPet, setSelectedPet] = useState<string | null>(null);
  
  // Mock data - in real app, this would be stored in pet store
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
    Alert.alert(
      "Foto hinzufügen",
      "Wähle eine Option",
      [
        { text: "Kamera", onPress: async () => {
          const uri = await takePhoto();
          if (uri) {
            // Add photo logic
            Alert.alert("Erfolg", "Foto wurde hinzugefügt");
          }
        }},
        { text: "Galerie", onPress: async () => {
          const uri = await pickImage();
          if (uri) {
            // Add photo logic
            Alert.alert("Erfolg", "Foto wurde hinzugefügt");
          }
        }},
        { text: "Abbrechen", style: "cancel" },
      ]
    );
  };

  const handlePhotoPress = (photo: Photo) => {
    Alert.alert(
      photo.petName,
      `Aufgenommen am ${new Date(photo.date).toLocaleDateString("de-DE")}`,
      [
        { text: "Teilen", onPress: () => Alert.alert("Teilen", "Foto wird geteilt...") },
        { text: "Löschen", style: "destructive", onPress: () => {
          setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
        }},
        { text: "Schließen", style: "cancel" },
      ]
    );
  };

  const handleSlideshow = () => {
    Alert.alert("Diashow", "Diashow-Funktion wird bald verfügbar sein");
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center flex-1">
            <Pressable
              onPress={() => router.back()}
              className="mr-4"
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              <IconSymbol name="chevron.left" size={28} color={colors.primary} />
            </Pressable>
            <Text className="text-3xl font-bold text-foreground">Fotoalbum</Text>
          </View>
          <Pressable
            onPress={handleAddPhoto}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <View className="w-10 h-10 rounded-full bg-primary items-center justify-center">
              <Text className="text-white text-2xl font-bold">+</Text>
            </View>
          </Pressable>
        </View>

        {/* Stats */}
        <View className="flex-row gap-3 mb-6">
          <GlassCard className="flex-1 items-center py-3">
            <Text className="text-2xl font-bold text-foreground">{photos.length}</Text>
            <Text className="text-muted text-sm">Fotos</Text>
          </GlassCard>
          <GlassCard className="flex-1 items-center py-3">
            <Text className="text-2xl font-bold text-foreground">{pets.length}</Text>
            <Text className="text-muted text-sm">Tiere</Text>
          </GlassCard>
          <Pressable
            onPress={handleSlideshow}
            className="flex-1"
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
          >
            <GlassCard className="items-center py-3 bg-primary/10">
              <IconSymbol name="play.fill" size={24} color={colors.primary} />
              <Text className="text-primary text-sm font-medium mt-1">Diashow</Text>
            </GlassCard>
          </Pressable>
        </View>

        {/* Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="mb-6"
          contentContainerStyle={{ gap: 8 }}
        >
          <Pressable
            onPress={() => setSelectedPet(null)}
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
          >
            <View
              className={`px-4 py-2 rounded-full ${
                selectedPet === null ? "bg-primary" : "bg-surface"
              }`}
            >
              <Text
                className={`font-medium ${
                  selectedPet === null ? "text-white" : "text-foreground"
                }`}
              >
                Alle
              </Text>
            </View>
          </Pressable>
          {pets.map((pet) => (
            <Pressable
              key={pet.id}
              onPress={() => setSelectedPet(pet.id.toString())}
              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
            >
              <View
                className={`px-4 py-2 rounded-full ${
                  selectedPet === pet.id.toString() ? "bg-primary" : "bg-surface"
                }`}
              >
                <Text
                  className={`font-medium ${
                    selectedPet === pet.id.toString() ? "text-white" : "text-foreground"
                  }`}
                >
                  {pet.name}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {/* Photo Grid */}
        {filteredPhotos.length === 0 ? (
          <GlassCard className="p-8 items-center">
            <IconSymbol name="photo.fill" size={48} color={colors.muted} />
            <Text className="text-muted text-center mt-4">
              Noch keine Fotos vorhanden
            </Text>
            <Text className="text-muted text-center text-sm mt-2">
              Tippe auf das + Symbol, um Fotos hinzuzufügen
            </Text>
          </GlassCard>
        ) : (
          <View className="flex-row flex-wrap gap-2">
            {filteredPhotos.map((photo) => (
              <Pressable
                key={photo.id}
                onPress={() => handlePhotoPress(photo)}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.8 : 1,
                  width: imageSize,
                  height: imageSize,
                })}
              >
                <Image
                  source={{ uri: photo.uri }}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 12,
                  }}
                  resizeMode="cover"
                />
                <View
                  className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded-full"
                >
                  <Text className="text-white text-xs font-medium">
                    {photo.petName}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
