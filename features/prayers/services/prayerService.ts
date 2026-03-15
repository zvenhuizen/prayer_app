import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { Prayer } from "@/features/prayers/types/Prayer";
import { PrayerUpdate } from "@/features/prayers/types/PrayerUpdate";
import { db } from "@/services/firebase";
import { writeBatch } from "firebase/firestore";

export async function createPrayer(params: {
  ownerId: string
  ownerName: string
  title: string
  description?: string
  groupIds?: string[]
}) {
  const { ownerId, ownerName, title, description, groupIds } = params

  const prayerRef = doc(collection(db, "prayers"))

  const batch = writeBatch(db)

  batch.set(prayerRef, {
    ownerId,
    ownerName,
    title,
    description: description ?? "",
    isAnswered: false,
    answeredAt: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  if (groupIds && groupIds.length > 0) {
    groupIds.forEach((groupId) => {
      const linkRef = doc(collection(db, "groupPrayers"))

      batch.set(linkRef, {
        groupId,
        prayerId: prayerRef.id,
        ownerId,
        sharedAt: serverTimestamp(),
      })
    })
  }

  await batch.commit()
}

export async function getUserPrayers(uid: string): Promise<Prayer[]> {
  const q = query(collection(db, "prayers"), where("ownerId", "==", uid));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Prayer[];
}

export async function getActiveUserPrayers(uid: string): Promise<Prayer[]> {
  const q = query(
    collection(db, "prayers"),
    where("ownerId", "==", uid),
    where("isAnswered", "==", false)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Prayer[];
}

export async function getPrayerById(prayerId: string): Promise<Prayer | null> {
  const prayerRef = doc(db, "prayers", prayerId);
  const snapshot = await getDoc(prayerRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Prayer;
}

export async function markPrayerAnswered(prayerId: string) {
  const prayerRef = doc(db, "prayers", prayerId);

  await updateDoc(prayerRef, {
    isAnswered: true,
    answeredAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function addPrayerUpdate(params: {
  prayerId: string;
  authorId: string;
  authorName: string;
  message: string;
}) {
  const { prayerId, authorId, authorName, message } = params;

  await addDoc(collection(db, "prayerUpdates"), {
    prayerId,
    authorId,
    authorName,
    message,
    createdAt: serverTimestamp(),
  });

  const prayerRef = doc(db, "prayers", prayerId);

  await updateDoc(prayerRef, {
    updatedAt: serverTimestamp(),
  });
}

export async function getPrayerUpdates(prayerId: string): Promise<PrayerUpdate[]> {
  const q = query(
    collection(db, "prayerUpdates"),
    where("prayerId", "==", prayerId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as PrayerUpdate[];
}