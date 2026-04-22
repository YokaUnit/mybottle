"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BottleProductImage } from "@/components/mybottle/bottle-product-image";
import { useStock } from "@/components/mybottle/stock-provider";

type Props = {
  initialKey?: string;
};

export function ConsumeStep1Client({ initialKey = "" }: Props) {
  const { stock } = useStock();
  const [selectedKey, setSelectedKey] = useState(initialKey);

  const selected = useMemo(
    () => stock.find((item) => `${item.storeId}:${item.productId}` === selectedKey),
    [selectedKey, stock],
  );

  if (stock.length === 0) {
    return (
      <section className="mb-surface p-6 text-center text-sm font-medium text-[var(--mb-forest-light)]">
        使用可能な在庫がありません。先に購入してください。
      </section>
    );
  }

  return (
    <section className="mb-surface space-y-3 p-5">
      {stock.map((item) => {
        const key = `${item.storeId}:${item.productId}`;
        const active = selectedKey === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => setSelectedKey(key)}
            className={`flex w-full items-center gap-4 rounded-[0.85rem] border px-3 py-3 text-left transition active:opacity-90 ${
              active
                ? "border-[var(--mb-forest)]/35 bg-[var(--mb-muted)] ring-1 ring-[var(--mb-ring)]"
                : "border-[var(--mb-ring)] bg-[var(--mb-muted)]/80"
            }`}
          >
            <BottleProductImage
              key={key}
              productId={item.productId}
              type={item.type}
              frameClassName="h-16 w-16 shrink-0"
              fallbackEmojiClassName="text-2xl"
            />
            <div className="min-w-0 flex-1">
              <p className="text-base font-semibold tracking-[-0.02em] text-[var(--mb-ink)]">{item.productName}</p>
              <p className="text-sm font-medium text-[var(--mb-forest-light)]">
                残り {item.remainingUnits}
                {item.unitLabel}
              </p>
            </div>
          </button>
        );
      })}

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
