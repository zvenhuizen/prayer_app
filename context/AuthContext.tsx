import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { auth } from "@/services/firebase";
import { ensureUserProfile, getUserProfile } from "@/services/userService";
import { UserProfile } from "@/types/UserProfile";

type AuthContextType = {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUserProfile = async () => {
    if (!auth.currentUser) {
      setUserProfile(null);
      return;
    }

    const profile = await getUserProfile(auth.currentUser.uid);
    setUserProfile(profile as UserProfile | null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        await ensureUserProfile({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
        });

        const profile = await getUserProfile(firebaseUser.uid);
        setUserProfile(profile as UserProfile | null);
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      user,
      userProfile,
      loading,
      login: async (email: string, password: string) => {
        const credential = await signInWithEmailAndPassword(auth, email, password);

        await ensureUserProfile({
          uid: credential.user.uid,
          email: credential.user.email,
        });

        const profile = await getUserProfile(credential.user.uid);
        setUserProfile(profile as UserProfile | null);
      },
      signup: async (email: string, password: string) => {
        const credential = await createUserWithEmailAndPassword(auth, email, password);

        await ensureUserProfile({
          uid: credential.user.uid,
          email: credential.user.email,
        });

        const profile = await getUserProfile(credential.user.uid);
        setUserProfile(profile as UserProfile | null);
      },
      logout: async () => {
        await signOut(auth);
        setUserProfile(null);
      },
      refreshUserProfile,
    }),
    [user, userProfile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}