"use client";

import Link from "next/link";
import { Check, ChevronLeft } from "lucide-react";

type Props = {
  title: string;
  subtitle?: string;
  step: number;
  total?: number;
  backHref?: string;
  backLabel?: string;
};

export function ConsumeFlowHeader({
  title,
  subtitle,
  step,
  total = 3,
  backHref = "/",
  backLabel = "戻る",
}: Props) {
  const progress = Math.round((step / total) * 100);

  return (
    <header className="space-y-4">
      <div className="flex items-center gap-2">
        <Link
          href={backHref}
          className="inline-flex items-center gap-0.5 rounded-full py-1 pr-2 text-[0.8125rem] font-bold text-[#64748b] transition active:opacity-70"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2.5} aria-hidden />
          {backLabel}
        </Link>
      </div>

      <div className="space-y-1.5">
        <p className="text-[0.6875rem] font-extrabold uppercase tracking-[0.12em] text-[#14b8a6]">
          使う · ステップ {step}/{total}
        </p>
        <h1 className="text-[1.35rem] font-extrabold leading-snug tracking-[-0.03em] text-[#1e293b]">{title}</h1>
        {subtitle ? <p className="text-sm font-medium leading-relaxed text-[#64748b]">{subtitle}</p> : null}
      </div>

      <div className="space-y-2" aria-label={`進捗 ${step} / ${total}`}>
        <div className="h-1.5 overflow-hidden rounded-full bg-[#e2e8f0]">
          <div
            className="h-full rounded-full bg-[#14b8a6] transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between gap-2">
          {Array.from({ length: total }).map((_, index) => {
            const n = index + 1;
            const done = n < step;
            const current = n === step;
            return (
              <div key={n} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-[0.625rem] font-extrabold ${
                    done
                      ? "bg-[#14b8a6] text-white"
                      : current
                        ? "bg-[#ccfbf1] text-[#0f766e] ring-2 ring-[#14b8a6]"
                        : "bg-[#f1f5f9] text-[#94a3b8]"
                  }`}
                >
                  {done ? <Check className="h-3.5 w-3.5" strokeWidth={2.75} aria-hidden /> : n}
                </span>
                <span
                  className={`max-w-full truncate text-[0.5625rem] font-bold ${
                    current ? "text-[#0f766e]" : "text-[#94a3b8]"
                  }`}
                >
                  {n === 1 ? "選択" : n === 2 ? "杯数" : "提示"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
}
