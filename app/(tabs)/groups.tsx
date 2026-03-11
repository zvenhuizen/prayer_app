import ScreenContainer from "@/components/ScreenContainer"
import { Pressable, StyleSheet, Text } from "react-native"

import { Colors } from "@/constants/colors"
import { Spacing } from "@/constants/spacing"

export default function GroupsScreen() {
  return (
    <ScreenContainer>
      <Text style={styles.title}>Groups</Text>

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Create Group</Text>
      </Pressable>

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Join Group</Text>
      </Pressable>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: Spacing.xl,
  },

  button: {
    backgroundColor: Colors.light.primary,
    padding: Spacing.lg,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: Spacing.md,
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
})