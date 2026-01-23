/* eslint-disable react-hooks/exhaustive-deps */
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import {
  CheckCircle2,
  Flame,
  Play,
  SkipForward,
  Target,
  Zap,
} from "lucide-react-native";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Exercise, HistoryItem, useData } from "../../components/DataContext";
import { DraggableModal } from "../../components/DragableModal";
import { ExerciseModal } from "../../components/ExerciseModal";
import { ReminderModal } from "../../components/Reminder-modal";
import { ReminderContext } from "../../components/reminderContext";
import { useTheme } from "../../components/ThemeContext";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // alert гаргах
    shouldPlaySound: true, // дуу тоглуулах
    shouldSetBadge: false, // badge update хийхгүй
    shouldShowBanner: true, // banner харагдах
    shouldShowList: true, // notification list-д харагдах
  }),
});
Notifications.addNotificationReceivedListener((notification) => {
  console.log("Notification received in foreground:", notification);
});

// -------------------- Notification function --------------------
export async function sendTestNotification(seconds: number = 10) {
  if (!Device.isDevice) {
    Alert.alert("Push notification зөвхөн real device дээр ажиллана");
    return;
  }

  // Permissions шалгах
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    Alert.alert("Notification permission татгалзагдлаа");
    return;
  }

  // Token авах
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log("Expo Push Token:", token);

  // Notification schedule хийх
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Сайн байна уу 👋",
      body: `${seconds} секундийн дараа notification`,
      sound: "default",
    },
    trigger: {
      type: "timeInterval",
      seconds,
      repeats: false,
    } as Notifications.TimeIntervalTriggerInput,
  });

  console.log(`Notification scheduled in ${seconds} seconds`);
}

