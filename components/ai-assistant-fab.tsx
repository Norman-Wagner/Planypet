import { Pressable, StyleSheet, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function AIAssistantFAB() {
  const insets = useSafeAreaInsets();
  const glow = useSharedValue(0.6);
  const scale = useSharedValue(1);

  useEffect(() => {
    glow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.6, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
    transform: [{ scale: 1 + glow.value * 0.08 }],
  }));

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
    router.push("/ai-chat");
  };

  return (
    <Animated.View style={[s.container, { bottom: 80 + insets.bottom }, buttonStyle]}>
      <Animated.View style={[s.glowRing, glowStyle]} />
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [s.button, pressed && { opacity: 0.9 }]}
      >
        <LinearGradient
          colors={["#D4A843", "#B8860B"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.gradient}
        >
          <IconSymbol name="crown.fill" size={26} color="#0A0A0F" />
        </LinearGradient>
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
  glowRing: {
    position: "absolute",
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(212,168,67,0.15)",
  },
  button: {
    width: 58,
    height: 58,
    borderRadius: 29,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#D4A843",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  gradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
