"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronRight, History, ListFilter, RefreshCw, ScrollText } from "lucide-react";
import { BottleProductImage } from "@/components/mybottle/bottle-product-image";
import { useStock } from "@/components/mybottle/stock-provider";
import { useMasterData } from "@/components/mybottle/master-data-provider";
import type { ActionType, ActivityLog } from "@/lib/mybottle/types";

type Tab = "all" | "visit" | "update";

const tabs: { id: Tab; label: string; hint: string; Icon: typeof ListFilter }[] = [
  { id: "all", label: "すべて", hint: "購入・来店・更新など", Icon: ListFilter },
  { id: "visit", label: "来店・贈答", hint: "店内での消化と贈答", Icon: History },
  { id: "update", label: "残量更新", hint: "残量の変更記録", Icon: RefreshCw },
];

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

function formatTimeTokyo(iso: string): string {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

/** 過去イベント向けの短い相対表現（日本語） */
function relativePastJa(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  if (diffMs < 0) return "今";
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "たった今";
  if (mins < 60) return `${mins}分前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}時間前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}日前`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}週間前`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}か月前`;
  const years = Math.floor(days / 365);
  return `${years}年前`;
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
  const { products, stores } = useMasterData();
  const [tab, setTab] = useState<Tab>("all");

  const counts = useMemo(() => {
    const all = logs.length;
    const visit = logs.filter((l) => l.action === "consume" || l.action === "gift").length;
    const update = logs.filter((l) => l.action === "update").length;
    return { all, visit, update } as Record<Tab, number>;
  }, [logs]);

  const filtered = useMemo(() => filterLogs(logs, tab), [logs, tab]);

  const grouped = useMemo(() => groupByDay(filtered), [filtered]);

  const tabIds: Tab[] = tabs.map((t) => t.id);

  return (
    <main className="mx-auto max-w-lg pb-8 pt-2 sm:max-w-none">
      <header className="border-b border-[var(--mb-ring)] pb-4 sm:pb-5">
        <h1 className="mb-screen-title">履歴</h1>
        <p className="mt-1.5 max-w-prose text-xs font-medium leading-relaxed text-[var(--mb-forest-light)] sm:text-sm">
          購入・来店・残量の変更を時系列で確認。行をタップでボトル詳細へ。
        </p>
      </header>

      <div className="mt-4 sm:mt-5">
        <div
          role="tablist"
          aria-label="履歴の表示切り替え"
          className="flex flex-col gap-2 rounded-[var(--mb-radius-card)] border border-[var(--mb-ring)] bg-[var(--mb-muted)] p-2 sm:flex-row sm:gap-1 sm:rounded-[var(--mb-radius-pill)] sm:p-1"
          onKeyDown={(e) => {
            if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
            e.preventDefault();
            const i = tabIds.indexOf(tab);
            const next =
              e.key === "ArrowLeft" ? (i - 1 + tabIds.length) % tabIds.length : (i + 1) % tabIds.length;
            const id = tabIds[next];
            setTab(id);
            queueMicrotask(() => {
              document.getElementById(`history-tab-${id}`)?.focus();
            });
          }}
        >
          {tabs.map((t) => {
            const Icon = t.Icon;
            const selected = tab === t.id;
            const count = counts[t.id];
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                id={`history-tab-${t.id}`}
                aria-selected={selected}
                aria-controls="history-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setTab(t.id)}
                className={`flex min-h-12 w-full min-w-0 flex-row items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mb-forest)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--mb-bg)] sm:min-h-11 sm:flex-1 sm:flex-col sm:justify-center sm:gap-0.5 sm:rounded-[var(--mb-radius-pill)] sm:px-1 sm:py-2 sm:text-center ${
                  selected
                    ? "bg-[var(--mb-card)] text-[var(--mb-forest)] shadow-sm ring-1 ring-[var(--mb-ring)]"
                    : "text-[var(--mb-forest-light)] active:bg-[var(--mb-card)]/70 hover:bg-[var(--mb-card)]/60 hover:text-[var(--mb-ink)]"
                }`}
              >
                <span className="flex min-w-0 items-center gap-2 sm:flex-col sm:gap-0.5">
                  <Icon className="h-4 w-4 shrink-0 sm:h-3.5 sm:w-3.5" strokeWidth={2} aria-hidden />
                  <span className="text-sm font-semibold leading-tight sm:text-[0.6875rem]">{t.label}</span>
                </span>
                <span
                  className={`shrink-0 text-sm font-medium tabular-nums sm:text-[0.625rem] ${
                    selected ? "text-[var(--mb-forest-light)]" : "text-[var(--mb-forest-light)]/80"
                  }`}
                >
                  {count}件
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-2 line-clamp-2 text-[0.6875rem] font-medium leading-relaxed text-[var(--mb-forest-light)] sm:line-clamp-none">
          {tabs.find((x) => x.id === tab)?.hint}
        </p>
      </div>

      <div id="history-panel" role="tabpanel" aria-labelledby={`history-tab-${tab}`} className="mt-5 sm:mt-6">
        {logs.length === 0 ? (
          <div className="mb-surface flex flex-col items-center px-6 py-14 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--mb-muted)] ring-1 ring-[var(--mb-ring)]">
              <ScrollText className="h-7 w-7 text-[var(--mb-forest-light)]" strokeWidth={1.75} aria-hidden />
            </div>
            <p className="mt-5 text-base font-semibold text-[var(--mb-ink)]">まだ履歴がありません</p>
            <p className="mt-2 max-w-xs text-sm font-medium leading-relaxed text-[var(--mb-forest-light)]">
              ボトルを購入したり店舗で使用すると、ここに記録が並びます。
            </p>
            <div className="mt-8 flex w-full max-w-xs flex-col gap-2.5">
              <Link
                href="/products/step-1"
                className="rounded-full bg-[var(--mb-forest)] px-5 py-3.5 text-center text-sm font-semibold text-white transition active:opacity-90"
              >
                ボトルを購入する
              </Link>
              <Link
                href="/"
                className="rounded-full border border-[var(--mb-ring)] bg-[var(--mb-card)] px-5 py-3.5 text-center text-sm font-semibold text-[var(--mb-forest)] ring-1 ring-[var(--mb-ring)] transition active:opacity-90"
              >
                ホームへ
              </Link>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="mb-surface flex flex-col items-center px-6 py-12 text-center">
            <ListFilter className="h-10 w-10 text-[var(--mb-forest-light)]" strokeWidth={1.75} aria-hidden />
            <p className="mt-4 text-base font-semibold text-[var(--mb-ink)]">該当する履歴がありません</p>
            <p className="mt-2 max-w-sm text-sm font-medium text-[var(--mb-forest-light)]">
              別のタブを選ぶと、ほかの種類の記録が表示されます。
            </p>
            <button
              type="button"
              onClick={() => setTab("all")}
              className="mt-6 rounded-full border border-[var(--mb-ring)] bg-[var(--mb-card)] px-6 py-3 text-sm font-semibold text-[var(--mb-forest)] ring-1 ring-[var(--mb-ring)] transition hover:bg-[var(--mb-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mb-forest)]/35"
            >
              すべて表示
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {grouped.map((group) => (
              <section
                key={group.dayKey}
                aria-labelledby={`history-day-${group.dayKey}`}
                className="scroll-mt-4"
              >
                <h2
                  id={`history-day-${group.dayKey}`}
                  className="sticky top-0 z-[1] -mx-1 mb-3 border-b border-[var(--mb-ring)] bg-[var(--mb-bg)]/95 px-1 pb-2 pt-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[var(--mb-forest-light)] backdrop-blur-sm supports-[backdrop-filter]:bg-[var(--mb-bg)]/80"
                >
                  {group.heading}
                </h2>
                <ul className="divide-y divide-[var(--mb-ring)] border-y border-[var(--mb-ring)]">
                  {group.items.map((log) => {
                    const storeName = stores.find((s) => s.id === log.storeId)?.name ?? "加盟店";
                    const type = products.find((p) => p.id === log.productId)?.type ?? "physical";
                    const isPlus = log.action === "purchase";
                    const signedUnits = isPlus ? `+${log.units}` : `-${log.units}`;
                    return (
                      <li key={log.id}>
                        <Link
                          href={`/bottle/${log.storeId}/${log.productId}`}
                          className="group grid grid-cols-[3.75rem_1fr_auto] items-center gap-x-3 py-2.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mb-forest)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--mb-bg)] active:opacity-92"
                        >
                          <div className="self-center justify-self-start">
                            <div className="mb-bottle-stage mb-bottle-stage--thumb">
                              <div className="mb-bottle-stage__bottle">
                                <BottleProductImage
                                  productId={log.productId}
                                  type={type}
                                  frameClassName="h-10 w-10 sm:h-10 sm:w-10"
                                  fallbackEmojiClassName="text-lg sm:text-xl"
                                  plain
                                />
                              </div>
                            </div>
                          </div>
                          <div className="min-w-0 py-0.5">
                            <p className="line-clamp-1 text-[0.625rem] font-semibold uppercase tracking-[0.04em] text-[var(--mb-forest-light)]">
                              {storeName}
                            </p>
                            <p className="mt-0.5 line-clamp-1 text-[0.8rem] font-semibold leading-snug tracking-[-0.01em] text-[var(--mb-ink)] sm:text-[0.9rem]">
                              {log.productName}
                            </p>
                            <p className="mt-0.5 text-[0.66rem] font-medium tabular-nums text-[var(--mb-forest-light)]">
                              <time dateTime={log.createdAt}>
                                {tokyoCalendarDayKey(log.createdAt).replaceAll("-", "/")} {formatTimeTokyo(log.createdAt)}
                              </time>
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 pl-1">
                            <p
                              className={`text-[0.72rem] font-semibold tabular-nums sm:text-xs ${
                                isPlus ? "text-sky-600" : "text-rose-600"
                              }`}
                            >
                              {signedUnits}
                              {log.unitLabel}
                            </p>
                            <ChevronRight
                              className="h-4 w-4 shrink-0 self-center text-[var(--mb-muted-strong)] transition group-hover:text-[var(--mb-forest-light)]"
                              strokeWidth={2}
                              aria-hidden
                            />
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
