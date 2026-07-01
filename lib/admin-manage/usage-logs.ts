import { supabaseAdmin } from "@/lib/supabase/admin";
import type { ActionType } from "@/lib/mybottle/types";

export type UsageLogActionFilter =
  | "all"
  | "purchase"
  | "consume"
  | "gift_send"
  | "gift_receive"
  | "other";

export type AdminUsageLogEntry = {
  id: string;
  createdAt: string;
  action: ActionType;
  actionLabel: string;
  userId: string;
  userName: string;
  userEmail: string | null;
  storeId: string;
  storeName: string;
  storeArea: string;
  productId: string;
  productName: string;
  units: number;
  unitLabel: string;
  detail: string;
};

export type AdminUsageLogsFilter = {
  storeId?: string;
  action?: UsageLogActionFilter;
  userQuery?: string;
  cursor?: string;
  limit?: number;
};

export type AdminUsageLogsResult = {
  logs: AdminUsageLogEntry[];
  nextCursor: string | null;
};

type StockEventRow = {
  id: string;
  user_id: string;
  action: ActionType;
  store_id: string;
  product_id: string;
  product_name: string;
  units: number;
  unit_label: string;
  detail: string;
  created_at: string;
  stores: { name: string; area: string } | { name: string; area: string }[] | null;
};

type ProfileRow = {
  id: string;
  display_name: string | null;
  email: string | null;
};

const PAGE_SIZE = 40;

export function resolveUsageActionLabel(action: ActionType, detail: string): string {
  if (action === "purchase") return "購入";
  if (action === "consume") return "利用";
  if (action === "gift") {
    if (detail.includes("受取")) return "受取";
    if (detail.includes("送付")) return "送信";
    return "送信";
  }
  if (action === "remove") return "削除";
  if (action === "update") return "残量更新";
  if (action === "transfer") return "移動";
  return action;
}

async function resolveUserIds(userQuery: string): Promise<string[]> {
  const q = userQuery.trim();
  if (!q) return [];

  const { data } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .or(`display_name.ilike.%${q}%,email.ilike.%${q}%`)
    .limit(50);

  return (data as { id: string }[] | null)?.map((row) => row.id) ?? [];
}

export async function getAdminUsageLogs(
  filter: AdminUsageLogsFilter = {},
): Promise<AdminUsageLogsResult> {
  const limit = filter.limit ?? PAGE_SIZE;

  let userIds: string[] | undefined;
  if (filter.userQuery?.trim()) {
    const resolved = await resolveUserIds(filter.userQuery);
    if (resolved.length === 0) {
      return { logs: [], nextCursor: null };
    }
    userIds = resolved;
  }

  let query = supabaseAdmin
    .from("stock_events")
    .select("id,user_id,action,store_id,product_id,product_name,units,unit_label,detail,created_at,stores(name,area)")
    .order("created_at", { ascending: false })
    .limit(limit + 1);

  if (filter.storeId) query = query.eq("store_id", filter.storeId);
  if (filter.cursor) query = query.lt("created_at", filter.cursor);
  if (userIds) query = query.in("user_id", userIds);

  const action = filter.action ?? "all";
  if (action === "purchase") query = query.eq("action", "purchase");
  else if (action === "consume") query = query.eq("action", "consume");
  else if (action === "gift_send") query = query.eq("action", "gift").like("detail", "%送付%");
  else if (action === "gift_receive") query = query.eq("action", "gift").like("detail", "%受取%");
  else if (action === "other") query = query.in("action", ["remove", "update", "transfer"]);

  const { data, error } = await query;
  if (error) throw error;

  const rows = (data as StockEventRow[] | null) ?? [];
  const hasMore = rows.length > limit;
  const pageRows = hasMore ? rows.slice(0, limit) : rows;

  const profileIds = [...new Set(pageRows.map((row) => row.user_id))];
  const { data: profiles } = profileIds.length
    ? await supabaseAdmin.from("profiles").select("id,display_name,email").in("id", profileIds)
    : { data: [] as ProfileRow[] };

  const profileMap = new Map(
    ((profiles as ProfileRow[] | null) ?? []).map((p) => [p.id, p]),
  );

  const logs: AdminUsageLogEntry[] = pageRows.map((row) => {
    const storeRaw = row.stores;
    const store = Array.isArray(storeRaw) ? storeRaw[0] : storeRaw;
    const profile = profileMap.get(row.user_id);

    return {
      id: row.id,
      createdAt: row.created_at,
      action: row.action,
      actionLabel: resolveUsageActionLabel(row.action, row.detail),
      userId: row.user_id,
      userName: profile?.display_name ?? "名前未設定",
      userEmail: profile?.email ?? null,
      storeId: row.store_id,
      storeName: store?.name ?? row.store_id,
      storeArea: store?.area ?? "",
      productId: row.product_id,
      productName: row.product_name,
      units: row.units,
      unitLabel: row.unit_label,
      detail: row.detail,
    };
  });

  return {
    logs,
    nextCursor: hasMore ? pageRows[pageRows.length - 1]?.created_at ?? null : null,
  };
}

export type AdminUsageLogSummary = {
  last24h: {
    purchase: number;
    consume: number;
    giftSend: number;
    giftReceive: number;
  };
};

export async function getAdminUsageLogSummary(): Promise<AdminUsageLogSummary> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [purchase, consume, giftSend, giftReceive] = await Promise.all([
    supabaseAdmin
      .from("stock_events")
      .select("id", { count: "exact", head: true })
      .eq("action", "purchase")
      .gte("created_at", since),
    supabaseAdmin
      .from("stock_events")
      .select("id", { count: "exact", head: true })
      .eq("action", "consume")
      .gte("created_at", since),
    supabaseAdmin
      .from("stock_events")
      .select("id", { count: "exact", head: true })
      .eq("action", "gift")
      .like("detail", "%送付%")
      .gte("created_at", since),
    supabaseAdmin
      .from("stock_events")
      .select("id", { count: "exact", head: true })
      .eq("action", "gift")
      .like("detail", "%受取%")
      .gte("created_at", since),
  ]);

  return {
    last24h: {
      purchase: purchase.count ?? 0,
      consume: consume.count ?? 0,
      giftSend: giftSend.count ?? 0,
      giftReceive: giftReceive.count ?? 0,
    },
  };
}
