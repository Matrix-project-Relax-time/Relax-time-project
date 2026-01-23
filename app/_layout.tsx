import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { BottomNav } from "../components/BottomNav";
import { ReminderProvider } from "../components/reminderContext";
import { ThemeProvider, useTheme } from "../components/ThemeContext";

function RootLayoutContent() {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        style={theme.text === "#fff" ? "light" : "dark"}
        backgroundColor={theme.background}
      />
      <View style={styles.content}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: theme.background },
          }}
        />
      </View>
      <BottomNav />
    </View>
  );
}

export default function RootLayout() {
  return (
    <ReminderProvider>
      <ThemeProvider>
        <RootLayoutContent />
      </ThemeProvider>
    </ReminderProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
});
