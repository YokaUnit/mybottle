"use client";

import { useState } from "react";
import { Gift, LayoutGrid, Newspaper } from "lucide-react";
import { BottleProductImage } from "@/components/mybottle/bottle-product-image";
import { useStock } from "@/components/mybottle/stock-provider";

type Tab = "all" | "news" | "coupon";

const tabs: { id: Tab; label: string; Icon: typeof LayoutGrid }[] = [
  { id: "all", label: "すべて", Icon: LayoutGrid },
  { id: "news", label: "ニュース", Icon: Newspaper },
  { id: "coupon", label: "クーポン", Icon: Gift },
];

export default function BenefitsPage() {
  const { stock } = useStock();
  const [tab, setTab] = useState<Tab>("all");

  const nearExpiry = stock.length > 0;

  return (
    <main className="pb-4 pt-2">
      <h1 className="mb-screen-title">特典・お知らせ</h1>

      <div className="mt-5 flex gap-1 rounded-full border border-[var(--mb-ring)] bg-[var(--mb-muted)] p-1">
        {tabs.map((t) => {
          const Icon = t.Icon;
          const on = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 text-xs font-semibold transition ${
                on
                  ? "bg-[var(--mb-card)] text-[var(--mb-forest)] shadow-sm ring-1 ring-[var(--mb-ring)]"
                  : "text-[var(--mb-forest-light)] hover:text-[var(--mb-ink)]"
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5 space-y-4">
        {(tab === "all" || tab === "coupon") && nearExpiry ? (
          <article className="mb-surface border-[var(--mb-accent-dark)]/35 bg-[var(--mb-accent)]/20 p-5 ring-1 ring-[var(--mb-accent-dark)]/25">
            <p className="text-sm font-semibold text-[var(--mb-ink)]">有効期限が近づいています</p>
            <p className="mt-1.5 text-sm font-medium leading-relaxed text-[var(--mb-forest-light)]">
              ボトルの残量を確認し、早めにご来店ください。
            </p>
            <ul className="mt-4 space-y-2">
              {stock.map((item) => (
                <li
                  key={`${item.storeId}-${item.productId}`}
                  className="flex items-center gap-3 rounded-[0.85rem] border border-[var(--mb-ring)] bg-[var(--mb-card)]/90 p-3"
                >
                  <BottleProductImage
                    productId={item.productId}
                    type={item.type}
                    frameClassName="h-12 w-12 shrink-0"
                    fallbackEmojiClassName="text-lg"
                  />
                  <span className="min-w-0 truncate text-sm font-medium text-[var(--mb-ink)]">
                    {item.productName}
                  </span>
                </li>
              ))}
            </ul>
          </article>
        ) : null}

        {(tab === "all" || tab === "coupon") && (
          <article className="mb-surface border-[var(--mb-forest)]/12 bg-[var(--mb-card)] p-5">
            <p className="mb-label-caps text-[var(--mb-forest)]">加盟店クーポン</p>
            <p className="mt-3 text-lg font-semibold tracking-[-0.02em] text-[var(--mb-forest)]">1杯無料券</p>
            <p className="mt-2 text-xs font-medium leading-relaxed text-[var(--mb-forest-light)]">
              対象店舗で提示すると1杯無料（デモ）
            </p>
          </article>
        )}

        {(tab === "all" || tab === "news") && (
          <article className="mb-surface p-5">
            <p className="text-xs font-semibold text-[var(--mb-accent-dark)]">アプリ更新</p>
            <p className="mt-2 font-semibold tracking-[-0.02em] text-[var(--mb-ink)]">mybottle デザイン刷新</p>
            <p className="mt-1.5 text-sm font-medium leading-relaxed text-[var(--mb-forest-light)]">
              ホーム画面が新しくなりました。
            </p>
          </article>
        )}
      </div>
    </main>
  );
}
