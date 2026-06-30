"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useStock } from "@/components/mybottle/stock-provider";
import { useMasterData } from "@/components/mybottle/master-data-provider";
import type { ActivityLog } from "@/lib/mybottle/types";

type Tab = "all" | "visit" | "update";

function tokyoCalendarDayKey(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}

function shiftTokyoDayKey(dayKey: string, deltaDays: number): string {
  const noon = new Date(`${dayKey}T12:00:00+09:00`);
  noon.setDate(noon.getDate() + deltaDays);
  return tokyoCalendarDayKey(noon.toISOString());
}

function formatHistoryDayHeading(dayKey: string): string {
  const today = tokyoCalendarDayKey(new Date().toISOString());
  const yesterday = shiftTokyoDayKey(today, -1);
  if (dayKey === today) return "今日";
  if (dayKey === yesterday) return "昨日";
  const localNoon = new Date(`${dayKey}T12:00:00+09:00`);
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(localNoon);
}

function filterLogs(logs: ActivityLog[], tab: Tab): ActivityLog[] {
  if (tab === "all") return logs;
  if (tab === "visit") return logs.filter((l) => l.action === "consume" || l.action === "gift");
  return logs.filter((l) => l.action === "update");
}

function groupByDay(logs: ActivityLog[]): { dayKey: string; heading: string; items: ActivityLog[] }[] {
  const groups: { dayKey: string; heading: string; items: ActivityLog[] }[] = [];
  for (const log of logs) {
    const dayKey = tokyoCalendarDayKey(log.createdAt);
    const last = groups[groups.length - 1];
    if (last && last.dayKey === dayKey) {
      last.items.push(log);
    } else {
      groups.push({ dayKey, heading: formatHistoryDayHeading(dayKey), items: [log] });
    }
  }
  return groups;
}

export function HistoryPageClient() {
  const { logs } = useStock();
  const { stores } = useMasterData();
  const [storeFilter, setStoreFilter] = useState("all");

  const storeOptions = useMemo(() => {
    const ids = [...new Set(logs.map((l) => l.storeId))];
    return ids.map((id) => ({
      id,
      name: stores.find((s) => s.id === id)?.name ?? "加盟店",
    }));
  }, [logs, stores]);

  const filtered = useMemo(() => {
    const base = filterLogs(logs, "all");
    if (storeFilter === "all") return base;
    return base.filter((l) => l.storeId === storeFilter);
  }, [logs, storeFilter]);

  const grouped = useMemo(() => groupByDay(filtered), [filtered]);

  return (
    <main className="pb-8 pt-2">
      <h1 className="mb-screen-title">利用履歴</h1>

      <div className="relative mt-4">
        <select
          value={storeFilter}
          onChange={(e) => setStoreFilter(e.target.value)}
          className="mb-search-input appearance-none pr-10 font-bold"
          aria-label="店舗で絞り込み"
        >
          <option value="all">店舗で絞り込み</option>
          {storeOptions.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--mb-forest-light)]"
          strokeWidth={2.5}
          aria-hidden
        />
      </div>

      {logs.length === 0 ? (
        <div className="mb-surface mt-5 flex flex-col items-center px-6 py-14 text-center">
          <p className="text-base font-extrabold text-[var(--mb-ink)]">まだ履歴がありません</p>
          <p className="mt-2 max-w-xs text-sm font-medium text-[var(--mb-forest-light)]">
            ボトルを購入したり店舗で使用すると、ここに記録が並びます。
          </p>
          <Link href="/products/step-1" className="mb-btn-primary mt-8 px-6 py-3.5 text-sm">
            ボトルを購入する
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="mb-surface mt-5 px-6 py-12 text-center">
          <p className="text-base font-extrabold text-[var(--mb-ink)]">該当する履歴がありません</p>
          <button
            type="button"
            onClick={() => setStoreFilter("all")}
            className="mb-btn-secondary mt-6 px-6 py-3 text-sm"
          >
            すべて表示
          </button>
        </div>
      ) : (
        <div className="mt-5 space-y-6">
          {grouped.map((group) => (
            <section key={group.dayKey} aria-labelledby={`history-day-${group.dayKey}`}>
              <h2
                id={`history-day-${group.dayKey}`}
                className="mb-3 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--mb-teal-dark)]"
              >
                {group.heading}
              </h2>
              <ul className="space-y-2">
                {group.items.map((log) => {
                  const storeName = stores.find((s) => s.id === log.storeId)?.name ?? "加盟店";
                  const isPlus =
                    log.action === "purchase" ||
                    (log.action === "gift" && log.detail.includes("受取"));
                  return (
                    <li key={log.id}>
                      <Link
                        href={`/bottle/${log.storeId}/${log.productId}`}
                        className="mb-surface flex items-center justify-between gap-3 p-4 transition active:scale-[0.99]"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[var(--mb-forest-light)]">{storeName}</p>
                          <p className="mt-0.5 font-extrabold text-[var(--mb-ink)]">{log.productName}</p>
                          <p className="mt-0.5 text-[11px] font-medium text-[var(--mb-forest-light)]">
                            {log.detail}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 text-sm font-extrabold tabular-nums ${
                            isPlus ? "text-[var(--mb-teal-dark)]" : "text-red-500"
                          }`}
                        >
                          {isPlus ? "+" : "-"}
                          {log.units}
                          {log.unitLabel}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
