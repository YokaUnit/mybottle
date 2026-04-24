"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
  const { consume } = useStock();
  const [token, setToken] = useState("");
  const [remain, setRemain] = useState(0);
  const [done, setDone] = useState(false);

  const store = useMemo(() => stores.find((s) => s.id === storeId) ?? stores[0], [storeId, stores]);
  const product = useMemo(() => products.find((p) => p.id === productId) ?? products[0], [productId, products]);
  const requestedUnits = Math.max(1, Math.floor(units || 1));

  useEffect(() => {
    if (!token || remain <= 0) return;
    const id = window.setInterval(() => {
      setRemain((prev) => {
        const next = Math.max(prev - 1, 0);
        if (next === 0) {
          setToken("");
        }
        return next;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [token, remain]);

  if (!store || !product) {
    return (
      <section className="mb-surface p-6 text-center text-sm font-medium text-[var(--mb-forest-light)]">
        データを読み込み中です...
      </section>
    );
  }

  if (done) {
    return (
      <section className="mb-surface border-emerald-200/80 bg-emerald-50/90 p-8 text-center">
        <div className="mb-bottle-stage mb-bottle-stage--square">
          <div className="mb-bottle-stage__bottle flex justify-center">
            <BottleProductImage
              key={product.id}
              productId={product.id}
              type={product.type}
              frameClassName="h-20 w-20"
              fallbackEmojiClassName="text-3xl"
              plain
            />
          </div>
        </div>
        <p className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-emerald-800">使用完了</p>
        <p className="mt-2 text-base font-medium text-[var(--mb-forest-light)]">
          {product.name} を{requestedUnits}
          {product.unitLabel}使用しました。
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-[var(--mb-forest)] px-8 py-3.5 text-base font-semibold text-white transition active:opacity-90"
        >
          ホームへ戻る
        </Link>
      </section>
    );
  }

  return (
    <section className="mb-surface space-y-4 p-5">
      <div className="flex items-center gap-3 rounded-[0.85rem] border border-[var(--mb-ring)] bg-[var(--mb-muted)] p-3">
        <div className="mb-bottle-stage mb-bottle-stage--row-compact">
          <div className="mb-bottle-stage__bottle">
            <BottleProductImage
              productId={product.id}
              type={product.type}
              frameClassName="h-16 w-16 shrink-0"
              fallbackEmojiClassName="text-2xl"
              plain
            />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold tracking-[-0.02em] text-[var(--mb-ink)]">{product.name}</p>
          <p className="text-xs font-medium text-[var(--mb-forest-light)]">{store.name}</p>
          <p className="mt-1 text-xs font-semibold text-[var(--mb-ink)]">
            使用量: {requestedUnits}
            {product.unitLabel}
          </p>
        </div>
      </div>

      {!token ? (
        <button
          type="button"
          className="w-full rounded-full bg-[var(--mb-forest)] px-4 py-4 text-base font-semibold text-white transition active:opacity-90"
          onClick={() => {
            setToken(createToken());
            setRemain(20);
          }}
        >
          店員に提示するコードを表示
        </button>
      ) : (
        <div className="rounded-[var(--mb-radius-card)] border border-[var(--mb-forest)]/20 bg-[var(--mb-forest)] p-6 text-white shadow-[var(--mb-shadow-card)]">
          <p className="text-[0.65rem] font-medium tracking-[0.18em] text-white/80">MYBOTTLE VERIFY</p>
          <p className="mt-3 text-4xl font-semibold tabular-nums tracking-[0.12em]">{token}</p>
          <p className="mt-3 text-sm font-medium text-white/90">有効期限: あと {remain} 秒</p>
          <p className="mt-1 text-xs font-medium text-white/70">店員確認が済んだら次へ進んでください</p>
        </div>
      )}

      <button
        type="button"
        className={`block rounded-full px-4 py-4 text-center text-base font-semibold transition active:opacity-90 ${
          token ? "bg-[var(--mb-forest)] text-white" : "bg-[var(--mb-muted-strong)] text-[var(--mb-forest-light)]"
        }`}
        onClick={async () => {
          if (!token) return;
          const ok = await consume({ storeId, productId, units: requestedUnits });
          if (ok) setDone(true);
        }}
      >
        確認後、使用を確定する
      </button>
    </section>
  );
}
