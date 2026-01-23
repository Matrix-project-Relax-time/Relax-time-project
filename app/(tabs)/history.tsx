import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons"; // Using Expo icons
import { JSX, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { HistoryItem, useData } from "../../components/DataContext";
import LoadingScreen from "../../components/loading-screen";
import { useTheme } from "../../components/ThemeContext";

type FilterPeriod = "today" | "week" | "all";

const CATEGORY_ICONS: Record<string, JSX.Element> = {
  eye: <Feather name="eye" size={20} color="#4F46E5" />,
  stretch: <MaterialIcons name="accessibility" size={20} color="#4F46E5" />,
  breathing: <Ionicons name="water-outline" size={20} color="#4F46E5" />,
};

export default function HistoryScreen() {
  const { theme } = useTheme();
  const { history, isLoading } = useData();
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>("week");

  if (isLoading) {
    return <LoadingScreen message="Loading history..." />;
  }

  const filteredHistory = history.filter((item) => {
    const date = new Date(item.completedAt);
    const now = new Date();

    if (filterPeriod === "today") {
      return (
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }
    if (filterPeriod === "week") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return date >= oneWeekAgo;
    }
    return true;
  });

  const completed = filteredHistory.filter(
    (e) => e.status === "completed",
  ).length;
  const skipped = filteredHistory.filter((e) => e.status === "skipped").length;
  const completionRate =
    filteredHistory.length > 0
      ? Math.round((completed / filteredHistory.length) * 100)
      : 0;

  // Group by date
  const groupedHistory: Record<string, HistoryItem[]> = {};
  filteredHistory.forEach((entry) => {
    const date = new Date(entry.completedAt);
    const key = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    if (!groupedHistory[key]) groupedHistory[key] = [];
    groupedHistory[key].push(entry);
  });

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>History</Text>
        <Text style={[styles.subtitle, { color: theme.subText }]}>
          Track your wellness journey
        </Text>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {(["today", "week", "all"] as FilterPeriod[]).map((period) => (
          <TouchableOpacity
            key={period}
            onPress={() => setFilterPeriod(period)}
            style={[
              styles.filterButton,
              filterPeriod === period && styles.filterButtonActive,
              {
                backgroundColor:
                  filterPeriod === period ? theme.primary : theme.card,
              },
            ]}
          >
            <Text
              style={[
                styles.filterText,
                { color: filterPeriod === period ? "#fff" : theme.text },
              ]}
            >
              {period === "today"
                ? "Today"
                : period === "week"
                  ? "This Week"
                  : "All Time"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <Feather name="check-circle" size={20} color="#4F46E5" />
          <Text style={[styles.statNumber, { color: theme.text }]}>
            {completed}
          </Text>
          <Text style={[styles.statLabel, { color: theme.subText }]}>
            Completed
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <Feather name="trending-up" size={20} color="#10B981" />
          <Text style={[styles.statNumber, { color: theme.text }]}>
            {completionRate}%
          </Text>
          <Text style={[styles.statLabel, { color: theme.subText }]}>Rate</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <Feather name="x-circle" size={20} color="#6B7280" />
          <Text style={[styles.statNumber, { color: theme.text }]}>
            {skipped}
          </Text>
          <Text style={[styles.statLabel, { color: theme.subText }]}>
            Skipped
          </Text>
        </View>
      </View>

      {/* History List */}
      {Object.keys(groupedHistory).length === 0 ? (
        <View style={[styles.emptyCard, { backgroundColor: theme.card }]}>
          <Feather name="calendar" size={40} color="#6B7280" />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            No history yet
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.subText }]}>
            Complete exercises to track progress
          </Text>
        </View>
      ) : (
        Object.entries(groupedHistory).map(([date, entries]) => (
          <View key={date} style={{ marginBottom: 20 }}>
            <Text style={[styles.groupDate, { color: theme.subText }]}>
              {date}
            </Text>
            {entries.map((entry) => {
              const isCompleted = entry.status === "completed";
              const Icon = CATEGORY_ICONS[entry.category] || (
                <Feather name="circle" size={20} color="#6B7280" />
              );
              const time = new Date(entry.completedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <View
                  key={entry.id}
                  style={[
                    styles.historyCard,
                    !isCompleted && { opacity: 0.5 },
                    { backgroundColor: theme.card },
                  ]}
                >
                  <View
                    style={[
                      styles.iconWrapper,
                      isCompleted
                        ? { backgroundColor: theme.primary + "20" }
                        : { backgroundColor: theme.iconBg },
                    ]}
                  >
                    {Icon}
                  </View>
                  <View style={styles.historyInfo}>
                    <Text style={[styles.exerciseName, { color: theme.text }]}>
                      {entry.exerciseName}
                    </Text>
                    <Text style={styles.exerciseTime}>{time}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      isCompleted
                        ? { backgroundColor: theme.primary + "20" }
                        : { backgroundColor: theme.iconBg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        isCompleted && { color: "#4F46E5" },
                      ]}
                    >
                      {isCompleted ? "Done" : "Skipped"}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#F9FAFB",
    paddingTop: 50,
  },
  header: { marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "bold" },
  subtitle: { fontSize: 14, color: "#6B7280" },
  filterContainer: { flexDirection: "row", marginBottom: 16 },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
    marginRight: 8,
  },
  filterButtonActive: { backgroundColor: "#4F46E5" },
  filterText: { fontSize: 12, color: "#374151" },
  filterTextActive: { color: "#FFF" },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    marginHorizontal: 4,
  },
  statNumber: { fontSize: 18, fontWeight: "bold", marginTop: 4 },
  statLabel: { fontSize: 10, color: "#6B7280" },
  emptyCard: {
    alignItems: "center",
    padding: 24,
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginTop: 16,
  },
  emptyTitle: { fontSize: 16, fontWeight: "600", marginTop: 8 },
  emptySubtitle: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 4,
  },
  groupDate: { fontSize: 12, color: "#6B7280", marginBottom: 8 },
  historyCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    marginBottom: 8,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  historyInfo: { flex: 1 },
  exerciseName: { fontSize: 14, fontWeight: "500" },
  exerciseTime: { fontSize: 10, color: "#6B7280", marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  statusText: { fontSize: 10, fontWeight: "500", color: "#6B7280" },
});
