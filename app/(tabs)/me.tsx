import React, { JSX, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Modal,
} from "react-native";
import { MaterialIcons, Feather, Ionicons } from "@expo/vector-icons";
import { mockExercises } from "@/lib/mock-data";

type Category = "all" | "eye" | "stretch" | "breathing";

const TABS: { value: Category; label: string; icon: JSX.Element }[] = [
  {
    value: "all",
    label: "All",
    icon: <MaterialIcons name="auto-awesome" size={16} color="#4F46E5" />,
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
    icon: <Ionicons name="water-outline" size={16} color="#8B5CF6" />,
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
    color: "#8B5CF6",
    bg: "#EDE9FE",
    icon: <Ionicons name="water-outline" size={20} color="#8B5CF6" />,
  },
};

function formatDuration(seconds: number): string {
  return seconds >= 60
    ? `${Math.floor(seconds / 60)}m ${seconds % 60}s`
    : `${seconds}s`;
}

export default function ExercisesScreen() {
  const [activeTab, setActiveTab] = useState<Category>("all");
  const [selectedExercise, setSelectedExercise] = useState<
    (typeof mockExercises)[0] | null
  >(null);

  const filteredExercises =
    activeTab === "all"
      ? mockExercises
      : mockExercises.filter((e) => e.category === activeTab);

  const getRandomExercise = (category: "eye" | "stretch" | "breathing") => {
    const exercises = mockExercises.filter((e) => e.category === category);
    return exercises[Math.floor(Math.random() * exercises.length)];
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Exercises</Text>
        <Text style={styles.subtitle}>Browse and start exercises</Text>
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
              ? mockExercises.length
              : mockExercises.filter((e) => e.category === tab.value).length;
          return (
            <TouchableOpacity
              key={tab.value}
              onPress={() => setActiveTab(tab.value)}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                {tab.icon}
                <Text
                  style={[styles.tabText, isActive && { color: "#FFFFFF" }]}
                >
                  {tab.label}
                </Text>
                <Text
                  style={[
                    styles.tabCount,
                    isActive
                      ? { color: "rgba(255,255,255,0.7)" }
                      : { color: "#6B7280" },
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
          const config = categoryConfig[exercise.category];
          return (
            <TouchableOpacity
              key={exercise.id}
              style={styles.card}
              onPress={() => setSelectedExercise(exercise)}
            >
              <Image
                source={
                  exercise.image
                    ? { uri: exercise.image }
                    : require("../assets/placeholder.png")
                }
                style={styles.thumbnail}
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
                    <Text style={{ fontSize: 10, color: "#6B7280" }}>
                      {config.label}
                    </Text>
                  </View>
                  <Text
                    style={{ fontWeight: "600", fontSize: 14, marginBottom: 2 }}
                  >
                    {exercise.name}
                  </Text>
                  <Text
                    style={{ fontSize: 12, color: "#6B7280" }}
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
                      <Text style={{ fontSize: 10, color: "#6B7280" }}>
                        {formatDuration(exercise.duration)}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 10, color: "#6B7280" }}>
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
        <Text style={styles.quickTitle}>Quick Start</Text>
        <View style={styles.quickGrid}>
          {(["eye", "stretch", "breathing"] as const).map((category) => {
            const config = categoryConfig[category];
            return (
              <TouchableOpacity
                key={category}
                style={[styles.quickButton, { backgroundColor: config.bg }]}
                onPress={() => setSelectedExercise(getRandomExercise(category))}
              >
                {config.icon}
                <Text style={{ fontSize: 10, fontWeight: "500", marginTop: 4 }}>
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
          <View style={styles.modalContent}>
            <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>
              {selectedExercise?.name}
            </Text>
            <Text style={{ fontSize: 12, color: "#6B7280" }}>
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
  container: { flex: 1, padding: 16, backgroundColor: "#F9FAFB" },
  header: { marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "bold" },
  subtitle: { fontSize: 14, color: "#6B7280" },
  tabs: { flexDirection: "row", marginBottom: 12 },
  tabButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
    marginRight: 8,
  },
  tabButtonActive: { backgroundColor: "#4F46E5" },
  tabText: { fontSize: 12, color: "#374151" },
  tabCount: { fontSize: 10 },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  thumbnail: { width: 96, height: 96, backgroundColor: "#E5E7EB" },
  cardContent: { flex: 1, padding: 8, justifyContent: "space-between" },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4F46E5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  quickTitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
    marginBottom: 6,
  },
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
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    width: "80%",
  },
  modalClose: {
    marginTop: 16,
    backgroundColor: "#4F46E5",
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
  },
});
