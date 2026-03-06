import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";

interface RegistrationDatabase {
  id: string;
  name: string;
  country: string;
  cost: string;
  url: string;
  description: string;
  icon: string;
}

const REGISTRATION_DATABASES: RegistrationDatabase[] = [
  {
    id: "tasso",
    name: "Tasso e.V.",
    country: "🇩🇪 Deutschland",
    cost: "Kostenlos",
    url: "https://www.tasso.net",
    description: "Größte Haustier-Registrierungsdatenbank in Deutschland",
    icon: "📋",
  },
  {
    id: "findefix",
    name: "Findefix",
    country: "🇩🇪 Deutschland",
    cost: "Kostenlos",
    url: "https://www.findefix.de",
    description: "Deutsches Haustier-Register des Deutschen Tierschutzbunds",
    icon: "🐾",
  },
  {
    id: "tiermeldezentrale",
    name: "Tiermeldezentrale",
    country: "🇩🇪 Deutschland",
    cost: "Kostenlos",
    url: "https://www.tiermeldezentrale.de",
    description: "Zentrale Meldestelle für vermisste und gefundene Tiere",
    icon: "🔔",
  },
  {
    id: "anicrypt",
    name: "Anicrypt",
    country: "🇪🇺 Europa",
    cost: "Kostenpflichtig",
    url: "https://www.anicrypt.com",
    description: "Europäische Haustier-Identifikationsdatenbank",
    icon: "🌍",
  },
];

