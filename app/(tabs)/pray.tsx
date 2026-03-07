import { Pressable, StyleSheet, Text, View } from "react-native";

export default function PrayScreen() {
  const focus = "Lifegroup";

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Good Morning</Text>

      <Text style={styles.title}>Today's Prayer Focus</Text>

      <Text style={styles.focus}>{focus}</Text>

      <Text style={styles.count}>3 requests today</Text>

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Start Prayer</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },

  greeting: {
    fontSize: 20,
    marginBottom: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
  },

  focus: {
    fontSize: 20,
    marginTop: 10,
    color: "#2e7d32",
  },

  count: {
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },

  button: {
    marginTop: 40,
    backgroundColor: "#2e7d32",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});