export default function HomeScreen() {
  const { theme } = useTheme();
  const {
    reminderModalVisible,
    setReminderModalVisible,
    remindersEnabled,
    setRemindersEnabled,
  } = useContext(ReminderContext);

  // Use Global Data
  const { settings, exercises, stats, addHistoryItem } = useData();

  const [showExercise, setShowExercise] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );
  const [timeToNextBreak, setTimeToNextBreak] = useState("--:--");

  const scheduleNextBreak = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      const { status: newStatus } =
        await Notifications.requestPermissionsAsync();
      if (newStatus !== "granted") return;
    }

    if (!settings) return;

    await Notifications.cancelAllScheduledNotificationsAsync();

    const now = new Date();
    const [startH, startM] = settings.workStartTime.split(":").map(Number);
    const [endH, endM] = settings.workEndTime.split(":").map(Number);

    const start = new Date();
    start.setHours(startH, startM, 0, 0);

    const end = new Date();
    end.setHours(endH, endM, 0, 0);

    if (now > end) return;

    let triggerSeconds = 0;

    if (now < start) {
      triggerSeconds = (start.getTime() - now.getTime()) / 1000;
    } else {
      const elapsedMs = now.getTime() - start.getTime();
      const intervalMs = settings.reminderInterval * 60 * 1000;
      const msUntilNext = intervalMs - (elapsedMs % intervalMs);
      triggerSeconds = msUntilNext / 1000;
    }

    if (triggerSeconds > 0) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Time for a break! 🧘",
          body: "Take a moment to relax and stretch.",
          sound: "default",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: triggerSeconds,
          repeats: false,
        },
      });
    }
  };

  useEffect(() => {
    if (remindersEnabled) {
      scheduleNextBreak();
    } else {
      Notifications.cancelAllScheduledNotificationsAsync();
    }
  }, [remindersEnabled, settings]);

  // Notification-д сонсох listener (foreground-д alert)
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received:", notification);
      },
    );
    return () => subscription.remove();
  }, []);

  // Timer Logic
  useEffect(() => {
    if (!remindersEnabled || !settings) {
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
            .padStart(2, "0")}`,
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
            .padStart(2, "0")}`,
        );
      } else {
        setTimeToNextBreak(
          `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`,
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
    if (exercises.length === 0) return;
    const randomIndex = Math.floor(Math.random() * exercises.length);
    setSelectedExercise(exercises[randomIndex]);
    setShowExercise(true);
  };

  const handleExerciseComplete = async (completed: boolean) => {
    setShowExercise(false);
    if (completed && selectedExercise) {
      const newEntry: HistoryItem = {
        id: Date.now().toString(),
        exerciseId: selectedExercise.id,
        exerciseName: selectedExercise.name,
        category: selectedExercise.category,
        completedAt: new Date().toISOString(),
        status: "completed", // now TS knows it's the correct literal type
      };

      try {
        const existing = await AsyncStorage.getItem("exerciseHistory");
        const history = existing ? JSON.parse(existing) : [];
        const updatedHistory = [newEntry, ...history];
        await AsyncStorage.setItem(
          "exerciseHistory",
          JSON.stringify(updatedHistory),
        );

        // Update global context state
        addHistoryItem(newEntry);

        // Save to backend
        try {
          // Replace with your backend URL (e.g., http://10.0.2.2:5000 for Android Emulator)
          await fetch(`http://172.20.10.2:5000/api/history`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newEntry),
          });
        } catch (err) {
          console.log("Failed to save to backend:", err);
        }
      } catch (e) {
        console.error("Failed to save history", e);
      }
    }
  };

  const weeklyProgress = stats
    ? (stats.weeklyCompleted / stats.weeklyGoal) * 100
    : 0;

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
      <View style={[styles.statCard, { backgroundColor: theme.card }]}>
        <View style={styles.statHeader}>
          {icon}
          <Text style={[styles.statLabel, { color: theme.subText }]}>
            {label}
          </Text>
        </View>
        <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
      </View>
    );
  }

  function Badge({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
      <View style={[styles.badge, { backgroundColor: theme.card }]}>
        {icon}
        <Text style={[styles.badgeText, { color: theme.text }]}>{label}</Text>
      </View>
    );
  }

  // -------------------- Render --------------------
  return (
    <>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.background },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.subtitle, { color: theme.subText }]}>
            Good morning
          </Text>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: theme.text }]}>Matrix</Text>
            <Zap size={18} color="#6366f1" />
          </View>
        </View>

        {/* Timer Card */}
        {remindersEnabled ? (
          <View
            style={[
              styles.card,
              styles.timerCard,
              { backgroundColor: theme.card },
            ]}
          >
            <Text style={[styles.mutedText, { color: theme.subText }]}>
              Next break in
            </Text>
            <Text style={[styles.timer, { color: theme.text }]}>
              {timeToNextBreak}
            </Text>

            <Pressable
              style={styles.primaryButton}
              onPress={handleStartExercise}
            >
              <Play size={16} color="#fff" />
              <Text style={styles.primaryButtonText}>Start Now</Text>
            </Pressable>
          </View>
        ) : (
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.sectionLabel, { color: theme.subText }]}>
              Reminders are disabled.
            </Text>
          </View>
        )}

        {/* Stats Grid */}
        <View style={styles.grid}>
          <StatCard
            icon={<CheckCircle2 size={16} color="#6366f1" />}
            label="Completed"
            value={stats?.todayCompleted ?? 0}
          />
          <StatCard
            icon={<SkipForward size={16} color="#6366f1" />}
            label="Skipped"
            value={stats?.todaySkipped ?? 0}
          />
          <StatCard
            icon={<Flame size={16} color="#f97316" />}
            label="Streak"
            value={`${stats?.streak ?? 0} days`}
          />
          <StatCard
            icon={<Target size={16} color="#6366f1" />}
            label="Weekly"
            value={`${stats?.weeklyCompleted ?? 0}/${stats?.weeklyGoal ?? 0}`}
          />
        </View>

        {/* Weekly Progress */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressTitle, { color: theme.text }]}>
              Weekly Progress
            </Text>
            <Text style={[styles.mutedText, { color: theme.subText }]}>
              {Math.round(weeklyProgress)}%
            </Text>
          </View>
          <View
            style={[styles.progressTrack, { backgroundColor: theme.iconBg }]}
          >
            <View
              style={[styles.progressFill, { width: `${weeklyProgress}%` }]}
            />
          </View>
        </View>

        {/* Active Categories */}
        <Text style={[styles.sectionLabel, { color: theme.subText }]}>
          Active Categories
        </Text>
        <View style={styles.badgeRow}>
          {settings?.enabledCategories?.includes("eye") && (
            <Badge icon={<Zap size={14} color="#6366f1" />} label="Eye Care" />
          )}
          {settings?.enabledCategories?.includes("stretch") && (
            <Badge
              icon={<Zap size={14} color="#6366f1" />}
              label="Stretching"
            />
          )}
          {settings?.enabledCategories?.includes("breathing") && (
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
      {showExercise && selectedExercise && (
        <DraggableModal
          visible={showExercise}
          onclose={() => setShowExercise(false)}
        >
          <ExerciseModal
            exercise={selectedExercise}
            onComplete={handleExerciseComplete}
            onClose={() => setShowExercise(false)}
          />
        </DraggableModal>
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
