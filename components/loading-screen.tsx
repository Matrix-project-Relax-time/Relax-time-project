import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({
  message = "Loading...",
}: LoadingScreenProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0a7ea4" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
});
