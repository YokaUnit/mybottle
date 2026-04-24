"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BottleProductImage } from "@/components/mybottle/bottle-product-image";
import { HorizontalDragScroll } from "@/components/mybottle/horizontal-drag-scroll";
import { useStock } from "@/components/mybottle/stock-provider";
import { useMasterData } from "@/components/mybottle/master-data-provider";

type Props = {
  initialKey?: string;
  preferredStoreId?: string;
};

export function ConsumeStep1Client({ initialKey = "", preferredStoreId = "" }: Props) {
  const { stock } = useStock();
  const { stores } = useMasterData();
  const [selectedKey, setSelectedKey] = useState(initialKey);
  const filteredStock = useMemo(
    () =>
      preferredStoreId
        ? stock.filter((item) => item.storeId === preferredStoreId)
        : stock,
    [preferredStoreId, stock],
  );

  useEffect(() => {
    if (filteredStock.length === 0) return;
    const hasSelected = filteredStock.some((item) => `${item.storeId}:${item.productId}` === selectedKey);
    if (hasSelected) return;
    setSelectedKey(`${filteredStock[0].storeId}:${filteredStock[0].productId}`);
  }, [filteredStock, selectedKey]);

  const selected = useMemo(
    () => filteredStock.find((item) => `${item.storeId}:${item.productId}` === selectedKey),
    [selectedKey, filteredStock],
  );

  if (filteredStock.length === 0) {
    return (
      <section className="mb-surface p-6 text-center text-sm font-medium text-[var(--mb-forest-light)]">
        {preferredStoreId
          ? "この店舗で使用可能な在庫がありません。"
          : "使用可能な在庫がありません。先に購入してください。"}
      </section>
    );
  }

  const selectedStoreName = selected
    ? stores.find((store) => store.id === selected.storeId)?.name ?? "加盟店"
    : null;

  return (
    <section className="mb-surface space-y-4 p-5">
      <HorizontalDragScroll>
        <div className="flex w-max gap-2.5">
          {filteredStock.map((item) => {
            const key = `${item.storeId}:${item.productId}`;
            const active = selectedKey === key;
            const storeName = stores.find((store) => store.id === item.storeId)?.name ?? "加盟店";
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedKey(key)}
                className={`group w-[8.9rem] shrink-0 snap-start overflow-hidden rounded-[0.95rem] border bg-[var(--mb-card)] text-left shadow-[var(--mb-shadow-card)] transition active:opacity-85 ${
                  active
                    ? "border-[var(--mb-forest)]/45 ring-2 ring-[var(--mb-forest)]/20"
                    : "border-[var(--mb-ring)]"
                }`}
              >
                <div className="mb-bottle-stage">
                  <div className="mb-bottle-stage__bottle">
                    <BottleProductImage
                      key={key}
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
                  {!preferredStoreId ? (
                    <p className="line-clamp-1 text-[10px] font-medium text-[var(--mb-forest-light)]">{storeName}</p>
                  ) : null}
                  <p className="text-[10px] font-medium text-[var(--mb-forest-light)]">
                    残り {item.remainingUnits}
                    {item.unitLabel}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </HorizontalDragScroll>

      {selected && selectedStoreName ? (
        <div className="rounded-[0.8rem] border border-[var(--mb-ring)] bg-[var(--mb-muted)] px-3 py-2">
          <p className="text-xs font-medium text-[var(--mb-forest-light)]">
            選択中: {selectedStoreName} / {selected.productName}
          </p>
        </div>
      ) : null}

      <Link
        href={
          selected
            ? `/consume/step-2?storeId=${selected.storeId}&productId=${selected.productId}`
            : "#"
        }
        className={`block rounded-full px-4 py-4 text-center text-base font-semibold transition active:opacity-90 ${
          selected ? "bg-[var(--mb-forest)] text-white" : "bg-[var(--mb-muted-strong)] text-[var(--mb-forest-light)]"
        }`}
      >
        このボトルを使用する
      </Link>
    </section>
  );
}
