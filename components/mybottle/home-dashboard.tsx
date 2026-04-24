"use client";

import Image from "next/image";
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
          <span className="block leading-snug">こんにちは、</span>
          <span className="mt-1 block leading-snug">
            <span className="bg-gradient-to-t from-[var(--mb-forest)] to-[#84cc16] bg-clip-text text-transparent">
              {displayName}
            </span>
            さん
          </span>
        </p>
        <p className="mt-1 text-[0.8125rem] font-medium text-[var(--mb-forest-light)]">マイボトル</p>
      </div>

      <section
        className="relative isolate mb-14 mt-4 overflow-visible rounded-[var(--mb-radius-card)] px-5 pb-5 pt-4 sm:mb-16"
        style={{
          background:
            "linear-gradient(90deg, #4c684f 0%, #41624a 10%, #355648 20%, #2f5244 22%, #2a4a3d 100%)",
        }}
      >
        <div className="relative z-10 max-w-[min(100%,17rem)] pr-2 sm:max-w-[58%]">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white/90 [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]">
            登録ボトル
          </p>
          <div className="mt-2.5 flex items-end gap-2">
            <p className="text-[2.25rem] font-semibold leading-none tracking-[-0.04em] text-white tabular-nums [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
              {bottleCount}
            </p>
            <span className="pb-1.5 text-sm font-medium text-white/95 [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]">
              本
            </span>
          </div>
          <div className="mt-3.5 h-px w-full bg-white/35" aria-hidden />
          <p className="mt-3 text-[0.8125rem] font-medium text-white/95 [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]">
            残量合計 <span className="font-semibold tabular-nums text-white">{totalUnits}</span> 杯
          </p>
        </div>
        <div
          className="pointer-events-none absolute bottom-0 -right-3 z-0 h-[175%] max-h-[15rem] min-h-[8.5rem] w-[52%] min-w-[8.25rem] max-w-[12.5rem] translate-x-1 translate-y-8 sm:-right-5 sm:h-[182%] sm:max-h-[16rem] sm:min-h-[9rem] sm:max-w-[13.5rem] sm:translate-x-2 sm:translate-y-10"
          aria-hidden
        >
          <div className="relative h-full w-full">
            <Image
              src="/images/green-bottle.webp"
              alt=""
              fill
              priority
              sizes="(max-width: 448px) 48vw, 200px"
              className="object-contain object-bottom"
              draggable={false}
            />
          </div>
        </div>
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
          <section className="space-y-6" aria-labelledby="home-bottles-by-store-heading">
            <header className="space-y-2">
              <h2 id="home-bottles-by-store-heading" className="mb-screen-title">
                店舗別のマイボトル
              </h2>
              <p className="max-w-sm text-[0.8125rem] font-medium leading-relaxed text-[var(--mb-forest-light)]">
                取扱店ごとに、登録中のボトルを分けて表示しています。
              </p>
            </header>
            <div className="space-y-5">
              {stockByStore.map(([storeId, items], storeIndex) => {
                const storeName = stores.find((s) => s.id === storeId)?.name ?? "加盟店";
                return (
                  <section key={storeId} className="space-y-2 overflow-x-visible">
                    <h3 className="overflow-x-visible text-[0.9375rem] font-semibold leading-snug tracking-[-0.02em] text-[var(--mb-ink)]">
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
                    </h3>
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
                              className="group mb-bottle-card-shell w-[8.9rem] shrink-0 snap-start select-none overflow-hidden rounded-[0.95rem] border border-[var(--mb-ring)] transition active:opacity-85"
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
                              <div className="mb-bottle-card-foot space-y-1 px-2.5 py-2">
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
              })}
            </div>
          </section>
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

      <section className="space-y-3" aria-labelledby="home-recommend-banner-heading">
        <h2
          id="home-recommend-banner-heading"
          className="text-base font-semibold tracking-[-0.02em] text-[var(--mb-ink)]"
        >
          あなたへのおすすめ
        </h2>
        <Link
          href="/stores"
          className="relative block overflow-hidden rounded-[var(--mb-radius-card)] shadow-[var(--mb-shadow-card)] ring-1 ring-black/[0.08] transition active:opacity-90"
        >
          <div className="relative aspect-[5/3] min-h-[9.25rem] w-full sm:min-h-[10rem]">
            <Image
              src="/images/banner-bar.webp"
              alt="店舗を探す"
              fill
              className="object-cover object-center"
              sizes="(max-width: 448px) 100vw, 28rem"
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/5 sm:from-black/75 sm:via-black/35 sm:to-transparent"
              aria-hidden
            />
            <div className="absolute inset-y-0 left-0 flex w-[min(100%,19rem)] flex-col justify-center px-5 py-4 sm:px-6">
              <p className="text-[1.0625rem] font-bold leading-snug tracking-[-0.02em] text-white [text-shadow:0_1px_14px_rgba(0,0,0,0.45)]">
                今夜はこの一杯で乾杯しませんか？
              </p>
              <p className="mt-2 text-[0.8125rem] font-medium leading-snug text-white/92 [text-shadow:0_1px_10px_rgba(0,0,0,0.35)]">
                近くの人気店をチェック
              </p>
            </div>
          </div>
        </Link>
      </section>
    </div>
  );
}
