import ScreenContainer from "@/components/ScreenContainer";
import { useAuth } from "@/context/AuthContext";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/spacing";

export default function ProfileScreen() {
  const { user, userProfile, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error: any) {
      Alert.alert("Logout failed", error.message ?? "Please try again.");
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>
          {userProfile?.displayName ?? "Not set"}
        </Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email}</Text>
      </View>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: Spacing.xl,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.light.text,
  },

  card: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
  },

  label: {
    fontSize: 13,
    color: Colors.light.mutedText,
    marginTop: Spacing.md,
  },

  value: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.light.text,
    marginTop: Spacing.xs,
  },

  logoutButton: {
    backgroundColor: "#ef4444",
    padding: Spacing.lg,
    borderRadius: 10,
    alignItems: "center",
  },

  logoutText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});