import { ScrollView, Text, View, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

import { GlassCard } from "@/components/ui/glass-card";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface MenuItemProps {
  icon: string;
  iconColor: string;
  iconBg: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
}

function MenuItem({ icon, iconColor, iconBg, title, subtitle, onPress }: MenuItemProps) {
  const colors = useColors();
  
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] })}
    >
      <GlassCard className="mb-3">
        <View className="flex-row items-center">
          <View 
            className="w-11 h-11 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: iconBg }}
          >
            <IconSymbol name={icon as any} size={22} color={iconColor} />
          </View>
          <View className="flex-1">
            <Text className="text-foreground font-semibold">{title}</Text>
            <Text className="text-muted text-sm">{subtitle}</Text>
          </View>
          <IconSymbol name="chevron.right" size={20} color={colors.muted} />
        </View>
      </GlassCard>
    </Pressable>
  );
}

export default function MoreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1">
      {/* Gradient Background */}
      <LinearGradient
        colors={["#0066CC", "#00A3FF", "#F0F7FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 0.6 }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />
      
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ 
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 100,
          paddingHorizontal: 20,
        }}
      >
        {/* Header */}
        <View className="mb-6">
          <Text className="text-white text-2xl font-bold">Mehr</Text>
          <Text className="text-white/70 text-base">Einstellungen & Features</Text>
        </View>

        {/* Features Section */}
        <Text className="text-foreground text-lg font-semibold mb-3">
          Features
        </Text>

        <MenuItem
          icon="location.fill"
          iconColor={colors.primary}
          iconBg="rgba(0, 102, 204, 0.15)"
          title="GPS-Tracking"
          subtitle="Gassi-Routen aufzeichnen"
          onPress={() => router.push("/gps-history")}
        />

        <MenuItem
          icon="cube.box.fill"
          iconColor={colors.warning}
          iconBg="rgba(245, 158, 11, 0.15)"
          title="Vorräte"
          subtitle="Futter & Zubehör verwalten"
          onPress={() => router.push("/supplies")}
        />

        <MenuItem
          icon="cart.fill"
          iconColor={colors.success}
          iconBg="rgba(16, 185, 129, 0.15)"
          title="Shop"
          subtitle="Tierbedarf kaufen"
        />

        <MenuItem
          icon="person.2.fill"
          iconColor="#8B5CF6"
          iconBg="rgba(139, 92, 246, 0.15)"
          title="Tierbetreuung"
          subtitle="Tiersitter & Pensionen finden"
        />

        <MenuItem
          icon="photo.fill"
          iconColor="#EC4899"
          iconBg="rgba(236, 72, 153, 0.15)"
          title="Fotoalbum"
          subtitle="Bilder deiner Haustiere"
        />

        {/* Emergency Section */}
        <Text className="text-foreground text-lg font-semibold mb-3 mt-4">
          Notfall
        </Text>

        <MenuItem
          icon="exclamationmark.triangle.fill"
          iconColor={colors.error}
          iconBg="rgba(239, 68, 68, 0.15)"
          title="Tier vermisst"
          subtitle="Schnelle Hilfe bei Vermissung"
          onPress={() => router.push("/emergency")}
        />

        <MenuItem
          icon="exclamationmark.triangle.fill"
          iconColor="#F59E0B"
          iconBg="rgba(245, 158, 11, 0.15)"
          title="Giftköder-Warnungen"
          subtitle="Gefahren in deiner Nähe"
          onPress={() => router.push("/emergency")}
        />

        <MenuItem
          icon="phone.fill"
          iconColor={colors.primary}
          iconBg="rgba(0, 102, 204, 0.15)"
          title="Notfallkontakte"
          subtitle="Tierärzte & Tierkliniken"
          onPress={() => router.push("/emergency")}
        />

        {/* Settings Section */}
        <Text className="text-foreground text-lg font-semibold mb-3 mt-4">
          Einstellungen
        </Text>

        <MenuItem
          icon="person.fill"
          iconColor={colors.muted}
          iconBg="rgba(100, 116, 139, 0.15)"
          title="Profil"
          subtitle="Deine Daten bearbeiten"
        />

        <MenuItem
          icon="person.2.fill"
          iconColor={colors.primary}
          iconBg="rgba(0, 102, 204, 0.15)"
          title="Familie & Sharing"
          subtitle="Tiere mit anderen teilen"
        />

        <MenuItem
          icon="bell.fill"
          iconColor={colors.warning}
          iconBg="rgba(245, 158, 11, 0.15)"
          title="Benachrichtigungen"
          subtitle="Push-Erinnerungen einstellen"
        />

        <MenuItem
          icon="gearshape.fill"
          iconColor={colors.muted}
          iconBg="rgba(100, 116, 139, 0.15)"
          title="App-Einstellungen"
          subtitle="Theme, Sprache, Export"
          onPress={() => router.push("/settings")}
        />

        {/* Legal Section */}
        <Text className="text-foreground text-lg font-semibold mb-3 mt-4">
          Rechtliches
        </Text>

        <MenuItem
          icon="doc.text.fill"
          iconColor={colors.muted}
          iconBg="rgba(100, 116, 139, 0.15)"
          title="Impressum"
          subtitle="Angaben gemäß § 5 TMG"
          onPress={() => router.push("/legal/impressum")}
        />

        <MenuItem
          icon="shield.fill"
          iconColor={colors.primary}
          iconBg="rgba(0, 102, 204, 0.15)"
          title="Datenschutzerklärung"
          subtitle="DSGVO-konforme Datenschutzhinweise"
          onPress={() => router.push("/legal/privacy")}
        />

        <MenuItem
          icon="doc.text.fill"
          iconColor={colors.muted}
          iconBg="rgba(100, 116, 139, 0.15)"
          title="AGB"
          subtitle="Allgemeine Geschäftsbedingungen"
          onPress={() => router.push("/legal/terms")}
        />

        {/* App Info */}
        <View className="items-center mt-8 mb-4">
          <Text className="text-muted text-sm">Planypet by Wagnerconnect</Text>
          <Text className="text-muted text-xs mt-1">Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}
