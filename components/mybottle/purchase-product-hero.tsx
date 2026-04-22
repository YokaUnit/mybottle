"use client";

import { BottleProductImage } from "@/components/mybottle/bottle-product-image";
import type { Product } from "@/lib/mybottle/types";

type Props = {
  product: Product;
};

export function PurchaseProductHero({ product }: Props) {
  return (
    <div className="flex gap-4 rounded-[0.85rem] border border-[var(--mb-ring)] bg-[var(--mb-muted)] p-4">
      <BottleProductImage
        key={product.id}
        productId={product.id}
        type={product.type}
        frameClassName="h-24 w-24 shrink-0"
        fallbackEmojiClassName="text-4xl"
      />
      <div className="min-w-0 flex-1">
        <p className="mb-label-caps">選択中</p>
        <p className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[var(--mb-ink)]">{product.name}</p>
        <p className="mt-2 text-sm font-medium leading-relaxed text-[var(--mb-forest-light)]">{product.description}</p>
      </div>
    </div>
  );
}
