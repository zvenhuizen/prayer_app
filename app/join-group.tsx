import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput } from "react-native";

import ScreenContainer from "@/components/ScreenContainer";
import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/spacing";
import { useAuth } from "@/context/AuthContext";
import { joinGroupByCode } from "@/features/groups/services/groupService";

export default function JoinGroupScreen() {
  const { user, userProfile } = useAuth();

  const [joinCode, setJoinCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleJoinGroup = async () => {
    if (!user) {
      Alert.alert("You must be logged in.");
      return;
    }

    if (!joinCode.trim()) {
      Alert.alert("Please enter a join code.");
      return;
    }

    try {
      setSubmitting(true);

      const result = await joinGroupByCode({
        joinCode,
        userId: user.uid,
        displayName: userProfile?.displayName ?? user.email ?? "Unknown User",
      });

      Alert.alert("Joined Group", `You joined ${result.groupName}.`);
      router.back();
    } catch (error: any) {
      Alert.alert("Could not join group", error.message ?? "Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer scroll keyboard>
      <Text style={styles.title}>Join Group</Text>
      <Text style={styles.subtitle}>
        Enter the 6-character code from your group leader.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Join code"
        autoCapitalize="characters"
        value={joinCode}
        onChangeText={setJoinCode}
      />

      <Pressable
        style={styles.button}
        onPress={handleJoinGroup}
        disabled={submitting}
      >
        <Text style={styles.buttonText}>
          {submitting ? "Joining..." : "Join Group"}
        </Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: Spacing.sm,
    marginTop: Spacing.xxxl,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.mutedText,
    marginBottom: Spacing.xl,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.card,
    borderRadius: 10,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    color: Colors.light.text,
  },
  button: {
    backgroundColor: Colors.light.primary,
    padding: Spacing.lg,
    borderRadius: 10,
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});