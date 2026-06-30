"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, Gift, Megaphone } from "lucide-react";
import { markNotificationsSeenAction } from "@/app/(main)/actions/notification-actions";
import type { AppNotification } from "@/lib/notifications";

function formatWhen(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / 3600000);
  if (diffHours < 1) return "たった今";
  if (diffHours < 24) return `${diffHours}時間前`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}日前`;
  return date.toLocaleDateString("ja-JP", { month: "short", day: "numeric" });
}

function NotificationIcon({ type }: { type: AppNotification["type"] }) {
  if (type === "gift_received") {
    return <Gift className="h-4 w-4 text-[#f472b6]" strokeWidth={2.25} aria-hidden />;
  }
  return <Megaphone className="h-4 w-4 text-[#14b8a6]" strokeWidth={2.25} aria-hidden />;
}

type Props = {
  initialItems: AppNotification[];
};

export function NotificationsPageClient({ initialItems }: Props) {
  const router = useRouter();

  useEffect(() => {
    void markNotificationsSeenAction().then(() => router.refresh());
  }, [router]);

  return (
    <main className="pb-4 pt-2">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#ecfdf5] text-[#14b8a6]">
          <Bell className="h-4 w-4" strokeWidth={2.25} aria-hidden />
        </span>
        <div>
          <h1 className="mb-screen-title !mb-0">お知らせ</h1>
          <p className="text-[11px] font-medium text-[#94a3b8]">運営からの告知とギフトの受取</p>
        </div>
      </div>

      {initialItems.length === 0 ? (
        <div className="mb-surface flex min-h-[min(40vh,16rem)] flex-col items-center justify-center px-6 py-12 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-[#f1f5f9] text-[#94a3b8]">
            <Bell className="h-6 w-6" strokeWidth={2} aria-hidden />
          </span>
          <p className="mt-5 text-base font-extrabold text-[var(--mb-ink)]">お知らせはありません</p>
          <p className="mt-2 max-w-[15rem] text-xs font-medium leading-relaxed text-[var(--mb-forest-light)]">
            新しいお知らせや友だちからのギフトが届くと、ここに表示されます
          </p>
          <Link href="/benefits" className="mb-btn-secondary mt-7 px-6 py-3 text-sm">
            特典・クーポンを見る
          </Link>
        </div>
      ) : (
        <ul className="space-y-2">
          {initialItems.map((item) => {
            const inner = (
              <>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#f8fafc] ring-1 ring-[#e2e8f0]">
                    <NotificationIcon type={item.type} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {item.badgeLabel ? (
                        <span className="inline-flex rounded-full bg-[#ecfdf8] px-2 py-0.5 text-[0.625rem] font-extrabold text-[#0d9488] ring-1 ring-[#99f6e4]/40">
                          {item.badgeLabel}
                        </span>
                      ) : null}
                      {item.isUnread ? (
                        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[#ef4444]" aria-label="未読" />
                      ) : null}
                      <span className="text-[10px] font-bold text-[#94a3b8]">{formatWhen(item.createdAt)}</span>
                    </div>
                    <p className="mt-1.5 font-extrabold tracking-[-0.01em] text-[#1e293b]">{item.title}</p>
                    <p className="mt-1 text-sm font-medium leading-relaxed text-[#64748b]">{item.body}</p>
                  </div>
                </div>
              </>
            );

            return (
              <li key={item.id}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className={`mb-surface block p-4 transition active:scale-[0.99] ${
                      item.isUnread ? "ring-1 ring-[#99f6e4]/50" : ""
                    }`}
                  >
                    {inner}
                  </Link>
                ) : (
                  <article
                    className={`mb-surface p-4 ${item.isUnread ? "ring-1 ring-[#99f6e4]/50" : ""}`}
                  >
                    {inner}
                  </article>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
