import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Platform, Alert } from "react-native";

export function useImagePicker() {
  const [isUploading, setIsUploading] = useState(false);

  const requestPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus !== "granted" || mediaStatus !== "granted") {
        Alert.alert(
          "Berechtigung erforderlich",
          "Wir benötigen Zugriff auf deine Kamera und Galerie, um Fotos hochzuladen."
        );
        return false;
      }
    }
    return true;
  };

  const pickImage = async (options?: {
    allowsEditing?: boolean;
    aspect?: [number, number];
    quality?: number;
  }) => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return null;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: options?.allowsEditing ?? true,
        aspect: options?.aspect ?? [4, 3],
        quality: options?.quality ?? 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }

      return null;
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Fehler", "Bild konnte nicht ausgewählt werden");
      return null;
    }
  };

  const takePhoto = async (options?: {
    allowsEditing?: boolean;
    aspect?: [number, number];
    quality?: number;
  }) => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return null;

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: options?.allowsEditing ?? true,
        aspect: options?.aspect ?? [4, 3],
        quality: options?.quality ?? 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }

      return null;
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Fehler", "Foto konnte nicht aufgenommen werden");
      return null;
    }
  };

  const uploadImage = async (uri: string): Promise<string | null> => {
    setIsUploading(true);
    try {
      // In a real app, upload to S3 or your backend
      // For now, return the local URI
      // const formData = new FormData();
      // formData.append('file', {
      //   uri,
      //   type: 'image/jpeg',
      //   name: 'photo.jpg',
      // } as any);
      
      // const response = await fetch('YOUR_UPLOAD_ENDPOINT', {
      //   method: 'POST',
      //   body: formData,
      // });
      
      // const data = await response.json();
      // return data.url;

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      return uri; // Return local URI for now
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Fehler", "Bild konnte nicht hochgeladen werden");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    pickImage,
    takePhoto,
    uploadImage,
    isUploading,
  };
}
