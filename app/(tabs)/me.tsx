import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";

export default function MeScreen() {
  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title">Profile</ThemedText>

        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <ThemedText style={styles.avatarText}>👤</ThemedText>
          </View>
          <View style={styles.profileInfo}>
            <ThemedText type="defaultSemiBold">User Name</ThemedText>
            <ThemedText style={styles.profileEmail}>
              user@example.com
            </ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Statistics
          </ThemedText>
          <View style={styles.statRow}>
            <View style={styles.stat}>
              <ThemedText style={styles.statValue}>0</ThemedText>
              <ThemedText style={styles.statLabel}>Sessions</ThemedText>
            </View>
            <View style={styles.stat}>
              <ThemedText style={styles.statValue}>0</ThemedText>
              <ThemedText style={styles.statLabel}>Minutes</ThemedText>
            </View>
            <View style={styles.stat}>
              <ThemedText style={styles.statValue}>0</ThemedText>
              <ThemedText style={styles.statLabel}>Streak</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Settings
          </ThemedText>
          <TouchableOpacity style={styles.menuItem}>
            <ThemedText>🔔 Notifications</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <ThemedText>🎨 Theme</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <ThemedText>ℹ️ About</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <ThemedText>🚪 Logout</ThemedText>
          </TouchableOpacity>
        </View>
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
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    fontSize: 32,
  },
  profileInfo: {
    flex: 1,
  },
  profileEmail: {
    marginTop: 4,
    fontSize: 13,
    color: "#666",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
  },
  stat: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0a7ea4",
  },
  statLabel: {
    marginTop: 4,
    fontSize: 12,
    color: "#666",
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
});
