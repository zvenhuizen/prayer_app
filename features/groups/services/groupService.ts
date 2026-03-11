import {
  addDoc,
  collection,
  documentId,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { Group } from "@/features/groups/types/Group";
import { db } from "@/services/firebase";

function generateJoinCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
}

export async function createGroup(params: {
  name: string;
  description?: string;
  ownerId: string;
  ownerName: string;
}) {
  const { name, description, ownerId, ownerName } = params;

  const joinCode = generateJoinCode();

  const groupRef = await addDoc(collection(db, "groups"), {
    name,
    description: description ?? "",
    ownerId,
    ownerName,
    joinCode,
    createdAt: serverTimestamp(),
  });

  await addDoc(collection(db, "groupMembers"), {
    groupId: groupRef.id,
    userId: ownerId,
    displayName: ownerName,
    role: "leader",
    joinedAt: serverTimestamp(),
  });
}

export async function getUserGroupIds(uid: string): Promise<string[]> {
  const q = query(collection(db, "groupMembers"), where("userId", "==", uid));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => doc.data().groupId as string);
}

export async function getGroupsByIds(groupIds: string[]): Promise<Group[]> {
  if (groupIds.length === 0) {
    return [];
  }

  const groups: Group[] = [];

  // Firestore where(documentId(), "in", ...) supports up to 10 values at a time
  for (let i = 0; i < groupIds.length; i += 10) {
    const chunk = groupIds.slice(i, i + 10);

    const q = query(
      collection(db, "groups"),
      where(documentId(), "in", chunk)
    );

    const snapshot = await getDocs(q);

    groups.push(
      ...(snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Group[])
    );
  }

  return groups;
}

export async function getUserGroups(uid: string): Promise<Group[]> {
  const groupIds = await getUserGroupIds(uid);

  if (groupIds.length === 0) {
    return [];
  }

  return await getGroupsByIds(groupIds);
}