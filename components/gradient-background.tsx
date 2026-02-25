import React from 'react';
import { View, type ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { ColorValue } from 'react-native';

interface GradientBackgroundProps extends ViewProps {
  children?: React.ReactNode;
  intensity?: 'light' | 'medium' | 'dark';
}

/**
 * Gradient Background Component
 * Provides the blue gradient background for Planypet
 * Gradient: Navy Blue (#001F3F) → Dodger Blue (#1E90FF)
 */
export function GradientBackground({
  children,
  intensity = 'medium',
  style,
  ...props
}: GradientBackgroundProps) {
  const gradients: Record<'light' | 'medium' | 'dark', { colors: [ColorValue, ColorValue]; start: { x: number; y: number }; end: { x: number; y: number } }> = {
    light: {
      colors: ['#1E40AF', '#60A5FA'],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    medium: {
      colors: ['#1E3A8A', '#3B82F6'],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    dark: {
      colors: ['#001F3F', '#1E40AF'],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
  }

  const gradient = gradients[intensity];

  return (
    <LinearGradient
      colors={gradient.colors}
      start={gradient.start}
      end={gradient.end}
      style={[{ flex: 1 }, style]}
      {...props}
    >
      {children}
    </LinearGradient>
  );
}
