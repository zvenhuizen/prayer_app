import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { db } from "@/services/firebase";

export async function ensureUserProfile(params: {
  uid: string;
  email: string | null;
}) {
  const { uid, email } = params;

  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      email: email ?? "",
      displayName: "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      churchId: null,
      prayerSchedule: {
        monday: "personal",
        tuesday: "lifegroup",
        wednesday: "personal",
        thursday: "personal",
        friday: "lifegroup",
        saturday: "family",
        sunday: "thanksgiving",
      },
      reminderTimes: [],
    });
    return;
  }

  await setDoc(
    userRef,
    {
      email: email ?? "",
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}