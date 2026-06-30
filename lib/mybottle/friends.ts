export type FriendUser = {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  createdAt?: string;
};

export type SendBottleInput = {
  friendId: string;
  storeId: string;
  productId: string;
  units: number;
  message?: string;
};
