import {
  Bell,
  CheckCircle2,
  Info,
  Moon,
  Smartphone,
  Sun,
  Trash2,
  Vibrate,
  Volume2,
} from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

type Theme = "light" | "dark" | "system";

const THEME_OPTIONS: { value: Theme; label: string; icon: any }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Smartphone },
];

export default function SettingsScreen() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);
  const [vibration, setVibration] = useState(true);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Customize your experience</Text>
      </View>

      {/* Notifications */}
      <View style={styles.card}>
        <View style={styles.cardTitle}>
          <Bell size={16} />
          <Text style={styles.notifications}>Notifications</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <View style={styles.iconContainer}>
              <Bell size={16} />
            </View>
            <View>
              <Text style={styles.rowTitle}>Push Notifications</Text>
              <Text style={styles.rowSubtitle}>Get reminded for breaks</Text>
            </View>
          </View>
          <Switch value={notifications} onValueChange={setNotifications} />
        </View>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <View style={styles.iconContainer}>
              <Volume2 size={16} />
            </View>
            <View>
              <Text style={styles.rowTitle}>Sound</Text>
              <Text style={styles.rowSubtitle}>Play notification sound</Text>
            </View>
          </View>
          <Switch value={sound} onValueChange={setSound} />
        </View>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <View style={styles.iconContainer}>
              <Vibrate size={16} />
            </View>
            <View>
              <Text style={styles.rowTitle}>Vibration</Text>
              <Text style={styles.rowSubtitle}>Haptic feedback</Text>
            </View>
          </View>
          <Switch value={vibration} onValueChange={setVibration} />
        </View>
      </View>

      {/* Theme */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Appearance</Text>
        <View style={styles.themeOptions}>
          {THEME_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = theme === option.value;
            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.themeOption,
                  isSelected && styles.themeOptionSelected,
                ]}
                onPress={() => setTheme(option.value)}
              >
                <Icon
                  width={20}
                  height={20}
                  color={isSelected ? "#3b82f6" : "#6b7280"}
                />
                <Text
                  style={[
                    styles.themeLabel,
                    isSelected && { color: "#3b82f6" },
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Notification Status */}
      <View style={styles.card}>
        <View style={styles.statusCard}>
          <CheckCircle2 size={20} color="#3b82f6" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.rowTitle}>Notifications enabled</Text>
            <Text style={styles.rowSubtitle}>
              You will receive break reminders
            </Text>
          </View>
        </View>
      </View>

      {/* About */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          <Info size={16} /> About
        </Text>
        <View style={styles.aboutRow}>
          <Text style={styles.rowSubtitle}>Version</Text>
          <Text style={styles.rowTitle}>1.0.0</Text>
        </View>
        <View style={styles.aboutRow}>
          <Text style={styles.rowSubtitle}>Exercises</Text>
          <Text style={styles.rowTitle}>12</Text>
        </View>
        <View style={styles.aboutRow}>
          <Text style={styles.rowSubtitle}>Categories</Text>
          <Text style={styles.rowTitle}>3</Text>
        </View>
      </View>

      {/* Clear Data */}
      <View style={styles.card}>
        <TouchableOpacity style={styles.clearButton}>
          <Trash2 size={16} stroke="white" />
          <Text style={styles.clearButtonText}>Clear All Data</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 50, paddingTop: 50 },
  header: { marginBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: "bold" },
  headerSubtitle: { fontSize: 14, color: "#6b7280" },
  card: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 10,
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    textAlign: "center",
    padding: 0,

    marginTop: 0,
  },
  notifications: { marginLeft: 4, marginTop: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
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
  rowSubtitle: { fontSize: 12, color: "#6b7280" },
  themeOptions: { flexDirection: "row", justifyContent: "space-between" },
  themeOption: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    borderRadius: 12,
    marginHorizontal: 5,
    backgroundColor: "#e5e7eb",
  },
  themeOptionSelected: {
    backgroundColor: "#dbeafe",
    borderWidth: 1,
    borderColor: "#3b82f6",
  },
  themeLabel: { fontSize: 12, marginTop: 5, color: "#6b7280" },
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#dbeafe",
    borderRadius: 12,
  },
  aboutRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  clearButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ef4444",
    borderRadius: 12,
    paddingVertical: 12,
  },
  clearButtonText: { color: "white", fontWeight: "500", marginLeft: 5 },
});
