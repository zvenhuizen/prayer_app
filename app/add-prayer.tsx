import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";

import ScreenContainer from "@/components/ScreenContainer";
import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/spacing";
import { useAuth } from "@/context/AuthContext";
import { createPrayer } from "@/services/prayerService";

export default function AddPrayerScreen() {
  const { user, userProfile } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async () => {
    if (!user) {
      Alert.alert("You must be logged in.");
      return;
    }

    if (!title.trim()) {
      Alert.alert("Please enter a prayer title.");
      return;
    }

    try {
      setSubmitting(true);

      await createPrayer({
        ownerId: user.uid,
        ownerName: userProfile?.displayName ?? user.email ?? "Unknown User",
        title: title.trim(),
        description: description.trim(),
      });

      router.back();
    } catch (error: any) {
      Alert.alert("Could not save prayer", error.message ?? "Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer scroll keyboard>
      <Text style={styles.title}>Add Prayer Request</Text>
      <Text style={styles.subtitle}>What would you like to pray for?</Text>

      <TextInput
        style={styles.input}
        placeholder="Prayer title"
        value={title}
        onChangeText={setTitle}
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
        onPress={handleSave}
        disabled={submitting}
      >
        <Text style={styles.buttonText}>
          {submitting ? "Saving..." : "Save Prayer"}
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