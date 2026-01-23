import { Feather, MaterialIcons } from "@expo/vector-icons";
import { JSX, useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Exercise, useData } from "../../components/DataContext";
import LoadingScreen from "../../components/loading-screen";
import { useTheme } from "../../components/ThemeContext";

type Category = "all" | "eye" | "stretch" | "breathing";

const TABS: { value: Category; label: string; icon: JSX.Element }[] = [
  {
    value: "all",
    label: "All",
    icon: <MaterialIcons name="auto-awesome" size={16} color="#8498d1" />,
  },
  {
    value: "eye",
    label: "Eye",
    icon: <Feather name="eye" size={16} color="#3B82F6" />,
  },
  {
    value: "stretch",
    label: "Stretch",
    icon: <MaterialIcons name="accessibility" size={16} color="#10B981" />,
  },
  {
    value: "breathing",
    label: "Breath",
    icon: <Feather name="wind" size={16} color="#326cc9" />,
  },
];

const categoryConfig = {
  eye: {
    label: "Eye Care",
    color: "#3B82F6",
    bg: "#DBEAFE",
    icon: <Feather name="eye" size={20} color="#3B82F6" />,
  },
  stretch: {
    label: "Stretching",
    color: "#10B981",
    bg: "#D1FAE5",
    icon: <MaterialIcons name="accessibility" size={20} color="#10B981" />,
  },
  breathing: {
    label: "Breathing",
    color: "#97dbca",
    bg: "#EDE9FE",
    icon: <Feather name="wind" size={20} color="#000000" />,
  },
};

function formatDuration(seconds: number): string {
  return seconds >= 60
    ? `${Math.floor(seconds / 60)}m ${seconds % 60}s`
    : `${seconds}s`;
}

export default function ExercisesScreen() {
  const { theme } = useTheme();
  const { exercises, isLoading } = useData();
  const [activeTab, setActiveTab] = useState<Category>("all");
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );

  if (isLoading) {
    return <LoadingScreen message="Loading exercises..." />;
  }

  const filteredExercises =
    activeTab === "all"
      ? exercises
      : exercises.filter((e) => e.category === activeTab);

  const getRandomExercise = (category: "eye" | "stretch" | "breathing") => {
    const categoryExercises = exercises.filter((e) => e.category === category);
    return (
      categoryExercises[Math.floor(Math.random() * categoryExercises.length)] ||
      null
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Exercises</Text>
        <Text style={[styles.subtitle, { color: theme.subText }]}>
          Browse and start exercises
        </Text>
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabs}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.value;
          const count =
            tab.value === "all"
              ? exercises.length
              : exercises.filter((e) => e.category === tab.value).length;
          return (
            <TouchableOpacity
              key={tab.value}
              onPress={() => setActiveTab(tab.value)}
              style={[
                styles.tabButton,
                { backgroundColor: theme.card },
                isActive && styles.tabButtonActive,
              ]}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                {tab.icon}
                <Text
                  style={[
                    styles.tabText,
                    { color: theme.text },
                    isActive && { color: "#FFFFFF" },
                  ]}
                >
                  {tab.label}
                </Text>
                <Text
                  style={[
                    styles.tabCount,
                    isActive
                      ? { color: "rgba(255,255,255,0.7)" }
                      : { color: theme.subText },
                  ]}
                >
                  {count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Exercise List */}
      <View style={{ marginVertical: 12 }}>
        {filteredExercises.map((exercise) => {
          const config =
            categoryConfig[
              exercise.category as "eye" | "stretch" | "breathing"
            ];
          return (
            <TouchableOpacity
              key={exercise.id}
              style={[styles.card, { backgroundColor: theme.card }]}
              onPress={() => setSelectedExercise(exercise)}
            >
              <Image
                source={exercise.image ? { uri: exercise.image } : undefined}
                style={[styles.thumbnail, { backgroundColor: theme.iconBg }]}
              />
              <View style={styles.cardContent}>
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                      marginBottom: 4,
                    }}
                  >
                    {config.icon}
                    <Text style={{ fontSize: 10, color: theme.subText }}>
                      {config.label}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontWeight: "600",
                      fontSize: 14,
                      marginBottom: 2,
                      color: theme.text,
                    }}
                  >
                    {exercise.name}
                  </Text>
                  <Text
                    style={{ fontSize: 12, color: theme.subText }}
                    numberOfLines={1}
                  >
                    {exercise.description}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 8,
                  }}
                >
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <MaterialIcons
                        name="access-time"
                        size={12}
                        color="#6B7280"
                      />
                      <Text style={{ fontSize: 10, color: theme.subText }}>
                        {formatDuration(exercise.duration)}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 10, color: theme.subText }}>
                      {exercise.steps.length} steps
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.startButton}
                    onPress={() => setSelectedExercise(exercise)}
                  >
                    <MaterialIcons
                      name="play-arrow"
                      size={12}
                      color="#FFFFFF"
                    />
                    <Text
                      style={{ fontSize: 10, color: "#FFFFFF", marginLeft: 4 }}
                    >
                      Start
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Quick Start */}
      <View>
        <Text style={[styles.quickTitle, { color: theme.subText }]}>
          Quick Start
        </Text>
        <View style={styles.quickGrid}>
          {(["eye", "stretch", "breathing"] as const).map((category) => {
            const config = categoryConfig[category];
            const exercise = getRandomExercise(category);
            return (
              <TouchableOpacity
                key={category}
                style={[styles.quickButton, { backgroundColor: config.bg }]}
                onPress={() => exercise && setSelectedExercise(exercise)}
              >
                {config.icon}
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "500",
                    marginTop: 4,
                    color: "#000",
                  }}
                >
                  {config.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Exercise Modal */}
      <Modal visible={!!selectedExercise} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 16,
                marginBottom: 8,
                color: theme.text,
              }}
            >
              {selectedExercise?.name}
            </Text>
            <Text style={{ fontSize: 12, color: theme.subText }}>
              {selectedExercise?.description}
            </Text>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setSelectedExercise(null)}
            >
              <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 50 },
  header: { marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "bold" },
  subtitle: { fontSize: 14, color: "#6B7280" },
  tabs: { flexDirection: "row", marginBottom: 12 },
  tabButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  tabButtonActive: { backgroundColor: "#4F46E5" },
  tabText: { fontSize: 12 },
  tabCount: { fontSize: 10 },
  card: {
    flexDirection: "row",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  thumbnail: { width: 96, height: 96 },
  cardContent: { flex: 1, padding: 8, justifyContent: "space-between" },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4F46E5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  quickTitle: { fontSize: 12, fontWeight: "500", marginBottom: 6 },
  quickGrid: { flexDirection: "row", justifyContent: "space-between" },
  quickButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: { borderRadius: 12, padding: 16, width: "80%" },
  modalClose: {
    marginTop: 16,
    backgroundColor: "#4F46E5",
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
  },
});
