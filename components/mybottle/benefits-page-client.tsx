"use client";

import Link from "next/link";
import { useState } from "react";
import { Clock, Gift, Sparkles, Trophy } from "lucide-react";
import type { BenefitNewsItem } from "@/lib/supabase/mybottle";
import { BENEFIT_KIND_LABELS, type StoreBenefit } from "@/lib/store-manage/types";
import { useStock } from "@/components/mybottle/stock-provider";

type Tab = "coupon" | "benefit";

type StoreBenefitPublic = StoreBenefit & { storeName: string };

type Props = {
  initialNews: BenefitNewsItem[];
  storeBenefits: StoreBenefitPublic[];
};

const TABS = [
  { id: "coupon" as const, label: "クーポン", Icon: Gift },
  { id: "benefit" as const, label: "特典", Icon: Sparkles },
] as const;

export function BenefitsPageClient({ initialNews, storeBenefits }: Props) {
  const { stock } = useStock();
  const [tab, setTab] = useState<Tab>("coupon");
  const rankProgress = Math.min(100, stock.length * 25 + 15);

  return (
    <main className="pb-4 pt-2">
      <h1 className="mb-screen-title">特典・クーポン</h1>

      <div
        className="mt-5 flex gap-1 rounded-full bg-[#e8ecf0]/90 p-1"
        role="tablist"
        aria-label="特典の種類"
      >
        {TABS.map((t) => {
          const Icon = t.Icon;
          const on = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setTab(t.id)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-3 text-xs font-extrabold transition active:scale-[0.98] ${
                on
                  ? "bg-white text-[#0d9488] shadow-[0_1px_4px_rgba(15,23,42,0.08)]"
                  : "text-[#64748b]"
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} aria-hidden />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5 space-y-3">
        {tab === "coupon" ? (
          <>
            {storeBenefits.length > 0 ? (
              <div className="space-y-2">
                {storeBenefits.map((benefit) => (
                  <article
                    key={benefit.id}
                    className="rounded-[1.25rem] border border-[#e2e8f0] bg-gradient-to-br from-[#fffbeb] via-[#fefce8] to-[#ecfdf8] p-4 shadow-[0_2px_12px_rgba(15,23,42,0.05)]"
                  >
                    <span className="inline-flex rounded-full bg-white/90 px-2.5 py-0.5 text-[0.625rem] font-extrabold text-[#0d9488] ring-1 ring-[#99f6e4]/60">
                      {benefit.storeName}
                    </span>
                    <p className="mt-2 text-[1.125rem] font-extrabold tracking-[-0.02em] text-[#1e293b]">
                      {benefit.title}
                    </p>
                    <p className="mt-1 text-sm font-medium text-[#64748b]">
                      {BENEFIT_KIND_LABELS[benefit.benefitKind]}
                      {benefit.description ? ` · ${benefit.description}` : ""}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <article className="rounded-[1.25rem] border border-[#e2e8f0] bg-gradient-to-br from-[#fffbeb] via-[#fefce8] to-[#ecfdf8] p-5 shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
                <p className="text-[0.6875rem] font-extrabold uppercase tracking-[0.12em] text-[#92400e]/75">
                  加盟店クーポン
                </p>
                <p className="mt-2 text-[1.375rem] font-extrabold text-[#1e293b]">準備中</p>
                <p className="mt-2 text-sm font-medium text-[#64748b]">
                  お店が特典を登録すると、ここに表示されます。
                </p>
              </article>
            )}

            {stock.length > 0 ? (
              <article className="flex gap-3 rounded-[1.25rem] border border-[#fde68a]/50 bg-[#fffbeb] p-4 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white shadow-[0_1px_4px_rgba(15,23,42,0.06)]">
                  <Clock className="h-5 w-5 text-[#d97706]" strokeWidth={2.25} aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-extrabold text-[#1e293b]">有効期限が近づいています</p>
                  <p className="mt-1 text-sm font-medium leading-relaxed text-[#64748b]">
                    ボトルの残量を確認し、早めにご来店ください。
                  </p>
                  <Link
                    href="/bottles"
                    className="mt-3 inline-flex items-center rounded-full bg-[#1e293b] px-4 py-2 text-xs font-extrabold text-white transition active:opacity-90"
                  >
                    ボトルを確認
                  </Link>
                </div>
              </article>
            ) : null}
          </>
        ) : (
          <>
            <article className="overflow-hidden rounded-[1.25rem] border border-[#e2e8f0] bg-white shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
              <div className="bg-gradient-to-br from-[#faf8f5] via-[#f5efe8] to-[#efe8df] px-5 pb-4 pt-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white shadow-[0_2px_8px_rgba(180,83,9,0.12)] ring-1 ring-[#fde68a]/50">
                    <Trophy className="h-6 w-6 text-[#b45309]" strokeWidth={2.25} aria-hidden />
                  </div>
                  <div>
                    <p className="text-[0.625rem] font-extrabold tracking-[0.08em] text-[#92400e]/70">
                      会員ランク
                    </p>
                    <p className="text-xl font-extrabold tracking-[-0.02em] text-[#1e293b]">ブロンズランク</p>
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5 pt-4">
                <div className="flex justify-between text-xs font-bold text-[#64748b]">
                  <span>次のランクまで</span>
                  <span className="text-[#0d9488]">{rankProgress}%</span>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#e8ecf0]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#2dd4bf] via-[#14b8a6] to-[#0d9488] transition-all"
                    style={{ width: `${rankProgress}%` }}
                  />
                </div>
                <p className="mt-3 text-xs font-medium leading-relaxed text-[#94a3b8]">
                  来店やボトル購入でランクアップに近づきます。
                </p>
              </div>
            </article>

            {initialNews.length === 0 ? (
              <article className="mb-surface px-5 py-10 text-center">
                <p className="text-sm font-bold text-[#64748b]">お知らせはまだありません。</p>
              </article>
            ) : (
              initialNews.map((item) => (
                <article key={item.id} className="mb-surface p-5">
                  {item.badgeLabel ? (
                    <span className="inline-flex rounded-full bg-[#ecfdf8] px-2.5 py-0.5 text-[0.6875rem] font-extrabold text-[#0d9488] ring-1 ring-[#99f6e4]/40">
                      {item.badgeLabel}
                    </span>
                  ) : null}
                  <p className="mt-2 font-extrabold tracking-[-0.01em] text-[#1e293b]">{item.title}</p>
                  <p className="mt-1.5 text-sm font-medium leading-relaxed text-[#64748b]">{item.body}</p>
                </article>
              ))
            )}
          </>
        )}
      </div>
    </main>
  );
}
