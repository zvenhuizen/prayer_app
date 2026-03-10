import LoadingScreen from "@/components/LoadingScreen";
import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";

export default function Index() {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!userProfile?.displayName) {
    return <Redirect href="/(onboarding)/name" />;
  }

  return <Redirect href="/(tabs)/pray" />;
}