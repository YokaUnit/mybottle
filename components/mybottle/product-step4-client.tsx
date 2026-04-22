"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BottleProductImage } from "@/components/mybottle/bottle-product-image";
import { useStock } from "@/components/mybottle/stock-provider";
import { PaymentMethod } from "@/lib/mybottle/types";
import { catalog } from "@/lib/mybottle/catalog";
import { stores } from "@/lib/mybottle/stores";

type Props = {
  storeId: string;
  productId: string;
  quantity: number;
};

function formatJpy(value: number) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value);
}

export function ProductStep4Client({ storeId, productId, quantity }: Props) {
  const { purchase } = useStock();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("apple_pay");
  const [done, setDone] = useState(false);

  const product = useMemo(
    () => catalog.find((item) => item.id === productId) ?? catalog[0],
    [productId],
  );
  const store = useMemo(
    () => stores.find((item) => item.id === storeId) ?? stores[0],
    [storeId],
  );

  const total = product.priceJpy * quantity;

  if (done) {
    return (
      <section className="mb-surface border-emerald-200/80 bg-emerald-50/90 p-8 text-center">
        <p className="text-2xl font-semibold tracking-[-0.03em] text-emerald-800">購入完了</p>
        <p className="mt-2 text-base font-medium text-[var(--mb-forest-light)]">
          {store.name} にストック反映しました。
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-[var(--mb-forest)] px-8 py-3.5 text-base font-semibold text-white transition active:opacity-90"
        >
          ホームへ
        </Link>
      </section>
    );
  }

  return (
    <section className="mb-surface space-y-5 p-5">
      <div className="flex gap-4 rounded-[0.85rem] border border-[var(--mb-ring)] bg-[var(--mb-muted)] p-4">
        <BottleProductImage
          key={product.id}
          productId={product.id}
          type={product.type}
          frameClassName="h-20 w-20 shrink-0"
          fallbackEmojiClassName="text-3xl"
        />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-[var(--mb-forest-light)]">{store.name}</p>
          <p className="mt-1 text-lg font-semibold tracking-[-0.02em] text-[var(--mb-ink)]">{product.name}</p>
          <p className="mt-2 text-sm font-medium text-[var(--mb-forest-light)]">
            {quantity}セット / 合計{" "}
            <span className="text-xl font-semibold tabular-nums text-[var(--mb-forest)]">{formatJpy(total)}</span>
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setPaymentMethod("apple_pay")}
          className={`flex-1 rounded-full px-3 py-3 text-sm font-semibold transition active:opacity-90 ${
            paymentMethod === "apple_pay"
              ? "bg-[var(--mb-forest)] text-white"
              : "border border-[var(--mb-ring)] bg-[var(--mb-muted)] text-[var(--mb-ink)]"
          }`}
        >
          Apple Pay
        </button>
        <button
          type="button"
          onClick={() => setPaymentMethod("card")}
          className={`flex-1 rounded-full px-3 py-3 text-sm font-semibold transition active:opacity-90 ${
            paymentMethod === "card"
              ? "bg-[var(--mb-forest)] text-white"
              : "border border-[var(--mb-ring)] bg-[var(--mb-muted)] text-[var(--mb-ink)]"
          }`}
        >
          クレカ
        </button>
      </div>
      <button
        type="button"
        className="w-full rounded-full bg-[var(--mb-forest)] px-4 py-4 text-base font-semibold text-white transition active:opacity-90"
        onClick={() => {
          for (let i = 0; i < quantity; i += 1) {
            purchase({ storeId, productId, paymentMethod });
          }
          setDone(true);
        }}
      >
        支払い
      </button>
    </section>
  );
}
