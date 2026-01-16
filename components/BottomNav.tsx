import { usePathname, useRouter } from "expo-router";
import { Bell, Clock, Dumbbell, Home, Settings } from "lucide-react-native";
import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const tabs = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/reminders", label: "Reminders", icon: Bell },
  { href: "/exercises", label: "Library", icon: Dumbbell },
  { href: "/history", label: "History", icon: Clock },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

const TabButton = memo(
  ({
    tab,
    isActive,
    onPress,
  }: {
    tab: (typeof tabs)[number];
    isActive: boolean;
    onPress: () => void;
  }) => {
    const Icon = tab.icon;
    return (
      <Pressable onPress={onPress} style={styles.tab}>
        <Icon
          size={22}
          color={isActive ? "#6366f1" : "#6b7280"}
          strokeWidth={isActive ? 2.5 : 2}
        />
        <Text style={[styles.label, isActive && styles.activeLabel]}>
          {tab.label}
        </Text>
      </Pressable>
    );
  }
);

TabButton.displayName = "TabButton";

export const BottomNav = memo(function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}
    >
      {tabs.map((tab) => (
        <TabButton
          key={tab.href}
          tab={tab}
          isActive={pathname === tab.href}
          onPress={() => router.push(tab.href)}
        />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 80,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },

  tab: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 56,
    marginTop: 30,
  },

  label: {
    fontSize: 10,
    marginTop: 2,
    color: "#6b7280",
    fontWeight: "500",
  },

  activeLabel: {
    color: "#6366f1",
  },
});
