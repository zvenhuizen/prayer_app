import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

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
      firstName: "",
      lastName: "",
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

export async function getUserProfile(uid: string) {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return null;
  }

  return {
    id: userSnap.id,
    ...userSnap.data(),
  };
}

export async function updateUserProfileName(params: {
  uid: string;
  firstName: string;
  lastName: string;
}) {
  const { uid, firstName, lastName } = params;
  const displayName = `${firstName} ${lastName}`.trim();

  const userRef = doc(db, "users", uid);

  await updateDoc(userRef, {
    firstName,
    lastName,
    displayName,
    updatedAt: serverTimestamp(),
  });
}