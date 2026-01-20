import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useFocusEffect } from "expo-router";
import {
  CheckCircle2,
  Flame,
  Play,
  SkipForward,
  Target,
  Zap,
} from "lucide-react-native";
import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { ExerciseModal } from "../../components/ExerciseModal";
import { ReminderModal } from "../../components/Reminder-modal";
import { ReminderContext } from "../../components/reminderContext";
import {
  mockExercises,
  mockSettings,
  mockStats,
} from "../../lib/mock-data";

/* =========================
   Notification үндсэн тохиргоо
========================= */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,   // Notification alert харуулна
    shouldPlaySound: true,   // Дуу тоглуулна
    shouldSetBadge: false,  // App icon badge нэмэхгүй
    shouldShowBanner: true, // Banner хэлбэрээр харуулна
    shouldShowList: true,   // Notification жагсаалтад харуулна
  }),
});

// Foreground дээр notification ирэхэд
Notifications.addNotificationReceivedListener((notification) => {
  console.log("Foreground дээр notification ирлээ:", notification);
});

/* =========================
   Test Notification илгээх
========================= */
export async function sendTestNotification(seconds: number = 10) {
  // Зөвхөн бодит төхөөрөмж дээр ажиллана
  if (!Device.isDevice) {
    Alert.alert(
      "Анхааруулга",
      "Push notification зөвхөн бодит төхөөрөмж дээр ажиллана"
    );
    return;
  }

  // Permission шалгах
  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } =
      await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    Alert.alert(
      "Зөвшөөрөл татгалзагдлаа",
      "Notification илгээх зөвшөөрөл олгогдоогүй"
    );
    return;
  }

  // Expo Push Token авах
  const token =
    (await Notifications.getExpoPushTokenAsync()).data;
  console.log("Expo Push Token:", token);

  // Notification төлөвлөх
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Сайн байна уу 👋",
      body: `${seconds} секундын дараа сануулга ирнэ`,
      sound: "default",
    },
    trigger: {
      type: "timeInterval",
      seconds,
      repeats: false,
    } as Notifications.TimeIntervalTriggerInput,
  });

  console.log(`${seconds} секундын дараа notification төлөвлөгдлөө`);
}

