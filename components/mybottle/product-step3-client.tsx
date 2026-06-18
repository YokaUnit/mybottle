"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { BottleProductImage } from "@/components/mybottle/bottle-product-image";
import type { Product } from "@/lib/mybottle/types";

type Props = {
  storeId: string;
  product: Product;
  initialQuantity?: number;
};

function formatJpy(value: number) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value);
}

export function ProductStep3Client({ storeId, product, initialQuantity = 1 }: Props) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const totalUnits = product.bundleSize * quantity;
  const totalPrice = product.priceJpy * quantity;
  const unitPrice = useMemo(
    () => Math.round(product.priceJpy / product.bundleSize),
    [product.priceJpy, product.bundleSize],
  );

  return (
    <section className="mb-surface space-y-5 p-5">
      <div className="flex flex-col items-center rounded-[1.25rem] bg-[var(--mb-muted)] p-5">
        <div className="mb-bottle-stage mb-bottle-stage--hero max-w-[12rem]">
          <div className="mb-bottle-stage__bottle flex justify-center">
            <BottleProductImage
              key={product.id}
              productId={product.id}
              type={product.type}
              frameClassName="h-32 w-28"
              fallbackEmojiClassName="text-5xl"
              plain
            />
          </div>
        </div>
        <p className="mt-4 text-lg font-extrabold text-[var(--mb-ink)]">{product.name}</p>
        <p className="mt-1 text-sm font-medium text-[var(--mb-forest-light)]">{product.description}</p>
      </div>

      <div className="rounded-[1rem] border-2 border-[var(--mb-muted-strong)] bg-white p-5">
        <p className="text-center text-sm font-extrabold text-[var(--mb-ink)]">セット数を選択</p>
        <div className="mt-4 flex items-center justify-center gap-4">
          <button
            type="button"
            className="grid h-12 w-12 place-items-center rounded-full border-2 border-[var(--mb-teal)] bg-white text-[var(--mb-teal-dark)] transition active:scale-95"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="1セット減らす"
          >
            <Minus className="h-5 w-5" strokeWidth={2.5} aria-hidden />
          </button>
          <p className="min-w-[4rem] text-center text-3xl font-extrabold tabular-nums text-[var(--mb-ink)]">
            {quantity}
          </p>
          <button
            type="button"
            className="grid h-12 w-12 place-items-center rounded-full bg-[var(--mb-teal)] text-white shadow-[0_3px_10px_rgba(13,148,136,0.35)] transition active:scale-95"
            onClick={() => setQuantity((q) => Math.min(10, q + 1))}
            aria-label="1セット増やす"
          >
            <Plus className="h-5 w-5" strokeWidth={2.5} aria-hidden />
          </button>
        </div>
      </div>

      <div className="mb-pop-card mb-pop-card--yellow rounded-[1.15rem] p-5 text-center">
        <p className="text-[0.6875rem] font-extrabold uppercase tracking-[0.1em] text-[#92400e]/75">合計</p>
        <p className="mt-1 text-[2rem] font-extrabold tabular-nums text-[#713f12]">{formatJpy(totalPrice)}</p>
        <p className="mt-1 text-sm font-bold text-[#78350f]">
          {totalUnits}
          {product.unitLabel} · 1杯あたり約 {formatJpy(unitPrice)}
        </p>
      </div>

      <Link
        href={`/products/step-4?storeId=${storeId}&productId=${product.id}&quantity=${quantity}`}
        className="mb-btn-primary w-full py-4 text-base"
      >
        購入確認へ
      </Link>
    </section>
  );
}
