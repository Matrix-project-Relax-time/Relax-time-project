import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import * as Notifications from "expo-notifications";

interface WelcomeScreenProps {
  onComplete: () => void;
}

export default function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [isRequesting, setIsRequesting] = useState(false);

  const requestNotificationPermission = async () => {
    setIsRequesting(true);
    try {
      const { status } = await Notifications.requestPermissionsAsync();

      if (status === "granted") {
        Alert.alert(
          "Success!",
          "Notifications are enabled. You will receive reminders."
        );
      } else {
        Alert.alert(
          "Notifications Disabled",
          "You can enable notifications anytime in settings."
        );
      }

      // Complete welcome and proceed to main app
      onComplete();
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      Alert.alert("Error", "Failed to request notification permission");
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.emoji}>🧘</Text>
          <Text style={styles.title}>Welcome to RelaxTime</Text>
          <Text style={styles.subtitle}>
            Your personal relaxation companion
          </Text>
        </View>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Text style={styles.featureEmoji}>🔔</Text>
            <Text style={styles.featureTitle}>Smart Reminders</Text>
            <Text style={styles.featureText}>
              Get personalized reminders for meditation, breaks, and relaxation
              sessions
            </Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureEmoji}>📊</Text>
            <Text style={styles.featureTitle}>Track Progress</Text>
            <Text style={styles.featureText}>
              Monitor your relaxation journey with detailed statistics
            </Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureEmoji}>⏰</Text>
            <Text style={styles.featureTitle}>Custom Schedule</Text>
            <Text style={styles.featureText}>
              Plan your own relaxation routine that fits your lifestyle
            </Text>
          </View>
        </View>

        <View style={styles.notificationSection}>
          <View style={styles.notificationHeader}>
            <Text style={styles.notificationTitle}>Enable Notifications</Text>
            <Text style={styles.notificationSubtitle}>
              Stay on track with reminders about your relaxation sessions
            </Text>
          </View>

          <View style={styles.permissionCard}>
            <Text style={styles.permissionIcon}>🔔</Text>
            <Text style={styles.permissionText}>
              RelaxTime would like to send you notifications for reminders
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={requestNotificationPermission}
          disabled={isRequesting}
        >
          <Text style={styles.primaryButtonText}>
            {isRequesting ? "Processing..." : "Allow Notifications"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          Notifications help you stay consistent with your relaxation goals
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 32,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  features: {
    marginBottom: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  feature: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  featureEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
    textAlign: "center",
  },
  featureText: {
    fontSize: 13,
    color: "#666",
    lineHeight: 19,
    textAlign: "center",
  },
  notificationSection: {
    marginBottom: 24,
  },
  notificationHeader: {
    marginBottom: 16,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  notificationSubtitle: {
    fontSize: 13,
    color: "#666",
  },
  permissionCard: {
    backgroundColor: "#f0f8ff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#0a7ea4",
  },
  permissionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: "#0a7ea4",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
});
