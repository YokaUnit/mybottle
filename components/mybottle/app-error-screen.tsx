"use client";

import Image from "next/image";
import Link from "next/link";
import {
  getAppErrorConfig,
  TONE_STYLES,
  type AppErrorAction,
  type AppErrorVariant,
} from "@/lib/mybottle/app-errors";

export type AppErrorActionItem = AppErrorAction & {
  onClick?: () => void;
};

type Props = {
  variant: AppErrorVariant;
  storeName?: string;
  productName?: string;
  storeId?: string;
  standalone?: boolean;
  actions?: AppErrorActionItem[];
};

export function AppErrorScreen({
  variant,
  storeName,
  productName,
  storeId,
  standalone = false,
  actions,
}: Props) {
  const config = getAppErrorConfig(variant, { storeName, productName, storeId });
  const tone = TONE_STYLES[config.tone];
  const actionList: AppErrorActionItem[] = actions ?? config.actions;
  const Icon = config.Icon;

  const content = (
    <div className="flex min-h-[min(70vh,32rem)] flex-col items-center justify-center px-2 py-10 text-center">
      <div
        className={`grid h-[4.5rem] w-[4.5rem] place-items-center rounded-[1.25rem] shadow-[0_8px_24px_rgba(15,23,42,0.08)] ring-4 ${tone.iconBg} ${tone.ring}`}
      >
        <Icon className={`h-8 w-8 ${tone.iconText}`} strokeWidth={2.25} aria-hidden />
      </div>

      <p className={`mt-5 text-[10px] font-extrabold uppercase tracking-[0.2em] ${tone.code}`}>
        {config.code}
      </p>
      <h1 className="mt-2 text-xl font-extrabold tracking-[-0.03em] text-[var(--mb-ink)]">{config.title}</h1>
      <p className="mt-3 max-w-[18rem] text-sm font-medium leading-relaxed text-[var(--mb-forest-light)]">
        {config.description}
      </p>

      <div className="mt-8 flex w-full max-w-xs flex-col gap-2.5">
        {actionList.map((action) => {
          const className = action.primary ? "mb-btn-primary py-3.5 text-sm" : "mb-btn-secondary py-3.5 text-sm";
          if (action.onClick) {
            return (
              <button key={action.label} type="button" onClick={action.onClick} className={className}>
                {action.label}
              </button>
            );
          }
          return (
            <Link key={action.href + action.label} href={action.href} className={className}>
              {action.label}
            </Link>
          );
        })}
      </div>
    </div>
  );

  if (standalone) {
    return (
      <div className="relative min-h-dvh">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center pt-[max(0.75rem,env(safe-area-inset-top))]">
          <Image
            src="/images/header_logo.png"
            alt="mybottle"
            width={120}
            height={32}
            className="h-8 w-auto opacity-90"
            priority
          />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-md px-4 pt-14">{content}</div>
      </div>
    );
  }

  return <div className="pb-8 pt-2">{content}</div>;
}
