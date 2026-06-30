"use client";

import Link from "next/link";
import { useState } from "react";
import { BottleProductImage } from "@/components/mybottle/bottle-product-image";
import { useStock } from "@/components/mybottle/stock-provider";

type ProductOffering = {
  id: string;
  name: string;
  priceJpy: number;
  type: "virtual" | "physical";
};

type Props = {
  storeId: string;
  storeName: string;
  product: ProductOffering;
  quantity: number;
};

function formatJpy(value: number) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value);
}

function sanitizePinDigit(raw: string): string {
  return raw.replace(/\D/g, "").slice(-1);
}

function sanitizePinString(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 4);
}

function focusPinInput(container: HTMLElement | null, index: number) {
  const el = container?.querySelectorAll("input")[index] as HTMLInputElement | undefined;
  el?.focus();
}

export function ProductStep4Client({ storeId, storeName, product, quantity }: Props) {
  const { purchase } = useStock();
  const [pin, setPin] = useState(["", "", "", ""]);
  const [done, setDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = product.priceJpy * quantity;
  const pinComplete = pin.every((d) => d.length === 1);

  if (done) {
    return (
      <section className="mb-celebrate-pop mb-pop-card mb-pop-card--teal rounded-[1.25rem] p-8 text-center text-white">
        <p className="text-2xl font-extrabold">追加完了！</p>
        <p className="mt-2 text-base font-bold text-white/90">
          {storeName} での購入分をマイボトルに追加しました。
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
          <p className="text-xs font-bold text-[var(--mb-forest-light)]">対象店舗: {storeName}</p>
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
        <p className="text-sm font-bold leading-relaxed text-[var(--mb-ink)]">
          店員の方に PIN を入力してもらいましょう
        </p>
        <div className="mt-4 flex justify-center gap-2" data-pin-inputs>
          {pin.map((digit, index) => (
            <input
              key={index}
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              maxLength={1}
              value={digit}
              onChange={(e) => {
                setError(null);
                const val = sanitizePinDigit(e.target.value);
                const next = [...pin];
                next[index] = val;
                setPin(next);
                if (val && index < 3) {
                  focusPinInput(e.target.closest("[data-pin-inputs]"), index + 1);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !pin[index] && index > 0) {
                  focusPinInput(e.currentTarget.closest("[data-pin-inputs]"), index - 1);
                  return;
                }
                if (e.key.length === 1 && !/^\d$/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              onPaste={(e) => {
                e.preventDefault();
                setError(null);
                const pasted = sanitizePinString(e.clipboardData.getData("text"));
                if (!pasted) return;
                const next = ["", "", "", ""];
                for (let i = 0; i < pasted.length; i += 1) {
                  next[i] = pasted[i] ?? "";
                }
                setPin(next);
                focusPinInput(
                  e.currentTarget.closest("[data-pin-inputs]"),
                  Math.min(pasted.length, 3),
                );
              }}
              className="h-14 w-12 rounded-xl border-2 border-[var(--mb-teal)]/30 bg-[var(--mb-muted)] text-center text-2xl font-extrabold text-[var(--mb-ink)] outline-none focus:border-[var(--mb-teal)] focus:ring-2 focus:ring-[var(--mb-teal)]/20 [&::-ms-reveal]:hidden"
              aria-label={`PIN ${index + 1}桁目（店員入力）`}
            />
          ))}
        </div>
        <p className="mt-3 text-xs font-medium leading-relaxed text-[var(--mb-forest-light)]">
          キャッシュオン連携ではありません。いつも通り伝票に記載してください。
        </p>
        <p className="mt-2 text-xs font-medium text-[var(--mb-forest-light)]">
          誤って何度も購入されないよう、お客様ではなく店員が入力してください
        </p>
      </div>

      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-bold text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        className="mb-btn-primary w-full py-4 text-base disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isSubmitting || !pinComplete}
        onClick={async () => {
          if (isSubmitting || !pinComplete) return;
          setIsSubmitting(true);
          setError(null);
          try {
            await purchase({
              storeId,
              productId: product.id,
              paymentMethod: "card",
              quantitySets: quantity,
              staffPin: pin.join(""),
            });
            setDone(true);
          } catch (err) {
            setError(err instanceof Error ? err.message : "購入に失敗しました");
          } finally {
            setIsSubmitting(false);
          }
        }}
      >
        {isSubmitting ? "購入中..." : "店員確認して購入する"}
      </button>

      <Link
        href={`/products/step-3?storeId=${storeId}&productId=${product.id}`}
        className="block text-center text-sm font-extrabold text-[var(--mb-forest-light)]"
      >
        キャンセル
      </Link>
    </section>
  );
}
