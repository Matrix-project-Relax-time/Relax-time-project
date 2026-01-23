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
});

const API_URL = "http://172.20.10.2:5000";

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = useCallback(async () => {
    try {
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
          workStartTime: data.workStartTime ?? "09:00",
          workEndTime: data.workEndTime ?? "17:00",
          workDays: data.workDays ?? [1, 2, 3, 4, 5],
          reminderInterval: data.reminderInterval ?? 60,
          enabledCategories: data.enabledCategories ?? ["eye", "stretch"],
          soundEnabled: data.soundEnabled ?? true,
          notificationsEnabled: data.notificationsEnabled ?? true,
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

  // Fetch on mount
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const addHistoryItem = (item: HistoryItem) => {
    setHistory((prev) => [item, ...prev]);
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
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