/* =========================
   Home Screen
========================= */
export default function HomeScreen() {
  const {
    reminderModalVisible,
    setReminderModalVisible,
    remindersEnabled,
    setRemindersEnabled,
  } = useContext(ReminderContext);

  const [showExercise, setShowExercise] = useState(false);
  const [selectedExercise, setSelectedExercise] =
    useState(mockExercises[0]);
  const [timeToNextBreak, setTimeToNextBreak] =
    useState("--:--");
  const [settings, setSettings] =
    useState(mockSettings);

  // Сануулга идэвхжихэд test notification
  useEffect(() => {
    if (remindersEnabled) {
      sendTestNotification(10);
    }
  }, [remindersEnabled]);

  // Notification listener
  useEffect(() => {
    const subscription =
      Notifications.addNotificationReceivedListener(
        (notification) => {
          console.log("Notification ирлээ:", notification);
        }
      );
    return () => subscription.remove();
  }, []);

  // Screen focus болох үед тохиргоо унших
  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("reminderSettings").then(
        (value) => {
          if (value) {
            setSettings({
              ...mockSettings,
              ...JSON.parse(value),
            });
          }
        }
      );
    }, [])
  );

  /* =========================
     Timer логик
  ========================= */
  useEffect(() => {
    if (!remindersEnabled) {
      setTimeToNextBreak("Түр зогссон");
      return;
    }

    const updateTimer = () => {
      const now = new Date();

      const [startH, startM] =
        settings.workStartTime.split(":").map(Number);
      const [endH, endM] =
        settings.workEndTime.split(":").map(Number);

      const start = new Date();
      start.setHours(startH, startM, 0, 0);

      const end = new Date();
      end.setHours(endH, endM, 0, 0);

      // Ажил эхлээгүй бол
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

      // Ажил дууссан бол
      if (now > end) {
        setTimeToNextBreak("Дууссан");
        return;
      }

      const elapsedMs =
        now.getTime() - start.getTime();
      const intervalMs =
        settings.reminderInterval * 60 * 1000;

      const msUntilNext =
        intervalMs - (elapsedMs % intervalMs);

      const m = Math.floor(msUntilNext / 60000);
      const s = Math.floor((msUntilNext % 60000) / 1000);

      if (m >= 60) {
        const h = Math.floor(m / 60);
        setTimeToNextBreak(
          `${h}:${(m % 60)
            .toString()
            .padStart(2, "0")}:${s
            .toString()
            .padStart(2, "0")}`
        );
      } else {
        setTimeToNextBreak(
          `${m.toString().padStart(2, "0")}:${s
            .toString()
            .padStart(2, "0")}`
        );
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [remindersEnabled, settings]);

  /* =========================
     Handler-ууд
  ========================= */
  const handleEnable = async () => {
    await AsyncStorage.setItem(
      "remindersEnabled",
      "true"
    );
    setRemindersEnabled(true);
    setReminderModalVisible(false);
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem(
      "remindersEnabled",
      "false"
    );
    setRemindersEnabled(false);
    setReminderModalVisible(false);
  };

  const handleStartExercise = () => {
    const randomIndex = Math.floor(
      Math.random() * mockExercises.length
    );
    setSelectedExercise(mockExercises[randomIndex]);
    setShowExercise(true);
  };

  const weeklyProgress =
    (mockStats.weeklyCompleted /
      mockStats.weeklyGoal) *
    100;

  /* =========================
     Reusable компонентууд
  ========================= */
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

  function Badge({
    icon,
    label,
  }: {
    icon: React.ReactNode;
    label: string;
  }) {
    return (
      <View style={styles.badge}>
        {icon}
        <Text style={styles.badgeText}>{label}</Text>
      </View>
    );
  }

  /* =========================
     Render
  ========================= */
  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Толгой хэсэг */}
        <View style={styles.header}>
          <Text style={styles.subtitle}>
            Өглөөний мэнд
          </Text>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Matrix</Text>
            <Zap size={18} color="#6366f1" />
          </View>
        </View>

        {/* Timer карт */}
        {remindersEnabled ? (
          <View style={[styles.card, styles.timerCard]}>
            <Text style={styles.mutedText}>
              Дараагийн завсарлага хүртэл
            </Text>
            <Text style={styles.timer}>
              {timeToNextBreak}
            </Text>

            <Pressable
              style={styles.primaryButton}
              onPress={handleStartExercise}
            >
              <Play size={16} color="#fff" />
              <Text style={styles.primaryButtonText}>
                Одоо эхлэх
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>
              Сануулга идэвхгүй байна
            </Text>
          </View>
        )}

        {/* Статистик */}
        <View style={styles.grid}>
          <StatCard
            icon={<CheckCircle2 size={16} color="#6366f1" />}
            label="Гүйцэтгэсэн"
            value={mockStats.todayCompleted}
          />
          <StatCard
            icon={<SkipForward size={16} color="#6b7280" />}
            label="Алгассан"
            value={mockStats.todaySkipped}
          />
          <StatCard
            icon={<Flame size={16} color="#f97316" />}
            label="Дараалал"
            value={`${mockStats.streak} өдөр`}
          />
          <StatCard
            icon={<Target size={16} color="#6366f1" />}
            label="7 хоногийн зорилт"
            value={`${mockStats.weeklyCompleted}/${mockStats.weeklyGoal}`}
          />
        </View>

        {/* 7 хоногийн явц */}
        <View style={styles.card}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>
              7 хоногийн ахиц
            </Text>
            <Text style={styles.mutedText}>
              {Math.round(weeklyProgress)}%
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${weeklyProgress}%` },
              ]}
            />
          </View>
        </View>

        {/* Идэвхтэй ангиллууд */}
        <Text style={styles.sectionLabel}>
          Идэвхтэй ангиллууд
        </Text>
        <View style={styles.badgeRow}>
          {settings.enabledCategories.includes("eye") && (
            <Badge
              icon={<Zap size={14} color="#6366f1" />}
              label="Нүдний дасгал"
            />
          )}
          {settings.enabledCategories.includes("stretch") && (
            <Badge
              icon={<Zap size={14} color="#6366f1" />}
              label="Сунгалт"
            />
          )}
          {settings.enabledCategories.includes("breathing") && (
            <Badge
              icon={<Zap size={14} color="#6366f1" />}
              label="Амьсгалын дасгал"
            />
          )}
        </View>
      </ScrollView>

      {/* Сануулгын modal */}
      {reminderModalVisible && (
        <ReminderModal
          visible={reminderModalVisible}
          onComplete={handleEnable}
          onSkip={handleSkip}
        />
      )}

      {/* Дасгал modal */}
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

/* =========================
   Styles
========================= */
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 120,
  },
  header: { marginBottom: 32 },
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
  title: { fontSize: 24, fontWeight: "700" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  timerCard: { alignItems: "center" },
  mutedText: { fontSize: 12, color: "#6b7280" },
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
  badgeText: { fontSize: 12, fontWeight: "500" },
});
