"use client";

import Link from "next/link";
import { useState } from "react";
import { Gift, Sparkles, Trophy } from "lucide-react";
import type { BenefitNewsItem } from "@/lib/supabase/mybottle";
import { useStock } from "@/components/mybottle/stock-provider";

type Tab = "coupon" | "benefit";

type Props = {
  initialNews: BenefitNewsItem[];
};

export function BenefitsPageClient({ initialNews }: Props) {
  const { stock } = useStock();
  const [tab, setTab] = useState<Tab>("coupon");
  const rankProgress = Math.min(100, stock.length * 25 + 15);

  return (
    <main className="pb-4 pt-2">
      <h1 className="mb-screen-title">特典・クーポン</h1>

      <div className="mt-5 flex gap-1 rounded-full bg-[var(--mb-muted)] p-1 ring-1 ring-[var(--mb-ring)]">
        {(
          [
            { id: "coupon" as const, label: "クーポン", Icon: Gift },
            { id: "benefit" as const, label: "特典", Icon: Sparkles },
          ] as const
        ).map((t) => {
          const Icon = t.Icon;
          const on = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-3 text-xs font-extrabold transition active:scale-[0.98] ${
                on
                  ? "bg-[var(--mb-teal)] text-white shadow-[0_3px_10px_rgba(13,148,136,0.35)]"
                  : "text-[var(--mb-forest-light)]"
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} aria-hidden />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5 space-y-4">
        {tab === "coupon" ? (
          <>
            <article className="mb-pop-card mb-pop-card--yellow overflow-hidden rounded-[1.25rem] p-5 shadow-[0_8px_24px_rgba(234,179,8,0.25)]">
              <p className="text-[0.6875rem] font-extrabold uppercase tracking-[0.12em] text-[#92400e]/75">
                加盟店クーポン
              </p>
              <p className="mt-2 text-[1.5rem] font-extrabold text-[#713f12]">1杯無料券</p>
              <p className="mt-2 text-sm font-bold text-[#78350f]/90">
                対象店舗で提示すると1杯無料（デモ）
              </p>
              <p className="mt-3 text-xs font-bold text-[#a16207]">有効期限: 2026/09/30</p>
              <button
                type="button"
                className="mt-4 w-full rounded-full bg-[#713f12] py-3.5 text-sm font-extrabold text-[var(--mb-yellow-bright)] transition active:opacity-90"
              >
                クーポンを使う
              </button>
            </article>

            {stock.length > 0 ? (
              <article className="mb-surface border-2 border-[var(--mb-pink)]/30 bg-[var(--mb-pink)]/8 p-5">
                <p className="text-sm font-extrabold text-[var(--mb-ink)]">有効期限が近づいています</p>
                <p className="mt-1.5 text-sm font-medium text-[var(--mb-forest-light)]">
                  ボトルの残量を確認し、早めにご来店ください。
                </p>
                <Link href="/bottles" className="mb-btn-primary mt-4 inline-flex px-5 py-2.5 text-sm">
                  ボトルを確認
                </Link>
              </article>
            ) : null}
          </>
        ) : (
          <>
            <article className="mb-pop-card mb-pop-card--teal rounded-[1.25rem] p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20">
                  <Trophy className="h-6 w-6 text-white" strokeWidth={2.25} aria-hidden />
                </div>
                <div>
                  <p className="text-[0.6875rem] font-extrabold uppercase tracking-[0.12em] text-white/75">
                    会員ランク
                  </p>
                  <p className="text-xl font-extrabold text-white">ブロンズランク</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs font-bold text-white/85">
                  <span>次のランクまで</span>
                  <span>{rankProgress}%</span>
                </div>
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/25">
                  <div
                    className="h-full rounded-full bg-[var(--mb-yellow)] transition-all"
                    style={{ width: `${rankProgress}%` }}
                  />
                </div>
              </div>
            </article>

            {initialNews.length === 0 ? (
              <article className="mb-surface p-5">
                <p className="text-sm font-bold text-[var(--mb-forest-light)]">お知らせはまだありません。</p>
              </article>
            ) : (
              initialNews.map((item) => (
                <article key={item.id} className="mb-surface p-5">
                  {item.badgeLabel ? (
                    <span className="inline-flex rounded-full bg-[var(--mb-pink)]/15 px-2.5 py-0.5 text-xs font-extrabold text-[var(--mb-pink-dark)]">
                      {item.badgeLabel}
                    </span>
                  ) : null}
                  <p className="mt-2 font-extrabold text-[var(--mb-ink)]">{item.title}</p>
                  <p className="mt-1.5 text-sm font-medium leading-relaxed text-[var(--mb-forest-light)]">
                    {item.body}
                  </p>
                </article>
              ))
            )}
          </>
        )}
      </div>
    </main>
  );
}
