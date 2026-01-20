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
import {
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

/* ---------------- THEME ---------------- */

type ThemeMode = "light" | "dark" | "system";

const lightTheme = {
  background: "#ffffff",
  card: "#f3f4f6",
  text: "#111827",
  subText: "#6b7280",
  iconBg: "#e5e7eb",
  primary: "#3b82f6",
  danger: "#ef4444",
};

const darkTheme = {
  background: "#0f172a",
  card: "#1e293b",
  text: "#f8fafc",
  subText: "#94a3b8",
  iconBg: "#334155",
  primary: "#3b82f6",
  danger: "#ef4444",
};

const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Smartphone },
] as const;

/* ---------------- SCREEN ---------------- */

export default function SettingsScreen() {
  const systemTheme = useColorScheme(); // light | dark

  const [themeMode, setThemeMode] = useState<ThemeMode>("system");
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);
  const [vibration, setVibration] = useState(true);

  const theme =
    themeMode === "system"
      ? systemTheme === "dark"
        ? darkTheme
        : lightTheme
      : themeMode === "dark"
      ? darkTheme
      : lightTheme;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Settings
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.subText }]}>
          Customize your experience
        </Text>
      </View>

      {/* Notifications */}
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <View style={styles.sectionHeader}>
          <Bell size={16} color={theme.text} />
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Notifications
          </Text>
        </View>

        {/* Push */}
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <View
              style={[styles.iconContainer, { backgroundColor: theme.iconBg }]}
            >
              <Bell size={16} color={theme.text} />
            </View>
            <View>
              <Text style={[styles.rowTitle, { color: theme.text }]}>
                Push Notifications
              </Text>
              <Text style={[styles.rowSubtitle, { color: theme.subText }]}>
                Get reminded for breaks
              </Text>
            </View>
          </View>
          <Switch value={notifications} onValueChange={setNotifications} />
        </View>

        {/* Sound */}
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <View
              style={[styles.iconContainer, { backgroundColor: theme.iconBg }]}
            >
              <Volume2 size={16} color={theme.text} />
            </View>
            <View>
              <Text style={[styles.rowTitle, { color: theme.text }]}>
                Sound
              </Text>
              <Text style={[styles.rowSubtitle, { color: theme.subText }]}>
                Play notification sound
              </Text>
            </View>
          </View>
          <Switch value={sound} onValueChange={setSound} />
        </View>

        {/* Vibration */}
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <View
              style={[styles.iconContainer, { backgroundColor: theme.iconBg }]}
            >
              <Vibrate size={16} color={theme.text} />
            </View>
            <View>
              <Text style={[styles.rowTitle, { color: theme.text }]}>
                Vibration
              </Text>
              <Text style={[styles.rowSubtitle, { color: theme.subText }]}>
                Haptic feedback
              </Text>
            </View>
          </View>
          <Switch value={vibration} onValueChange={setVibration} />
        </View>
      </View>

      {/* Appearance */}
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Appearance
        </Text>

        <View style={styles.themeOptions}>
          {THEME_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = themeMode === option.value;

            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.themeOption,
                  {
                    backgroundColor: isSelected
                      ? theme.primary + "20"
                      : theme.iconBg,
                    borderColor: isSelected ? theme.primary : "transparent",
                    borderWidth: isSelected ? 1 : 0,
                  },
                ]}
                onPress={() => setThemeMode(option.value)}
              >
                <Icon
                  size={20}
                  color={isSelected ? theme.primary : theme.subText}
                />
                <Text
                  style={[
                    styles.themeLabel,
                    {
                      color: isSelected ? theme.primary : theme.subText,
                      fontWeight: isSelected ? "500" : "400",
                    },
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Status */}
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <View
          style={[styles.statusCard, { backgroundColor: theme.primary + "20" }]}
        >
          <CheckCircle2 size={20} color={theme.primary} />
          <View style={{ marginLeft: 10 }}>
            <Text style={[styles.rowTitle, { color: theme.text }]}>
              Notifications enabled
            </Text>
            <Text style={[styles.rowSubtitle, { color: theme.subText }]}>
              You will receive break reminders
            </Text>
          </View>
        </View>
      </View>

      {/* About */}
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <View style={styles.sectionHeader}>
          <Info size={16} color={theme.text} />
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            About
          </Text>
        </View>

        <View style={styles.aboutRow}>
          <Text style={[styles.rowSubtitle, { color: theme.subText }]}>
            Version
          </Text>
          <Text style={[styles.rowTitle, { color: theme.text }]}>1.0.0</Text>
        </View>

        <View style={styles.aboutRow}>
          <Text style={[styles.rowSubtitle, { color: theme.subText }]}>
            Exercises
          </Text>
          <Text style={[styles.rowTitle, { color: theme.text }]}>12</Text>
        </View>

        <View style={styles.aboutRow}>
          <Text style={[styles.rowSubtitle, { color: theme.subText }]}>
            Categories
          </Text>
          <Text style={[styles.rowTitle, { color: theme.text }]}>3</Text>
        </View>
      </View>

      {/* Clear Data */}
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <TouchableOpacity
          style={[styles.clearButton, { backgroundColor: theme.danger }]}
        >
          <Trash2 size={16} color="white" />
          <Text style={styles.clearButtonText}>Clear All Data</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 40,
  },

  header: { marginBottom: 24 },
  headerTitle: { fontSize: 24, fontWeight: "700" },
  headerSubtitle: { fontSize: 14, marginTop: 4 },

  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    paddingTop: 10,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 14, fontWeight: "600", marginLeft: 6 },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
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
  rowSubtitle: { fontSize: 12 },

  themeOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  themeOption: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 5,
  },
  themeLabel: { fontSize: 12, marginTop: 6 },

  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
  },

  aboutRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },

  clearButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 12,
  },
  clearButtonText: {
    color: "white",
    fontWeight: "500",
    marginLeft: 6,
  },
});
