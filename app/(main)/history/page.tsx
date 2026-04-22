"use client";

import { useMemo, useState } from "react";
import { History, ListFilter, RefreshCw } from "lucide-react";
import { BottleProductImage } from "@/components/mybottle/bottle-product-image";
import { getProductType } from "@/lib/mybottle/catalog";
import { useStock } from "@/components/mybottle/stock-provider";
type Tab = "all" | "visit" | "update";

const tabs: { id: Tab; label: string; Icon: typeof ListFilter }[] = [
  { id: "all", label: "すべて", Icon: ListFilter },
  { id: "visit", label: "来店", Icon: History },
  { id: "update", label: "残量更新", Icon: RefreshCw },
];

export default function HistoryPage() {
  const { logs } = useStock();
  const [tab, setTab] = useState<Tab>("all");

  const filtered = useMemo(() => {
    if (tab === "all") return logs;
    if (tab === "visit")
      return logs.filter((l) => l.action === "consume" || l.action === "gift");
    return logs.filter((l) => l.action === "update");
  }, [logs, tab]);

  return (
    <main className="pb-4 pt-2">
      <h1 className="mb-screen-title">履歴</h1>
      <p className="mt-1 text-sm font-medium text-[var(--mb-forest-light)]">来店・残量更新を一覧で確認</p>

      <div className="mt-5 flex gap-1 rounded-full border border-[var(--mb-ring)] bg-[var(--mb-muted)] p-1">
        {tabs.map((t) => {
          const Icon = t.Icon;
          const on = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 text-xs font-semibold transition ${
                on
                  ? "bg-[var(--mb-card)] text-[var(--mb-forest)] shadow-sm ring-1 ring-[var(--mb-ring)]"
                  : "text-[var(--mb-forest-light)] hover:text-[var(--mb-ink)]"
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden />
              {t.label}
            </button>
          );
        })}
      </div>

      <ul className="mt-5 space-y-3">
        {filtered.length === 0 ? (
          <li className="mb-surface px-5 py-10 text-center text-sm font-medium text-[var(--mb-forest-light)]">
            履歴はまだありません
          </li>
        ) : (
          filtered.map((log) => (
            <li
              key={log.id}
              className="mb-surface flex gap-4 px-4 py-4 text-sm"
            >
              <BottleProductImage
                key={`${log.id}-${log.productId}`}
                productId={log.productId}
                type={getProductType(log.productId)}
                frameClassName="h-14 w-14 shrink-0"
                fallbackEmojiClassName="text-xl"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-[var(--mb-forest-light)]">
                  {new Date(log.createdAt).toLocaleString("ja-JP")}
                </p>
                <p className="mt-1 font-semibold tracking-[-0.02em] text-[var(--mb-ink)]">{log.productName}</p>
                <p className="mt-0.5 font-medium leading-snug text-[var(--mb-forest-light)]">{log.detail}</p>
              </div>
            </li>
          ))
        )}
      </ul>
    </main>
  );
}
