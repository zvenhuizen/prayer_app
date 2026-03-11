export type GroupMember = {
  id: string
  groupId: string
  userId: string
  displayName: string
  role: "leader" | "member"
  joinedAt: any
}