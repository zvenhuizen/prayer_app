import { StyleSheet, Text, View } from "react-native";

export default function PrayScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pray</Text>
      <Text style={styles.subtitle}>Welcome to your prayer time.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
});