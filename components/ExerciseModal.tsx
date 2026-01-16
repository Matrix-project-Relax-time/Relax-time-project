import { useEffect, useState } from "react";
import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";

import {
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pause,
  Play,
  RotateCcw,
  Speech as Stretch,
  Wind,
  X,
} from "lucide-react-native";

interface ExerciseStep {
  text: string;
  image: string;
}

interface Exercise {
  id: string;
  name: string;
  category: "eye" | "stretch" | "breathing";
  duration: number;
  description: string;
  image: string;
  steps: ExerciseStep[];
}

interface ExerciseModalProps {
  exercise: Exercise;
  onComplete: (completed: boolean) => void;
  onClose: () => void;
}

const categoryConfig = {
  eye: { label: "Eye Care", icon: Eye, color: "#60a5fa" },
  stretch: { label: "Stretching", icon: Stretch, color: "#34d399" },
  breathing: { label: "Breathing", icon: Wind, color: "#a78bfa" },
};

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function ExerciseModal({
  exercise,
  onComplete,
  onClose,
}: ExerciseModalProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(exercise.duration);
  const [currentStep, setCurrentStep] = useState(0);

  const progress = ((exercise.duration - timeLeft) / exercise.duration) * 100;

  const config = categoryConfig[exercise.category];
  const Icon = config.icon;

  /* ---------------- Timer ---------------- */

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setIsRunning(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  /* ---------------- Step sync ---------------- */

  useEffect(() => {
    if (!exercise.steps.length) return;

    const stepDuration = exercise.duration / exercise.steps.length;
    const elapsed = exercise.duration - timeLeft;
    const step = Math.min(
      Math.floor(elapsed / stepDuration),
      exercise.steps.length - 1
    );

    setCurrentStep(step);
  }, [timeLeft, exercise]);

  const reset = () => {
    setIsRunning(false);
    setTimeLeft(exercise.duration);
    setCurrentStep(0);
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < exercise.steps.length) {
      setCurrentStep(step);
    }
  };

  return (
    <Modal
      visible={true}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={onClose} hitSlop={16} style={styles.iconButton}>
            <X size={24} color="#000" />
          </Pressable>

          <View style={styles.category}>
            <Icon size={16} color={config.color} />
            <Text style={styles.categoryText}>{config.label}</Text>
          </View>

          <View style={{ width: 36 }} />
        </View>

        <View>
          {/* Image */}
          <View style={styles.imageWrapper}>
            <Image
              source={{
                uri: exercise.steps[currentStep]?.image || exercise.image,
              }}
              style={styles.image}
            />

            {/* Step navigation */}
            <View style={styles.imageOverlay}>
              <Pressable
                onPress={() => goToStep(currentStep - 1)}
                disabled={currentStep === 0}
                style={styles.overlayButton}
              >
                <ChevronLeft size={20} />
              </Pressable>

              <View style={styles.stepDots}>
                {exercise.steps.map((_, i) => (
                  <View
                    key={i}
                    style={[styles.dot, i === currentStep && styles.activeDot]}
                  />
                ))}
              </View>

              <Pressable
                onPress={() => goToStep(currentStep + 1)}
                disabled={currentStep === exercise.steps.length - 1}
                style={styles.overlayButton}
              >
                <ChevronRight size={20} />
              </Pressable>
            </View>
          </View>

          {/* Info */}
          <View style={styles.content}>
            <Text style={styles.title}>{exercise.name}</Text>
            <Text style={styles.description}>{exercise.description}</Text>

            {/* Step card */}
            <View style={styles.stepCard}>
              <Text style={styles.stepText}>
                {exercise.steps[currentStep]?.text}
              </Text>
            </View>

            {/* Timer */}
            <View style={styles.timer}>
              <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
              <View style={styles.progressTrack}>
                <View
                  style={[styles.progressFill, { width: `${progress}%` }]}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Bottom controls */}
        <View style={styles.footer}>
          <View style={styles.controls}>
            <Pressable onPress={reset} style={styles.circleBtn}>
              <RotateCcw size={20} />
            </Pressable>

            <Pressable
              onPress={() => setIsRunning(!isRunning)}
              style={[styles.circleBtn, styles.playBtn]}
            >
              {isRunning ? <Pause size={24} /> : <Play size={24} />}
            </Pressable>
          </View>

          <View style={styles.actions}>
            <Pressable
              style={styles.outlineBtn}
              onPress={() => onComplete(false)}
            >
              <Text>Skip</Text>
            </Pressable>

            <Pressable
              style={styles.primaryBtn}
              onPress={() => onComplete(true)}
            >
              <Check size={16} color="#fff" />
              <Text style={styles.primaryText}>Complete</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },

  iconButton: {
    height: 60, // bigger height
    width: 40, // keep width or increase if needed
    padding: 0, // remove paddingTop
    paddingTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  category: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    gap: 6,
  },

  categoryText: {
    fontSize: 14,
    fontWeight: "500",
  },

  imageWrapper: {
    aspectRatio: 1,
    backgroundColor: "#f3f4f6",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  imageOverlay: {
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },

  overlayButton: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 999,
  },

  stepDots: {
    flexDirection: "row",
    gap: 6,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#d1d5db",
  },

  activeDot: {
    width: 20,
    backgroundColor: "#6366f1",
  },

  content: {
    padding: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },

  description: {
    color: "#6b7280",
    marginBottom: 16,
  },

  stepCard: {
    backgroundColor: "#f9fafb",
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },

  stepText: {
    fontSize: 16,
    fontWeight: "500",
  },

  timer: {
    alignItems: "center",
    gap: 12,
  },

  timerText: {
    fontSize: 28,
    fontWeight: "700",
  },

  progressTrack: {
    height: 6,
    width: "100%",
    backgroundColor: "#e5e7eb",
    borderRadius: 999,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#6366f1",
  },

  footer: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    padding: 6,
  },

  controls: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 16,
  },

  circleBtn: {
    height: 55,
    width: 55,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },

  playBtn: {
    height: 55,
    width: 55,
    borderRadius: 32,
    backgroundColor: "#6366f1",
  },

  actions: {
    flexDirection: "row",
    gap: 12,
  },

  outlineBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },

  primaryBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#6366f1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  primaryText: {
    color: "#fff",
    fontWeight: "600",
  },
});
