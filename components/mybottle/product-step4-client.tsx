"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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

export function ProductStep4Client({ storeId, productId, quantity }: Props) {
  const { purchase } = useStock();
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
  const verifyCode = useMemo(() => {
    const seed = `${storeId}:${productId}:${quantity}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
      hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }
    return hash.toString(36).toUpperCase().slice(0, 8).padEnd(8, "0");
  }, [productId, quantity, storeId]);

  if (!product || !store) {
    return (
      <section className="mb-surface p-6 text-center text-sm font-medium text-[var(--mb-forest-light)]">
        商品または店舗情報を読み込めませんでした。
      </section>
    );
  }

  const total = product.priceJpy * quantity;

  if (done) {
    return (
      <section className="mb-surface border-emerald-200/80 bg-emerald-50/90 p-8 text-center">
        <p className="text-2xl font-semibold tracking-[-0.03em] text-emerald-800">追加完了</p>
        <p className="mt-2 text-base font-medium text-[var(--mb-forest-light)]">
          {store.name} での購入分をマイボトルに追加しました。
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
          <p className="text-xs font-medium text-[var(--mb-forest-light)]">対象店舗: {store.name}</p>
          <p className="mt-1 text-lg font-semibold tracking-[-0.02em] text-[var(--mb-ink)]">{product.name}</p>
          <p className="mt-2 text-sm font-medium text-[var(--mb-forest-light)]">
            注文内容: {quantity}セット / 合計{" "}
            <span className="text-xl font-semibold tabular-nums text-[var(--mb-forest)]">{formatJpy(total)}</span>
          </p>
        </div>
      </div>

      <div className="rounded-[var(--mb-radius-card)] border border-[var(--mb-ring)] bg-white p-4 text-center">
        <p className="text-xs font-semibold tracking-[0.12em] text-[var(--mb-forest-light)]">STORE CHECK</p>
        <div
          className="mx-auto mt-3 h-40 w-40 rounded-lg border border-[var(--mb-ring)] bg-[linear-gradient(90deg,#111_10%,transparent_10%),linear-gradient(#111_10%,transparent_10%)] bg-[size:14px_14px] bg-center"
          role="img"
          aria-label="店員提示用QRイメージ"
        />
        <p className="mt-3 text-lg font-semibold tracking-[0.16em] text-[var(--mb-ink)]">{verifyCode}</p>
        <p className="mt-2 text-sm font-medium leading-relaxed text-[var(--mb-forest-light)]">
          店頭でお会計後、この画面を店員に提示してください
          <br />
          確認が完了したら「マイボトルに追加」を押します
        </p>
      </div>

      <button
        type="button"
        className="w-full rounded-full bg-[var(--mb-forest)] px-4 py-4 text-base font-semibold text-white transition active:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        onClick={async () => {
          if (isSubmitting) return;
          setIsSubmitting(true);
          try {
            await purchase({ storeId, productId, paymentMethod: "card", quantitySets: quantity });
            setDone(true);
          } finally {
            setIsSubmitting(false);
          }
        }}
      >
        {isSubmitting ? "追加中..." : "マイボトルに追加"}
      </button>
    </section>
  );
}
