"use client";

import Link from "next/link";
import { BottleProductImage } from "@/components/mybottle/bottle-product-image";
import type { Product } from "@/lib/mybottle/types";

type Props = {
  storeId: string;
  product: Product;
};

export function PurchaseProductRow({ storeId, product }: Props) {
  return (
    <Link
      href={`/products/step-3?storeId=${storeId}&productId=${product.id}`}
      className="group mb-bottle-card-shell w-[8.9rem] shrink-0 snap-start select-none overflow-hidden rounded-[0.95rem] border border-[var(--mb-ring)] transition active:opacity-85"
      draggable={false}
    >
      <div className="mb-bottle-stage">
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
        <p className="line-clamp-1 text-[0.8rem] font-semibold tracking-[-0.01em] text-[var(--mb-ink)]">
          {product.name}
        </p>
        <p className="text-[10px] font-medium text-[var(--mb-forest-light)]">
          1セット: {product.bundleSize}
          {product.unitLabel}
        </p>
      </div>
    </Link>
  );
}
