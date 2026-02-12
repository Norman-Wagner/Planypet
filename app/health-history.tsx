import { useState, useMemo } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { usePetStore } from "@/lib/pet-store";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CHART_WIDTH = SCREEN_WIDTH - 80;
const CHART_HEIGHT = 180;

type TabType = "weight" | "symptoms" | "vaccinations";

export default function HealthHistoryScreen() {
  const insets = useSafeAreaInsets();
  const store = usePetStore();
  const [activeTab, setActiveTab] = useState<TabType>("weight");
  const [selectedPetId, setSelectedPetId] = useState(store.pets[0]?.id || "");

  const selectedPet = store.pets.find(p => p.id === selectedPetId);
  const petRecords = store.healthRecords.filter(r => r.petId === selectedPetId);

  // Weight data from health records
  const weightData = useMemo(() => {
    const entries = petRecords
      .filter(r => r.weight && r.weight > 0)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Add current weight from pet profile
    if (selectedPet?.weight && entries.length === 0) {
      return [{ date: new Date().toISOString(), weight: selectedPet.weight }];
    }
    return entries.map(e => ({ date: e.date, weight: e.weight! }));
  }, [petRecords, selectedPet]);

  // Symptoms grouped by month
  const symptomTimeline = useMemo(() => {
    return petRecords
      .filter(r => r.symptoms && r.symptoms.length > 0)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 20);
  }, [petRecords]);

  // Vaccinations
  const vaccinations = useMemo(() => {
    return petRecords
      .filter(r => r.type === "vaccination" || r.notes?.toLowerCase().includes("impf"))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [petRecords]);

  const renderWeightChart = () => {
    if (weightData.length === 0) {
      return (
        <View style={s.emptyChart}>
          <IconSymbol name="chart.line.uptrend.xyaxis" size={32} color="#2A2A30" />
          <Text style={s.emptyChartText}>Noch keine Gewichtsdaten</Text>
          <Text style={s.emptyChartSub}>Trage das Gewicht im Tier-Profil ein, um den Verlauf zu sehen</Text>
        </View>
      );
    }

    const weights = weightData.map(d => d.weight);
    const minW = Math.min(...weights) * 0.9;
    const maxW = Math.max(...weights) * 1.1;
    const range = maxW - minW || 1;

    return (
      <View style={s.chartContainer}>
        <View style={s.chartHeader}>
          <Text style={s.chartTitle}>Gewichtsverlauf</Text>
          {weightData.length > 0 && (
            <Text style={s.chartValue}>{weightData[weightData.length - 1].weight.toFixed(1)} kg</Text>
          )}
        </View>

        {/* Simple SVG-like chart using Views */}
        <View style={s.chart}>
          {/* Y-axis labels */}
          <View style={s.yAxis}>
            <Text style={s.yLabel}>{maxW.toFixed(1)}</Text>
            <Text style={s.yLabel}>{((maxW + minW) / 2).toFixed(1)}</Text>
            <Text style={s.yLabel}>{minW.toFixed(1)}</Text>
          </View>

          {/* Chart area */}
          <View style={s.chartArea}>
            {/* Grid lines */}
            <View style={[s.gridLine, { top: 0 }]} />
            <View style={[s.gridLine, { top: CHART_HEIGHT / 2 }]} />
            <View style={[s.gridLine, { top: CHART_HEIGHT - 1 }]} />

            {/* Data points */}
            {weightData.map((d, i) => {
              const x = weightData.length === 1 ? CHART_WIDTH / 2 : (i / (weightData.length - 1)) * (CHART_WIDTH - 40);
              const y = CHART_HEIGHT - ((d.weight - minW) / range) * CHART_HEIGHT;
              return (
                <View
                  key={i}
                  style={[s.dataPoint, { left: x, top: y - 5 }]}
                >
                  <View style={s.dataPointInner} />
                </View>
              );
            })}

            {/* Connecting lines */}
            {weightData.length > 1 && weightData.slice(0, -1).map((d, i) => {
              const x1 = (i / (weightData.length - 1)) * (CHART_WIDTH - 40);
              const y1 = CHART_HEIGHT - ((d.weight - minW) / range) * CHART_HEIGHT;
              const x2 = ((i + 1) / (weightData.length - 1)) * (CHART_WIDTH - 40);
              const y2 = CHART_HEIGHT - ((weightData[i + 1].weight - minW) / range) * CHART_HEIGHT;
              const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
              const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
              return (
                <View
                  key={`line-${i}`}
                  style={[
                    s.chartLine,
                    {
                      left: x1 + 5,
                      top: y1,
                      width: length,
                      transform: [{ rotate: `${angle}deg` }],
                      transformOrigin: "left center",
                    },
                  ]}
                />
              );
            })}
          </View>
        </View>

        {/* X-axis labels */}
        <View style={s.xAxis}>
          {weightData.slice(0, 6).map((d, i) => (
            <Text key={i} style={s.xLabel}>
              {new Date(d.date).toLocaleDateString("de-DE", { day: "2-digit", month: "short" })}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  const renderSymptomTimeline = () => {
    if (symptomTimeline.length === 0) {
      return (
        <View style={s.emptyChart}>
          <IconSymbol name="heart.text.square.fill" size={32} color="#2A2A30" />
          <Text style={s.emptyChartText}>Keine Symptome erfasst</Text>
          <Text style={s.emptyChartSub}>Erfasse Symptome im Gesundheits-Tab, um den Verlauf zu sehen</Text>
        </View>
      );
    }

    return (
      <View style={{ gap: 0 }}>
        {symptomTimeline.map((record, i) => (
          <View key={record.id} style={s.timelineItem}>
            <View style={s.timelineDot}>
              <View style={[s.timelineDotInner, { backgroundColor: getSeverityColor(record.severity) }]} />
              {i < symptomTimeline.length - 1 && <View style={s.timelineLine} />}
            </View>
            <View style={s.timelineContent}>
              <Text style={s.timelineDate}>
                {new Date(record.date).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })}
              </Text>
              <View style={s.timelineCard}>
                {record.symptoms?.map((symptom, j) => (
                  <Text key={j} style={s.symptomText}>{symptom}</Text>
                ))}
                {record.notes && <Text style={s.timelineNotes}>{record.notes}</Text>}
                {record.severity && (
                  <View style={[s.severityBadge, { backgroundColor: `${getSeverityColor(record.severity)}15` }]}>
                    <Text style={[s.severityText, { color: getSeverityColor(record.severity) }]}>
                      {getSeverityLabel(record.severity)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderVaccinations = () => {
    if (vaccinations.length === 0) {
      return (
        <View style={s.emptyChart}>
          <IconSymbol name="syringe.fill" size={32} color="#2A2A30" />
          <Text style={s.emptyChartText}>Keine Impfungen erfasst</Text>
          <Text style={s.emptyChartSub}>Impfungen werden aus den Gesundheitsakten geladen</Text>
        </View>
      );
    }

    return (
      <View style={{ gap: 8 }}>
        {vaccinations.map(record => (
          <View key={record.id} style={s.vaccCard}>
            <View style={[s.vaccIcon, { backgroundColor: "rgba(66,165,245,0.1)" }]}>
              <IconSymbol name="syringe.fill" size={18} color="#42A5F5" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.vaccTitle}>{record.notes || "Impfung"}</Text>
              <Text style={s.vaccDate}>
                {new Date(record.date).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })}
              </Text>
            </View>
            <IconSymbol name="checkmark.circle.fill" size={20} color="#66BB6A" />
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0F" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 40,
          paddingHorizontal: 20,
        }}
      >
        {/* Back */}
        <Pressable onPress={() => router.back()} style={({ pressed }) => [s.backBtn, pressed && { opacity: 0.6 }]}>
          <IconSymbol name="chevron.left" size={20} color="#D4A843" />
          <Text style={s.backText}>Zurueck</Text>
        </Pressable>

        {/* Header */}
        <View style={s.header}>
          <Text style={s.headerTitle}>Gesundheitsverlauf</Text>
          <Text style={s.headerSub}>{selectedPet?.name || "Alle Tiere"}</Text>
          <View style={s.goldDivider} />
        </View>

        {/* Pet Selector */}
        {store.pets.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 20 }}>
            {store.pets.map(pet => (
              <Pressable
                key={pet.id}
                onPress={() => setSelectedPetId(pet.id)}
                style={[s.petChip, selectedPetId === pet.id && s.petChipActive]}
              >
                <Text style={[s.petChipText, selectedPetId === pet.id && s.petChipTextActive]}>{pet.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}

        {/* Tab Bar */}
        <View style={s.tabBar}>
          {([
            { key: "weight" as const, label: "Gewicht", icon: "chart.line.uptrend.xyaxis" },
            { key: "symptoms" as const, label: "Symptome", icon: "heart.text.square.fill" },
            { key: "vaccinations" as const, label: "Impfungen", icon: "syringe.fill" },
          ] as const).map(tab => (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[s.tab, activeTab === tab.key && s.tabActive]}
            >
              <IconSymbol name={tab.icon as any} size={14} color={activeTab === tab.key ? "#D4A843" : "#6B6B6B"} />
              <Text style={[s.tabText, activeTab === tab.key && s.tabTextActive]}>{tab.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Content */}
        {activeTab === "weight" && renderWeightChart()}
        {activeTab === "symptoms" && renderSymptomTimeline()}
        {activeTab === "vaccinations" && renderVaccinations()}
      </ScrollView>
    </View>
  );
}

function getSeverityColor(severity?: string): string {
  switch (severity) {
    case "mild": return "#66BB6A";
    case "moderate": return "#FFB74D";
    case "severe": return "#EF5350";
    default: return "#6B6B6B";
  }
}

function getSeverityLabel(severity?: string): string {
  switch (severity) {
    case "mild": return "Leicht";
    case "moderate": return "Mittel";
    case "severe": return "Schwer";
    default: return "Unbekannt";
  }
}

const s = StyleSheet.create({
  backBtn: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 },
  backText: { fontSize: 14, fontWeight: "500", color: "#D4A843", letterSpacing: 0.5 },

  header: { marginBottom: 24 },
  headerTitle: { fontSize: 28, fontWeight: "300", color: "#FAFAF8", letterSpacing: 2 },
  headerSub: { fontSize: 12, fontWeight: "400", color: "#6B6B6B", letterSpacing: 1, marginTop: 4 },
  goldDivider: { width: 40, height: 1, backgroundColor: "#D4A843", marginTop: 16 },

  petChip: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderWidth: 1, borderColor: "rgba(212,168,67,0.1)",
    backgroundColor: "#141418",
  },
  petChipActive: { borderColor: "#D4A843", backgroundColor: "rgba(212,168,67,0.1)" },
  petChipText: { fontSize: 12, fontWeight: "500", color: "#6B6B6B", letterSpacing: 0.5 },
  petChipTextActive: { color: "#D4A843" },

  tabBar: {
    flexDirection: "row", gap: 0, marginBottom: 24,
    borderWidth: 1, borderColor: "rgba(212,168,67,0.08)",
  },
  tab: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, paddingVertical: 12, backgroundColor: "#141418",
  },
  tabActive: { backgroundColor: "rgba(212,168,67,0.1)", borderBottomWidth: 2, borderBottomColor: "#D4A843" },
  tabText: { fontSize: 11, fontWeight: "500", color: "#6B6B6B", letterSpacing: 0.5 },
  tabTextActive: { color: "#D4A843" },

  // Weight Chart
  chartContainer: { marginBottom: 20 },
  chartHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16,
  },
  chartTitle: { fontSize: 15, fontWeight: "500", color: "#FAFAF8", letterSpacing: 0.3 },
  chartValue: { fontSize: 20, fontWeight: "300", color: "#D4A843", letterSpacing: 1 },

  chart: { flexDirection: "row", height: CHART_HEIGHT },
  yAxis: { width: 40, justifyContent: "space-between", alignItems: "flex-end", paddingRight: 8 },
  yLabel: { fontSize: 9, fontWeight: "400", color: "#4A4A4A" },
  chartArea: { flex: 1, position: "relative" },
  gridLine: {
    position: "absolute", left: 0, right: 0,
    height: 1, backgroundColor: "rgba(212,168,67,0.05)",
  },
  dataPoint: {
    position: "absolute", width: 10, height: 10, zIndex: 2,
  },
  dataPointInner: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: "#D4A843",
    shadowColor: "#D4A843", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5, shadowRadius: 4, elevation: 4,
  },
  chartLine: {
    position: "absolute", height: 2,
    backgroundColor: "rgba(212,168,67,0.4)",
  },
  xAxis: {
    flexDirection: "row", justifyContent: "space-between",
    paddingLeft: 40, marginTop: 8,
  },
  xLabel: { fontSize: 9, fontWeight: "400", color: "#4A4A4A" },

  // Empty states
  emptyChart: {
    backgroundColor: "#141418", padding: 40, alignItems: "center",
    borderWidth: 1, borderColor: "rgba(212,168,67,0.08)", gap: 8,
  },
  emptyChartText: { fontSize: 14, fontWeight: "300", color: "#6B6B6B", letterSpacing: 0.5 },
  emptyChartSub: { fontSize: 12, fontWeight: "400", color: "#4A4A4A", textAlign: "center", maxWidth: 240 },

  // Symptom Timeline
  timelineItem: { flexDirection: "row", minHeight: 80 },
  timelineDot: { width: 24, alignItems: "center" },
  timelineDotInner: { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
  timelineLine: {
    width: 1, flex: 1, backgroundColor: "rgba(212,168,67,0.1)", marginTop: 4,
  },
  timelineContent: { flex: 1, paddingLeft: 12, paddingBottom: 16 },
  timelineDate: { fontSize: 11, fontWeight: "400", color: "#6B6B6B", letterSpacing: 0.5, marginBottom: 6 },
  timelineCard: {
    backgroundColor: "#141418", padding: 14,
    borderWidth: 1, borderColor: "rgba(212,168,67,0.08)",
  },
  symptomText: { fontSize: 13, fontWeight: "500", color: "#FAFAF8", letterSpacing: 0.3, marginBottom: 2 },
  timelineNotes: { fontSize: 12, fontWeight: "400", color: "#6B6B6B", marginTop: 6, lineHeight: 18 },
  severityBadge: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, marginTop: 8 },
  severityText: { fontSize: 10, fontWeight: "600", letterSpacing: 1, textTransform: "uppercase" },

  // Vaccinations
  vaccCard: {
    flexDirection: "row", alignItems: "center", gap: 14,
    backgroundColor: "#141418", padding: 16,
    borderWidth: 1, borderColor: "rgba(212,168,67,0.08)",
  },
  vaccIcon: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  vaccTitle: { fontSize: 14, fontWeight: "500", color: "#FAFAF8", letterSpacing: 0.3 },
  vaccDate: { fontSize: 11, fontWeight: "400", color: "#6B6B6B", marginTop: 2 },
});
