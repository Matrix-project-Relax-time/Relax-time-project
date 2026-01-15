import { router } from "expo-router";
import React from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";

type ReminderModalProps = {
  visible: boolean;
  onComplete: () => void;
  onSkip?: () => void;
};

export function ReminderModal({
  visible,
  onComplete,
  onSkip,
}: ReminderModalProps) {
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Set your reminders</Text>
          <Text style={styles.message}>
            Reminders help you stay consistent. You can set them now.
          </Text>

          <Pressable
            style={styles.primaryButton}
            onPress={async () => {
              onComplete(); // first, handle the async storage / state
              router.push("/reminders"); // then navigate
            }}
          >
            <Text style={styles.primaryButtonText}>Set Reminders</Text>
          </Pressable>
          {onSkip && (
            <Pressable style={styles.skipButton} onPress={onSkip}>
              <Text style={styles.skipButtonText}>Skip</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  message: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: "#6366f1",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 999,
    marginBottom: 12,
  },
  primaryButtonText: { color: "#fff", fontWeight: "600" },
  skipButton: { paddingVertical: 12, paddingHorizontal: 32 },
  skipButtonText: { color: "#6b7280", fontWeight: "500" },
});
