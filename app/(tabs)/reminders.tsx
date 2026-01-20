import Slider from "@react-native-community/slider";
import {
  Bell,
  Eye,
  StretchHorizontal,
  Volume2,
  Wind,
} from "lucide-react-native";
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
import { ReminderContext } from "../../components/reminderContext";

/* =========================
   Долоо хоногийн өдрүүд
========================= */
const DAYS = [
  { value: 0, label: "Ня" },
  { value: 1, label: "Да" },
  { value: 2, label: "Мя" },
  { value: 3, label: "Лх" },
  { value: 4, label: "Пү" },
  { value: 5, label: "Ба" },
  { value: 6, label: "Бя" },
];

/* =========================
   Дасгалын ангиллууд
========================= */
const CATEGORIES = [
  {
    value: "eye",
    label: "Нүдний дасгал",
    icon: Eye,
    description: "Нүдний ядаргааг багасгана",
  },
  {
    value: "stretch",
    label: "Сунгалт",
    icon: StretchHorizontal,
    description: "Булчинг суллана",
  },
  {
    value: "breathing",
    label: "Амьсгал",
    icon: Wind,
    description: "Тайвшруулж, анхаарал төвлөрүүлнэ",
  },
];

/* =========================
   Анхны тохиргоо
========================= */
const mockSettings = {
  workStartTime: "09:00",
  workEndTime: "17:00",
  workDays: [1, 2, 3, 4, 5],
  reminderInterval: 60,
  enabledCategories: ["eye", "stretch"],
  soundEnabled: true,
};

