"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { FriendUser, SendBottleInput } from "@/lib/mybottle/friends";

type RpcFriendRow = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  created_at?: string;
};

function mapFriend(row: RpcFriendRow): FriendUser {
  return {
    id: row.id,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
  };
}

export async function searchUsersAction(
  query: string,
  options?: { excludeFriends?: boolean },
): Promise<FriendUser[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("search_my_bottle_users", {
    p_query: q,
    p_exclude_friends: options?.excludeFriends ?? false,
  });
  if (error) throw new Error(error.message);

  return ((data as RpcFriendRow[] | null) ?? []).map(mapFriend);
}

export async function addFriendAction(friendId: string): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("add_my_bottle_friend", { p_friend_id: friendId });
  if (error) throw new Error(error.message);
  revalidatePath("/send");
}

export async function listFriendsAction(): Promise<FriendUser[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("list_my_bottle_friends");
  if (error) throw new Error(error.message);

  return ((data as RpcFriendRow[] | null) ?? []).map(mapFriend);
}

export async function removeFriendAction(friendId: string): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("remove_my_bottle_friend", { p_friend_id: friendId });
  if (error) throw new Error(error.message);
  revalidatePath("/send");
}

export async function sendBottleToFriendAction(input: SendBottleInput): Promise<void> {
  const units = Math.max(1, Math.floor(input.units));
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("send_bottle_to_friend", {
    p_friend_id: input.friendId,
    p_store_id: input.storeId,
    p_product_id: input.productId,
    p_units: units,
    p_message: input.message?.trim() || null,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/bottles");
  revalidatePath("/send");
  revalidatePath("/history");
}
