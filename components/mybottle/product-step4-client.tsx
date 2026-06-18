"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BottleProductImage } from "@/components/mybottle/bottle-product-image";
import { useStock } from "@/components/mybottle/stock-provider";
import { useMasterData } from "@/components/mybottle/master-data-provider";

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

export function ProductStep4Client({ storeId, productId, quantity: initialQuantity }: Props) {
  const { purchase } = useStock();
  const [quantity, setQuantity] = useState(initialQuantity);
  const [pin, setPin] = useState(["", "", "", ""]);
  const [done, setDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { products, stores } = useMasterData();

  const product = useMemo(
    () => products.find((item) => item.id === productId) ?? products[0],
    [productId, products],
  );
  const store = useMemo(
    () => stores.find((item) => item.id === storeId) ?? stores[0],
    [storeId, stores],
  );

  if (!product || !store) {
    return (
      <section className="mb-surface p-6 text-center text-sm font-bold text-[var(--mb-forest-light)]">
        商品または店舗情報を読み込めませんでした。
      </section>
    );
  }

  const total = product.priceJpy * quantity;
  const pinComplete = pin.every((d) => d.length === 1);

  if (done) {
    return (
      <section className="mb-celebrate-pop mb-pop-card mb-pop-card--teal rounded-[1.25rem] p-8 text-center text-white">
        <p className="text-2xl font-extrabold">追加完了！</p>
        <p className="mt-2 text-base font-bold text-white/90">
          {store.name} での購入分をマイボトルに追加しました。
        </p>
        <Link href="/" className="mt-6 inline-flex rounded-full bg-white px-8 py-3.5 text-base font-extrabold text-[var(--mb-teal-dark)]">
          ホームへ
        </Link>
      </section>
    );
  }

  return (
    <section className="mb-surface space-y-5 p-5">
      <div className="flex gap-4 rounded-[1rem] bg-[var(--mb-muted)] p-4">
        <div className="mb-bottle-stage mb-bottle-stage--row-compact">
          <div className="mb-bottle-stage__bottle">
            <BottleProductImage
              key={product.id}
              productId={product.id}
              type={product.type}
              frameClassName="h-20 w-20 shrink-0"
              fallbackEmojiClassName="text-3xl"
              plain
            />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-[var(--mb-forest-light)]">対象店舗: {store.name}</p>
          <p className="mt-1 text-lg font-extrabold text-[var(--mb-ink)]">{product.name}</p>
          <p className="mt-2 text-sm font-bold text-[var(--mb-forest-light)]">
            {quantity}セット / 合計{" "}
            <span className="text-xl font-extrabold tabular-nums text-[var(--mb-teal-dark)]">
              {formatJpy(total)}
            </span>
          </p>
        </div>
      </div>

      <div className="rounded-[1rem] border-2 border-[var(--mb-muted-strong)] bg-white p-5 text-center">
        <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--mb-forest-light)]">
          確認用 PIN（デモ）
        </p>
        <div className="mt-4 flex justify-center gap-2">
          {pin.map((digit, index) => (
            <input
              key={index}
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(-1);
                const next = [...pin];
                next[index] = val;
                setPin(next);
                if (val && index < 3) {
                  const el = e.target.parentElement?.querySelectorAll("input")[index + 1] as HTMLInputElement | undefined;
                  el?.focus();
                }
              }}
              className="h-14 w-12 rounded-xl border-2 border-[var(--mb-teal)]/30 bg-[var(--mb-muted)] text-center text-2xl font-extrabold text-[var(--mb-ink)] outline-none focus:border-[var(--mb-teal)] focus:ring-2 focus:ring-[var(--mb-teal)]/20"
              aria-label={`PIN ${index + 1}桁目`}
            />
          ))}
        </div>
        <p className="mt-3 text-xs font-medium text-[var(--mb-forest-light)]">
          店頭でお会計後、PINを入力して購入を確定します
        </p>
      </div>

      <button
        type="button"
        className="mb-btn-primary w-full py-4 text-base disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isSubmitting || !pinComplete}
        onClick={async () => {
          if (isSubmitting || !pinComplete) return;
          setIsSubmitting(true);
          try {
            await purchase({ storeId, productId, paymentMethod: "card", quantitySets: quantity });
            setDone(true);
          } finally {
            setIsSubmitting(false);
          }
        }}
      >
        {isSubmitting ? "購入中..." : "購入する"}
      </button>

      <Link href={`/products/step-3?storeId=${storeId}&productId=${productId}`} className="block text-center text-sm font-extrabold text-[var(--mb-forest-light)]">
        キャンセル
      </Link>
    </section>
  );
}
