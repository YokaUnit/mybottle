"use client";

import Link from "next/link";
import { BottleProductImage } from "@/components/mybottle/bottle-product-image";
import type { Product } from "@/lib/mybottle/types";
import { ChevronRight } from "lucide-react";

type Props = {
  storeId: string;
  product: Product;
};

export function PurchaseProductRow({ storeId, product }: Props) {
  return (
    <Link
      href={`/products/step-3?storeId=${storeId}&productId=${product.id}`}
      className="flex items-center gap-4 rounded-[var(--mb-radius-card)] border border-[var(--mb-ring)] bg-[var(--mb-muted)] p-4 transition active:opacity-85"
    >
      <BottleProductImage
        key={product.id}
        productId={product.id}
        type={product.type}
        frameClassName="h-16 w-16"
        fallbackEmojiClassName="text-2xl"
      />
      <div className="min-w-0 flex-1">
        <p className="text-base font-semibold tracking-[-0.02em] text-[var(--mb-ink)]">{product.name}</p>
        <p className="mt-0.5 line-clamp-2 text-sm font-medium leading-snug text-[var(--mb-forest-light)]">
          {product.description}
        </p>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-[var(--mb-forest-light)]" aria-hidden strokeWidth={2} />
    </Link>
  );
}
