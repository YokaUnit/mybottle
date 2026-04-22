"use client";

import Link from "next/link";
import { useMemo } from "react";
import { AnimatedLinearGauge } from "@/components/mybottle/animated-linear-gauge";
import { BottleProductImage } from "@/components/mybottle/bottle-product-image";
import { useStock } from "@/components/mybottle/stock-provider";
import { useMasterData } from "@/components/mybottle/master-data-provider";

function expiryLabel(updatedAt: string) {
  const d = new Date(updatedAt);
  d.setMonth(d.getMonth() + 3);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

export function HomeDashboard() {
  const { stock, totalUnits } = useStock();
  const { products, stores } = useMasterData();
  const bottleCount = stock.length;

  const sorted = useMemo(
    () => [...stock].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [stock],
  );

  return (
    <div className="space-y-6 pb-4 pt-1">
      <div>
        <p className="text-2xl font-semibold tracking-[-0.03em] text-[var(--mb-ink)]">こんにちは、ゲストさん</p>
        <p className="mt-1 text-[0.8125rem] font-medium text-[var(--mb-forest-light)]">マイボトル</p>
      </div>

      <section className="mb-surface px-5 py-5">
        <p className="mb-label-caps">登録ボトル</p>
        <div className="mt-3 flex items-end gap-2">
          <p className="text-[2.25rem] font-semibold leading-none tracking-[-0.04em] text-[var(--mb-forest)]">
            {bottleCount}
          </p>
          <span className="pb-1 text-sm font-medium text-[var(--mb-forest-light)]">本</span>
        </div>
        <div className="mt-4 h-px w-full bg-[var(--mb-muted-strong)]" aria-hidden />
        <p className="mt-3 text-[0.8125rem] font-medium text-[var(--mb-forest-light)]">
          残量合計 <span className="text-[var(--mb-ink)]">{totalUnits}</span> ユニット
        </p>
      </section>

      <div className="space-y-3">
        {sorted.length === 0 ? (
          <div className="mb-surface px-5 py-10 text-center">
            <p className="text-sm font-medium text-[var(--mb-forest-light)]">まだボトルがありません。</p>
            <Link
              href="/add-bottle"
              className="mt-4 inline-flex rounded-full bg-[var(--mb-accent)]/35 px-5 py-2.5 text-sm font-semibold text-[var(--mb-forest)] ring-1 ring-[var(--mb-accent-dark)]/25 active:opacity-80"
            >
              QRで追加する
            </Link>
          </div>
        ) : (
          sorted.map((item) => {
            const product = products.find((c) => c.id === item.productId);
            const max = product?.bundleSize ?? 5;
            const pct = Math.min(100, Math.round((item.remainingUnits / max) * 100));
            const storeName = stores.find((s) => s.id === item.storeId)?.name ?? "加盟店";
            return (
              <Link
                key={`${item.storeId}-${item.productId}`}
                href={`/bottle/${item.storeId}/${item.productId}`}
                className="mb-surface block p-4 active:opacity-80"
              >
                <div className="flex gap-4">
                  <BottleProductImage
                    key={`${item.storeId}-${item.productId}`}
                    productId={item.productId}
                    type={item.type}
                    frameClassName="h-[4.75rem] w-[4.75rem]"
                    fallbackEmojiClassName="text-3xl"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[1.05rem] font-semibold tracking-[-0.02em] text-[var(--mb-ink)]">
                      {item.productName}
                    </p>
                    <p className="mt-0.5 truncate text-[0.8125rem] font-medium text-[var(--mb-forest-light)]">
                      {storeName}
                    </p>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--mb-muted-strong)]">
                      <AnimatedLinearGauge
                        value={pct}
                        className="h-full rounded-full bg-[var(--mb-forest)]"
                      />
                    </div>
                    <p className="mt-2 text-[0.6875rem] font-medium text-[var(--mb-forest-light)]">
                      残り {pct}% · 有効期限 {expiryLabel(item.updatedAt)}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/add-bottle"
          className="flex items-center justify-center rounded-full bg-[var(--mb-forest)] px-5 py-3.5 text-center text-[0.9375rem] font-semibold text-white shadow-sm active:opacity-90"
        >
          ボトルを追加
        </Link>
        <Link
          href="/products/step-1"
          className="flex items-center justify-center rounded-full border border-[var(--mb-forest)]/25 bg-[var(--mb-card)] px-5 py-3.5 text-center text-[0.9375rem] font-semibold text-[var(--mb-forest)] ring-1 ring-[var(--mb-ring)] active:opacity-90"
        >
          購入する
        </Link>
      </div>
    </div>
  );
}