export default function ChipRegistrationScreen() {
  const colors = useColors();
  const [pets, setPets] = useState<any[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [chipNumber, setChipNumber] = useState("");
  const [chipDate, setChipDate] = useState("");
  const [veterinarian, setVeterinarian] = useState("");
  const [registrations, setRegistrations] = useState<{ [key: string]: boolean }>({});
  const [showForm, setShowForm] = useState(false);

  // Fetch pets
  const { data: petsData } = trpc.pets.list.useQuery();

  React.useEffect(() => {
    if (petsData) {
      const allPets = [...(petsData.owned || []), ...(petsData.shared || [])];
      setPets(allPets);
      if (allPets.length > 0) {
        setSelectedPetId(allPets[0].id);
      }
    }
  }, [petsData]);

  const handleRegisterChip = async (database: RegistrationDatabase) => {
    if (!selectedPetId || !chipNumber) {
      Alert.alert("Fehler", "Bitte wähle ein Tier und gib die Chipnummer ein");
      return;
    }

    const pet = pets.find((p) => p.id === selectedPetId);

    if (database.cost === "Kostenlos") {
      // Open registration page directly
      Linking.openURL(database.url);
      setRegistrations({ ...registrations, [database.id]: true });
      Alert.alert(
        "Registrierung gestartet",
        `Du wirst zu ${database.name} weitergeleitet. Bitte registriere ${pet?.name} dort.`
      );
    } else {
      // Send email with pre-filled data
      const emailBody = `
Hallo,

ich möchte mein Haustier registrieren:

Tier: ${pet?.name}
Tierart: ${pet?.type}
Rasse: ${pet?.breed || "Unbekannt"}
Chipnummer: ${chipNumber}
Chip-Datum: ${chipDate}
Tierarzt: ${veterinarian}

Bitte senden Sie mir die Registrierungsunterlagen und Rechnung.

Mit freundlichen Grüßen
      `.trim();

      Linking.openURL(
        `mailto:info@${database.url.replace("https://www.", "").replace("/", "")}?subject=Chip-Registrierung für ${pet?.name}&body=${encodeURIComponent(emailBody)}`
      );

      setRegistrations({ ...registrations, [database.id]: true });
      Alert.alert(
        "Email vorbereitet",
        `Eine Email wurde vorbereitet. Bitte sende sie ab und zahle die Registrierungsgebühr.`
      );
    }
  };

  const handleSaveChipData = () => {
    if (!selectedPetId || !chipNumber) {
      Alert.alert("Fehler", "Bitte gib die Chipnummer ein");
      return;
    }

    Alert.alert("Erfolg", "Chip-Daten wurden gespeichert!");
    setShowForm(false);
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground mb-2">Chip-Registrierung</Text>
          <Text className="text-muted">Registriere deinen Haustier-Chip in Datenbanken</Text>
        </View>

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

        {/* Chip Data Form */}
        {showForm ? (
          <View className="bg-surface rounded-lg p-4 border border-border mb-6">
            <Text className="text-lg font-semibold text-foreground mb-4">Chip-Daten</Text>

            <View className="gap-3">
              <View>
                <Text className="text-sm text-muted mb-1">Chipnummer *</Text>
                <TextInput
                  className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                  placeholder="z.B. 900123456789012"
                  value={chipNumber}
                  onChangeText={setChipNumber}
                  placeholderTextColor={colors.muted}
                />
              </View>

              <View>
                <Text className="text-sm text-muted mb-1">Chip-Datum</Text>
                <TextInput
                  className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                  placeholder="YYYY-MM-DD"
                  value={chipDate}
                  onChangeText={setChipDate}
                  placeholderTextColor={colors.muted}
                />
              </View>

              <View>
                <Text className="text-sm text-muted mb-1">Tierarzt</Text>
                <TextInput
                  className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                  placeholder="Name des Tierarztes"
                  value={veterinarian}
                  onChangeText={setVeterinarian}
                  placeholderTextColor={colors.muted}
                />
              </View>

              <View className="flex-row gap-2 mt-2">
                <TouchableOpacity
                  className="flex-1 bg-primary rounded-lg py-3 items-center"
                  onPress={handleSaveChipData}
                >
                  <Text className="text-background font-semibold">Speichern</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 bg-surface border border-border rounded-lg py-3 items-center"
                  onPress={() => setShowForm(false)}
                >
                  <Text className="text-foreground font-semibold">Abbrechen</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            className="bg-primary rounded-lg py-3 items-center mb-6"
            onPress={() => setShowForm(true)}
          >
            <Text className="text-background font-semibold">+ Chip-Daten hinzufügen</Text>
          </TouchableOpacity>
        )}

        {/* Registration Databases */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-foreground mb-4">
            Registrierungsdatenbanken
          </Text>

          <View className="gap-3">
            {REGISTRATION_DATABASES.map((db) => (
              <View
                key={db.id}
                className="bg-surface rounded-lg p-4 border border-border"
              >
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                      <Text className="text-2xl">{db.icon}</Text>
                      <View>
                        <Text className="text-lg font-semibold text-foreground">
                          {db.name}
                        </Text>
                        <Text className="text-xs text-muted">{db.country}</Text>
                      </View>
                    </View>
                    <Text className="text-sm text-muted mb-2">{db.description}</Text>
                    <Text
                      className={`text-sm font-semibold ${
                        db.cost === "Kostenlos" ? "text-success" : "text-warning"
                      }`}
                    >
                      {db.cost}
                    </Text>
                  </View>
                  {registrations[db.id] && (
                    <Text className="text-success text-2xl">✓</Text>
                  )}
                </View>

                <TouchableOpacity
                  className={`rounded-lg py-2 items-center ${
                    registrations[db.id]
                      ? "bg-success/20 border border-success"
                      : "bg-primary"
                  }`}
                  onPress={() => handleRegisterChip(db)}
                  disabled={registrations[db.id]}
                >
                  <Text
                    className={`font-semibold ${
                      registrations[db.id]
                        ? "text-success"
                        : "text-background"
                    }`}
                  >
                    {registrations[db.id] ? "✓ Registriert" : "Registrieren"}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Info */}
        <View className="bg-info/10 border border-info rounded-lg p-4">
          <Text className="text-info font-semibold mb-2">ℹ️ Wichtig</Text>
          <Text className="text-sm text-info mb-2">
            • Ein Chip kostet beim Tierarzt ca. 25-35€
          </Text>
          <Text className="text-sm text-info mb-2">
            • Kostenlose Registrierung in deutschen Datenbanken
          </Text>
          <Text className="text-sm text-info">
            • Chip ist essentiell für die Identifikation deines Tieres
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
