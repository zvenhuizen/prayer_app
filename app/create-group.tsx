import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput } from "react-native";

import ScreenContainer from "@/components/ScreenContainer";
import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/spacing";
import { useAuth } from "@/context/AuthContext";
import { createGroup } from "@/features/groups/services/groupService";

export default function CreateGroupScreen() {
  const { user, userProfile } = useAuth();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleCreateGroup = async () => {
    if (!user) {
      Alert.alert("You must be logged in.");
      return;
    }

    if (!name.trim()) {
      Alert.alert("Please enter a group name.");
      return;
    }

    try {
      setSubmitting(true);

      await createGroup({
        name: name.trim(),
        description: description.trim(),
        ownerId: user.uid,
        ownerName: userProfile?.displayName ?? user.email ?? "Unknown User",
      });

      router.back();
    } catch (error: any) {
      Alert.alert("Could not create group", error.message ?? "Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer scroll keyboard>
      <Text style={styles.title}>Create Group</Text>
      <Text style={styles.subtitle}>
        Start a private group for prayer and encouragement.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Group name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description (optional)"
        multiline
        textAlignVertical="top"
        value={description}
        onChangeText={setDescription}
      />

      <Pressable
        style={styles.button}
        onPress={handleCreateGroup}
        disabled={submitting}
      >
        <Text style={styles.buttonText}>
          {submitting ? "Creating..." : "Create Group"}
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
  textArea: {
    minHeight: 120,
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