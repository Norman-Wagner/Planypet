import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";

interface EmergencyContact {
  name: string;
  phone: string;
  type: "veterinarian" | "emergency_vet" | "poison_control" | "personal";
}

const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    name: "Tierärztlicher Notfalldienst",
    phone: "+49 30 123456",
    type: "emergency_vet",
  },
  {
    name: "Giftnotruf",
    phone: "+49 551 19240",
    type: "poison_control",
  },
];

const FIRST_AID_TIPS = [
  {
    title: "Blutung stoppen",
    steps: [
      "Wunde mit sauberer Gaze oder Tuch abdecken",
      "Druck ausüben für 5-10 Minuten",
      "Verband anlegen",
      "Tierarzt aufsuchen",
    ],
  },
  {
    title: "Vergiftung",
    steps: [
      "Giftnotruf anrufen: +49 551 19240",
      "Nicht erbrechen lassen",
      "Gift-Verpackung mitnehmen zum Tierarzt",
      "Sofort zum Notfall-Tierarzt",
    ],
  },
  {
    title: "Hitzeschlag",
    steps: [
      "Tier an kühlen Ort bringen",
      "Mit kühlem Wasser abkühlen (nicht eiskalt)",
      "Viel Wasser zum Trinken anbieten",
      "Sofort zum Tierarzt",
    ],
  },
  {
    title: "Knochenbruch",
    steps: [
      "Tier ruhig halten",
      "Verletzte Gliedmaße nicht bewegen",
      "Mit Decke wärmen",
      "Sofort zum Tierarzt transportieren",
    ],
  },
  {
    title: "Fremdkörper verschluckt",
    steps: [
      "Nicht versuchen zu entfernen",
      "Nicht erbrechen lassen",
      "Sofort zum Tierarzt",
      "Röntgen machen lassen",
    ],
  },
];

