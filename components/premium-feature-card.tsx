import { View, Text, Pressable, type ViewProps } from 'react-native';
import { cn } from '@/lib/utils';

export interface PremiumFeatureCardProps extends ViewProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  color: string; // Hex color for gradient background
  onPress?: () => void;
  disabled?: boolean;
  disclaimer?: string;
}

/**
 * Premium Feature Card - Used in redesigned dashboard
 * - Colored gradient background
 * - High contrast text
 * - No emojis, professional design
 * - Optional disclaimer text
 */
export function PremiumFeatureCard({
  title,
  subtitle,
  icon,
  color,
  onPress,
  disabled = false,
  disclaimer,
  className,
  ...props
}: PremiumFeatureCardProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          opacity: pressed && !disabled ? 0.8 : 1,
          transform: [{ scale: pressed && !disabled ? 0.98 : 1 }],
        },
      ]}
    >
      <View
        className={cn(
          'rounded-2xl p-6 mb-4 border border-gray-700',
          disabled && 'opacity-50',
          className
        )}
        style={{
          backgroundColor: color,
          shadowColor: color,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 5,
        }}
        {...props}
      >
        {/* Icon if provided */}
        {icon && <View className="mb-3">{icon}</View>}

        {/* Title */}
        <Text className="text-2xl font-bold text-white mb-1">{title}</Text>

        {/* Subtitle */}
        {subtitle && (
          <Text className="text-sm text-gray-100 opacity-90 mb-3">{subtitle}</Text>
        )}

        {/* Disclaimer */}
        {disclaimer && (
          <View className="mt-3 pt-3 border-t border-white border-opacity-20">
            <Text className="text-xs text-gray-100 opacity-75">{disclaimer}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}
