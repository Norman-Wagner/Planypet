import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  FlatList,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";

interface Device {
  id: string;
  name: string;
  type: string;
  status: "online" | "offline";
  battery: number;
  lastActivity: string;
  location?: string;
}

export default function SmartDevicesScreen() {
  const insets = useSafeAreaInsets();
  const [devices, setDevices] = useState<Device[]>([
    {
      id: "1",
      name: "AirTag Luna",
      type: "GPS-Tracker",
      status: "online",
      battery: 92,
      lastActivity: "Gerade eben",
      location: "Park, 50m entfernt",
    },
    {
      id: "2",
      name: "Fütterautomat Max",
      type: "Fütterautomat",
      status: "online",
      battery: 78,
      lastActivity: "vor 2h",
      location: "Zuhause",
    },
    {
      id: "3",
      name: "Kamera Wohnzimmer",
      type: "Überwachungskamera",
      status: "online",
      battery: 100,
      lastActivity: "Liveübertragung",
    },
    {
      id: "4",
      name: "Wasserschüssel Sensor",
      type: "Wassersensor",
      status: "offline",
      battery: 15,
      lastActivity: "vor 6h",
    },
  ]);

  const handleDevicePress = (device: Device) => {
    Alert.alert(device.name, `Status: ${device.status}\nBatterie: ${device.battery}%`);
  };

  const handleRemoveDevice = (deviceId: string) => {
    Alert.alert(
      "Gerät entfernen",
      "Möchten Sie dieses Gerät wirklich entfernen?",
      [
        { text: "Abbrechen", onPress: () => {} },
        {
          text: "Entfernen",
          onPress: () => {
            setDevices(devices.filter((d) => d.id !== deviceId));
          },
        },
      ]
    );
  };

  const renderDevice = ({ item }: { item: Device }) => (
    <Pressable
      onPress={() => handleDevicePress(item)}
      className="bg-white/10 rounded-2xl p-4 border border-white/20 mb-3"
    >
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-row items-center gap-3 flex-1">
          <View className="w-12 h-12 bg-white/20 rounded-lg items-center justify-center">
            <IconSymbol
              size={24}
              name={
                item.type === "GPS-Tracker"
                  ? "location.fill"
                  : item.type === "Fütterautomat"
                    ? "fork.knife"
                    : item.type === "Überwachungskamera"
                      ? "video.fill"
                      : "drop.fill"
              }
              color="#FFFFFF"
            />
          </View>
          <View className="flex-1">
            <Text className="text-white font-bold">{item.name}</Text>
            <Text className="text-white/60 text-xs">{item.type}</Text>
          </View>
        </View>
        <View
          className={`w-3 h-3 rounded-full ${
            item.status === "online" ? "bg-green-500" : "bg-red-500"
          }`}
        />
      </View>

      <View className="gap-2 mb-3">
        {/* Battery */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <IconSymbol size={14} name="battery.25" color="#FFFFFF" />
            <Text className="text-white/70 text-xs">Batterie</Text>
          </View>
          <Text className="text-white font-semibold text-sm">{item.battery}%</Text>
        </View>

        {/* Last Activity */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <IconSymbol size={14} name="clock.fill" color="#FFFFFF" />
            <Text className="text-white/70 text-xs">Letzte Aktivität</Text>
          </View>
          <Text className="text-white/80 text-xs">{item.lastActivity}</Text>
        </View>

        {/* Location */}
        {item.location && (
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <IconSymbol size={14} name="location.fill" color="#FFFFFF" />
              <Text className="text-white/70 text-xs">Standort</Text>
            </View>
            <Text className="text-white/80 text-xs">{item.location}</Text>
          </View>
        )}
      </View>

      {/* Battery Warning */}
      {item.battery < 20 && (
        <View className="bg-red-500/20 rounded-lg p-2 mb-3 flex-row items-center gap-2">
          <IconSymbol size={14} name="exclamationmark.triangle.fill" color="#FF6B6B" />
          <Text className="text-red-200 text-xs">Batterie schwach</Text>
        </View>
      )}

      {/* Action Buttons */}
      <View className="flex-row gap-2">
        <Pressable className="flex-1 py-2 rounded-lg bg-white/20 items-center justify-center">
          <Text className="text-white text-xs font-semibold">Details</Text>
        </Pressable>
        <Pressable
          onPress={() => handleRemoveDevice(item.id)}
          className="flex-1 py-2 rounded-lg bg-red-500/20 border border-red-400/50 items-center justify-center"
        >
          <Text className="text-red-200 text-xs font-semibold">Entfernen</Text>
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <LinearGradient
      colors={["#1A3A52", "#0F2438"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 100,
          paddingHorizontal: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-8">
          <View>
            <Text className="text-white text-sm font-medium opacity-80">
              Verbundene Geräte
            </Text>
            <Text className="text-white text-2xl font-bold">Smart-Geräte</Text>
          </View>
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
          >
            <IconSymbol size={20} name="xmark" color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Overview Stats */}
        <View className="gap-3 mb-6">
          <View className="flex-row gap-3">
            <View className="flex-1 bg-white/10 rounded-2xl p-4 border border-white/20">
              <Text className="text-white/70 text-xs mb-1">Aktive Geräte</Text>
              <Text className="text-white font-bold text-2xl">
                {devices.filter((d) => d.status === "online").length}
              </Text>
            </View>
            <View className="flex-1 bg-white/10 rounded-2xl p-4 border border-white/20">
              <Text className="text-white/70 text-xs mb-1">Gesamt</Text>
              <Text className="text-white font-bold text-2xl">
                {devices.length}
              </Text>
            </View>
          </View>
        </View>

        {/* Devices List */}
        <View className="mb-6">
          <Text className="text-white font-bold text-lg mb-3">Geräte</Text>
          <FlatList
            data={devices}
            renderItem={renderDevice}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Add Device Button */}
        <Pressable className="py-4 rounded-2xl items-center justify-center mb-6">
          <LinearGradient
            colors={["rgba(255,255,255,0.3)", "rgba(255,255,255,0.1)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: "100%",
              paddingVertical: 16,
              borderRadius: 16,
              alignItems: "center",
            }}
          >
            <View className="flex-row items-center gap-2">
              <IconSymbol size={20} name="plus" color="#FFFFFF" />
              <Text className="text-white font-bold text-lg">
                Gerät hinzufügen
              </Text>
            </View>
          </LinearGradient>
        </Pressable>

        {/* Device Types Info */}
        <View className="bg-white/10 rounded-2xl p-4 border border-white/20 mb-6">
          <Text className="text-white font-semibold mb-3">Unterstützte Geräte</Text>
          <View className="gap-2">
            {[
              "GPS-Tracker (AirTag, Tile)",
              "Fütterautomaten",
              "Überwachungskameras",
              "Wassersensoren",
              "Aktivitätstracker",
            ].map((device, idx) => (
              <View key={idx} className="flex-row gap-2">
                <Text className="text-white/60">•</Text>
                <Text className="text-white/80 text-xs flex-1">{device}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Liability Disclaimer */}
        <View className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <Text className="text-white/60 text-xs leading-relaxed">
            <Text className="font-semibold">Datenschutz:</Text> Alle Geräte
            werden verschlüsselt verbunden. Ihre Standortdaten werden nicht mit
            Dritten geteilt.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
