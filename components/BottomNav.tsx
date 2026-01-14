import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Home, Bell, Dumbbell, Clock, Settings } from "lucide-react-native";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/reminders", label: "Reminders", icon: Bell },
  { href: "/exercises", label: "Library", icon: Dumbbell },
  { href: "/history", label: "History", icon: Clock },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          return (
            <Pressable
              key={tab.href}
              onPress={() => router.push(tab.href)}
              style={({ pressed }) => [
                styles.tab,
                isActive && styles.activeTab,
                pressed && styles.pressed,
              ]}
            >
              <Icon
                size={20}
                color={isActive ? "#6366f1" : "#6b7280"}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <Text style={[styles.label, isActive && styles.activeLabel]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    backgroundColor: "#fff",
  },

  inner: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },

  tab: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 56,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 10,
  },

  pressed: {
    opacity: 0.6,
  },

  label: {
    fontSize: 10,
    fontWeight: "500",
    color: "#6b7280",
    marginTop: 2,
  },

  activeTab: {},

  activeLabel: {
    color: "#6366f1",
  },
});
