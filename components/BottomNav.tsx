import { usePathname, useRouter } from "expo-router";
import { Bell, Clock, Dumbbell, Home, Settings } from "lucide-react-native";
import { memo, useCallback } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
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
      <Pressable
        onPress={onPress}
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
  }
);

TabButton.displayName = "TabButton";

export const BottomNav = memo(function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const handleNavigation = useCallback(
    (href: typeof tabs[number]["href"]) => {
      router.push(href);
    },
    [router]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <TabButton
              key={tab.href}
              tab={tab}
              isActive={isActive}
              onPress={() => handleNavigation(tab.href)}
            />
          );
        })}
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },

  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 10,
    paddingHorizontal: 10,
    minHeight: 60,
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
