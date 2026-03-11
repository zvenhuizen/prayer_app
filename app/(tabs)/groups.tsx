import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import ScreenContainer from "@/components/ScreenContainer";
import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/spacing";
import { useAuth } from "@/context/AuthContext";
import { getUserGroups } from "@/features/groups/services/groupService";
import { Group } from "@/features/groups/types/Group";

export default function GroupsScreen() {
  const { user } = useAuth();

  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  const loadGroups = async () => {
    if (!user) return;

    setLoading(true);
    const results = await getUserGroups(user.uid);
    setGroups(results);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadGroups();
    }, [user])
  );

  return (
    <ScreenContainer>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={loadGroups}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Groups</Text>

            <Pressable
              style={styles.button}
              onPress={() => router.push("/create-group")}
            >
              <Text style={styles.buttonText}>Create Group</Text>
            </Pressable>

            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>Join Group</Text>
            </Pressable>

            <Text style={styles.sectionTitle}>Your Groups</Text>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.name}</Text>

            {item.description ? (
              <Text style={styles.cardDescription}>{item.description}</Text>
            ) : null}

            <Text style={styles.joinCode}>Join Code: {item.joinCode}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            You are not part of any groups yet.
          </Text>
        }
        contentContainerStyle={styles.contentContainer}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 40,
  },

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

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.light.text,
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },

  card: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.text,
  },

  cardDescription: {
    marginTop: Spacing.sm,
    color: Colors.light.mutedText,
    lineHeight: 20,
  },

  joinCode: {
    marginTop: Spacing.md,
    fontSize: 13,
    color: Colors.light.mutedText,
  },

  emptyText: {
    color: Colors.light.mutedText,
    marginTop: Spacing.sm,
  },
});