import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

export type ThemeMode = "light" | "dark" | "system";

export const lightTheme = {
  background: "#ffffff",
  card: "#f3f4f6",
  text: "#111827",
  subText: "#6b7280",
  iconBg: "#e5e7eb",
  primary: "#6465f0",
  danger: "#6465f0",
  breath: "#",
};

export const darkTheme = {
  background: "#1b1a1c",
  card: "#282729",
  text: "#fff",
  subText: "#94a3b8",
  iconBg: "#323459",
  primary: "#6465f0",
  danger: "#6465f0",
  breath: "#fff",
};

type ThemeType = typeof lightTheme;

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  theme: ThemeType;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("themeMode").then((val) => {
      if (val) setThemeMode(val as ThemeMode);
      setIsLoaded(true);
    });
  }, []);

  const saveThemeMode = async (mode: ThemeMode) => {
    setThemeMode(mode);
    await AsyncStorage.setItem("themeMode", mode);
  };

  const activeTheme =
    themeMode === "system"
      ? systemScheme === "dark"
        ? darkTheme
        : lightTheme
      : themeMode === "dark"
        ? darkTheme
        : lightTheme;

  if (!isLoaded) return null;

  return (
    <ThemeContext.Provider
      value={{ themeMode, setThemeMode: saveThemeMode, theme: activeTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};
