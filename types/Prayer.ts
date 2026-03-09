export type Prayer = {
  id: string;
  ownerId: string;
  ownerName: string;

  title: string;
  description?: string;

  createdAt: any;
  updatedAt: any;

  isAnswered: boolean;
  answeredAt?: any | null;
};