import Header from "@/components/header";
import WorkScheduleManager from "@/components/work-schedule-manager";

import { StyleSheet, ScrollView } from "react-native";

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <Header></Header>
      <WorkScheduleManager />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111" },
});
