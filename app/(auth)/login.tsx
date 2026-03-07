import { Link, router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/spacing";
import { useAuth } from "@/context/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    try {
      setSubmitting(true);
      await login(email.trim(), password);
      router.replace("/(tabs)/pray");
    } catch (error: any) {
      Alert.alert("Login failed", error.message ?? "Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to continue your prayer journey.</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable style={styles.button} onPress={handleLogin} disabled={submitting}>
        <Text style={styles.buttonText}>
          {submitting ? "Signing In..." : "Sign In"}
        </Text>
      </Pressable>

      <Link href="/(auth)/signup" style={styles.link}>
        Create an account
      </Link>
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
    marginBottom: Spacing.sm,
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
  link: {
    marginTop: Spacing.xl,
    color: Colors.light.primary,
    textAlign: "center",
    fontSize: 16,
  },
});