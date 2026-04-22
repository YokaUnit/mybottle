import Link from "next/link";
import { ChevronLeft, Mail } from "lucide-react";

export default function MyPageHelpPage() {
  return (
    <main className="space-y-4 pb-4 pt-2">
      <header className="mb-surface flex items-center gap-3 p-5">
        <Link
          href="/mypage"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--mb-muted)] text-[var(--mb-ink)]"
          aria-label="マイページへ戻る"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-[1.2rem] font-semibold tracking-[-0.02em] text-[var(--mb-ink)]">お問い合わせ</h1>
      </header>

      <section className="mb-surface space-y-4 p-5">
        <p className="text-sm font-medium leading-relaxed text-[var(--mb-forest-light)]">
          ご不明点・不具合報告・機能要望は、以下のメールアドレスにご連絡ください。
        </p>
        <a
          href="mailto:support@mybottle.app?subject=mybottle%E3%81%AE%E3%81%8A%E5%95%8F%E3%81%84%E5%90%88%E3%82%8F%E3%81%9B"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--mb-forest)] px-4 py-3 text-sm font-semibold text-white"
        >
          <Mail className="h-4 w-4" />
          メールで問い合わせる
        </a>
      </section>
    </main>
  );
}
