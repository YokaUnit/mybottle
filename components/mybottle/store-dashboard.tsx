"use client";

import { useMemo, useState } from "react";
import { useStock } from "@/components/mybottle/stock-provider";
import { useMasterData } from "@/components/mybottle/master-data-provider";

function formatJpy(value: number) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value);
}

export function StoreDashboard() {
  const { stock, logs, totalSalesJpy } = useStock();
  const { stores } = useMasterData();
  const [lineCopy, setLineCopy] = useState(
    "雨の日限定: MyBottleで1杯ギフトすると、もう1杯5%OFFクーポン",
  );

  const metrics = useMemo(() => {
    const giftCount = logs.filter((log) => log.action === "gift").length;
    const consumeCount = logs.filter((log) => log.action === "consume").length;
    const activeUsers = new Set(logs.map((log) => `${log.storeId}-${log.productId}`)).size;
    return { giftCount, consumeCount, activeUsers };
  }, [logs]);

  return (
    <section className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <article className="mb-surface p-4">
          <p className="text-xs font-medium text-[var(--mb-forest-light)]">累計決済額（疑似）</p>
          <p className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[var(--mb-forest)]">
            {formatJpy(totalSalesJpy)}
          </p>
        </article>
        <article className="mb-surface p-4">
          <p className="text-xs font-medium text-[var(--mb-forest-light)]">提供数</p>
          <p className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[var(--mb-ink)]">{metrics.consumeCount}</p>
        </article>
        <article className="mb-surface p-4">
          <p className="text-xs font-medium text-[var(--mb-forest-light)]">ギフト数</p>
          <p className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[var(--mb-ink)]">{metrics.giftCount}</p>
        </article>
        <article className="mb-surface p-4">
          <p className="text-xs font-medium text-[var(--mb-forest-light)]">アクティブ在庫</p>
          <p className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[var(--mb-ink)]">{metrics.activeUsers}</p>
        </article>
      </div>

      <div className="mb-surface p-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--mb-forest-light)]">店舗別ストック</h2>
        <div className="mt-4 space-y-2">
          {stores.map((store) => {
            const units = stock
              .filter((item) => item.storeId === store.id)
              .reduce((sum, item) => sum + item.remainingUnits, 0);
            return (
              <article
                key={store.id}
                className="flex items-center justify-between rounded-[0.85rem] border border-[var(--mb-ring)] bg-[var(--mb-muted)] px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--mb-ink)]">{store.name}</p>
                  <p className="text-xs font-medium text-[var(--mb-forest-light)]">{store.area}</p>
                </div>
                <p className="text-lg font-semibold text-[var(--mb-forest)]">{units}</p>
              </article>
            );
          })}
        </div>
      </div>

      <div className="mb-surface p-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--mb-forest-light)]">
          再来店促進LINE（疑似）
        </h2>
        <textarea
          value={lineCopy}
          onChange={(event) => setLineCopy(event.target.value)}
          className="mt-3 h-24 w-full rounded-[0.85rem] border border-[var(--mb-ring)] bg-[var(--mb-muted)] p-3 text-sm font-medium text-[var(--mb-ink)] outline-none focus:border-[var(--mb-accent-dark)]/35 focus:ring-2 focus:ring-[var(--mb-accent)]/30"
        />
        <a
          href={`https://line.me/R/msg/text/?${encodeURIComponent(lineCopy)}`}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex rounded-full bg-[var(--mb-forest)] px-5 py-2.5 text-sm font-semibold text-white transition active:opacity-90"
        >
          LINEで配信プレビュー
        </a>
      </div>
    </section>
  );
}
