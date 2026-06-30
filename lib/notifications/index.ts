import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AppNotification = {
  id: string;
  type: "news" | "gift_received";
  title: string;
  body: string;
  badgeLabel: string | null;
  createdAt: string;
  href: string | null;
  isUnread: boolean;
};

export type NotificationSummary = {
  unreadCount: number;
  items: AppNotification[];
};

const EPOCH = "1970-01-01T00:00:00.000Z";

async function getLastSeenAt(userId: string): Promise<string> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("profiles")
    .select("notifications_last_seen_at")
    .eq("id", userId)
    .maybeSingle();

  return (data as { notifications_last_seen_at: string | null } | null)?.notifications_last_seen_at ?? EPOCH;
}

export async function getNotificationSummary(): Promise<NotificationSummary> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { unreadCount: 0, items: [] };
  }

  const lastSeen = await getLastSeenAt(user.id);

  const [{ data: newsRows }, { data: giftRows }] = await Promise.all([
    supabase
      .from("benefit_news")
      .select("id,badge_label,title,body,created_at")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(30),
    supabase
      .from("stock_events")
      .select("id,detail,product_name,units,unit_label,store_id,product_id,created_at")
      .eq("user_id", user.id)
      .eq("action", "gift")
      .like("detail", "%受取%")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const newsItems: AppNotification[] = (newsRows ?? []).map((row) => {
    const createdAt = (row as { created_at: string }).created_at;
    return {
      id: `news-${(row as { id: string }).id}`,
      type: "news",
      title: (row as { title: string }).title,
      body: (row as { body: string }).body,
      badgeLabel: (row as { badge_label: string }).badge_label || "お知らせ",
      createdAt,
      href: null,
      isUnread: createdAt > lastSeen,
    };
  });

  const giftItems: AppNotification[] = (giftRows ?? []).map((row) => {
    const r = row as {
      id: string;
      detail: string;
      product_name: string;
      units: number;
      unit_label: string;
      store_id: string;
      product_id: string;
      created_at: string;
    };
    return {
      id: `gift-${r.id}`,
      type: "gift_received",
      title: "ボトルをもらいました",
      body: `${r.detail}（${r.product_name}）`,
      badgeLabel: "ギフト",
      createdAt: r.created_at,
      href: `/bottle/${r.store_id}/${r.product_id}`,
      isUnread: r.created_at > lastSeen,
    };
  });

  const items = [...newsItems, ...giftItems].sort(
    (a, b) => b.createdAt.localeCompare(a.createdAt),
  );

  const unreadCount = items.filter((item) => item.isUnread).length;

  return { unreadCount, items };
}

export async function markNotificationsSeen(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("profiles")
    .update({ notifications_last_seen_at: new Date().toISOString() })
    .eq("id", user.id);
}
