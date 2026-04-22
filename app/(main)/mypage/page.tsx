import Link from "next/link";
import { ChevronRight, UserRound } from "lucide-react";
import { LogoutButton } from "@/components/mybottle/logout-button";

export default function MyPage() {
  return (
    <main className="space-y-5 pb-4 pt-2">
      <h1 className="mb-screen-title">マイページ</h1>

      <section className="mb-surface flex items-center gap-4 p-5">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-[var(--mb-muted)] text-[var(--mb-forest)] ring-1 ring-[var(--mb-ring)]">
          <UserRound className="h-8 w-8" strokeWidth={1.75} aria-hidden />
        </div>
        <div>
          <p className="text-lg font-semibold tracking-[-0.02em] text-[var(--mb-ink)]">ゲスト</p>
          <p className="text-sm font-medium text-[var(--mb-forest-light)]">090-0000-0000</p>
        </div>
      </section>

      <nav className="mb-surface overflow-hidden">
        {[
          { href: "#", label: "プロフィール編集" },
          { href: "#", label: "通知設定" },
          { href: "#", label: "パスコード設定" },
          { href: "#", label: "ヘルプ・お問い合わせ" },
        ].map((row) => (
          <Link
            key={row.label}
            href={row.href}
            className="flex items-center justify-between border-b border-[var(--mb-muted-strong)] px-5 py-4 text-sm font-medium text-[var(--mb-ink)] last:border-0"
          >
            {row.label}
            <ChevronRight className="h-4 w-4 shrink-0 text-[var(--mb-forest-light)]" strokeWidth={2} aria-hidden />
          </Link>
        ))}
        <LogoutButton />
      </nav>

      <Link
        href="/dashboard"
        className="block text-center text-xs font-medium text-[var(--mb-forest-light)]"
      >
        店舗向けダッシュボード（運営）
      </Link>
    </main>
  );
}
