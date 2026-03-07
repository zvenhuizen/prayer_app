import { router } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/spacing";
import { useAuth } from "@/context/AuthContext";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/(auth)/login");
    } catch (error: any) {
      Alert.alert("Logout failed", error.message ?? "Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.email}>{user?.email ?? "No email found"}</Text>

      <Pressable style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: Spacing.xl,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: Spacing.md,
  },
  email: {
    fontSize: 16,
    color: Colors.light.mutedText,
    marginBottom: Spacing.xl,
  },
  button: {
    backgroundColor: Colors.light.primary,
    padding: Spacing.lg,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});