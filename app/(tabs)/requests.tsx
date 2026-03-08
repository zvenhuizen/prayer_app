import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useAuth } from "@/context/AuthContext";
import { getUserPrayers } from "@/services/prayerService";
import { Prayer } from "@/types/Prayer";

import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/spacing";

export default function RequestsScreen() {
  const { user } = useAuth();

  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPrayers = async () => {
    if (!user) return;

    setLoading(true);
    const results = await getUserPrayers(user.uid);
    setPrayers(results);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadPrayers();
    }, [user])
  );

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.addButton}
        onPress={() => router.push("/add-prayer")}
      >
        <Text style={styles.addButtonText}>+ Add Prayer Request</Text>
      </Pressable>

      <FlatList
        data={prayers}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={loadPrayers}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>

            {item.description ? (
              <Text style={styles.description}>{item.description}</Text>
            ) : null}
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No prayer requests yet</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
    backgroundColor: Colors.light.background,
  },

  addButton: {
    backgroundColor: Colors.light.primary,
    padding: Spacing.lg,
    borderRadius: 10,
    marginBottom: Spacing.lg,
  },

  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },

  card: {
    backgroundColor: Colors.light.card,
    borderRadius: 10,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },

  description: {
    marginTop: Spacing.sm,
    color: Colors.light.mutedText,
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: Colors.light.mutedText,
  },
});