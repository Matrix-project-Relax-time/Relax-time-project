import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { useState } from "react";

interface Reminder {
  id: string;
  title: string;
  description: string;
  time: string;
  completed: boolean;
}

export default function RemindersScreen() {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: "1",
      title: "Morning Meditation",
      description: "Start your day with 10 minutes of meditation",
      time: "08:00 AM",
      completed: false,
    },
    {
      id: "2",
      title: "Afternoon Break",
      description: "Take a 5-minute relaxation break",
      time: "02:00 PM",
      completed: false,
    },
    {
      id: "3",
      title: "Evening Stretch",
      description: "Gentle stretching session",
      time: "06:00 PM",
      completed: false,
    },
  ]);

  const toggleReminder = (id: string) => {
    setReminders(
      reminders.map((reminder) =>
        reminder.id === id
          ? { ...reminder, completed: !reminder.completed }
          : reminder
      )
    );
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title">Reminders</ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>
          Stay on track with your relaxation goals
        </ThemedText>

        {reminders.map((reminder) => (
          <TouchableOpacity
            key={reminder.id}
            style={[
              styles.reminderCard,
              reminder.completed && styles.completed,
            ]}
            onPress={() => toggleReminder(reminder.id)}
          >
            <View style={styles.reminderContent}>
              <ThemedText
                type="defaultSemiBold"
                style={reminder.completed ? styles.completedText : {}}
              >
                {reminder.title}
              </ThemedText>
              <ThemedText style={styles.reminderDescription}>
                {reminder.description}
              </ThemedText>
              <ThemedText style={styles.reminderTime}>
                {reminder.time}
              </ThemedText>
            </View>
            <View
              style={[
                styles.checkbox,
                reminder.completed && styles.checkboxChecked,
              ]}
            >
              {reminder.completed && (
                <ThemedText style={styles.checkmark}>✓</ThemedText>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 40,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
  },
  reminderCard: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  completed: {
    opacity: 0.6,
    backgroundColor: "#e8f5e9",
  },
  reminderContent: {
    flex: 1,
  },
  completedText: {
    textDecorationLine: "line-through",
  },
  reminderDescription: {
    marginTop: 4,
    fontSize: 13,
    color: "#666",
  },
  reminderTime: {
    marginTop: 8,
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#0a7ea4",
    marginLeft: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#0a7ea4",
  },
  checkmark: {
    color: "white",
    fontSize: 16,
  },
});
