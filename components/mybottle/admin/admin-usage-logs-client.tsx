"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { loadMoreAdminUsageLogsAction } from "@/app/(admin-manage)/admin/actions";
import type { AdminUsageLogEntry, UsageLogActionFilter } from "@/lib/admin-manage/usage-logs";
import { ChevronRight, Search } from "lucide-react";

type Store = { id: string; name: string };

type Props = {
  logs: AdminUsageLogEntry[];
  nextCursor: string | null;
  stores: Store[];
  initialStoreId: string;
  initialAction: UsageLogActionFilter;
  initialQuery: string;
};

const ACTION_FILTERS: { id: UsageLogActionFilter; label: string }[] = [
  { id: "all", label: "すべて" },
  { id: "purchase", label: "購入" },
  { id: "consume", label: "利用" },
  { id: "gift_send", label: "送信" },
  { id: "gift_receive", label: "受取" },
  { id: "other", label: "その他" },
];

const ACTION_BADGE: Record<string, string> = {
  購入: "bg-[#fef3c7] text-[#b45309] ring-[#fde68a]",
  利用: "bg-[#ecfdf5] text-[#0d9488] ring-[#99f6e4]",
  送信: "bg-[#fff1f2] text-[#e11d48] ring-[#fecdd3]",
  受取: "bg-[#eff6ff] text-[#2563eb] ring-[#bfdbfe]",
  削除: "bg-[#f8fafc] text-[#64748b] ring-[#e2e8f0]",
  残量更新: "bg-[#f8fafc] text-[#64748b] ring-[#e2e8f0]",
  移動: "bg-[#f8fafc] text-[#64748b] ring-[#e2e8f0]",
};

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString("ja-JP", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AdminUsageLogsClient({
  logs,
  nextCursor,
  stores,
  initialStoreId,
  initialAction,
  initialQuery,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(initialQuery);
  const [items, setItems] = useState(logs);
  const [cursor, setCursor] = useState(nextCursor);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setItems(logs);
    setCursor(nextCursor);
  }, [logs, nextCursor]);

  const pushFilters = useCallback(
    (patch: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(patch)) {
        if (!value || value === "all") params.delete(key);
        else params.set(key, value);
      }
      params.delete("cursor");
      startTransition(() => {
        router.push(`/admin/logs?${params.toString()}`);
      });
    },
    [router, searchParams],
  );

  const loadMore = async () => {
    if (!cursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const result = await loadMoreAdminUsageLogsAction({
        storeId: initialStoreId !== "all" ? initialStoreId : undefined,
        action: initialAction,
        userQuery: initialQuery || undefined,
        cursor,
      });
      setItems((prev) => [...prev, ...result.logs]);
      setCursor(result.nextCursor);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3 rounded-2xl bg-white p-4 ring-1 ring-[#e7e5e4]">
        <label className="block">
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#78716c]">店舗</span>
          <select
            value={initialStoreId}
            onChange={(e) => pushFilters({ storeId: e.target.value })}
            className="mt-1.5 h-10 w-full rounded-xl border border-[#e7e5e4] bg-[#fffbeb] px-3 text-sm font-semibold text-[#292524]"
          >
            <option value="all">すべての店舗</option>
            {stores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>
        </label>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#78716c]">種別</span>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {ACTION_FILTERS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => pushFilters({ action: id })}
                className={`rounded-full px-3 py-1.5 text-[11px] font-extrabold transition ${
                  initialAction === id
                    ? "bg-[#b45309] text-white shadow-sm"
                    : "bg-[#fef3c7]/80 text-[#78716c] ring-1 ring-[#fde68a]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            pushFilters({ q: query.trim() || undefined });
          }}
          className="flex gap-2"
        >
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a8a29e]" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="名前・メールで検索"
              className="h-10 w-full rounded-xl border border-[#e7e5e4] bg-[#fffbeb] pl-9 pr-3 text-sm font-medium"
            />
          </div>
          <button
            type="submit"
            className="shrink-0 rounded-xl bg-[#b45309] px-4 text-xs font-extrabold text-white"
          >
            検索
          </button>
        </form>
      </div>

      {isPending ? (
        <p className="text-center text-xs font-bold text-[#a8a29e]">読み込み中…</p>
      ) : null}

      {items.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center ring-1 ring-[#e7e5e4]">
          <p className="text-sm font-extrabold text-[#292524]">該当するログがありません</p>
          <p className="mt-1 text-xs font-medium text-[#78716c]">条件を変えて再度お試しください</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((log) => (
            <li key={log.id} className="rounded-2xl bg-white p-4 ring-1 ring-[#e7e5e4]">
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-extrabold ring-1 ${
                    ACTION_BADGE[log.actionLabel] ?? ACTION_BADGE["削除"]
                  }`}
                >
                  {log.actionLabel}
                </span>
                <time className="text-[10px] font-bold text-[#94a3b8]">{formatWhen(log.createdAt)}</time>
              </div>

              <dl className="mt-3 grid grid-cols-[3.5rem_1fr] gap-x-2 gap-y-1.5 text-xs">
                <dt className="font-bold text-[#a8a29e]">誰が</dt>
                <dd className="font-extrabold text-[#292524]">
                  {log.userName}
                  {log.userEmail ? (
                    <span className="mt-0.5 block text-[10px] font-medium text-[#78716c]">{log.userEmail}</span>
                  ) : null}
                </dd>

                <dt className="font-bold text-[#a8a29e]">どこで</dt>
                <dd className="font-bold text-[#44403c]">
                  {log.storeName}
                  {log.storeArea ? (
                    <span className="text-[#78716c]"> · {log.storeArea}</span>
                  ) : null}
                </dd>

                <dt className="font-bold text-[#a8a29e]">何を</dt>
                <dd className="font-extrabold text-[#292524]">{log.productName}</dd>

                <dt className="font-bold text-[#a8a29e]">何杯</dt>
                <dd className="font-extrabold text-[#b45309]">
                  {log.units}
                  {log.unitLabel}
                </dd>
              </dl>

              {log.detail ? (
                <p className="mt-2.5 rounded-lg bg-[#fffbeb]/60 px-2.5 py-1.5 text-[11px] leading-relaxed text-[#78716c]">
                  {log.detail}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      {cursor ? (
        <button
          type="button"
          onClick={loadMore}
          disabled={isPending || loadingMore}
          className="flex w-full items-center justify-center gap-1 rounded-2xl border border-dashed border-[#d6d3d1] bg-white py-3.5 text-xs font-extrabold text-[#b45309] disabled:opacity-50"
        >
          さらに読み込む
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
        </button>
      ) : null}
    </div>
  );
}
