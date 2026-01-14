// lib/mock-data.native.ts

export interface ExerciseStep {
  text: string;
  image: any; // require() returns a number in RN
}

export interface Exercise {
  id: string;
  name: string;
  category: "eye" | "stretch" | "breathing";
  duration: number;
  description: string;
  image: any;
  steps: ExerciseStep[];
}

export interface HistoryItem {
  id: string;
  exerciseId: string;
  exerciseName: string;
  category: "eye" | "stretch" | "breathing";
  completedAt: string;
  status: "completed" | "skipped";
}

export interface Settings {
  workStartTime: string;
  workEndTime: string;
  workDays: number[];
  reminderInterval: number;
  enabledCategories: ("eye" | "stretch" | "breathing")[];
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  theme: "light" | "dark" | "system";
}

export interface Stats {
  todayCompleted: number;
  todaySkipped: number;
  totalMinutes: number;
  streak: number;
  weeklyGoal: number;
  weeklyCompleted: number;
}

// -------------------------
// EXERCISES
// -------------------------
export const mockExercises: Exercise[] = [
  // ----- EYE -----
  {
    id: "eye-1",
    name: "20-20-20 Rule",
    category: "eye",
    duration: 20,
    description: "Look at something 20 feet away for 20 seconds",
    image: require("../assets/images/eye/eye-1.jpg"),
    steps: [
      {
        text: "Find an object 20 feet away",
        image: require("../assets/images/eye/eye-1-step-1.jpg"),
      },
      {
        text: "Focus on it for 20 seconds",
        image: require("../assets/images/eye/eye-1-step-2.jpg"),
      },
      {
        text: "Blink naturally",
        image: require("../assets/images/eye/eye-1-step-3.jpg"),
      },
    ],
  },
  {
    id: "eye-2",
    name: "Eye Rolling",
    category: "eye",
    duration: 30,
    description: "Gentle circular eye movements",
    image: require("../assets/images/eye/eye-2.jpg"),
    steps: [
      {
        text: "Close your eyes",
        image: require("../assets/images/eye/eye-2-step-1.jpg"),
      },
      {
        text: "Roll eyes clockwise 5 times",
        image: require("../assets/images/eye/eye-2-step-2.jpg"),
      },
      {
        text: "Roll eyes counter-clockwise 5 times",
        image: require("../assets/images/eye/eye-2-step-3.jpg"),
      },
    ],
  },
  {
    id: "eye-3",
    name: "Palming",
    category: "eye",
    duration: 60,
    description: "Rest your eyes in darkness",
    image: require("../assets/images/eye/eye-3.jpg"),
    steps: [
      {
        text: "Rub palms together to warm them",
        image: require("../assets/images/eye/eye-3-step-1.jpg"),
      },
      {
        text: "Cup palms over closed eyes",
        image: require("../assets/images/eye/eye-3-step-2.jpg"),
      },
      {
        text: "Relax and breathe deeply",
        image: require("../assets/images/eye/eye-3-step-3.jpg"),
      },
    ],
  },
  {
    id: "eye-4",
    name: "Focus Shifting",
    category: "eye",
    duration: 45,
    description: "Alternate between near and far focus",
    image: require("../assets/images/eye/eye-4.jpg"),
    steps: [
      {
        text: "Hold thumb 10 inches away",
        image: require("../assets/images/eye/eye-4-step-1.jpg"),
      },
      {
        text: "Focus on thumb for 5 seconds",
        image: require("../assets/images/eye/eye-4-step-2.jpg"),
      },
      {
        text: "Focus on distant object for 5 seconds",
        image: require("../assets/images/eye/eye-4-step-3.jpg"),
      },
      {
        text: "Repeat 5 times",
        image: require("../assets/images/eye/eye-4-step-4.jpg"),
      },
    ],
  },

  // ----- STRETCH -----
  {
    id: "stretch-1",
    name: "Neck Rolls",
    category: "stretch",
    duration: 45,
    description: "Gentle neck stretches to release tension",
    image: require("../assets/images/stretch/stretch-1.jpg"),
    steps: [
      {
        text: "Drop chin to chest",
        image: require("../assets/images/stretch/stretch-1-step-1.jpg"),
      },
      {
        text: "Roll head to right shoulder",
        image: require("../assets/images/stretch/stretch-1-step-2.jpg"),
      },
      {
        text: "Roll back and to left",
        image: require("../assets/images/stretch/stretch-1-step-3.jpg"),
      },
      {
        text: "Complete 3 circles each direction",
        image: require("../assets/images/stretch/stretch-1-step-4.jpg"),
      },
    ],
  },
  {
    id: "stretch-2",
    name: "Shoulder Shrugs",
    category: "stretch",
    duration: 30,
    description: "Release shoulder tension",
    image: require("../assets/images/stretch/stretch-2.jpg"),
    steps: [
      {
        text: "Raise shoulders to ears",
        image: require("../assets/images/stretch/stretch-2-step-1.jpg"),
      },
      {
        text: "Hold for 3 seconds",
        image: require("../assets/images/stretch/stretch-2-step-2.jpg"),
      },
      {
        text: "Release and relax",
        image: require("../assets/images/stretch/stretch-2-step-3.jpg"),
      },
      {
        text: "Repeat 5 times",
        image: require("../assets/images/stretch/stretch-2-step-4.jpg"),
      },
    ],
  },
  {
    id: "stretch-3",
    name: "Wrist Circles",
    category: "stretch",
    duration: 30,
    description: "Loosen up your wrists",
    image: require("../assets/images/stretch/stretch-3.jpg"),
    steps: [
      {
        text: "Extend arms forward",
        image: require("../assets/images/stretch/stretch-3-step-1.jpg"),
      },
      {
        text: "Make fists",
        image: require("../assets/images/stretch/stretch-3-step-2.jpg"),
      },
      {
        text: "Rotate wrists 10 times each direction",
        image: require("../assets/images/stretch/stretch-3-step-3.jpg"),
      },
    ],
  },
  {
    id: "stretch-4",
    name: "Seated Spinal Twist",
    category: "stretch",
    duration: 60,
    description: "Gentle spine rotation",
    image: require("../assets/images/stretch/stretch-4.jpg"),
    steps: [
      {
        text: "Sit up straight",
        image: require("../assets/images/stretch/stretch-4-step-1.jpg"),
      },
      {
        text: "Place right hand on left knee",
        image: require("../assets/images/stretch/stretch-4-step-2.jpg"),
      },
      {
        text: "Twist torso left, look over shoulder",
        image: require("../assets/images/stretch/stretch-4-step-3.jpg"),
      },
      {
        text: "Hold 15 seconds, switch sides",
        image: require("../assets/images/stretch/stretch-4-step-4.jpg"),
      },
    ],
  },

  // ----- BREATHING -----
  {
    id: "breath-1",
    name: "Box Breathing",
    category: "breathing",
    duration: 60,
    description: "4-4-4-4 breathing pattern for calm",
    image: require("../assets/images/breath/breath-1.jpg"),
    steps: [
      {
        text: "Inhale for 4 counts",
        image: require("../assets/images/breath/breath-1-step-1.jpg"),
      },
      {
        text: "Hold for 4 counts",
        image: require("../assets/images/breath/breath-1-step-2.jpg"),
      },
      {
        text: "Exhale for 4 counts",
        image: require("../assets/images/breath/breath-1-step-3.jpg"),
      },
      {
        text: "Hold for 4 counts",
        image: require("../assets/images/breath/breath-1-step-4.jpg"),
      },
      {
        text: "Repeat 3 times",
        image: require("../assets/images/breath/breath-1-step-5.jpg"),
      },
    ],
  },
  {
    id: "breath-2",
    name: "4-7-8 Technique",
    category: "breathing",
    duration: 45,
    description: "Calming breath for stress relief",
    image: require("../assets/images/breath/breath-2.jpg"),
    steps: [
      {
        text: "Inhale through nose for 4 counts",
        image: require("../assets/images/breath/breath-2-step-1.jpg"),
      },
      {
        text: "Hold breath for 7 counts",
        image: require("../assets/images/breath/breath-2-step-2.jpg"),
      },
      {
        text: "Exhale through mouth for 8 counts",
        image: require("../assets/images/breath/breath-2-step-3.jpg"),
      },
    ],
  },
  {
    id: "breath-3",
    name: "Deep Belly Breathing",
    category: "breathing",
    duration: 60,
    description: "Diaphragmatic breathing",
    image: require("../assets/images/breath/breath-3.jpg"),
    steps: [
      {
        text: "Place hand on belly",
        image: require("../assets/images/breath/breath-3-step-1.jpg"),
      },
      {
        text: "Inhale deeply, feel belly rise",
        image: require("../assets/images/breath/breath-3-step-2.jpg"),
      },
      {
        text: "Exhale slowly, feel belly fall",
        image: require("../assets/images/breath/breath-3-step-3.jpg"),
      },
      {
        text: "Repeat 5 times",
        image: require("../assets/images/breath/breath-3-step-4.jpg"),
      },
    ],
  },
  {
    id: "breath-4",
    name: "Energizing Breath",
    category: "breathing",
    duration: 30,
    description: "Quick breathing to boost energy",
    image: require("../assets/images/breath/breath-4.jpg"),
    steps: [
      {
        text: "Take 3 quick, sharp inhales through nose",
        image: require("../assets/images/breath/breath-4-step-1.jpg"),
      },
      {
        text: "One long exhale through mouth",
        image: require("../assets/images/breath/breath-4-step-2.jpg"),
      },
      {
        text: "Repeat 5 times",
        image: require("../assets/images/breath/breath-4-step-3.jpg"),
      },
    ],
  },
];

