import { StoreManageHeader } from "@/components/mybottle/store-manage-nav";
import { getAccessibleStores, requireStoreAccess, resolveStoreId } from "@/lib/store-manage/access";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Props = { searchParams: Promise<{ storeId?: string }> };

export default async function DashboardHistoryPage({ searchParams }: Props) {
  const params = await searchParams;
  const { stores } = await getAccessibleStores();
  const storeId = resolveStoreId(stores, params.storeId);
  await requireStoreAccess(storeId);

  const supabase = await createSupabaseServerClient();
  const { data: events } = await supabase
    .from("stock_events")
    .select("id,action,product_name,units,unit_label,detail,created_at")
    .eq("store_id", storeId)
    .order("created_at", { ascending: false })
    .limit(50);

  const actionLabel: Record<string, string> = {
    purchase: "購入",
    consume: "提供",
    gift: "ギフト",
    remove: "削除",
    update: "更新",
    transfer: "移動",
  };

  return (
    <main className="px-4 pt-2">
      <StoreManageHeader stores={stores} storeId={storeId} title="利用履歴" />
      <ul className="space-y-2">
        {(events ?? []).length === 0 ? (
          <li className="rounded-2xl bg-white p-6 text-center text-sm font-bold text-[#64748b] ring-1 ring-[#e2e8f0]">
            まだ履歴がありません
          </li>
        ) : (
          (events ?? []).map((event) => (
            <li key={event.id as string} className="rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-[#e2e8f0]">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-extrabold text-[#1e293b]">{event.product_name as string}</p>
                  <p className="mt-0.5 text-xs font-medium text-[#64748b]">
                    {actionLabel[event.action as string] ?? event.action} · {event.units}
                    {event.unit_label}
                  </p>
                </div>
                <time className="shrink-0 text-[10px] font-bold text-[#94a3b8]">
                  {new Date(event.created_at as string).toLocaleString("ja-JP", {
                    month: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </div>
              {event.detail ? (
                <p className="mt-1 text-[11px] text-[#94a3b8]">{event.detail as string}</p>
              ) : null}
            </li>
          ))
        )}
      </ul>
    </main>
  );
}
