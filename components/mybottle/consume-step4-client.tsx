"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BottleProductImage } from "@/components/mybottle/bottle-product-image";
import { useStock } from "@/components/mybottle/stock-provider";

type Props = {
  storeId: string;
  productId: string;
};

export function ConsumeStep4Client({ storeId, productId }: Props) {
  const { stock, consume } = useStock();
  const [done, setDone] = useState(false);

  const item = useMemo(
    () =>
      stock.find(
        (entry) =>
          entry.productId === productId && (entry.storeId === storeId || entry.type === "virtual"),
      ),
    [stock, productId, storeId],
  );

  if (!item) {
    return (
      <section className="mb-surface p-6 text-center text-sm font-medium text-[var(--mb-forest-light)]">
        在庫が見つかりません。最初からやり直してください。
      </section>
    );
  }

  if (done) {
    return (
      <section className="mb-surface border-emerald-200/80 bg-emerald-50/90 p-8 text-center">
        <div className="mx-auto flex w-fit justify-center">
          <BottleProductImage
            key={item.productId}
            productId={item.productId}
            type={item.type}
            frameClassName="h-20 w-20"
            fallbackEmojiClassName="text-3xl"
          />
        </div>
        <p className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-emerald-800">使用完了</p>
        <p className="mt-2 text-base font-medium text-[var(--mb-forest-light)]">
          {item.productName} を1{item.unitLabel}使用しました。
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-[var(--mb-forest)] px-8 py-3.5 text-base font-semibold text-white transition active:opacity-90"
        >
          ホームへ戻る
        </Link>
      </section>
    );
  }

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
            店員確認後、使用完了を押してください。
          </p>
        </div>
      </div>
      <button
        type="button"
        className="w-full rounded-full bg-[var(--mb-forest)] px-4 py-4 text-base font-semibold text-white transition active:opacity-90"
        onClick={() => {
          const ok = consume({ storeId, productId });
          if (ok) setDone(true);
        }}
      >
        使用完了
      </button>
    </section>
  );
}
