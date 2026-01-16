import React, { useCallback, useContext, useEffect, useState } from "react";
import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import { useFocusEffect } from "expo-router";
import {
  Zap,
  Play,
  CheckCircle2,
  Eye,
  Flame,
  Target,
  SkipForward,
} from "lucide-react-native";
import { ExerciseModal } from "../../components/ExerciseModal";
import { mockExercises, mockSettings, mockStats } from "../../lib/mock-data";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { ReminderContext } from "../../components/reminderContext";
import { ReminderModal } from "../../components/Reminder-modal";

export default function HomeScreen() {
  const {
    reminderModalVisible,
    setReminderModalVisible,
    remindersEnabled,
    setRemindersEnabled,
  } = useContext(ReminderContext);

  const [showExercise, setShowExercise] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(mockExercises[0]);
  const [timeToNextBreak, setTimeToNextBreak] = useState("--:--");
  const [settings, setSettings] = useState(mockSettings);

  // Load settings when screen focuses
  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("reminderSettings").then((value) => {
        if (value) {
          setSettings({ ...mockSettings, ...JSON.parse(value) });
        }
      });
    }, [])
  );

  // Timer Logic
  useEffect(() => {
    if (!remindersEnabled) {
      setTimeToNextBreak("Paused");
      return;
    }

    const updateTimer = () => {
      const now = new Date();
      const [startH, startM] = settings.workStartTime.split(":").map(Number);
      const [endH, endM] = settings.workEndTime.split(":").map(Number);

      const start = new Date();
      start.setHours(startH, startM, 0, 0);

      const end = new Date();
      end.setHours(endH, endM, 0, 0);

      if (now < start) {
        const diff = start.getTime() - now.getTime();
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setTimeToNextBreak(
          `${h}:${m.toString().padStart(2, "0")}:${s
            .toString()
            .padStart(2, "0")}`
        );
        return;
      }

      if (now > end) {
        setTimeToNextBreak("Done");
        return;
      }

      const elapsedMs = now.getTime() - start.getTime();
      const intervalMs = settings.reminderInterval * 60 * 1000;
      const msUntilNext = intervalMs - (elapsedMs % intervalMs);
      const m = Math.floor(msUntilNext / 60000);
      const s = Math.floor((msUntilNext % 60000) / 1000);

      if (m >= 60) {
        const h = Math.floor(m / 60);
        setTimeToNextBreak(
          `${h}:${(m % 60).toString().padStart(2, "0")}:${s
            .toString()
            .padStart(2, "0")}`
        );
      } else {
        setTimeToNextBreak(
          `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
        );
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [remindersEnabled, settings]);

  // -------------------- Handlers --------------------
  const handleEnable = async () => {
    await AsyncStorage.setItem("remindersEnabled", "true");
    setRemindersEnabled(true);
    setReminderModalVisible(false);
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem("remindersEnabled", "false");
    setRemindersEnabled(false);
    setReminderModalVisible(false);
  };

  const handleStartExercise = () => {
    const randomIndex = Math.floor(Math.random() * mockExercises.length);
    setSelectedExercise(mockExercises[randomIndex]);
    setShowExercise(true);
  };

  const weeklyProgress =
    (mockStats.weeklyCompleted / mockStats.weeklyGoal) * 100;

  // -------------------- Reusable Components --------------------
  function StatCard({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
  }) {
    return (
      <View style={styles.statCard}>
        <View style={styles.statHeader}>
          {icon}
          <Text style={styles.statLabel}>{label}</Text>
        </View>
        <Text style={styles.statValue}>{value}</Text>
      </View>
    );
  }

  function Badge({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
      <View style={styles.badge}>
        {icon}
        <Text style={styles.badgeText}>{label}</Text>
      </View>
    );
  }

  // -------------------- Render --------------------
  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.subtitle}>Good morning</Text>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Matrix</Text>
            <Zap size={18} color="#6366f1" />
          </View>
        </View>

        {/* Timer Card */}
        {remindersEnabled ? (
          <View style={[styles.card, styles.timerCard]}>
            <Text style={styles.mutedText}>Next break in</Text>
            <Text style={styles.timer}>{timeToNextBreak}</Text>

            <Pressable
              style={styles.primaryButton}
              onPress={handleStartExercise}
            >
              <Play size={16} color="#fff" />
              <Text style={styles.primaryButtonText}>Start Now</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>Reminders are disabled.</Text>
          </View>
        )}

        {/* Stats Grid */}
        <View style={styles.grid}>
          <StatCard
            icon={<CheckCircle2 size={16} color="#6366f1" />}
            label="Completed"
            value={mockStats.todayCompleted}
          />
          <StatCard
            icon={<SkipForward size={16} color="#6b7280" />}
            label="Skipped"
            value={mockStats.todaySkipped}
          />
          <StatCard
            icon={<Flame size={16} color="#f97316" />}
            label="Streak"
            value={`${mockStats.streak} days`}
          />
          <StatCard
            icon={<Target size={16} color="#6366f1" />}
            label="Weekly"
            value={`${mockStats.weeklyCompleted}/${mockStats.weeklyGoal}`}
          />
        </View>

        {/* Weekly Progress */}
        <View style={styles.card}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Weekly Progress</Text>
            <Text style={styles.mutedText}>{Math.round(weeklyProgress)}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[styles.progressFill, { width: `${weeklyProgress}%` }]}
            />
          </View>
        </View>

        {/* Active Categories */}
        <Text style={styles.sectionLabel}>Active Categories</Text>
        <View style={styles.badgeRow}>
          {settings.enabledCategories.includes("eye") && (
            <Badge icon={<Zap size={14} color="#6366f1" />} label="Eye Care" />
          )}
          {settings.enabledCategories.includes("stretch") && (
            <Badge
              icon={<Zap size={14} color="#6366f1" />}
              label="Stretching"
            />
          )}
          {settings.enabledCategories.includes("breathing") && (
            <Badge icon={<Zap size={14} color="#6366f1" />} label="Breathing" />
          )}
        </View>
      </ScrollView>

      {/* Reminder Modal */}
      {reminderModalVisible && (
        <ReminderModal
          visible={reminderModalVisible}
          onComplete={handleEnable}
          onSkip={handleSkip}
        />
      )}

      {/* Exercise Modal */}
      {showExercise && (
        <ExerciseModal
          exercise={selectedExercise}
          onComplete={() => setShowExercise(false)}
          onClose={() => setShowExercise(false)}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 48, paddingBottom: 120 },
  header: { marginBottom: 32 },
  subtitle: { fontSize: 12, color: "#6b7280", marginBottom: 4 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  title: { fontSize: 24, fontWeight: "700" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  timerCard: { alignItems: "center" },
  mutedText: { fontSize: 12, color: "#6b7280" },
  timer: { fontSize: 48, fontWeight: "700", marginVertical: 16 },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#6366f1",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
  },
  primaryButtonText: { color: "#fff", fontWeight: "600" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 16 },
  statCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  statLabel: { fontSize: 12, color: "#6b7280" },
  statValue: { fontSize: 22, fontWeight: "700" },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressTitle: { fontWeight: "600" },
  progressTrack: {
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "#6366f1" },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 8,
  },
  badgeRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 999,
  },
  badgeText: { fontSize: 12, fontWeight: "500" },
});
