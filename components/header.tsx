
import { Image, StyleSheet, View } from "react-native";
import { ThemedText } from "./themed-text";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Header / outside scroll view */}
      <View style={styles.header}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.leapLogo}
          />

          <ThemedText style={styles.headerText}>Relax time</ThemedText>
        </View>
        <View style={{ marginLeft: -33 }}>
          <Image
            source={require("@/assets/images/settings.png")}
            style={styles.settingsLogo}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111" },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    marginHorizontal: 8,
    flexShrink: 1,
  },
  header: {
    marginTop: 50,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderColor: "#222",
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderWidth: 1,
    backgroundColor: "#111",
    flexDirection: "row",
    alignItems: "center",
  },
  leapLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  card: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(39, 39, 39, 1)",
  },
  cardText: {
    marginTop: 8,
    fontSize: 14,
    color: "white",
  },

  footer: {
    padding: 10,
    backgroundColor: "#222",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#4f8ef7",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
  },
  settingsLogo: {
    width: 30,
    height: 30,
    borderRadius: 20,
  },
});
