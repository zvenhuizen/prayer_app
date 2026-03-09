import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
    Alert,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { useAuth } from "@/context/AuthContext";
import {
    addPrayerUpdate,
    getPrayerById,
    getPrayerUpdates,
    markPrayerAnswered,
} from "@/services/prayerService";
import { Prayer } from "@/types/Prayer";
import { PrayerUpdate } from "@/types/PrayerUpdate";

import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/spacing";

export default function PrayerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, userProfile } = useAuth();

  const [prayer, setPrayer] = useState<Prayer | null>(null);
  const [updates, setUpdates] = useState<PrayerUpdate[]>([]);
  const [newUpdate, setNewUpdate] = useState("");
  const [loading, setLoading] = useState(true);
  const [submittingUpdate, setSubmittingUpdate] = useState(false);
  const [markingAnswered, setMarkingAnswered] = useState(false);

  const loadPrayerData = async () => {
    if (!id) return;

    setLoading(true);

    const [prayerResult, updatesResult] = await Promise.all([
      getPrayerById(id),
      getPrayerUpdates(id),
    ]);

    setPrayer(prayerResult);
    setUpdates(updatesResult);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadPrayerData();
    }, [id])
  );

  const handleAddUpdate = async () => {
    if (!user || !id) {
      Alert.alert("Missing user or prayer.");
      return;
    }

    if (!newUpdate.trim()) {
      Alert.alert("Please enter an update message.");
      return;
    }

    try {
      setSubmittingUpdate(true);

      await addPrayerUpdate({
        prayerId: id,
        authorId: user.uid,
        authorName: userProfile?.displayName ?? user.email ?? "Unknown User",
        message: newUpdate.trim(),
      });

      setNewUpdate("");
      await loadPrayerData();
    } catch (error: any) {
      Alert.alert("Could not add update", error.message ?? "Please try again.");
    } finally {
      setSubmittingUpdate(false);
    }
  };

  const handleMarkAnswered = async () => {
    if (!id) return;

    try {
      setMarkingAnswered(true);
      await markPrayerAnswered(id);
      await loadPrayerData();
    } catch (error: any) {
      Alert.alert("Could not mark answered", error.message ?? "Please try again.");
    } finally {
      setMarkingAnswered(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading prayer...</Text>
      </View>
    );
  }

  if (!prayer) {
    return (
      <View style={styles.centered}>
        <Text>Prayer not found.</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={updates}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <>
          <Text style={styles.title}>{prayer.title}</Text>

          <Text style={styles.meta}>Requested by {prayer.ownerName}</Text>

          {prayer.description ? (
            <Text style={styles.description}>{prayer.description}</Text>
          ) : null}

          <View style={styles.statusRow}>
            <Text style={styles.status}>
              Status: {prayer.isAnswered ? "Answered" : "Active"}
            </Text>
          </View>

          {!prayer.isAnswered ? (
            <Pressable
              style={styles.actionButton}
              onPress={handleMarkAnswered}
              disabled={markingAnswered}
            >
              <Text style={styles.actionButtonText}>
                {markingAnswered ? "Marking..." : "Mark Answered"}
              </Text>
            </Pressable>
          ) : null}

          <Text style={styles.sectionTitle}>Add Update</Text>

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Share an update..."
            multiline
            textAlignVertical="top"
            value={newUpdate}
            onChangeText={setNewUpdate}
          />

          <Pressable
            style={styles.actionButton}
            onPress={handleAddUpdate}
            disabled={submittingUpdate}
          >
            <Text style={styles.actionButtonText}>
              {submittingUpdate ? "Saving..." : "Save Update"}
            </Text>
          </Pressable>

          <Text style={styles.sectionTitle}>Updates</Text>
        </>
      }
      renderItem={({ item }) => (
        <View style={styles.updateCard}>
          <Text style={styles.updateAuthor}>{item.authorName}</Text>
          <Text style={styles.updateMessage}>{item.message}</Text>
        </View>
      )}
      ListEmptyComponent={
        <Text style={styles.emptyText}>No updates yet.</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    padding: Spacing.xl,
    paddingBottom: 80,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: Spacing.sm,
  },
  meta: {
    fontSize: 14,
    color: Colors.light.mutedText,
    marginBottom: Spacing.lg,
  },
  description: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  statusRow: {
    marginBottom: Spacing.lg,
  },
  status: {
    fontSize: 15,
    color: Colors.light.primary,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.light.text,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
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
    minHeight: 100,
  },
  actionButton: {
    backgroundColor: Colors.light.primary,
    padding: Spacing.lg,
    borderRadius: 10,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  updateCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 10,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  updateAuthor: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  updateMessage: {
    fontSize: 15,
    color: Colors.light.text,
    lineHeight: 20,
  },
  emptyText: {
    color: Colors.light.mutedText,
    marginTop: Spacing.md,
  },
});