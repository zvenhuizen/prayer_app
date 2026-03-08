import {
    addDoc,
    collection,
    getDocs,
    query,
    serverTimestamp,
    where,
} from "firebase/firestore";

import { db } from "@/services/firebase";
import { Prayer } from "@/types/Prayer";

export async function createPrayer(params: {
  ownerId: string;
  ownerName: string;
  title: string;
  description?: string;
}) {
  const { ownerId, ownerName, title, description } = params;

  await addDoc(collection(db, "prayers"), {
    ownerId,
    ownerName,
    title,
    description: description ?? "",
    isAnswered: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getUserPrayers(uid: string): Promise<Prayer[]> {
  const q = query(collection(db, "prayers"), where("ownerId", "==", uid));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Prayer[];
}