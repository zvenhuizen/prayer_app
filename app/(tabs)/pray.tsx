import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/spacing";
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
    padding: Spacing.xl,
    justifyContent: "center",
    backgroundColor: Colors.light.background,
  },

  greeting: {
    fontSize: 20,
    marginBottom: Spacing.lg,
    color: Colors.light.text,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: Colors.light.text,
  },

  focus: {
    fontSize: 20,
    marginTop: Spacing.sm,
    color: Colors.light.primary,
  },

  count: {
    marginTop: Spacing.lg,
    fontSize: 16,
    color: Colors.light.mutedText,
  },

  button: {
    marginTop: Spacing.xxxl,
    backgroundColor: Colors.light.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
});