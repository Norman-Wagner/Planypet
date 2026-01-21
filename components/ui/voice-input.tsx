import { useState } from "react";
import { View, Text, Pressable, Platform, ActivityIndicator } from "react-native";
import * as Haptics from "expo-haptics";
import { useAudioRecorder, AudioModule } from "expo-audio";
import { IconSymbol } from "./icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  placeholder?: string;
}

export function VoiceInput({ onTranscript, placeholder = "Tippe zum Sprechen" }: VoiceInputProps) {
  const colors = useColors();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recording, setRecording] = useState<any>(null);

  const startRecording = async () => {
    try {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      // Request permissions
      const permission = await AudioModule.requestRecordingPermissionsAsync();
      if (!permission.granted) {
        alert("Mikrofon-Berechtigung erforderlich");
        return;
      }

      // Set audio mode
      await AudioModule.setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      // Start recording
      const newRecording = await AudioModule.startRecordingAsync();

      setRecording(newRecording);
      setIsRecording(true);
    } catch (error) {
      console.error("Failed to start recording:", error);
      alert("Aufnahme konnte nicht gestartet werden");
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      setIsProcessing(true);

      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      if (uri) {
        // In a real app, send audio to backend for transcription
        // For now, simulate transcription
        setTimeout(() => {
          const mockTranscript = "Dies ist eine Beispiel-Transkription. In der finalen Version wird hier die echte Sprach-zu-Text-Umwandlung verwendet.";
          onTranscript(mockTranscript);
          setIsProcessing(false);
        }, 1500);
      }

      setRecording(null);
    } catch (error) {
      console.error("Failed to stop recording:", error);
      setIsProcessing(false);
      alert("Aufnahme konnte nicht gestoppt werden");
    }
  };

  return (
    <View className="items-center">
      <Pressable
        onPressIn={startRecording}
        onPressOut={stopRecording}
        disabled={isProcessing}
        style={({ pressed }) => ({
          opacity: pressed || isProcessing ? 0.7 : 1,
          transform: [{ scale: pressed ? 0.95 : 1 }],
        })}
      >
        <View
          className="w-20 h-20 rounded-full items-center justify-center"
          style={{
            backgroundColor: isRecording ? colors.error : colors.primary,
          }}
        >
          {isProcessing ? (
            <ActivityIndicator color="#FFFFFF" size="large" />
          ) : (
            <IconSymbol
              name={isRecording ? "stop.fill" : "mic.fill"}
              size={36}
              color="#FFFFFF"
            />
          )}
        </View>
      </Pressable>

      <Text className="text-muted text-sm mt-3 text-center">
        {isProcessing
          ? "Verarbeite Aufnahme..."
          : isRecording
          ? "Aufnahme läuft..."
          : placeholder}
      </Text>

      {isRecording && (
        <View className="mt-2 flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-error mr-2" />
          <Text className="text-error text-xs font-medium">REC</Text>
        </View>
      )}
    </View>
  );
}
