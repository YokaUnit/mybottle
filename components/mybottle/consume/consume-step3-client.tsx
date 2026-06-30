"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PartyPopper, ShieldCheck, Sparkles } from "lucide-react";
import { BottleProductImage } from "@/components/mybottle/bottle-product-image";
import { useMasterData } from "@/components/mybottle/master-data-provider";
import { useStock } from "@/components/mybottle/stock-provider";

type Props = {
  storeId: string;
  productId: string;
  units: number;
};

function createToken() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function ConsumeStep3Client({ storeId, productId, units }: Props) {
  const { stores, products } = useMasterData();
  const { consume, stock } = useStock();
  const [token, setToken] = useState("");
  const [remain, setRemain] = useState(0);
  const [done, setDone] = useState(false);
  const [remainingAfter, setRemainingAfter] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const store = useMemo(() => stores.find((s) => s.id === storeId) ?? stores[0], [storeId, stores]);
  const product = useMemo(() => products.find((p) => p.id === productId) ?? products[0], [productId, products]);
  const requestedUnits = Math.max(1, Math.floor(units || 1));

  const currentItem = useMemo(
    () => stock.find((s) => s.storeId === storeId && s.productId === productId),
    [stock, storeId, productId],
  );

  useEffect(() => {
    if (!token || remain <= 0) return;
    const id = window.setInterval(() => {
      setRemain((prev) => {
        const next = Math.max(prev - 1, 0);
        if (next === 0) setToken("");
        return next;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [token, remain]);

  if (!store || !product) {
    return (
      <section className="mt-4 rounded-[1.25rem] bg-white p-6 text-center text-sm font-bold text-[#64748b]">
        データを読み込み中です...
      </section>
    );
  }

  if (done) {
    return (
      <section className="relative mt-4 overflow-hidden rounded-[1.5rem] bg-white px-6 py-10 text-center shadow-[0_4px_24px_rgba(20,184,166,0.12)]">
        <div className="pointer-events-none absolute inset-x-0 top-5 flex justify-center gap-3 opacity-80" aria-hidden>
          <Sparkles className="h-5 w-5 text-[#facc15]" strokeWidth={2.5} />
          <PartyPopper className="h-6 w-6 text-[#f472b6]" strokeWidth={2.25} />
          <Sparkles className="h-5 w-5 text-[#14b8a6]" strokeWidth={2.5} />
        </div>

        <div className="mx-auto max-w-[10rem]">
          <div className="mb-bottle-stage mb-bottle-stage--square border-0 bg-transparent shadow-none">
            <div className="mb-bottle-stage__bottle flex justify-center">
              <BottleProductImage
                productId={product.id}
                type={product.type}
                frameClassName="h-20 w-20"
                fallbackEmojiClassName="text-3xl"
                plain
              />
            </div>
          </div>
        </div>

        <p className="mt-4 text-[1.5rem] font-extrabold tracking-[-0.03em] text-[#0f766e]">乾杯！</p>
        <p className="mt-2 text-sm font-medium text-[#64748b]">
          {requestedUnits}
          {product.unitLabel}の使用が完了しました
        </p>
        <p className="mt-4 rounded-full bg-[#f0fdfa] px-4 py-2 text-base font-extrabold text-[#0d9488]">
          残り {remainingAfter}
          {product.unitLabel}
        </p>

        <Link href="/" className="mb-btn-primary mt-8 inline-flex px-10 py-3.5 text-base">
          ホームへ戻る
        </Link>
      </section>
    );
  }

  return (
    <>
      <section className="mt-4 space-y-4">
        <div className="flex items-center gap-3 rounded-[1.15rem] border border-[#e2e8f0] bg-white p-4 shadow-sm">
          <div className="mb-bottle-stage mb-bottle-stage--thumb shrink-0">
            <div className="mb-bottle-stage__bottle">
              <BottleProductImage
                productId={product.id}
                type={product.type}
                frameClassName="h-12 w-12"
                fallbackEmojiClassName="text-xl"
                plain
              />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-extrabold text-[#1e293b]">{product.name}</p>
            <p className="truncate text-xs font-medium text-[#64748b]">{store.name}</p>
            <p className="mt-1 text-xs font-extrabold text-[#0d9488]">
              使用予定 {requestedUnits}
              {product.unitLabel}
            </p>
          </div>
        </div>

        {!token ? (
          <div className="rounded-[1.25rem] border border-[#e2e8f0] bg-white p-6 text-center shadow-sm">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#f0fdfa] text-[#14b8a6]">
              <ShieldCheck className="h-6 w-6" strokeWidth={2.25} aria-hidden />
            </div>
            <p className="mt-4 text-base font-extrabold text-[#1e293b]">店員さんに提示してください</p>
            <p className="mt-2 text-sm font-medium leading-relaxed text-[#64748b]">
              確認コードを表示して、店員さんの確認が取れたら使用を確定します。
            </p>
            <button
              type="button"
              className="mb-btn-primary mt-6 w-full py-3.5 text-base"
              onClick={() => {
                setToken(createToken());
                setRemain(60);
              }}
            >
              確認コードを表示
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-[#14b8a6] to-[#0d9488] p-6 text-white shadow-[0_8px_28px_rgba(20,184,166,0.35)]">
            <p className="text-center text-[0.625rem] font-extrabold tracking-[0.2em] text-white/75">
              MYBOTTLE VERIFY
            </p>
            <p
              className="mt-4 text-center text-[2.75rem] font-black tabular-nums tracking-[0.18em]"
              aria-live="polite"
            >
              {token}
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="h-1.5 flex-1 max-w-[8rem] overflow-hidden rounded-full bg-white/25">
                <span
                  className="block h-full rounded-full bg-white transition-[width] duration-1000 ease-linear"
                  style={{ width: `${(remain / 60) * 100}%` }}
                />
              </span>
              <p className="text-sm font-bold tabular-nums text-white/90">あと {remain} 秒</p>
            </div>
            <p className="mt-3 text-center text-xs font-medium text-white/80">
              この画面を店員さんにお見せください
            </p>
          </div>
        )}
      </section>

      <div className="fixed inset-x-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-30 mx-auto max-w-md px-4 sm:px-5">
        <div className="rounded-[1.15rem] border border-[#e2e8f0] bg-white/95 p-3 shadow-[0_-4px_24px_rgba(15,23,42,0.08)] backdrop-blur-sm">
          <button
            type="button"
            className={`w-full rounded-full py-3.5 text-center text-base font-extrabold transition active:opacity-90 ${
              token && !submitting ? "mb-btn-primary" : "bg-[#e2e8f0] text-[#94a3b8]"
            }`}
            disabled={!token || submitting}
            onClick={async () => {
              if (!token || submitting) return;
              setSubmitting(true);
              const before = currentItem?.remainingUnits ?? 0;
              const ok = await consume({ storeId, productId, units: requestedUnits });
              if (ok) {
                setRemainingAfter(Math.max(0, before - requestedUnits));
                setDone(true);
              }
              setSubmitting(false);
            }}
          >
            {submitting ? "処理中..." : "店員確認後、使用を確定する"}
          </button>
          {!token ? (
            <p className="mt-2 text-center text-[0.6875rem] font-medium text-[#94a3b8]">
              先に確認コードを表示してください
            </p>
          ) : null}
        </div>
      </div>

      <div className="h-28" aria-hidden />
    </>
  );
}
