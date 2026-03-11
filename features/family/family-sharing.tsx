import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

interface FamilyMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "parent" | "child" | "vet" | "staff";
  joinedDate: string;
}

const ROLE_LABELS = {
  owner: "Besitzer",
  parent: "Eltern",
  child: "Kind",
  vet: "Tierarzt",
  staff: "Mitarbeiter",
};

const ROLE_COLORS = {
  owner: "#1E5A96",
  parent: "#3498DB",
  child: "#2ECC71",
  vet: "#E74C3C",
  staff: "#F39C12",
};

export default function FamilySharingScreen() {
  const colors = useColors();
  const [members, setMembers] = useState<FamilyMember[]>([
    {
      id: "1",
      name: "Du",
      email: "du@example.de",
      role: "owner",
      joinedDate: "2026-03-06",
    },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState<{
    name: string;
    email: string;
    role: FamilyMember["role"];
  }>({
    name: "",
    email: "",
    role: "parent",
  });

  const handleAddMember = () => {
    if (!newMember.name || !newMember.email) {
      Alert.alert("Fehler", "Bitte fülle alle Felder aus");
      return;
    }

    const member: FamilyMember = {
      id: Date.now().toString(),
      name: newMember.name,
      email: newMember.email,
      role: newMember.role,
      joinedDate: new Date().toISOString().split("T")[0],
    };

    setMembers([...members, member]);
    setNewMember({ name: "", email: "", role: "parent" });
    setShowAddForm(false);
    Alert.alert("Erfolg", `${newMember.name} wurde eingeladen`);
  };

  const handleRemoveMember = (id: string) => {
    if (id === "1") {
      Alert.alert("Fehler", "Du kannst dich selbst nicht entfernen");
      return;
    }
    setMembers(members.filter((m) => m.id !== id));
  };

  const handleChangeRole = (id: string, newRole: FamilyMember["role"]) => {
    if (id === "1") {
      Alert.alert("Info", "Du kannst deine eigene Rolle nicht ändern");
      return;
    }
    setMembers(
      members.map((m) => (m.id === id ? { ...m, role: newRole } : m))
    );
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="pb-6">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground mb-2">
            Familien-Freigabe
          </Text>
          <Text className="text-muted">
            Verwalte wer auf dein Haustier-Profil zugreifen kann
          </Text>
        </View>

        {/* Family Members List */}
        <View className="bg-surface rounded-lg border border-border overflow-hidden mb-6">
          <FlatList
            data={members}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <View
                className={`p-4 ${index !== members.length - 1 ? "border-b border-border" : ""}`}
              >
                <View className="flex-row justify-between items-start gap-3">
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-foreground">
                      {item.name}
                    </Text>
                    <Text className="text-sm text-muted mb-2">{item.email}</Text>
                    <View className="flex-row gap-2 items-center">
                      <View
                        className="px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: ROLE_COLORS[item.role] + "20",
                        }}
                      >
                        <Text
                          className="text-xs font-semibold"
                          style={{ color: ROLE_COLORS[item.role] }}
                        >
                          {ROLE_LABELS[item.role]}
                        </Text>
                      </View>
                      <Text className="text-xs text-muted">
                        Beigetreten: {item.joinedDate}
                      </Text>
                    </View>
                  </View>

                  {item.id !== "1" && (
                    <TouchableOpacity
                      onPress={() => handleRemoveMember(item.id)}
                      className="p-2"
                    >
                      <IconSymbol
                        name="xmark.circle.fill"
                        size={24}
                        color={colors.error}
                      />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Role Selector */}
                {item.id !== "1" && (
                  <View className="mt-3 flex-row gap-2 flex-wrap">
                    {(
                      Object.entries(ROLE_LABELS) as [
                        FamilyMember["role"],
                        string
                      ][]
                    ).map(([role, label]) => (
                      <TouchableOpacity
                        key={role}
                        onPress={() => handleChangeRole(item.id, role)}
                        className={`px-3 py-1 rounded-full ${
                          item.role === role
                            ? "border-2"
                            : "border border-border"
                        }`}
                        style={{
                          borderColor: ROLE_COLORS[role],
                          backgroundColor:
                            item.role === role
                              ? ROLE_COLORS[role] + "20"
                              : "transparent",
                        }}
                      >
                        <Text
                          className="text-xs font-semibold"
                          style={{
                            color:
                              item.role === role
                                ? ROLE_COLORS[role]
                                : colors.muted,
                          }}
                        >
                          {label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}
          />
        </View>

        {/* Add Member Form */}
        {showAddForm ? (
          <View className="bg-surface rounded-lg border border-border p-4 mb-6 gap-3">
            <Text className="text-lg font-semibold text-foreground">
              Familienmitglied hinzufügen
            </Text>

            <View>
              <Text className="text-sm text-muted mb-1">Name</Text>
              <TextInput
                className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                placeholder="Name"
                value={newMember.name}
                onChangeText={(text) =>
                  setNewMember({ ...newMember, name: text })
                }
                placeholderTextColor={colors.muted}
              />
            </View>

            <View>
              <Text className="text-sm text-muted mb-1">E-Mail</Text>
              <TextInput
                className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                placeholder="email@example.de"
                value={newMember.email}
                onChangeText={(text) =>
                  setNewMember({ ...newMember, email: text })
                }
                keyboardType="email-address"
                placeholderTextColor={colors.muted}
              />
            </View>

            <View>
              <Text className="text-sm text-muted mb-2">Rolle</Text>
              <View className="flex-row gap-2 flex-wrap">
                    {(
                      Object.entries(ROLE_LABELS).filter(
                        ([role]) => role !== "owner"
                      ) as [FamilyMember["role"], string][]
                    ).map(([role, label]) => (
                      <TouchableOpacity
                        key={role}
                        onPress={() =>
                          setNewMember({ ...newMember, role: role as FamilyMember["role"] })
                        }
                    className={`px-3 py-1 rounded-full ${
                      newMember.role === role
                        ? "border-2"
                        : "border border-border"
                    }`}
                    style={{
                      borderColor: ROLE_COLORS[role],
                      backgroundColor:
                        newMember.role === role
                          ? ROLE_COLORS[role] + "20"
                          : "transparent",
                    }}
                  >
                    <Text
                      className="text-xs font-semibold"
                      style={{
                        color:
                          newMember.role === role
                            ? ROLE_COLORS[role]
                            : colors.muted,
                      }}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="flex-row gap-2 mt-2">
              <TouchableOpacity
                className="flex-1 bg-surface border border-border rounded-lg py-2 items-center"
                onPress={() => setShowAddForm(false)}
              >
                <Text className="text-foreground font-semibold">Abbrechen</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-primary rounded-lg py-2 items-center"
                onPress={handleAddMember}
              >
                <Text className="text-background font-semibold">Hinzufügen</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            className="bg-primary rounded-lg py-3 items-center mb-6"
            onPress={() => setShowAddForm(true)}
          >
            <View className="flex-row items-center gap-2">
              <IconSymbol name="plus.circle.fill" size={20} color="#ffffff" />
              <Text className="text-background font-semibold">
                Familienmitglied hinzufügen
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Info Box */}
        <View className="bg-info/10 border border-info rounded-lg p-4">
          <Text className="text-sm text-info font-semibold mb-2">
            ℹ️ Rollen-Erklärung
          </Text>
          <Text className="text-xs text-info leading-relaxed">
            <Text className="font-semibold">Besitzer:</Text> Vollständiger Zugriff
            {"\n"}
            <Text className="font-semibold">Eltern:</Text> Alle Funktionen
            {"\n"}
            <Text className="font-semibold">Kind:</Text> Begrenzte Funktionen
            {"\n"}
            <Text className="font-semibold">Tierarzt:</Text> Nur Gesundheitsdaten
            {"\n"}
            <Text className="font-semibold">Mitarbeiter:</Text> Nur Aktivitäten
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
