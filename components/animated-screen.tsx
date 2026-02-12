import { useEffect } from "react";
import { ViewProps } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  FadeIn,
} from "react-native-reanimated";

interface AnimatedScreenProps extends ViewProps {
  children: React.ReactNode;
  delay?: number;
}

/**
 * Wraps screen content with a subtle fade-in + slide-up animation.
 * Duration: 250ms, subtle translateY of 12px.
 */
export function AnimatedScreen({ children, delay = 0, style, ...props }: AnimatedScreenProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(12);

  useEffect(() => {
    const timeout = setTimeout(() => {
      opacity.value = withTiming(1, {
        duration: 280,
        easing: Easing.out(Easing.cubic),
      });
      translateY.value = withTiming(0, {
        duration: 280,
        easing: Easing.out(Easing.cubic),
      });
    }, delay);
    return () => clearTimeout(timeout);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle, style]} {...props}>
      {children}
    </Animated.View>
  );
}

/**
 * Staggered animation for list items.
 * Each item fades in with a slight delay after the previous one.
 */
export function AnimatedListItem({
  children,
  index,
  style,
  ...props
}: ViewProps & { children: React.ReactNode; index: number }) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);

  useEffect(() => {
    const timeout = setTimeout(() => {
      opacity.value = withTiming(1, {
        duration: 250,
        easing: Easing.out(Easing.cubic),
      });
      translateY.value = withTiming(0, {
        duration: 250,
        easing: Easing.out(Easing.cubic),
      });
    }, 80 + index * 60);
    return () => clearTimeout(timeout);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]} {...props}>
      {children}
    </Animated.View>
  );
}

/**
 * Animated section header with gold divider reveal.
 */
export function AnimatedSection({
  children,
  delay = 0,
  style,
  ...props
}: ViewProps & { children: React.ReactNode; delay?: number }) {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(-8);

  useEffect(() => {
    const timeout = setTimeout(() => {
      opacity.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
      translateX.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
    }, delay);
    return () => clearTimeout(timeout);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]} {...props}>
      {children}
    </Animated.View>
  );
}
