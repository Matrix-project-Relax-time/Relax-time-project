import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { ReminderProvider } from "../components/reminderContext";
import { BottomNav } from "../components/BottomNav";
// ✅ import provider

export default function RootLayout() {
  return (
    <ReminderProvider>
      <View style={styles.container}>
        <StatusBar style="light" backgroundColor="#0a0f0f" />
        <View style={styles.content}>
          <Stack screenOptions={{ headerShown: false }} />
        </View>
        <BottomNav />
      </View>
    </ReminderProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0f0f" },
  content: { flex: 1, paddingBottom: 80 },
});
