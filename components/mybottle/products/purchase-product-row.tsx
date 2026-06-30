"use client";

import Link from "next/link";
import { BottleProductImage } from "@/components/mybottle/bottle-product-image";
import type { StoreProductOffering } from "@/lib/mybottle/types";

type Props = {
  storeId: string;
  product: StoreProductOffering;
};

function formatJpy(n: number) {
  return new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 }).format(n);
}

export function PurchaseProductRow({ storeId, product }: Props) {
  const soldOut = product.isSoldOut;

  const body = (
    <>
      <div className={`mb-bottle-stage ${soldOut ? "opacity-45 grayscale" : ""}`}>
        <div className="mb-bottle-stage__bottle">
          <BottleProductImage
            key={product.id}
            productId={product.id}
            type={product.type}
            frameClassName="h-[5.55rem] w-[5.55rem]"
            fallbackEmojiClassName="text-2xl"
            plain
          />
        </div>
      </div>
      <div className="mb-bottle-card-foot space-y-1 px-2.5 py-2">
        <p className="line-clamp-1 text-[0.8rem] font-extrabold text-[var(--mb-ink)]">{product.name}</p>
        <p className="text-[10px] font-bold text-[#0d9488]">{formatJpy(product.mybottlePriceJpy)}</p>
        <p className="text-[9px] font-medium text-[#94a3b8] line-through">{formatJpy(product.regularPriceJpy)}</p>
        <p className="text-[10px] font-medium text-[var(--mb-forest-light)]">
          1セット: {product.bundleSize}
          {product.unitLabel}
        </p>
        {soldOut ? (
          <span className="inline-flex rounded-full bg-[#fef2f2] px-2 py-0.5 text-[9px] font-extrabold text-[#dc2626]">
            在庫切れ
          </span>
        ) : null}
      </div>
    </>
  );

  if (soldOut) {
    return (
      <div className="mb-bottle-card-shell w-[8.9rem] shrink-0 snap-start select-none overflow-hidden rounded-[1rem] border-2 border-[#e2e8f0] opacity-80">
        {body}
      </div>
    );
  }

  return (
    <Link
      href={`/products/step-3?storeId=${storeId}&productId=${product.id}`}
      className="group mb-bottle-card-shell w-[8.9rem] shrink-0 snap-start select-none overflow-hidden rounded-[1rem] border-2 border-[var(--mb-yellow)]/40 transition active:scale-[0.98]"
      draggable={false}
    >
      {body}
    </Link>
  );
}
