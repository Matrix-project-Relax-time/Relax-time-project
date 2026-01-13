/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface WorkSchedule {
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  notificationInterval: number; // in minutes
  enabled: boolean;
}

export default function WorkScheduleManager() {
  const [schedule, setSchedule] = useState<WorkSchedule>({
    startTime: "09:00",
    endTime: "17:00",
    notificationInterval: 60,
    enabled: false,
  });

  const [editMode, setEditMode] = useState(false);
  const [tempSchedule, setTempSchedule] = useState<WorkSchedule>(schedule);
  const [minutesUntilReminder, setMinutesUntilReminder] = useState<
    number | null
  >(null);

  // Load schedule from storage on mount
  useEffect(() => {
    loadSchedule();
  }, []);

  // Setup notifications when schedule changes
  useEffect(() => {
    if (schedule.enabled) {
      setupNotifications();
    }
  }, [schedule]);

  // Update countdown timer every second
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

      // If outside work hours, show time until next start
      if (now < startDate) {
        const diff = Math.ceil((startDate.getTime() - now.getTime()) / 60000);
        setMinutesUntilReminder(diff);
        return;
      }

      if (now > endDate) {
        setMinutesUntilReminder(null);
        return;
      }

      // Calculate minutes since start time
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
      Alert.alert("Success", "Work schedule saved!");
    } catch (error) {
      console.error("Error saving schedule:", error);
      Alert.alert("Error", "Failed to save schedule");
    }
  };

  const setupNotifications = async () => {
    try {
      // Cancel all existing notifications
      await Notifications.cancelAllScheduledNotificationsAsync();

      const [startHour, startMin] = schedule.startTime.split(":").map(Number);
      const [endHour, endMin] = schedule.endTime.split(":").map(Number);

      const startDate = new Date();
      startDate.setHours(startHour, startMin, 0);

      const endDate = new Date();
      endDate.setHours(endHour, endMin, 0);

      // Schedule notifications at intervals
      let currentTime = new Date(startDate);
      let count = 0;

      while (currentTime < endDate && count < 20) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "🧘 Relax Break Time!",
            body: "Take a moment to do eye workouts and stretch. Your health matters!",
            sound: "default",
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
            hour: currentTime.getHours(),
            minute: currentTime.getMinutes(),
            repeats: true,
          },
        });

        currentTime.setMinutes(
          currentTime.getMinutes() + schedule.notificationInterval
        );
        count++;
      }

      Alert.alert(
        "Success",
        `${count} notifications scheduled for ${schedule.startTime} - ${schedule.endTime}`
      );
      console.log(`${count} notifications scheduled`);
    } catch (error) {
      console.error("Error setting up notifications:", error);
      Alert.alert("Error", `Failed to schedule notifications: ${error}`);
    }
  };

  const cancelNotifications = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      setSchedule({ ...schedule, enabled: false });
      Alert.alert("Success", "Notifications cancelled");
    } catch (error) {
      console.error("Error cancelling notifications:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Work Schedule & Reminders</Text>

        {!editMode ? (
          // View Mode
          <View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Start Time:</Text>
              <Text style={styles.value}>{schedule.startTime}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>End Time:</Text>
              <Text style={styles.value}>{schedule.endTime}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Reminder Interval:</Text>
              <Text style={styles.value}>
                {schedule.notificationInterval} minutes
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Status:</Text>
              <Text
                style={[
                  styles.value,
                  { color: schedule.enabled ? "#4CAF50" : "#FF6B6B" },
                ]}
              >
                {schedule.enabled ? "🔔 Active" : "🔕 Inactive"}
              </Text>
            </View>

            {schedule.enabled && minutesUntilReminder !== null && (
              <View style={styles.countdownRow}>
                <Text style={styles.countdownLabel}>⏱️ Next Reminder In:</Text>
                <Text style={styles.countdownValue}>
                  {minutesUntilReminder} min
                  {minutesUntilReminder !== 1 ? "s" : ""}
                </Text>
              </View>
            )}

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.editButton]}
                onPress={() => setEditMode(true)}
              >
                <Text style={styles.buttonText}>✏️ Edit</Text>
              </TouchableOpacity>

              {schedule.enabled ? (
                <TouchableOpacity
                  style={[styles.button, styles.dangerButton]}
                  onPress={cancelNotifications}
                >
                  <Text style={styles.buttonText}>⏹️ Stop</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.button, styles.successButton]}
                  onPress={() => setSchedule({ ...schedule, enabled: true })}
                >
                  <Text style={styles.buttonText}>▶️ Start</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : (
          // Edit Mode
          <View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Start Time (HH:MM)</Text>
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
              <Text style={styles.inputLabel}>End Time (HH:MM)</Text>
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
              <Text style={styles.inputLabel}>
                Notification Interval (minutes)
              </Text>
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
                <Text style={styles.buttonText}>✓ Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={() => {
                  setEditMode(false);
                  setTempSchedule(schedule);
                }}
              >
                <Text style={styles.buttonText}>✕ Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.infoText}>💡 Eye Workouts & Stretches:</Text>
          <Text style={styles.infoText}>• Blink 20 times slowly</Text>
          <Text style={styles.infoText}>
            • Look at distant objects for 20 seconds
          </Text>
          <Text style={styles.infoText}>• Roll shoulders and neck gently</Text>
          <Text style={styles.infoText}>• Stand and stretch arms overhead</Text>
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
