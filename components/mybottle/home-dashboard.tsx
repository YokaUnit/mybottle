"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { AnimatedLinearGauge } from "@/components/mybottle/animated-linear-gauge";
import { BottleProductImage } from "@/components/mybottle/bottle-product-image";
import { HorizontalDragScroll } from "@/components/mybottle/horizontal-drag-scroll";
import { useStock } from "@/components/mybottle/stock-provider";
import { useMasterData } from "@/components/mybottle/master-data-provider";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

function expiryLabel(updatedAt: string) {
  const d = new Date(updatedAt);
  d.setMonth(d.getMonth() + 3);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

export function HomeDashboard() {
  const { stock, totalUnits } = useStock();
  const { products, stores } = useMasterData();
  const [displayName, setDisplayName] = useState("ゲスト");
  const bottleCount = stock.length;

  const sorted = useMemo(
    () => [...stock].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [stock],
  );
  const stockByStore = useMemo(() => {
    const grouped = sorted.reduce<Record<string, typeof sorted>>((acc, item) => {
      if (!acc[item.storeId]) acc[item.storeId] = [];
      acc[item.storeId].push(item);
      return acc;
    }, {});
    return Object.entries(grouped).sort((a, b) => {
      const aName = stores.find((s) => s.id === a[0])?.name ?? a[0];
      const bName = stores.find((s) => s.id === b[0])?.name ?? b[0];
      return aName.localeCompare(bName, "ja");
    });
  }, [sorted, stores]);

  useEffect(() => {
    let active = true;
    async function loadDisplayName() {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || !active) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .maybeSingle();

      if (!active) return;
      const name =
        profile?.display_name ??
        user.user_metadata?.name ??
        user.user_metadata?.full_name ??
        user.email?.split("@")[0] ??
        "ユーザー";
      setDisplayName(name);
    }

    loadDisplayName();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6 pb-4 pt-1">
      <div>
        <p className="text-2xl font-semibold tracking-[-0.03em] text-[var(--mb-ink)]">
          こんにちは、
          <span className="inline-block bg-gradient-to-t from-[var(--mb-forest)] to-[#84cc16] bg-clip-text text-transparent">
            {displayName}
          </span>
          さん
        </p>
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
          残量合計 <span className="text-[var(--mb-ink)]">{totalUnits}</span> 杯
        </p>
      </section>

      <div className="space-y-5">
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
          stockByStore.map(([storeId, items], storeIndex) => {
            const storeName = stores.find((s) => s.id === storeId)?.name ?? "加盟店";
            return (
              <section key={storeId} className="space-y-2">
                <h2 className="text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[var(--mb-forest-light)]">
                  <span
                    className="mb-store-name-underline"
                    style={
                      {
                        "--mb-underline-delay": `${Math.min(storeIndex, 6) * 90}ms`,
                      } as CSSProperties
                    }
                  >
                    {storeName}
                  </span>
                </h2>
                <HorizontalDragScroll>
                  <div className="flex w-max gap-2.5">
                    {items.map((item) => {
                      const product = products.find((c) => c.id === item.productId);
                      const max = product?.bundleSize ?? 5;
                      const pct = Math.min(100, Math.round((item.remainingUnits / max) * 100));
                      return (
                        <Link
                          key={`${item.storeId}-${item.productId}`}
                          href={`/bottle/${item.storeId}/${item.productId}`}
                          className="group w-[8.9rem] shrink-0 snap-start select-none overflow-hidden rounded-[0.95rem] border border-[var(--mb-ring)] bg-[var(--mb-card)] shadow-[var(--mb-shadow-card)] transition active:opacity-85"
                        >
                          <div className="mb-bottle-stage">
                            <div className="mb-bottle-stage__bottle">
                              <BottleProductImage
                                key={`${item.storeId}-${item.productId}`}
                                productId={item.productId}
                                type={item.type}
                                frameClassName="h-[5.55rem] w-[5.55rem]"
                                fallbackEmojiClassName="text-2xl"
                                plain
                              />
                            </div>
                          </div>
                          <div className="space-y-1 border-t border-[var(--mb-ring)] px-2.5 py-2">
                            <p className="line-clamp-1 text-[0.8rem] font-semibold tracking-[-0.01em] text-[var(--mb-ink)]">
                              {item.productName}
                            </p>
                            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[var(--mb-muted-strong)]">
                              <AnimatedLinearGauge
                                value={pct}
                                className="h-full rounded-full bg-[var(--mb-forest)]"
                              />
                            </div>
                            <p className="text-[10px] font-medium text-[var(--mb-forest-light)]">
                              残り {item.remainingUnits}
                              {item.unitLabel}
                            </p>
                            <p className="text-[10px] font-medium text-[var(--mb-forest-light)]">
                              有効期限 {expiryLabel(item.updatedAt)}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </HorizontalDragScroll>
              </section>
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
