import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { BottomNav } from "../components/BottomNav";

export default function RootLayout() {
  return (
    <View style={styles.container}>
      {/* Status bar replaces <head> / metadata */}
      <StatusBar style="light" backgroundColor="#0a0f0f" />

      {/* Main app stack */}
      <View style={styles.content}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </View>

      {/* Bottom navigation */}
      <BottomNav />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0f0f", // bg-background
  },
  content: {
    flex: 1,
  },
});