// -------------------------
// HISTORY
// -------------------------
export const mockHistory: HistoryItem[] = [
  {
    id: "1",
    exerciseId: "eye-1",
    exerciseName: "20-20-20 Rule",
    category: "eye",
    completedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    status: "completed",
  },
  {
    id: "2",
    exerciseId: "stretch-1",
    exerciseName: "Neck Rolls",
    category: "stretch",
    completedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    status: "completed",
  },
  {
    id: "3",
    exerciseId: "breath-1",
    exerciseName: "Box Breathing",
    category: "breathing",
    completedAt: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
    status: "skipped",
  },
  {
    id: "4",
    exerciseId: "eye-2",
    exerciseName: "Eye Rolling",
    category: "eye",
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: "completed",
  },
  {
    id: "5",
    exerciseId: "stretch-2",
    exerciseName: "Shoulder Shrugs",
    category: "stretch",
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
    status: "completed",
  },
  {
    id: "6",
    exerciseId: "breath-2",
    exerciseName: "4-7-8 Technique",
    category: "breathing",
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    status: "completed",
  },
  {
    id: "7",
    exerciseId: "eye-3",
    exerciseName: "Palming",
    category: "eye",
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    status: "skipped",
  },
  {
    id: "8",
    exerciseId: "stretch-3",
    exerciseName: "Wrist Circles",
    category: "stretch",
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 49).toISOString(),
    status: "completed",
  },
];

// -------------------------
// SETTINGS
// -------------------------
export const mockSettings: Settings = {
  workStartTime: "09:00",
  workEndTime: "17:00",
  workDays: [1, 2, 3, 4, 5],
  reminderInterval: 45,
  enabledCategories: ["eye", "stretch", "breathing"],
  soundEnabled: true,
  notificationsEnabled: true,
  theme: "system",
};

// -------------------------
// STATS
// -------------------------
export const mockStats: Stats = {
  todayCompleted: 3,
  todaySkipped: 1,
  totalMinutes: 12,
  streak: 5,
  weeklyGoal: 20,
  weeklyCompleted: 14,
};
