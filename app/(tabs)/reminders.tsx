/* eslint-disable react-hooks/exhaustive-deps */
import Slider from "@react-native-community/slider";
import { Bell, Eye, StretchHorizontal, Wind } from "lucide-react-native";
import { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useData } from "../../components/DataContext";
import { ReminderContext } from "../../components/reminderContext";
import { useTheme } from "../../components/ThemeContext";

// Days of the week
const DAYS = [
  { value: 0, label: "S" },
  { value: 1, label: "M" },
  { value: 2, label: "T" },
  { value: 3, label: "W" },
  { value: 4, label: "T" },
  { value: 5, label: "F" },
  { value: 6, label: "S" },
];

// Exercise categories
const CATEGORIES = [
  {
    value: "eye",
    label: "Eye Care",
    icon: Eye,
    description: "Reduce eye strain",
  },
  {
    value: "stretch",
    label: "Stretching",
    icon: StretchHorizontal,
    description: "Release tension",
  },
  {
    value: "breathing",
    label: "Breathing",
    icon: Wind,
    description: "Calm your mind",
  },
];

export default function RemindersScreen() {
  const { remindersEnabled, setRemindersEnabled } = useContext(ReminderContext);
  const { theme } = useTheme();
  const { settings, updateSettings } = useData();

  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [workDays, setWorkDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [interval, setInterval] = useState(60);
  const [categories, setCategories] = useState<string[]>(["eye", "stretch"]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from API and AsyncStorage
  useEffect(() => {
    const loadSettings = async () => {
      // master toggle
      const enabledVal = await AsyncStorage.getItem("remindersEnabled");
      if (enabledVal !== null) {
        setRemindersEnabled(enabledVal === "true");
      }

      const stored = await AsyncStorage.getItem("reminderSettings");
      if (stored) {
        const parsed = JSON.parse(stored);

        setStartTime(parsed.workStartTime ?? "09:00");
        setEndTime(parsed.workEndTime ?? "17:00");
        setWorkDays(parsed.workDays ?? [1, 2, 3, 4, 5]);
        setInterval(parsed.reminderInterval ?? 60);
        setCategories(parsed.enabledCategories ?? ["eye", "stretch"]);
        setSoundEnabled(parsed.soundEnabled ?? true);
      }

      setIsLoaded(true);
    };

    loadSettings();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const newSettings = {
      workStartTime: startTime,
      workEndTime: endTime,
      workDays,
      reminderInterval: interval,
      enabledCategories: categories,
      soundEnabled,
    };

    // 1. persist
    AsyncStorage.setItem("reminderSettings", JSON.stringify(newSettings));

    // 2. 🔥 GLOBAL SYNC (хамгийн чухал)
    updateSettings(newSettings);
  }, [
    startTime,
    endTime,
    workDays,
    interval,
    categories,
    soundEnabled,
    isLoaded,
  ]);

  // Toggle work days
  const toggleDay = (day: number) => {
    setWorkDays(
      workDays.includes(day)
        ? workDays.filter((d) => d !== day)
        : [...workDays, day].sort(),
    );
  };

  // Toggle exercise categories
  const toggleCategory = (category: string) => {
    if (categories.includes(category)) {
      if (categories.length > 1)
        setCategories(categories.filter((c) => c !== category));
    } else {
      setCategories([...categories, category]);
    }
  };

  // Calculate number of reminders per day
  const startMins =
    parseInt(startTime.split(":")[0], 10) * 60 +
    parseInt(startTime.split(":")[1], 10);
  const endMins =
    parseInt(endTime.split(":")[0], 10) * 60 +
    parseInt(endTime.split(":")[1], 10);
  const reminderCount = Math.floor((endMins - startMins) / interval);

  // Toggle master reminders switch
  const handleToggleReminders = async (value: boolean) => {
    setRemindersEnabled(value);
    await AsyncStorage.setItem("remindersEnabled", JSON.stringify(value));
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Reminders
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.subText }]}>
          Configure your break schedule
        </Text>
      </View>

      {/* Master Toggle */}
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <View
              style={[styles.iconContainer, { backgroundColor: theme.iconBg }]}
            >
              <Bell size={20} color={theme.text} />
            </View>
            <View>
              <Text style={[styles.rowTitle, { color: theme.text }]}>
                Reminders
              </Text>
              <Text style={[styles.rowSubtitle, { color: theme.primary }]}>
                {remindersEnabled ? "Active" : "Paused"}
              </Text>
            </View>
          </View>
          <Switch
            value={!!remindersEnabled}
            onValueChange={handleToggleReminders}
            trackColor={{ false: "#d1d5db", true: "#6465f0" }}
            thumbColor="#ffffff"
          />
        </View>
      </View>

      {/* Work Hours */}
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Work Hours
        </Text>
        <View style={styles.timeRow}>
          <View style={styles.timeContainer}>
            <Text style={[styles.timeLabel, { color: theme.subText }]}>
              Start
            </Text>
            <TextInput
              style={[
                styles.timeInput,
                {
                  color: theme.text,
                  borderColor: theme.iconBg,
                  backgroundColor: theme.background,
                },
              ]}
              value={startTime}
              onChangeText={setStartTime}
              placeholder="HH:MM"
              placeholderTextColor={theme.subText}
            />
          </View>
          <View style={styles.timeContainer}>
            <Text style={[styles.timeLabel, { color: theme.subText }]}>
              End
            </Text>
            <TextInput
              style={[
                styles.timeInput,
                {
                  color: theme.text,
                  borderColor: theme.iconBg,
                  backgroundColor: theme.background,
                },
              ]}
              value={endTime}
              onChangeText={setEndTime}
              placeholder="HH:MM"
              placeholderTextColor={theme.subText}
            />
          </View>
        </View>

        <Text style={[styles.timeLabel, { color: theme.subText }]}>
          Work Days
        </Text>
        <View style={styles.daysRow}>
          {DAYS.map((day) => (
            <TouchableOpacity
              key={day.value}
              style={[
                styles.dayButton,
                { backgroundColor: theme.background },
                workDays.includes(day.value) && styles.dayButtonActive,
              ]}
              onPress={() => toggleDay(day.value)}
            >
              <Text
                style={[
                  styles.dayText,
                  { color: theme.subText },
                  workDays.includes(day.value) && styles.dayTextActive,
                ]}
              >
                {day.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Interval */}
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <View style={styles.row}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Break Interval
          </Text>
          <Text style={[styles.intervalText, { color: theme.text }]}>
            {interval}m
          </Text>
        </View>
        <Slider
          minimumValue={15}
          maximumValue={120}
          step={5}
          value={interval}
          minimumTrackTintColor="#6465f0"
          thumbTintColor="#6465f0"
          onValueChange={setInterval}
        />
        <View style={styles.sliderLabels}>
          <Text style={[styles.sliderLabel, { color: theme.subText }]}>
            15 min
          </Text>
          <Text style={[styles.sliderLabel, { color: theme.subText }]}>
            120 min
          </Text>
        </View>
        <View
          style={[styles.reminderCount, { backgroundColor: theme.background }]}
        >
          <Text style={styles.reminderNumber}>{reminderCount}</Text>
          <Text style={[styles.rowSubtitle, { color: theme.primary }]}>
            reminders per day
          </Text>
        </View>
      </View>

      {/* Categories */}
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Exercise Types
        </Text>
        {CATEGORIES.map((cat) => {
          const isActive = categories.includes(cat.value);
          return (
            <TouchableOpacity
              key={cat.value}
              style={[
                styles.categoryButton,
                { backgroundColor: theme.background },
                isActive && { backgroundColor: theme.primary + "20" },
              ]}
              onPress={() => toggleCategory(cat.value)}
            >
              <View
                style={[
                  styles.categoryIcon,
                  { backgroundColor: theme.iconBg },
                  isActive && { backgroundColor: theme.primary + "40" },
                ]}
              >
                <cat.icon size={16} color={theme.text} />
              </View>
              <View style={styles.categoryText}>
                <Text style={[styles.rowTitle, { color: theme.text }]}>
                  {cat.label}
                </Text>
                <Text style={[styles.rowSubtitle, { color: theme.subText }]}>
                  {cat.description}
                </Text>
              </View>
              <View
                style={[styles.checkbox, isActive && styles.checkboxActive]}
              >
                {isActive && <Text style={styles.checkboxCheck}>✓</Text>}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

// Styles remain unchanged
const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 10,
    paddingTop: 50,
    flexGrow: 1,
    gap: 0,
  },
  header: { marginBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: "bold" },
  headerSubtitle: { fontSize: 14, color: "#6b7280" },
  card: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 14,
    paddingTop: 23,
    paddingBottom: 20,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowLeft: { flexDirection: "row", alignItems: "center" },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  rowTitle: { fontSize: 14, fontWeight: "500" },
  rowSubtitle: { fontSize: 12, color: "#6465f0" },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 10,
    marginTop: -7,
    paddingTop: 0,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -8,
  },
  timeContainer: { flex: 1, marginHorizontal: 5 },
  timeLabel: { fontSize: 12, color: "#6b7280", marginBottom: 4, marginTop: 4 },
  timeInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  dayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  dayButtonActive: { backgroundColor: "#6465f0" },
  dayText: { fontSize: 12, color: "#6b7280", fontWeight: "500" },
  dayTextActive: { color: "#fff" },
  intervalText: { fontSize: 16, fontWeight: "bold" },
  sliderLabels: { flexDirection: "row", justifyContent: "space-between" },
  sliderLabel: { fontSize: 12, color: "#6b7280" },
  reminderCount: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  reminderNumber: { fontSize: 24, fontWeight: "bold", color: "#6465f0" },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 12,
    marginBottom: 5,
    backgroundColor: "#fff",
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    marginRight: 10,
  },
  categoryText: { flex: 1 },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#6465f0",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxActive: { borderColor: "#6465f0", backgroundColor: "#6465f0" },
  checkboxCheck: { color: "#fff", fontSize: 12 },
});
