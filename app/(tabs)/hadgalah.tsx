import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface WorkSchedule {
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  notificationInterval: number; // in minutes
  enabled: boolean;
}

export default function WorkScheduleManager() {
  const [schedule, setSchedule] = useState<WorkSchedule>({
    startTime: "11:45",
    endTime: "17:00",
    notificationInterval: 1,
    enabled: false,
  });

  const [editMode, setEditMode] = useState(false);
  const [tempSchedule, setTempSchedule] = useState<WorkSchedule>(schedule);
  const [minutesUntilReminder, setMinutesUntilReminder] = useState<
    number | null
  >(null);
  const [timeUntilReminder, setTimeUntilReminder] = useState<{
    min: number;
    sec: number;
  } | null>(null);

  useEffect(() => {
    if (!schedule.enabled) {
      setTimeUntilReminder(null);
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const [startHour, startMin] = schedule.startTime.split(":").map(Number);
      const [endHour, endMin] = schedule.endTime.split(":").map(Number);

      const startDate = new Date();
      startDate.setHours(startHour, startMin, 0, 0);
      const endDate = new Date();
      endDate.setHours(endHour, endMin, 0, 0);

      if (now < startDate) {
        // Start цаг хүртэлх хугацаа
        const diffMs = startDate.getTime() - now.getTime();

        // 1 минутын дараа notification ирэх
        const secondsUntilNextReminder = Math.max(
          60,
          Math.floor(diffMs / 1000)
        );

        setTimeUntilReminder({
          min: Math.floor(secondsUntilNextReminder / 60),
          sec: secondsUntilNextReminder % 60,
        });

        return;
      }

      if (now > endDate) {
        setTimeUntilReminder(null);
        return;
      }

      const minutesSinceStart = Math.floor(
        (now.getTime() - startDate.getTime()) / 60000
      );
      const nextReminderMin =
        schedule.notificationInterval -
        (minutesSinceStart % schedule.notificationInterval);

      // Дараагийн сануулах цагийг секундээр
      const nextReminderTime = new Date(
        startDate.getTime() + minutesSinceStart * 60000
      );
      const nextReminderInMs =
        schedule.notificationInterval * 60000 -
        (now.getTime() - nextReminderTime.getTime());

      setTimeUntilReminder({
        min: Math.floor(nextReminderInMs / 60000),
        sec: Math.floor((nextReminderInMs % 60000) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [schedule]);

  // Load schedule from storage
  useEffect(() => {
    loadSchedule();
  }, []);

  // Setup notifications when schedule changes
  useEffect(() => {
    if (schedule.enabled) {
      setupNotifications(schedule); // schedule-г дамжуулж байна
    }
  }, [schedule]);

  // Countdown timer
  useEffect(() => {
    if (!schedule.enabled) {
      setMinutesUntilReminder(null);
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const [startHour, startMin] = schedule.startTime.split(":").map(Number);
      const [endHour, endMin] = schedule.endTime.split(":").map(Number);

      const startDate = new Date();
      startDate.setHours(startHour, startMin, 0, 0);
      const endDate = new Date();
      endDate.setHours(endHour, endMin, 0, 0);

      if (now < startDate) {
        setMinutesUntilReminder(
          Math.ceil((startDate.getTime() - now.getTime()) / 60000)
        );
        return;
      }

      if (now > endDate) {
        setMinutesUntilReminder(null);
        return;
      }

      const minutesSinceStart = Math.floor(
        (now.getTime() - startDate.getTime()) / 60000
      );
      const nextReminderIn =
        schedule.notificationInterval -
        (minutesSinceStart % schedule.notificationInterval);
      setMinutesUntilReminder(
        nextReminderIn > 0 ? nextReminderIn : schedule.notificationInterval
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [schedule]);

  const loadSchedule = async () => {
    try {
      const saved = await AsyncStorage.getItem("workSchedule");
      if (saved) {
        const parsed = JSON.parse(saved);
        setSchedule(parsed);
        setTempSchedule(parsed);
      }
    } catch (error) {
      console.error("Error loading schedule:", error);
    }
  };

  const saveSchedule = async () => {
    try {
      await AsyncStorage.setItem("workSchedule", JSON.stringify(tempSchedule));
      setSchedule(tempSchedule);
      setEditMode(false);
      Alert.alert("Амжилттай хадгалагдлаа!");
    } catch (error) {
      console.error("Error saving schedule:", error);
      Alert.alert("Алдаа", "Хуваарийг хадгалах боломжгүй боллоо");
    }
  };

  const setupNotifications = async (schedule: WorkSchedule) => {
    try {
      // Өмнөх бүх сануулгыг цуцлах
      await Notifications.cancelAllScheduledNotificationsAsync();

      const [startHour, startMin] = schedule.startTime.split(":").map(Number);
      const [endHour, endMin] = schedule.endTime.split(":").map(Number);

      const startDate = new Date();
      startDate.setHours(startHour, startMin, 0, 0);

      const endDate = new Date();
      endDate.setHours(endHour, endMin, 0, 0);

      let currentTime = new Date(startDate);
      let count = 0;

      while (currentTime < endDate && count < 50) {
        let trigger: Notifications.NotificationTriggerInput;

        if (Platform.OS === "ios") {
          // iOS-д calendar trigger
          trigger = {
            type: "calendar",
            hour: currentTime.getHours(),
            minute: currentTime.getMinutes(),
            repeats: true,
          } as Notifications.CalendarTriggerInput;
        } else {
          // Android-д interval trigger
          const secondsFromNow = Math.max(
            1,
            Math.floor((currentTime.getTime() - new Date().getTime()) / 1000)
          );

          trigger = {
            type: "timeInterval",
            seconds: secondsFromNow,
            repeats: true,
          } as Notifications.TimeIntervalTriggerInput;
        }

        await Notifications.scheduleNotificationAsync({
          content: {
            title: "🧘 Амралтын сануулга!",
            body: "Нүдний дасгал хийж, сунгалт хийгээрэй. Эрүүл мэнд чухал!",
            sound: "default",
          },
          trigger,
        });
        console.log(
          `Notification scheduled at ${currentTime.toLocaleTimeString()}`
        );

        currentTime.setMinutes(
          currentTime.getMinutes() + schedule.notificationInterval
        );
        count++;
      }

      Alert.alert("Амжилттай", `сануулга тохируулагдлаа!`);
      console.log(`${count} сануулга тохируулагдлаа`);
    } catch (error) {
      console.error("Error setting up notifications:", error);
      Alert.alert("Алдаа", `Сануулах тохиргоо амжилтгүй боллоо: ${error}`);
    }
  };

  const cancelNotifications = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      setSchedule({ ...schedule, enabled: false });
      Alert.alert("Амжилттай", "Сануулахыг цуцаллаа");
    } catch (error) {
      console.error("Error cancelling notifications:", error);
    }
  };

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("📩 Notification ирлээ:", notification);
      }
    );

    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("📩 Notification дээр дарлаа:", response);
      });

    return () => {
      subscription.remove();
      responseSubscription.remove();
    };
  }, []);
  const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Алдаа", "Notification зөвшөөрөл аваагүй байна!");
    }
  };

  // App эхлэхэд дуудаж болно
  useEffect(() => {
    requestPermissions();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Ажлын Хуваарь & Сануулах</Text>

        {!editMode ? (
          // Үзэх горим
          <View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Эхлэх цаг:</Text>
              <Text style={styles.value}>{schedule.startTime}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Дуусах цаг:</Text>
              <Text style={styles.value}>{schedule.endTime}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Сануулгын давтамж:</Text>
              <Text style={styles.value}>
                {schedule.notificationInterval} минут
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Статус:</Text>
              <Text
                style={[
                  styles.value,
                  { color: schedule.enabled ? "#4CAF50" : "#FF6B6B" },
                ]}
              >
                {schedule.enabled ? "🔔 Идэвхтэй" : "🔕 Идэвхгүй"}
              </Text>
            </View>

            {schedule.enabled && timeUntilReminder && (
              <View style={styles.countdownRow}>
                <Text style={styles.countdownLabel}>
                  ⏱️ Дараагийн сануулах хугацаа:
                </Text>
                <Text style={styles.countdownValue}>
                  {timeUntilReminder.min}:
                  {timeUntilReminder.sec.toString().padStart(2, "0")} мин
                </Text>
              </View>
            )}

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.editButton]}
                onPress={() => setEditMode(true)}
              >
                <Text style={styles.buttonText}>✏️ Засах</Text>
              </TouchableOpacity>

              {schedule.enabled ? (
                <TouchableOpacity
                  style={[styles.button, styles.dangerButton]}
                  onPress={cancelNotifications}
                >
                  <Text style={styles.buttonText}>⏹️ Зогсоох</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.button, styles.successButton]}
                  onPress={() => setSchedule({ ...schedule, enabled: true })}
                >
                  <Text style={styles.buttonText}>▶️ Эхлүүлэх</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : (
          // Засах горим
          <View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Эхлэх цаг (HH:MM)</Text>
              <TextInput
                style={styles.input}
                placeholder="09:00"
                value={tempSchedule.startTime}
                onChangeText={(text) =>
                  setTempSchedule({ ...tempSchedule, startTime: text })
                }
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Дуусах цаг (HH:MM)</Text>
              <TextInput
                style={styles.input}
                placeholder="17:00"
                value={tempSchedule.endTime}
                onChangeText={(text) =>
                  setTempSchedule({ ...tempSchedule, endTime: text })
                }
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Сануулгын давтамж (минут)</Text>
              <TextInput
                style={styles.input}
                placeholder="60"
                value={tempSchedule.notificationInterval.toString()}
                onChangeText={(text) => {
                  const value = text === "" ? 0 : parseInt(text);
                  if (!isNaN(value)) {
                    setTempSchedule({
                      ...tempSchedule,
                      notificationInterval: value,
                    });
                  }
                }}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.successButton]}
                onPress={saveSchedule}
              >
                <Text style={styles.buttonText}>✓ Хадгалах</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={() => {
                  setEditMode(false);
                  setTempSchedule(schedule);
                }}
              >
                <Text style={styles.buttonText}>✕ Болих</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.infoText}>
            💡 Нүдний дасгал & Тэнхлэг сунгалтууд:
          </Text>
          <Text style={styles.infoText}>• 20 удаа удаан аньж нээх</Text>
          <Text style={styles.infoText}>
            • Алсад байгаа зүйл рүү 20 секунд харах
          </Text>
          <Text style={styles.infoText}>• Хамар, мөрийг зөөлөн эргүүлэх</Text>
          <Text style={styles.infoText}>• Зогсож гараа дээш сунгах</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#111",
  },
  card: {
    backgroundColor: "#222",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  label: {
    fontSize: 14,
    color: "#999",
    fontWeight: "500",
  },
  value: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
  countdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginTop: 12,
    backgroundColor: "#333",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#0a7ea4",
  },
  countdownLabel: {
    fontSize: 14,
    color: "#0a7ea4",
    fontWeight: "600",
  },
  countdownValue: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "700",
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: "#999",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#444",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  editButton: {
    backgroundColor: "#0a7ea4",
  },
  successButton: {
    backgroundColor: "#4CAF50",
  },
  dangerButton: {
    backgroundColor: "#FF6B6B",
  },
  secondaryButton: {
    backgroundColor: "#444",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  info: {
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
  },
  infoText: {
    color: "#ccc",
    fontSize: 12,
    lineHeight: 20,
  },
});
