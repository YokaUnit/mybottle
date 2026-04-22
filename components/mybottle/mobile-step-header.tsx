"use client";

import { Check } from "lucide-react";

type Props = {
  title: string;
  step: number;
  total?: number;
};

export function MobileStepHeader({ title, step, total = 4 }: Props) {
  return (
    <header className="mb-surface space-y-4 p-5">
      <p className="mb-label-caps">
        Step {step} / {total}
      </p>
      <h1 className="text-[1.35rem] font-semibold leading-snug tracking-[-0.03em] text-[var(--mb-ink)]">{title}</h1>

      <div className="flex items-center" aria-label={`ステップ ${step} / ${total}`}>
        {Array.from({ length: total }).map((_, index) => {
          const n = index + 1;
          const done = n < step;
          const current = n === step;
          return (
            <div key={index} className="flex min-w-0 flex-1 items-center">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold transition ${
                  done
                    ? "border-[var(--mb-forest)] bg-[var(--mb-forest)] text-white"
                    : current
                      ? "border-[var(--mb-accent-dark)]/50 bg-[var(--mb-accent)]/20 text-[var(--mb-forest)]"
                      : "border-[var(--mb-ring)] bg-[var(--mb-muted)] text-[var(--mb-forest-light)]"
                }`}
              >
                {done ? <Check className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden /> : n}
              </span>
              {index < total - 1 ? (
                <span
                  className={`mx-1.5 h-0.5 min-w-[6px] flex-1 rounded-full ${index + 1 < step ? "bg-[var(--mb-forest)]" : "bg-[var(--mb-muted-strong)]"}`}
                  aria-hidden
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </header>
  );
}
