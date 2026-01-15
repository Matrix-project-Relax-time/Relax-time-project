import { View, Text, StyleSheet, Pressable, SafeAreaView } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Home, Bell, Dumbbell, Clock, Settings } from "lucide-react-native";

const tabs = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/reminders", label: "Reminders", icon: Bell },
  { href: "/exercises", label: "Library", icon: Dumbbell },
  { href: "/history", label: "History", icon: Clock },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          return (
            <Pressable
              key={tab.href}
              onPress={() => router.push(tab.href)}
              style={({ pressed }) => [styles.tab, pressed && styles.pressed]}
            >
              <View style={styles.iconTextWrapper}>
                <Icon
                  size={24}
                  color={isActive ? "#6366f1" : "#6b7280"}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <Text style={[styles.label, isActive && styles.activeLabel]}>
                  {tab.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
  },

  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingBottom: 10, // space for safe area
    paddingTop: 30,
    height: 50,
  },

  tab: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 56,
  },

  iconTextWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },

  pressed: {
    opacity: 0.6,
  },

  label: {
    fontSize: 10,
    fontWeight: "500" as const,
    color: "#6b7280",
    marginTop: 2,
  },

  activeLabel: {
    color: "#6366f1",
  },
});