export default function RemindersScreen() {
  const { remindersEnabled, setRemindersEnabled } =
    useContext(ReminderContext);

  const [startTime, setStartTime] =
    useState(mockSettings.workStartTime);
  const [endTime, setEndTime] =
    useState(mockSettings.workEndTime);
  const [workDays, setWorkDays] =
    useState(mockSettings.workDays);
  const [interval, setInterval] =
    useState(mockSettings.reminderInterval);
  const [categories, setCategories] =
    useState(mockSettings.enabledCategories);
  const [soundEnabled, setSoundEnabled] =
    useState(mockSettings.soundEnabled);
  const [isLoaded, setIsLoaded] = useState(false);

  /* =========================
     Тохиргоо унших
  ========================= */
  useEffect(() => {
    const loadSettings = async () => {
      const enabledVal =
        await AsyncStorage.getItem("remindersEnabled");
      if (enabledVal !== null)
        setRemindersEnabled(enabledVal === "true");

      const settingsVal =
        await AsyncStorage.getItem("reminderSettings");
      if (settingsVal) {
        const parsed = JSON.parse(settingsVal);
        setStartTime(
          parsed.workStartTime ?? mockSettings.workStartTime
        );
        setEndTime(
          parsed.workEndTime ?? mockSettings.workEndTime
        );
        setWorkDays(parsed.workDays ?? mockSettings.workDays);
        setInterval(
          parsed.reminderInterval ??
            mockSettings.reminderInterval
        );
        setCategories(
          parsed.enabledCategories ??
            mockSettings.enabledCategories
        );
        setSoundEnabled(
          parsed.soundEnabled ?? mockSettings.soundEnabled
        );
      }
      setIsLoaded(true);
    };
    loadSettings();
  }, []);

  /* =========================
     Тохиргоо хадгалах
  ========================= */
  useEffect(() => {
    if (!isLoaded) return;

    const settings = {
      workStartTime: startTime,
      workEndTime: endTime,
      workDays,
      reminderInterval: interval,
      enabledCategories: categories,
      soundEnabled,
    };

    AsyncStorage.setItem(
      "reminderSettings",
      JSON.stringify(settings)
    );
  }, [
    startTime,
    endTime,
    workDays,
    interval,
    categories,
    soundEnabled,
    isLoaded,
  ]);

  const toggleDay = (day: number) => {
    setWorkDays(
      workDays.includes(day)
        ? workDays.filter((d) => d !== day)
        : [...workDays, day].sort()
    );
  };

  const toggleCategory = (category: string) => {
    if (categories.includes(category)) {
      if (categories.length > 1)
        setCategories(categories.filter((c) => c !== category));
    } else {
      setCategories([...categories, category]);
    }
  };

  const startMins =
    parseInt(startTime.split(":")[0], 10) * 60 +
    parseInt(startTime.split(":")[1], 10);
  const endMins =
    parseInt(endTime.split(":")[0], 10) * 60 +
    parseInt(endTime.split(":")[1], 10);

  const reminderCount = Math.floor(
    (endMins - startMins) / interval
  );

  const handleToggleReminders = async (value: boolean) => {
    setRemindersEnabled(value);
    await AsyncStorage.setItem(
      "remindersEnabled",
      JSON.stringify(value)
    );
  };

  /* =========================
     Render
  ========================= */
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Толгой хэсэг */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Сануулга</Text>
        <Text style={styles.headerSubtitle}>
          Амралтын сануулгын тохиргоо
        </Text>
      </View>

      {/* Ерөнхий асаах / унтраах */}
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <View style={styles.iconContainer}>
              <Bell size={20} />
            </View>
            <View>
              <Text style={styles.rowTitle}>Сануулга</Text>
              <Text style={styles.rowSubtitle}>
                {remindersEnabled ? "Идэвхтэй" : "Түр зогссон"}
              </Text>
            </View>
          </View>
          <Switch
            value={!!remindersEnabled}
            onValueChange={handleToggleReminders}
          />
        </View>
      </View>

      {/* Ажлын цаг */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Ажлын цаг</Text>

        <View style={styles.timeRow}>
          <View style={styles.timeContainer}>
            <Text style={styles.timeLabel}>Эхлэх цаг</Text>
            <TextInput
              style={styles.timeInput}
              value={startTime}
              onChangeText={setStartTime}
              placeholder="HH:MM"
            />
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeLabel}>Дуусах цаг</Text>
            <TextInput
              style={styles.timeInput}
              value={endTime}
              onChangeText={setEndTime}
              placeholder="HH:MM"
            />
          </View>
        </View>

        <Text style={styles.timeLabel}>Ажлын өдрүүд</Text>
        <View style={styles.daysRow}>
          {DAYS.map((day) => (
            <TouchableOpacity
              key={day.value}
              style={[
                styles.dayButton,
                workDays.includes(day.value) &&
                  styles.dayButtonActive,
              ]}
              onPress={() => toggleDay(day.value)}
            >
              <Text
                style={[
                  styles.dayText,
                  workDays.includes(day.value) &&
                    styles.dayTextActive,
                ]}
              >
                {day.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Интервал */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.sectionTitle}>
            Амралтын давтамж
          </Text>
          <Text style={styles.intervalText}>
            {interval} мин
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
          <Text style={styles.sliderLabel}>15 мин</Text>
          <Text style={styles.sliderLabel}>120 мин</Text>
        </View>

        <View style={styles.reminderCount}>
          <Text style={styles.reminderNumber}>
            {reminderCount}
          </Text>
          <Text style={styles.rowSubtitle}>
            Өдөрт ирэх сануулга
          </Text>
        </View>
      </View>

      {/* Дасгалын төрөл */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Дасгалын төрөл
        </Text>

        {CATEGORIES.map((cat) => {
          const isActive = categories.includes(cat.value);
          return (
            <TouchableOpacity
              key={cat.value}
              style={[
                styles.categoryButton,
                isActive && styles.categoryActive,
              ]}
              onPress={() => toggleCategory(cat.value)}
            >
              <View
                style={[
                  styles.categoryIcon,
                  isActive &&
                    styles.categoryIconActive,
                ]}
              >
                <cat.icon size={16} />
              </View>

              <View style={styles.categoryText}>
                <Text style={styles.rowTitle}>
                  {cat.label}
                </Text>
                <Text style={styles.rowSubtitle}>
                  {cat.description}
                </Text>
              </View>

              <View
                style={[
                  styles.checkbox,
                  isActive && styles.checkboxActive,
                ]}
              >
                {isActive && (
                  <Text style={styles.checkboxCheck}>
                    ✓
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Дуу */}
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <View style={styles.iconContainer}>
              <Volume2 size={20} />
            </View>
            <View>
              <Text style={styles.rowTitle}>Дуу</Text>
              <Text style={styles.rowSubtitle}>
                Сануулгын дуу тоглуулах
              </Text>
            </View>
          </View>
          <Switch
            value={soundEnabled}
            onValueChange={setSoundEnabled}
          />
        </View>
      </View>
    </ScrollView>
  );
}

/* =========================
   Styles (өөрчлөгдөөгүй)
========================= */
const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 50, paddingTop: 50, flex: 1 },
  header: { marginBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: "bold" },
  headerSubtitle: { fontSize: 14, color: "#6b7280" },
  card: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
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
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  rowTitle: { fontSize: 14, fontWeight: "500" },
  rowSubtitle: { fontSize: 12, color: "#6465f0" },
  sectionTitle: { fontSize: 14, fontWeight: "500", marginBottom: 10 },
  timeRow: { flexDirection: "row", justifyContent: "space-between" },
  timeContainer: { flex: 1, marginHorizontal: 5 },
  timeLabel: { fontSize: 12, color: "#6b7280", marginBottom: 4 },
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
    backgroundColor: "#e5e7eb",
  },
  dayButtonActive: { backgroundColor: "#6465f0" },
  dayText: { fontSize: 12, color: "#6b7280", fontWeight: "500" },
  dayTextActive: { color: "#fff" },
  intervalText: { fontSize: 16, fontWeight: "bold" },
  sliderLabels: { flexDirection: "row", justifyContent: "space-between" },
  sliderLabel: { fontSize: 12, color: "#6b7280" },
  reminderCount: {
    backgroundColor: "#e0f2fe",
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
    backgroundColor: "#e5e7eb",
  },
  categoryActive: { backgroundColor: "#dbeafe" },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    marginRight: 10,
  },
  categoryIconActive: { backgroundColor: "#bfdbfe" },
  categoryText: { flex: 1 },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxActive: { borderColor: "#3b82f6", backgroundColor: "#6465f0" },
  checkboxCheck: { color: "#fff", fontSize: 12 },
});
