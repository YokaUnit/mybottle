"use client";

import Link from "next/link";
import { useMemo, type CSSProperties } from "react";
import { AnimatedLinearGauge } from "@/components/mybottle/animated-linear-gauge";
import { BottleProductImage } from "@/components/mybottle/bottle-product-image";
import { HorizontalDragScroll } from "@/components/mybottle/horizontal-drag-scroll";
import { useStock } from "@/components/mybottle/stock-provider";
import { useMasterData } from "@/components/mybottle/master-data-provider";

const CARD_W = "w-[8.9rem] min-w-[8.9rem] max-w-[8.9rem]";

function expiryLabel(updatedAt: string) {
  const d = new Date(updatedAt);
  d.setMonth(d.getMonth() + 3);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

export function HomeBottlesSection() {
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
      <div className="rounded-[1.15rem] border border-dashed border-[#cbd5e1] bg-white px-4 py-5 text-center">
        <p className="text-sm font-extrabold text-[#334155]">まだボトルがありません</p>
        <p className="mt-1 text-xs font-medium text-[#94a3b8]">QRで追加するか、店舗で購入してください</p>
        <div className="mt-3 flex justify-center gap-2">
          <Link
            href="/add-bottle"
            className="rounded-full bg-[#14b8a6] px-4 py-2 text-xs font-extrabold text-white shadow-sm"
          >
            追加する
          </Link>
          <Link
            href="/products/step-1"
            className="rounded-full bg-white px-4 py-2 text-xs font-extrabold text-[#0d9488] ring-1 ring-[#14b8a6]/30"
          >
            購入する
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {stockByStore.map(([storeId, items], storeIndex) => {
        const storeName = stores.find((s) => s.id === storeId)?.name ?? "加盟店";
        return (
          <section key={storeId} className="space-y-2">
            <h3 className="text-[0.875rem] font-extrabold text-[#334155]">
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

            <div className="-mx-4">
              <HorizontalDragScroll>
                <div className="flex w-max snap-x snap-mandatory gap-2.5 px-4 pb-0.5">
                  {items.map((item) => {
                    const product = products.find((c) => c.id === item.productId);
                    const max = product?.bundleSize ?? 5;
                    const pct = Math.min(100, Math.round((item.remainingUnits / max) * 100));
                    return (
                      <Link
                        key={`${item.storeId}-${item.productId}`}
                        href={`/bottle/${item.storeId}/${item.productId}`}
                        className={`${CARD_W} flex shrink-0 snap-start flex-col overflow-hidden rounded-[1.05rem] border border-[#e2e8f0]/80 bg-white shadow-[0_4px_14px_rgba(15,23,42,0.07)] transition active:scale-[0.97]`}
                      >
                        <div className="mb-bottle-stage mb-bottle-stage--pop">
                          <div className="mb-bottle-stage__bottle">
                            <BottleProductImage
                              productId={item.productId}
                              type={item.type}
                              frameClassName="h-[5.55rem] w-[5.55rem]"
                              fallbackEmojiClassName="text-2xl"
                              plain
                            />
                          </div>
                        </div>
                        <div className="mb-bottle-card-foot space-y-1 px-2.5 py-2">
                          <p className="line-clamp-1 text-[0.8rem] font-extrabold text-[#334155]">
                            {item.productName}
                          </p>
                          <div className="mt-1 h-2 overflow-hidden rounded-full bg-[#e8ecf0]">
                            <AnimatedLinearGauge
                              value={pct}
                              className="h-full rounded-full bg-[#14b8a6]"
                            />
                          </div>
                          <p className="text-[10px] font-extrabold text-[#0d9488]">
                            残り {item.remainingUnits}
                            {item.unitLabel}
                          </p>
                          <p className="text-[10px] font-medium text-[#94a3b8]">
                            有効期限 {expiryLabel(item.updatedAt)}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </HorizontalDragScroll>
            </div>
          </section>
        );
      })}
    </div>
  );
}
