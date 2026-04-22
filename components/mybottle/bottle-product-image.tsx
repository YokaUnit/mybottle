"use client";

import { useMemo, useState } from "react";
import { bottleImageCandidates } from "@/lib/mybottle/bottle-images";

type Props = {
  productId: string;
  type: "virtual" | "physical";
  /** 枠のサイズ・角丸など */
  frameClassName: string;
  /** 画像が無い／読み込み失敗時の絵文字サイズ */
  fallbackEmojiClassName?: string;
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
}: Props) {
  const paths = useMemo(() => bottleImageCandidates(productId), [productId]);
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  const emoji = type === "virtual" ? "🍺" : "🥃";
  const src = paths[index];

  if (failed || !src) {
    return (
      <div
        className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[var(--mb-muted)] ring-1 ring-[var(--mb-ring)] ${fallbackEmojiClassName} ${frameClassName}`}
        aria-hidden
      >
        {emoji}
      </div>
    );
  }

  return (
    <div
      className={`relative flex min-h-0 min-w-0 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[var(--mb-muted)] p-2 ring-1 ring-[var(--mb-ring)] ${frameClassName}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- ローカル透過PNGの確実表示のため */}
      <img
        key={src}
        src={src}
        alt=""
        className="max-h-full max-w-full object-contain object-center"
        decoding="async"
        onError={() => {
          if (index < paths.length - 1) setIndex((n) => n + 1);
          else setFailed(true);
        }}
      />
    </div>
  );
}
