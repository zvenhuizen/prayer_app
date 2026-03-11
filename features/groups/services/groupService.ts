import {
    addDoc,
    collection,
    getDocs,
    query,
    serverTimestamp,
    where,
} from "firebase/firestore"

import { db } from "@/services/firebase"

function generateJoinCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let code = ""

  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return code
}

export async function createGroup(params: {
  name: string
  description?: string
  ownerId: string
  ownerName: string
}) {
  const { name, description, ownerId, ownerName } = params

  const joinCode = generateJoinCode()

  const groupRef = await addDoc(collection(db, "groups"), {
    name,
    description: description ?? "",
    ownerId,
    ownerName,
    joinCode,
    createdAt: serverTimestamp(),
  })

  await addDoc(collection(db, "groupMembers"), {
    groupId: groupRef.id,
    userId: ownerId,
    displayName: ownerName,
    role: "leader",
    joinedAt: serverTimestamp(),
  })
}

export async function getUserGroups(uid: string): Promise<string[]> {
  const q = query(collection(db, "groupMembers"), where("userId", "==", uid))

  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => doc.data().groupId)
}