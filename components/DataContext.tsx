import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// --- Types ---
export type Category = "eye" | "stretch" | "breathing";

export interface ExerciseStep {
  text: string;
  image?: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: Category;
  duration: number;
  description: string;
  image?: string;
  steps: ExerciseStep[];
}

export interface Settings {
  workStartTime: string;
  workEndTime: string;
  workDays: number[];
  reminderInterval: number;
  enabledCategories: string[];
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  theme: "light" | "dark";
  
}

export interface Stats {
  todayCompleted: number;
  todaySkipped: number;
  streak: number;
  weeklyCompleted: number;
  weeklyGoal: number;
  totalMinutes: number;
}

export interface HistoryItem {
  id: string;
  exerciseId: string;
  exerciseName: string;
  category: string;
  completedAt: string;
  status: "completed" | "skipped";
}

interface DataContextType {
  exercises: Exercise[];
  history: HistoryItem[];
  settings: Settings | null;
  stats: Stats | null;
  isLoading: boolean;
  refreshData: () => Promise<void>;
  addHistoryItem: (item: HistoryItem) => void;
  // ✅ allow partial updates
  updateSettings: (settings: Partial<Settings>) => void;
}


// --- Context ---
const DataContext = createContext<DataContextType>({
  exercises: [],
  history: [],
  settings: null,
  stats: null,
  isLoading: true,
  refreshData: async () => {},
  addHistoryItem: () => {},
  updateSettings: () => {},
});

const API_URL = "http://172.20.10.3:5000";

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);


const updateSettings = (newSettings: Partial<Settings>) => {
  setSettings((prev) => {
    const updated: Settings = {
      workStartTime: prev?.workStartTime ?? "09:00",
      workEndTime: prev?.workEndTime ?? "17:00",
      workDays: prev?.workDays ?? [1, 2, 3, 4, 5],
      reminderInterval: prev?.reminderInterval ?? 60,
      enabledCategories: prev?.enabledCategories ?? ["eye", "stretch"],
      soundEnabled: prev?.soundEnabled ?? true,
      notificationsEnabled: prev?.notificationsEnabled ?? true,
      theme: prev?.theme ?? "light",
      
      ...newSettings,
    };
    AsyncStorage.setItem("reminderSettings", JSON.stringify(updated));
    return updated;
  });
};



  const refreshData = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem("reminderSettings");
      const localSettings = stored
        ? (JSON.parse(stored) as Partial<Settings>)
        : null;

      const [exercisesRes, historyRes, settingsRes, statsRes] =
        await Promise.all([
          fetch(`${API_URL}/api/exercises`).catch(() => null),
          fetch(`${API_URL}/api/history`).catch(() => null),
          fetch(`${API_URL}/api/settings`).catch(() => null),
          fetch(`${API_URL}/api/stats`).catch(() => null),
        ]);

      if (exercisesRes?.ok) {
        const data = await exercisesRes.json();
        if (Array.isArray(data)) setExercises(data);
      }

      if (historyRes?.ok) {
        const data = await historyRes.json();
        if (Array.isArray(data)) setHistory(data);
      }

      if (settingsRes?.ok) {
        const data = (await settingsRes.json()) as Partial<Settings>;

        setSettings({
          workStartTime:
            localSettings?.workStartTime ??
            data.workStartTime ??
            "09:00",
          workEndTime:
            localSettings?.workEndTime ??
            data.workEndTime ??
            "17:00",
          workDays:
            localSettings?.workDays ??
            data.workDays ??
            [1, 2, 3, 4, 5],
          reminderInterval:
            localSettings?.reminderInterval ??
            data.reminderInterval ??
            60,
          enabledCategories:
            localSettings?.enabledCategories ??
            data.enabledCategories ??
            ["eye", "stretch"],
          soundEnabled:
            localSettings?.soundEnabled ??
            data.soundEnabled ??
            true,
          notificationsEnabled:
            data.notificationsEnabled ?? true,
          theme: data.theme ?? "light",
        });
      }

      if (statsRes?.ok) {
        const data = (await statsRes.json()) as Stats;
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const addHistoryItem = (item: HistoryItem) => {
    setHistory((prev) => [item, ...prev]);

    setStats((prev) => {
      if (!prev) return null;
      const completed = item.status === "completed";
      return {
        ...prev,
        todayCompleted: completed
          ? prev.todayCompleted + 1
          : prev.todayCompleted,
        todaySkipped: !completed
          ? prev.todaySkipped + 1
          : prev.todaySkipped,
        weeklyCompleted: completed
          ? prev.weeklyCompleted + 1
          : prev.weeklyCompleted,
      };
    });
  };

  return (
    <DataContext.Provider
      value={{
        exercises,
        history,
        settings,
        stats,
        isLoading,
        refreshData,
        addHistoryItem,
        updateSettings,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
