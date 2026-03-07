import { Pressable, StyleSheet, Platform } from "react-native";
import { router } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function AIAssistantFAB() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const scale = useSharedValue(1);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    scale.value = withSequence(
      withTiming(0.9, { duration: 80 }),
      withTiming(1, { duration: 150 })
    );
    router.push("/ai-advisor" as any);
  };

  return (
    <Animated.View style={[s.container, { bottom: 80 + insets.bottom }, buttonStyle]}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          s.button,
          { backgroundColor: colors.primary },
          pressed && { opacity: 0.8 },
        ]}
      >
        <IconSymbol name="pawprint.fill" size={26} color="#ffffff" />
      </Pressable>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  container: {
    position: "absolute",
    right: 20,
    zIndex: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: 58,
    height: 58,
    borderRadius: 29,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
