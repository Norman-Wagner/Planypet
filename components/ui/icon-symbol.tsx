// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<string, ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * SF Symbols to Material Icons mappings for Planypet
 */
const MAPPING = {
  // Navigation
  "house.fill": "home",
  "pawprint.fill": "pets",
  "heart.fill": "favorite",
  "gearshape.fill": "settings",
  "plus.circle.fill": "add-circle",
  "chevron.right": "chevron-right",
  "checkmark": "check",
  "xmark": "close",
  "chevron.left": "chevron-left",
  "ellipsis.circle.fill": "more-horiz",
  "bubble.left.fill": "chat-bubble",
  "square.and.arrow.up.fill": "share",
  "icloud.fill": "cloud",
  "arrow.down.doc.fill": "download",
  "arrow.up.doc.fill": "upload",
  
  // Pet actions
  "fork.knife": "restaurant",
  "drop.fill": "water-drop",
  "figure.walk": "directions-walk",
  "location.fill": "location-on",
  "map.fill": "map",
  "clock.fill": "schedule",
  "bell.fill": "notifications",
  
  // Health
  "cross.case.fill": "medical-services",
  "stethoscope": "healing",
  "pill.fill": "medication",
  "syringe.fill": "vaccines",
  "doc.text.fill": "description",
  
  // Media
  "camera.fill": "camera-alt",
  "photo.fill": "photo",
  "mic.fill": "mic",
  "play.fill": "play-arrow",
  "stop.fill": "stop",
  "speaker.wave.3.fill": "volume-up",
  "waveform": "graphic-eq",
  
  // Navigation extended
  "chevron.up": "expand-less",
  "chevron.down": "expand-more",
  
  // Shield
  "shield.fill": "shield",
  
  // Alerts
  "exclamationmark.triangle.fill": "warning",
  "checkmark.circle.fill": "check-circle",
  "info.circle.fill": "info",
  
  // Shopping
  "cart.fill": "shopping-cart",
  "bag.fill": "shopping-bag",
  "cube.box.fill": "inventory",
  
  // Social
  "person.2.fill": "people",
  "person.fill": "person",
  "share.fill": "share",
  
  // Crown / Premium
  "crown.fill": "auto-awesome",
  
  // Misc
  "magnifyingglass": "search",
  "calendar": "event",
  "star.fill": "star",
  "trash.fill": "delete",
  "pencil": "edit",
  "paperplane.fill": "send",
  "phone.fill": "phone",
  "envelope.fill": "email",
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const iconName = MAPPING[name as keyof typeof MAPPING] || "help";
  return <MaterialIcons color={color} size={size} name={iconName} style={style} />;
}
