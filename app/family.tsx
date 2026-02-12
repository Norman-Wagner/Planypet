import { useState } from "react";
import {
  ScrollView, Text, View, Pressable, StyleSheet, TextInput,
  Alert, Platform, Share,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { usePetStore, type FamilyMember, type FamilyRole } from "@/lib/pet-store";

const ROLE_LABELS: Record<FamilyRole, string> = {
  owner: "Besitzer",
  mother: "Mutter",
  father: "Vater",
  child: "Kind",
  partner: "Partner/in",
  boss: "Chef/in",
  employee: "Mitarbeiter/in",
  secretary: "Sekretaer/in",
  foreman: "Vorarbeiter/in",
  caretaker: "Betreuer/in",
  veterinarian: "Tierarzt",
  trainer: "Trainer/in",
  other: "Sonstige",
};

const ROLE_OPTIONS: FamilyRole[] = [
  "owner", "mother", "father", "child", "partner",
  "caretaker", "veterinarian", "trainer", "other",
];

export default function FamilyScreen() {
  const insets = useSafeAreaInsets();
  const { userName, userRole, familyMembers, pets, addFamilyMember, updateFamilyMember, deleteFamilyMember } = usePetStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState<FamilyRole>("partner");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formPermissions, setFormPermissions] = useState({
    canFeed: true,
    canWalk: true,
    canEditHealth: false,
    canOrder: false,
    canManageFamily: false,
  });

  const resetForm = () => {
    setFormName("");
    setFormRole("partner");
    setFormEmail("");
    setFormPhone("");
    setFormPermissions({
      canFeed: true, canWalk: true, canEditHealth: false,
      canOrder: false, canManageFamily: false,
    });
    setShowAddForm(false);
    setEditingId(null);
  };

  const handleSave = () => {
    if (!formName.trim()) {
      Alert.alert("Fehler", "Bitte gib einen Namen ein.");
      return;
    }

    if (editingId) {
      updateFamilyMember(editingId, {
        name: formName.trim(),
        role: formRole,
        email: formEmail.trim() || undefined,
        phone: formPhone.trim() || undefined,
        permissions: formPermissions,
      });
    } else {
      addFamilyMember({
        name: formName.trim(),
        role: formRole,
        email: formEmail.trim() || undefined,
        phone: formPhone.trim() || undefined,
        assignedPets: pets.map((p) => p.id),
        permissions: formPermissions,
      });
    }

    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    resetForm();
  };

  const handleEdit = (member: FamilyMember) => {
    setEditingId(member.id);
    setFormName(member.name);
    setFormRole(member.role);
    setFormEmail(member.email || "");
    setFormPhone(member.phone || "");
    setFormPermissions(member.permissions);
    setShowAddForm(true);
  };

  const handleDelete = (member: FamilyMember) => {
    Alert.alert(
      "Mitglied entfernen",
      `Moechtest du ${member.name} wirklich aus der Familie entfernen?`,
      [
        { text: "Abbrechen", style: "cancel" },
        {
          text: "Entfernen",
          style: "destructive",
          onPress: () => {
            deleteFamilyMember(member.id);
            if (Platform.OS !== "web") {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            }
          },
        },
      ]
    );
  };

  const handleInvite = async (member: FamilyMember) => {
    try {
      await Share.share({
        title: "Planypet Einladung",
        message: `Hallo ${member.name}! Du wurdest eingeladen, unsere Haustiere in Planypet mitzuverwalten. Lade die App herunter und tritt der Familie bei!`,
      });
    } catch (e) {
      // User cancelled
    }
  };

  const togglePermission = (key: keyof typeof formPermissions) => {
    setFormPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const permissionLabels: Record<string, { label: string; icon: string }> = {
    canFeed: { label: "Fuettern", icon: "fork.knife" },
    canWalk: { label: "Gassi gehen", icon: "figure.walk" },
    canEditHealth: { label: "Gesundheit bearbeiten", icon: "heart.fill" },
    canOrder: { label: "Bestellungen", icon: "cart.fill" },
    canManageFamily: { label: "Familie verwalten", icon: "person.2.fill" },
  };

  return (
    <View style={st.container}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 40,
          paddingHorizontal: 20,
        }}
      >
        {/* Header */}
        <View style={st.headerRow}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [st.backBtn, pressed && { opacity: 0.6 }]}
          >
            <IconSymbol name="chevron.left" size={20} color="#D4A843" />
          </Pressable>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={st.headerTitle}>Familie</Text>
            <Text style={st.headerSub}>Gemeinsam fuer eure Tiere sorgen</Text>
            <View style={st.goldDivider} />
          </View>
        </View>

        {/* Current User */}
        <Text style={st.sectionTitle}>Du</Text>
        <View style={st.memberCard}>
          <View style={st.avatarCircle}>
            <Text style={st.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={st.memberName}>{userName || "Du"}</Text>
            <Text style={st.memberRole}>{ROLE_LABELS[userRole] || "Besitzer"}</Text>
          </View>
          <View style={st.ownerBadge}>
            <Text style={st.ownerBadgeText}>Admin</Text>
          </View>
        </View>

        {/* Family Members */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 24 }}>
          <Text style={st.sectionTitle}>Familienmitglieder ({familyMembers.length})</Text>
          {!showAddForm && (
            <Pressable
              onPress={() => setShowAddForm(true)}
              style={({ pressed }) => [st.addBtn, pressed && { opacity: 0.7 }]}
            >
              <IconSymbol name="plus" size={14} color="#0A0A0F" />
              <Text style={st.addBtnText}>Hinzufuegen</Text>
            </Pressable>
          )}
        </View>

        {/* Add/Edit Form */}
        {showAddForm && (
          <View style={st.formCard}>
            <Text style={st.formTitle}>{editingId ? "Mitglied bearbeiten" : "Neues Mitglied"}</Text>

            <Text style={st.inputLabel}>Name</Text>
            <TextInput
              style={st.input}
              value={formName}
              onChangeText={setFormName}
              placeholder="Name eingeben"
              placeholderTextColor="#4A4A4A"
              returnKeyType="done"
            />

            <Text style={st.inputLabel}>Rolle</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {ROLE_OPTIONS.map((role) => (
                  <Pressable
                    key={role}
                    onPress={() => setFormRole(role)}
                    style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
                  >
                    <View style={[st.roleChip, formRole === role && st.roleChipActive]}>
                      <Text style={[st.roleChipText, formRole === role && st.roleChipTextActive]}>
                        {ROLE_LABELS[role]}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </ScrollView>

            <Text style={st.inputLabel}>E-Mail (optional)</Text>
            <TextInput
              style={st.input}
              value={formEmail}
              onChangeText={setFormEmail}
              placeholder="email@beispiel.de"
              placeholderTextColor="#4A4A4A"
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="done"
            />

            <Text style={st.inputLabel}>Telefon (optional)</Text>
            <TextInput
              style={st.input}
              value={formPhone}
              onChangeText={setFormPhone}
              placeholder="+49 123 456789"
              placeholderTextColor="#4A4A4A"
              keyboardType="phone-pad"
              returnKeyType="done"
            />

            {/* Permissions */}
            <Text style={[st.inputLabel, { marginTop: 8 }]}>Berechtigungen</Text>
            <View style={{ gap: 8, marginBottom: 20 }}>
              {Object.entries(permissionLabels).map(([key, { label }]) => (
                <Pressable
                  key={key}
                  onPress={() => togglePermission(key as keyof typeof formPermissions)}
                  style={({ pressed }) => [st.permRow, pressed && { opacity: 0.8 }]}
                >
                  <Text style={st.permLabel}>{label}</Text>
                  <View style={[st.toggle, formPermissions[key as keyof typeof formPermissions] && st.toggleActive]}>
                    <View style={[st.toggleDot, formPermissions[key as keyof typeof formPermissions] && st.toggleDotActive]} />
                  </View>
                </Pressable>
              ))}
            </View>

            {/* Form Actions */}
            <View style={{ flexDirection: "row", gap: 12 }}>
              <Pressable
                onPress={resetForm}
                style={({ pressed }) => [st.cancelBtn, pressed && { opacity: 0.7 }]}
              >
                <Text style={st.cancelBtnText}>Abbrechen</Text>
              </Pressable>
              <Pressable
                onPress={handleSave}
                style={({ pressed }) => [st.saveBtn, pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }]}
              >
                <Text style={st.saveBtnText}>{editingId ? "Speichern" : "Hinzufuegen"}</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Member List */}
        {familyMembers.length === 0 && !showAddForm ? (
          <View style={st.emptyCard}>
            <IconSymbol name="person.2.fill" size={32} color="#2A2A30" />
            <Text style={st.emptyText}>Noch keine Mitglieder</Text>
            <Text style={st.emptySub}>Fuege Familienmitglieder hinzu, um gemeinsam fuer eure Tiere zu sorgen</Text>
          </View>
        ) : (
          <View style={{ gap: 10, marginTop: 12 }}>
            {familyMembers.map((member) => (
              <View key={member.id} style={st.memberCard}>
                <View style={st.avatarCircle}>
                  <Text style={st.avatarText}>{member.name.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={st.memberName}>{member.name}</Text>
                  <Text style={st.memberRole}>{ROLE_LABELS[member.role]}</Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                    {member.permissions.canFeed && <View style={st.permBadge}><Text style={st.permBadgeText}>Fuettern</Text></View>}
                    {member.permissions.canWalk && <View style={st.permBadge}><Text style={st.permBadgeText}>Gassi</Text></View>}
                    {member.permissions.canEditHealth && <View style={st.permBadge}><Text style={st.permBadgeText}>Gesundheit</Text></View>}
                    {member.permissions.canOrder && <View style={st.permBadge}><Text style={st.permBadgeText}>Bestellen</Text></View>}
                    {member.permissions.canManageFamily && <View style={st.permBadge}><Text style={st.permBadgeText}>Admin</Text></View>}
                  </View>
                </View>

                {/* Actions */}
                <View style={{ gap: 8 }}>
                  <Pressable
                    onPress={() => handleInvite(member)}
                    style={({ pressed }) => [st.iconBtn, pressed && { opacity: 0.6 }]}
                  >
                    <IconSymbol name="paperplane.fill" size={14} color="#D4A843" />
                  </Pressable>
                  <Pressable
                    onPress={() => handleEdit(member)}
                    style={({ pressed }) => [st.iconBtn, pressed && { opacity: 0.6 }]}
                  >
                    <IconSymbol name="pencil" size={14} color="#8B8B80" />
                  </Pressable>
                  <Pressable
                    onPress={() => handleDelete(member)}
                    style={({ pressed }) => [st.iconBtn, pressed && { opacity: 0.6 }]}
                  >
                    <IconSymbol name="trash.fill" size={14} color="#C62828" />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Assigned Pets Info */}
        {familyMembers.length > 0 && (
          <>
            <Text style={[st.sectionTitle, { marginTop: 24 }]}>Zugewiesene Tiere</Text>
            <View style={st.infoCard}>
              <IconSymbol name="info.circle.fill" size={16} color="#D4A843" />
              <Text style={st.infoText}>
                Alle Familienmitglieder haben Zugang zu {pets.length} {pets.length === 1 ? "Tier" : "Tieren"}. Berechtigungen koennen individuell angepasst werden.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0F" },

  headerRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 28 },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "rgba(212,168,67,0.1)",
    alignItems: "center", justifyContent: "center",
  },
  headerTitle: { fontSize: 24, fontWeight: "300", color: "#FAFAF8", letterSpacing: 2 },
  headerSub: { fontSize: 13, color: "#6B6B6B", marginTop: 4 },
  goldDivider: { width: 40, height: 1, backgroundColor: "#D4A843", marginTop: 12 },

  sectionTitle: {
    fontSize: 11, fontWeight: "600", color: "#D4A843",
    letterSpacing: 3, textTransform: "uppercase", marginBottom: 12,
  },

  // Member Card
  memberCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#141418", borderWidth: 1,
    borderColor: "rgba(212,168,67,0.08)", padding: 16,
  },
  avatarCircle: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: "rgba(212,168,67,0.12)",
    borderWidth: 1, borderColor: "rgba(212,168,67,0.2)",
    alignItems: "center", justifyContent: "center",
  },
  avatarText: { fontSize: 18, fontWeight: "300", color: "#D4A843" },
  memberName: { fontSize: 16, fontWeight: "500", color: "#FAFAF8", letterSpacing: 0.3 },
  memberRole: { fontSize: 12, color: "#8B8B80", marginTop: 2 },

  ownerBadge: {
    backgroundColor: "rgba(212,168,67,0.15)", paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: "rgba(212,168,67,0.3)",
  },
  ownerBadgeText: { fontSize: 10, fontWeight: "700", color: "#D4A843", letterSpacing: 1, textTransform: "uppercase" },

  permBadge: {
    backgroundColor: "rgba(212,168,67,0.08)", paddingHorizontal: 8, paddingVertical: 2,
  },
  permBadgeText: { fontSize: 10, color: "#8B8B80" },

  // Add Button
  addBtn: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "#D4A843", paddingHorizontal: 12, paddingVertical: 6,
  },
  addBtnText: { fontSize: 12, fontWeight: "700", color: "#0A0A0F" },

  // Form
  formCard: {
    backgroundColor: "#141418", borderWidth: 1,
    borderColor: "rgba(212,168,67,0.1)", padding: 20, marginBottom: 16,
  },
  formTitle: { fontSize: 16, fontWeight: "300", color: "#FAFAF8", letterSpacing: 1, marginBottom: 20 },
  inputLabel: { fontSize: 10, fontWeight: "600", color: "#D4A843", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 },
  input: {
    backgroundColor: "#0A0A0F", borderWidth: 1, borderColor: "rgba(212,168,67,0.1)",
    padding: 14, color: "#FAFAF8", fontSize: 15, marginBottom: 16,
  },

  roleChip: {
    paddingHorizontal: 14, paddingVertical: 8,
    backgroundColor: "#0A0A0F", borderWidth: 1, borderColor: "rgba(212,168,67,0.1)",
  },
  roleChipActive: { backgroundColor: "#D4A843", borderColor: "#D4A843" },
  roleChipText: { fontSize: 13, color: "#8B8B80" },
  roleChipTextActive: { color: "#0A0A0F", fontWeight: "600" },

  // Permissions
  permRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: "#0A0A0F", padding: 14,
    borderWidth: 1, borderColor: "rgba(212,168,67,0.05)",
  },
  permLabel: { fontSize: 14, color: "#FAFAF8" },
  toggle: {
    width: 44, height: 24, borderRadius: 12,
    backgroundColor: "#2A2A30", justifyContent: "center", paddingHorizontal: 2,
  },
  toggleActive: { backgroundColor: "#D4A843" },
  toggleDot: {
    width: 20, height: 20, borderRadius: 10, backgroundColor: "#6B6B6B",
  },
  toggleDotActive: { backgroundColor: "#0A0A0F", alignSelf: "flex-end" },

  // Form Actions
  cancelBtn: {
    flex: 1, paddingVertical: 14, alignItems: "center",
    borderWidth: 1, borderColor: "rgba(212,168,67,0.15)",
  },
  cancelBtnText: { fontSize: 14, color: "#8B8B80" },
  saveBtn: {
    flex: 1, paddingVertical: 14, alignItems: "center",
    backgroundColor: "#D4A843",
  },
  saveBtnText: { fontSize: 14, fontWeight: "700", color: "#0A0A0F" },

  // Empty
  emptyCard: {
    backgroundColor: "#141418", padding: 32, alignItems: "center",
    borderWidth: 1, borderColor: "rgba(212,168,67,0.08)", marginTop: 8,
  },
  emptyText: { fontSize: 16, fontWeight: "300", color: "#6B6B6B", marginTop: 12 },
  emptySub: { fontSize: 12, color: "#4A4A4A", textAlign: "center", marginTop: 4, lineHeight: 18 },

  // Icon Buttons
  iconBtn: {
    width: 28, height: 28, alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(212,168,67,0.05)",
  },

  // Info
  infoCard: {
    flexDirection: "row", alignItems: "flex-start",
    backgroundColor: "#141418", borderWidth: 1,
    borderColor: "rgba(212,168,67,0.08)", padding: 16, gap: 12,
  },
  infoText: { flex: 1, fontSize: 13, color: "#8B8B80", lineHeight: 20 },
});
