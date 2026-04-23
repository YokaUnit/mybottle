"use client";

import { useMemo, useState } from "react";
import { BottleProductImage } from "@/components/mybottle/bottle-product-image";
import { useStock } from "@/components/mybottle/stock-provider";
import Link from "next/link";

type Props = {
  storeId: string;
  productId: string;
  initialUnits?: number;
};

export function ConsumeStep4Client({ storeId, productId, initialUnits = 1 }: Props) {
  const { stock } = useStock();
  const [units, setUnits] = useState(initialUnits);

  const item = useMemo(
    () =>
      stock.find((entry) => entry.productId === productId && entry.storeId === storeId),
    [stock, productId, storeId],
  );

  if (!item) {
    return (
      <section className="mb-surface p-6 text-center text-sm font-medium text-[var(--mb-forest-light)]">
        在庫が見つかりません。最初からやり直してください。
      </section>
    );
  }

  const maxUnits = Math.max(1, item.remainingUnits);
  const quickOptions = Array.from(new Set([1, 2, 3, Math.min(5, maxUnits), maxUnits]))
    .filter((value) => value >= 1 && value <= maxUnits)
    .sort((a, b) => a - b);
  const clampedUnits = Math.min(Math.max(units, 1), maxUnits);

  return (
    <section className="mb-surface space-y-5 p-5">
      <div className="flex gap-4">
        <BottleProductImage
          key={item.productId}
          productId={item.productId}
          type={item.type}
          frameClassName="h-24 w-24 shrink-0"
          fallbackEmojiClassName="text-4xl"
        />
        <div className="min-w-0 flex-1">
          <p className="text-lg font-semibold tracking-[-0.02em] text-[var(--mb-ink)]">{item.productName}</p>
          <p className="mt-2 text-sm font-medium leading-relaxed text-[var(--mb-forest-light)]">
            使う杯数を選んで、次に店員提示画面へ進みます。
          </p>
        </div>
      </div>
      <div className="rounded-[0.85rem] border border-[var(--mb-ring)] bg-[var(--mb-muted)] p-4">
        <p className="text-sm font-semibold text-[var(--mb-ink)]">何杯使用しますか？</p>
        <p className="mt-1 text-xs font-medium text-[var(--mb-forest-light)]">
          残り {item.remainingUnits}
          {item.unitLabel} から選択
        </p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <button
            type="button"
            className="h-11 w-11 rounded-full border border-[var(--mb-ring)] bg-white text-xl font-semibold text-[var(--mb-ink)] active:opacity-80"
            onClick={() => setUnits((prev) => Math.max(1, prev - 1))}
            aria-label="1杯減らす"
          >
            -
          </button>
          <p className="min-w-[8rem] text-center text-2xl font-semibold tracking-[-0.03em] text-[var(--mb-ink)]">
            {clampedUnits}
            <span className="ml-1 text-sm font-medium text-[var(--mb-forest-light)]">{item.unitLabel}</span>
          </p>
          <button
            type="button"
            className="h-11 w-11 rounded-full border border-[var(--mb-ring)] bg-white text-xl font-semibold text-[var(--mb-ink)] active:opacity-80"
            onClick={() => setUnits((prev) => Math.min(maxUnits, prev + 1))}
            aria-label="1杯増やす"
          >
            +
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {quickOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setUnits(option)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition active:opacity-80 ${
                clampedUnits === option
                  ? "bg-[var(--mb-forest)] text-white"
                  : "bg-white text-[var(--mb-forest)] ring-1 ring-[var(--mb-ring)]"
              }`}
            >
              {option}
              {item.unitLabel}
            </button>
          ))}
        </div>
      </div>
      <Link
        href={`/consume/step-4?storeId=${storeId}&productId=${productId}&units=${clampedUnits}`}
        className="block w-full rounded-full bg-[var(--mb-forest)] px-4 py-4 text-center text-base font-semibold text-white transition active:opacity-90"
      >
        {clampedUnits}
        {item.unitLabel}で店員提示へ進む
      </Link>
    </section>
  );
}
