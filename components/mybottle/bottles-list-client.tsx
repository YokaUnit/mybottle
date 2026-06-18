"use client";

import Link from "next/link";
import { useMemo, type CSSProperties } from "react";
import { AnimatedLinearGauge } from "@/components/mybottle/animated-linear-gauge";
import { BottleProductImage } from "@/components/mybottle/bottle-product-image";
import { HorizontalDragScroll } from "@/components/mybottle/horizontal-drag-scroll";
import { useStock } from "@/components/mybottle/stock-provider";
import { useMasterData } from "@/components/mybottle/master-data-provider";

function expiryLabel(updatedAt: string) {
  const d = new Date(updatedAt);
  d.setMonth(d.getMonth() + 3);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

export function BottlesListClient() {
  const { stock } = useStock();
  const { products, stores } = useMasterData();

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

  if (sorted.length === 0) {
    return (
      <div className="mb-surface px-5 py-12 text-center">
        <p className="text-base font-bold text-[var(--mb-ink)]">まだボトルがありません</p>
        <p className="mt-2 text-sm font-medium text-[var(--mb-forest-light)]">
          QRコードで追加するか、店舗で購入してください。
        </p>
        <Link href="/add-bottle" className="mb-btn-primary mt-6 inline-flex px-6 py-3 text-sm">
          QRで追加する
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {stockByStore.map(([storeId, items], storeIndex) => {
        const storeName = stores.find((s) => s.id === storeId)?.name ?? "加盟店";
        return (
          <section key={storeId} className="space-y-2 overflow-x-visible">
            <h3 className="text-[0.9375rem] font-extrabold leading-snug text-[var(--mb-ink)]">
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
                      className="group mb-bottle-card-shell w-[8.9rem] shrink-0 snap-start overflow-hidden rounded-[1rem] border-2 border-[var(--mb-yellow)]/40 transition active:scale-[0.98]"
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
                        <p className="line-clamp-1 text-[0.8rem] font-extrabold text-[var(--mb-ink)]">
                          {item.productName}
                        </p>
                        <div className="mt-1 h-2 overflow-hidden rounded-full bg-[var(--mb-muted-strong)]">
                          <AnimatedLinearGauge
                            value={pct}
                            className="h-full rounded-full bg-[var(--mb-teal)]"
                          />
                        </div>
                        <p className="text-[10px] font-bold text-[var(--mb-teal-dark)]">
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
  );
}