export default function EmergencyScreen() {
  const colors = useColors();
  const [pets, setPets] = useState<any[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  const [userContacts, setUserContacts] = useState<any>(null);

  // Fetch pets
  const { data: petsData } = trpc.pets.list.useQuery();

  // Fetch user data
  const { data: user } = trpc.auth.me.useQuery();

  useEffect(() => {
    if (petsData) {
      const allPets = [...(petsData.owned || []), ...(petsData.shared || [])];
      setPets(allPets);
      if (allPets.length > 0) {
        setSelectedPetId(allPets[0].id);
      }
    }
  }, [petsData]);

  useEffect(() => {
    if (user) {
      setUserContacts(user);
    }
  }, [user]);

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleSOS = () => {
    Alert.alert(
      "🚨 NOTFALL",
      "Rufe sofort den Notfall-Tierarzt an oder fahre zur nächsten Notfall-Klinik!",
      [
        {
          text: "Anrufen",
          onPress: () => handleCall("+49 30 123456"),
        },
        {
          text: "Abbrechen",
          style: "cancel",
        },
      ]
    );
  };

  const selectedPet = pets.find((p) => p.id === selectedPetId);

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4">
        {/* SOS Button */}
        <TouchableOpacity
          className="bg-error rounded-lg p-4 items-center mb-6 border-2 border-error"
          onPress={handleSOS}
        >
          <Text className="text-background font-bold text-xl">🚨 NOTFALL - SOFORT ANRUFEN</Text>
        </TouchableOpacity>

        {/* Pet Selection */}
        {pets.length > 0 && (
          <View className="mb-6">
            <Text className="text-sm font-semibold text-muted mb-2">Tier auswählen</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
              {pets.map((pet) => (
                <TouchableOpacity
                  key={pet.id}
                  className={`px-4 py-2 rounded-full ${
                    selectedPetId === pet.id
                      ? "bg-primary"
                      : "bg-surface border border-border"
                  }`}
                  onPress={() => setSelectedPetId(pet.id)}
                >
                  <Text
                    className={
                      selectedPetId === pet.id
                        ? "text-background font-semibold"
                        : "text-foreground"
                    }
                  >
                    {pet.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Pet Emergency Info */}
        {selectedPet && (
          <View className="bg-surface rounded-lg p-4 border border-border mb-6">
            <Text className="text-lg font-semibold text-foreground mb-3">
              Notfall-Daten für {selectedPet.name}
            </Text>

            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-muted">Tierart:</Text>
                <Text className="text-foreground font-semibold">{selectedPet.type}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-muted">Rasse:</Text>
                <Text className="text-foreground font-semibold">
                  {selectedPet.breed || "Unbekannt"}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-muted">Gewicht:</Text>
                <Text className="text-foreground font-semibold">
                  {selectedPet.weight || "Unbekannt"}
                </Text>
              </View>
              {selectedPet.microchipId && (
                <View className="flex-row justify-between border-t border-border pt-2 mt-2">
                  <Text className="text-muted">Chipnummer:</Text>
                  <Text className="text-foreground font-semibold">{selectedPet.microchipId}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* User Emergency Contacts */}
        {userContacts && (
          <View className="bg-surface rounded-lg p-4 border border-border mb-6">
            <Text className="text-lg font-semibold text-foreground mb-3">Deine Kontaktdaten</Text>

            <View className="gap-2">
              <View>
                <Text className="text-xs text-muted">Name</Text>
                <Text className="text-foreground font-semibold">{userContacts.name}</Text>
              </View>
              <View>
                <Text className="text-xs text-muted">Telefon</Text>
                <Text className="text-foreground font-semibold">{userContacts.phone || "-"}</Text>
              </View>
              <View>
                <Text className="text-xs text-muted">Adresse</Text>
                <Text className="text-foreground font-semibold">
                  {userContacts.address || "-"}
                </Text>
              </View>
              {userContacts.emergencyContactName && (
                <>
                  <View className="border-t border-border pt-2 mt-2">
                    <Text className="text-xs text-muted">Notfallkontakt</Text>
                    <Text className="text-foreground font-semibold">
                      {userContacts.emergencyContactName}
                    </Text>
                    <Text className="text-foreground font-semibold">
                      {userContacts.emergencyContactPhone}
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>
        )}

        {/* Emergency Contacts */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-foreground mb-3">Notfall-Kontakte</Text>

          <View className="gap-2">
            {EMERGENCY_CONTACTS.map((contact, idx) => (
              <TouchableOpacity
                key={idx}
                className="bg-surface rounded-lg p-3 border border-error flex-row justify-between items-center"
                onPress={() => handleCall(contact.phone)}
              >
                <View>
                  <Text className="text-foreground font-semibold">{contact.name}</Text>
                  <Text className="text-muted text-sm">{contact.phone}</Text>
                </View>
                <Text className="text-2xl">📞</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* First Aid Tips */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-foreground mb-3">Erste-Hilfe-Tipps</Text>

          <View className="gap-2">
            {FIRST_AID_TIPS.map((tip, idx) => (
              <TouchableOpacity
                key={idx}
                className={`rounded-lg p-3 border ${
                  selectedTip === idx
                    ? "bg-primary/10 border-primary"
                    : "bg-surface border-border"
                }`}
                onPress={() => setSelectedTip(selectedTip === idx ? null : idx)}
              >
                <View className="flex-row justify-between items-center">
                  <Text className="text-foreground font-semibold flex-1">{tip.title}</Text>
                  <Text className="text-xl">{selectedTip === idx ? "▼" : "▶"}</Text>
                </View>

                {selectedTip === idx && (
                  <View className="mt-3 pt-3 border-t border-border">
                    {tip.steps.map((step, stepIdx) => (
                      <View key={stepIdx} className="flex-row gap-2 mb-2">
                        <Text className="text-primary font-bold">{stepIdx + 1}.</Text>
                        <Text className="text-foreground flex-1">{step}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Warning */}
        <View className="bg-error/10 border border-error rounded-lg p-4">
          <Text className="text-error font-semibold mb-2">⚠️ Wichtig</Text>
          <Text className="text-sm text-error">
            Diese Tipps ersetzen nicht den Besuch beim Tierarzt! Im Notfall sofort zum Notfall-Tierarzt oder anrufen!
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
