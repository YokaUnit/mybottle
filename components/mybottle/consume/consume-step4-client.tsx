"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CheckCircle2, Eye, Minus, Plus, Wine } from "lucide-react";
import { BottleProductImage } from "@/components/mybottle/bottle-product-image";
import { useMasterData } from "@/components/mybottle/master-data-provider";
import { useStock } from "@/components/mybottle/stock-provider";

type Props = {
  storeId: string;
  productId: string;
  initialUnits?: number;
};

const FLOW_STEPS = [
  { icon: Wine, label: "杯数を選ぶ" },
  { icon: Eye, label: "店員に画面を見せる" },
  { icon: CheckCircle2, label: "確認後に確定" },
] as const;

export function ConsumeStep4Client({ storeId, productId, initialUnits = 1 }: Props) {
  const { stock } = useStock();
  const { stores } = useMasterData();
  const [units, setUnits] = useState(initialUnits);

  const item = useMemo(
    () => stock.find((entry) => entry.productId === productId && entry.storeId === storeId),
    [stock, productId, storeId],
  );

  const storeName = useMemo(
    () => stores.find((store) => store.id === storeId)?.name ?? "加盟店",
    [stores, storeId],
  );

  if (!item) {
    return (
      <section className="mt-4 rounded-[1.25rem] border border-dashed border-[#cbd5e1] bg-white px-5 py-10 text-center">
        <p className="text-sm font-bold text-[#64748b]">在庫が見つかりませんでした。</p>
        <Link href="/consume/step-1" className="mb-btn-primary mt-5 inline-flex px-6 py-3 text-sm">
          最初から選び直す
        </Link>
      </section>
    );
  }

  const maxUnits = Math.max(1, item.remainingUnits);
  const clampedUnits = Math.min(Math.max(units, 1), maxUnits);
  const afterUnits = item.remainingUnits - clampedUnits;

  return (
    <>
      <section className="mt-4 space-y-4">
        <div className="overflow-hidden rounded-[1.25rem] border border-[#e2e8f0] bg-white shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
          <div className="flex items-center gap-3 border-b border-[#f1f5f9] p-4">
            <div className="mb-bottle-stage mb-bottle-stage--thumb shrink-0">
              <div className="mb-bottle-stage__bottle">
                <BottleProductImage
                  productId={item.productId}
                  type={item.type}
                  frameClassName="h-14 w-14"
                  fallbackEmojiClassName="text-2xl"
                  plain
                />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-extrabold text-[#1e293b]">{item.productName}</p>
              <p className="mt-0.5 truncate text-xs font-medium text-[#64748b]">{storeName}</p>
              <p className="mt-1.5 text-xs font-extrabold text-[#0d9488]">
                現在の残り {item.remainingUnits}
                {item.unitLabel}
              </p>
            </div>
          </div>

          <div className="p-5">
            <p className="text-center text-sm font-extrabold text-[#1e293b]">何杯使いますか？</p>
            <div className="mt-5 flex items-center justify-center gap-5">
              <button
                type="button"
                className="grid h-12 w-12 place-items-center rounded-full border-2 border-[#14b8a6] bg-white text-[#0d9488] transition enabled:active:scale-95 disabled:opacity-40"
                onClick={() => setUnits((prev) => Math.max(1, prev - 1))}
                disabled={clampedUnits <= 1}
                aria-label="1杯減らす"
              >
                <Minus className="h-5 w-5" strokeWidth={2.5} aria-hidden />
              </button>
              <div className="min-w-[6rem] text-center">
                <p className="text-4xl font-black tabular-nums leading-none text-[#1e293b]">{clampedUnits}</p>
                <p className="mt-1 text-sm font-bold text-[#64748b]">{item.unitLabel}</p>
              </div>
              <button
                type="button"
                className="grid h-12 w-12 place-items-center rounded-full bg-[#14b8a6] text-white shadow-[0_4px_12px_rgba(20,184,166,0.35)] transition enabled:active:scale-95 disabled:opacity-40"
                onClick={() => setUnits((prev) => Math.min(maxUnits, prev + 1))}
                disabled={clampedUnits >= maxUnits}
                aria-label="1杯増やす"
              >
                <Plus className="h-5 w-5" strokeWidth={2.5} aria-hidden />
              </button>
            </div>
            <p className="mt-4 text-center text-xs font-medium text-[#94a3b8]">
              使用後の残り：{afterUnits}
              {item.unitLabel}
            </p>
          </div>
        </div>

        <div className="rounded-[1.15rem] bg-[#f0fdfa] px-4 py-4 ring-1 ring-[#99f6e4]/50">
          <p className="text-xs font-extrabold text-[#0f766e]">ご利用の流れ</p>
          <ol className="mt-3 space-y-2.5">
            {FLOW_STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <li key={step.label} className="flex items-center gap-2.5 text-sm font-bold text-[#334155]">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white text-[#14b8a6] shadow-sm">
                    <Icon className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden />
                  </span>
                  <span>
                    <span className="mr-1.5 text-[0.625rem] font-extrabold text-[#94a3b8]">{index + 1}</span>
                    {step.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-30 mx-auto max-w-md px-4 sm:px-5">
        <div className="rounded-[1.15rem] border border-[#e2e8f0] bg-white/95 p-3 shadow-[0_-4px_24px_rgba(15,23,42,0.08)] backdrop-blur-sm">
          <Link
            href={`/consume/step-3?storeId=${storeId}&productId=${productId}&units=${clampedUnits}`}
            className="mb-btn-primary w-full py-3.5 text-base"
          >
            店員提示へ進む
          </Link>
        </div>
      </div>

      <div className="h-24" aria-hidden />
    </>
  );
}
