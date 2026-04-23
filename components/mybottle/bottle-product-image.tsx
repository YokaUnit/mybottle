"use client";

import { useMemo, useState } from "react";
import { bottleImageCandidates } from "@/lib/mybottle/bottle-images";
import { useMasterData } from "@/components/mybottle/master-data-provider";
import { getProductImageObjectUrl, getProductImageUrl } from "@/lib/supabase/storage";

type Props = {
  productId: string;
  type: "virtual" | "physical";
  /** 枠のサイズ・角丸など */
  frameClassName: string;
  /** 画像が無い／読み込み失敗時の絵文字サイズ */
  fallbackEmojiClassName?: string;
  /** true のとき、背景枠なしで画像だけ表示 */
  plain?: boolean;
};

/**
 * 主に `public/bottles/{slug}.png`（`lib/mybottle/bottle-images.ts` の対応表）。
 * 無ければ `public/images/bottles/{productId}.png` なども順に試す。
 */
export function BottleProductImage({
  productId,
  type,
  frameClassName,
  fallbackEmojiClassName = "text-3xl",
  plain = false,
}: Props) {
  const { products } = useMasterData();
  const product = useMemo(() => products.find((item) => item.id === productId), [products, productId]);
  const storageImage = product?.imagePath ? getProductImageUrl(product.imagePath, 320) : null;
  const storageObjectImage = product?.imagePath ? getProductImageObjectUrl(product.imagePath) : null;
  const paths = useMemo(() => bottleImageCandidates(productId), [productId]);
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const [renderFailed, setRenderFailed] = useState(false);

  const emoji = type === "virtual" ? "🍺" : "🥃";
  const src = (() => {
    if (storageImage && !renderFailed) return storageImage;
    if (storageObjectImage && !failed) return storageObjectImage;
    return paths[index] ?? null;
  })();

  if (failed || !src) {
    return (
      <div
        className={`relative flex shrink-0 items-center justify-center overflow-hidden ${
          plain ? "" : "rounded-xl bg-[var(--mb-muted)] ring-1 ring-[var(--mb-ring)]"
        } ${fallbackEmojiClassName} ${frameClassName}`}
        aria-hidden
      >
        {emoji}
      </div>
    );
  }

  return (
    <div
      className={`relative flex min-h-0 min-w-0 shrink-0 items-center justify-center overflow-hidden ${
        plain ? "" : "rounded-xl bg-[var(--mb-muted)] p-2 ring-1 ring-[var(--mb-ring)]"
      } ${frameClassName}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- ローカル透過PNGの確実表示のため */}
      <img
        key={src}
        src={src}
        alt=""
        className="pointer-events-none max-h-full max-w-full object-contain object-center"
        draggable={false}
        decoding="async"
        loading="lazy"
        onError={() => {
          if (storageImage && !renderFailed) {
            setRenderFailed(true);
            return;
          }
          if (storageObjectImage && !failed) {
            setFailed(true);
            return;
          }
          if (index < paths.length - 1) setIndex((n) => n + 1);
          else setFailed(true);
        }}
      />
    </div>
  );
}
