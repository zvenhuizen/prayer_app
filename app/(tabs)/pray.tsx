import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import ScreenContainer from "@/components/ScreenContainer";
import { useAuth } from "@/context/AuthContext";
import { getActiveUserPrayers } from "@/features/prayers/services/prayerService";
import { Prayer } from "@/features/prayers/types/Prayer";

import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/spacing";

export default function PrayScreen() {
  const { user, userProfile } = useAuth();

  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);

  const firstName = userProfile?.firstName?.trim() || "friend";

  const todaysFocus = useMemo(() => {
    const day = new Date().toLocaleDateString("en-US", {
      weekday: "long",
    }).toLowerCase() as
      | "monday"
      | "tuesday"
      | "wednesday"
      | "thursday"
      | "friday"
      | "saturday"
      | "sunday";

    return userProfile?.prayerSchedule?.[day] ?? "personal";
  }, [userProfile]);

  const loadPrayers = async () => {
    if (!user) return;

    setLoading(true);
    const results = await getActiveUserPrayers(user.uid);
    setPrayers(results);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadPrayers();
    }, [user])
  );

  const formattedFocus =
    todaysFocus.charAt(0).toUpperCase() + todaysFocus.slice(1);

  return (
    <ScreenContainer>
      <FlatList
        data={prayers}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={loadPrayers}
        ListHeaderComponent={
          <>
            <Text style={styles.greeting}>Good morning, {firstName}</Text>

            <Text style={styles.sectionLabel}>Today's Prayer Focus</Text>
            <Text style={styles.focus}>{formattedFocus}</Text>

            <Text style={styles.count}>
              {prayers.length} active prayer{prayers.length === 1 ? "" : "s"}
            </Text>

            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>Start Prayer</Text>
            </Pressable>

            <Text style={styles.sectionTitle}>Your Active Prayers</Text>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>

            {item.description ? (
              <Text style={styles.cardDescription}>{item.description}</Text>
            ) : null}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No active prayer requests yet</Text>
            <Text style={styles.emptyText}>
              Add a prayer request in the Requests tab to start building your
              prayer rhythm.
            </Text>
          </View>
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

  greeting: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: Spacing.xl,
  },

  sectionLabel: {
    fontSize: 14,
    color: Colors.light.mutedText,
    marginBottom: Spacing.xs,
  },

  focus: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.light.primary,
    marginBottom: Spacing.lg,
  },

  count: {
    fontSize: 16,
    color: Colors.light.mutedText,
    marginBottom: Spacing.lg,
  },

  button: {
    backgroundColor: Colors.light.primary,
    padding: Spacing.lg,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: Spacing.xl,
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
    fontWeight: "600",
    color: Colors.light.text,
  },

  cardDescription: {
    marginTop: Spacing.sm,
    color: Colors.light.mutedText,
    lineHeight: 20,
  },

  emptyState: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: Spacing.xl,
    marginTop: Spacing.sm,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: Spacing.sm,
  },

  emptyText: {
    fontSize: 15,
    color: Colors.light.mutedText,
    lineHeight: 22,
  },
});