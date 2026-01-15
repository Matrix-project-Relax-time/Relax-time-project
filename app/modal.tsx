import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import {
  CheckCircle2,
  Eye,
  Flame,
  Play,
  SkipForward,
  Speech as Stretch,
  Target,
  Wind,
  Zap,
} from "lucide-react-native";
import { ExerciseModal } from "../components/ExerciseModal";
import { mockExercises, mockSettings, mockStats } from "../lib/mock-data";

export default function HomeScreen() {
  const [showExercise, setShowExercise] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(mockExercises[0]);

  const handleStartExercise = () => {
    const randomIndex = Math.floor(Math.random() * mockExercises.length);
    setSelectedExercise(mockExercises[randomIndex]);
    setShowExercise(true);
  };

  const timeToNextBreak = "23:45";

  const weeklyProgress =
    (mockStats.weeklyCompleted / mockStats.weeklyGoal) * 100;

  return (
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
      <View style={[styles.card, styles.timerCard]}>
        <Text style={styles.mutedText}>Next break in</Text>
        <Text style={styles.timer}>{timeToNextBreak}</Text>

        <Pressable style={styles.primaryButton} onPress={handleStartExercise}>
          <Play size={16} color="#fff" />
          <Text style={styles.primaryButtonText}>Start Now</Text>
        </Pressable>
      </View>

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
        {mockSettings.enabledCategories.includes("eye") && (
          <Badge icon={<Eye size={14} color="#6366f1" />} label="Eye Care" />
        )}

        {mockSettings.enabledCategories.includes("stretch") && (
          <Badge
            icon={<Stretch size={14} color="#6366f1" />}
            label="Stretching"
          />
        )}

        {mockSettings.enabledCategories.includes("breathing") && (
          <Badge icon={<Wind size={14} color="#6366f1" />} label="Breathing" />
        )}
      </View>

      {/* Exercise Modal */}
      {showExercise && (
        <ExerciseModal
          exercise={selectedExercise}
          onComplete={() => setShowExercise(false)}
          onClose={() => setShowExercise(false)}
        />
      )}
    </ScrollView>
  );
}

/* ------------------ */
/* Reusable pieces   */
/* ------------------ */

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

/* ------------------ */
/* Styles            */
/* ------------------ */

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 120,
  },

  header: {
    marginBottom: 32,
  },
  subtitle: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },

  timerCard: {
    alignItems: "center",
  },

  mutedText: {
    fontSize: 12,
    color: "#6b7280",
  },

  timer: {
    fontSize: 48,
    fontWeight: "700",
    marginVertical: 16,
  },

  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#6366f1",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },

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
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressTitle: {
    fontWeight: "600",
  },
  progressTrack: {
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6366f1",
  },

  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 8,
  },

  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
