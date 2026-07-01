import Link from "next/link";
import { Mail, MessageCircleQuestion } from "lucide-react";
import { LegalDocumentPage } from "@/components/mybottle/legal/legal-document-page";
import { getLegalCompanyInfo, legalContactMailto } from "@/lib/legal/company";

import { resolveLegalBackHref } from "@/lib/legal/navigation";

export const metadata = { title: "お問い合わせ" };

const FAQ = [
  {
    q: "ログインできない",
    a: "Googleアカウントでログインしてください。ブラウザのCookieを有効にし、プライベートモード以外でお試しください。",
  },
  {
    q: "購入したボトルが反映されない",
    a: "店員による購入確認（PIN入力等）が完了しているかご確認ください。解決しない場合は店舗名・日時を添えてご連絡ください。",
  },
  {
    q: "退会したい",
    a: "退会ページから手続きできます。店舗でのボトルキープ実物は店舗の記録に残る場合があります。",
  },
  {
    q: "個人情報の開示・削除",
    a: "プライバシーポリシーに基づき対応します。本人確認のうえ、合理的な期間内にご返答します。",
  },
] as const;

type Props = { searchParams: Promise<{ back?: string }> };

export default async function LegalContactPage({ searchParams }: Props) {
  const params = await searchParams;
  const company = getLegalCompanyInfo();

  return (
    <LegalDocumentPage
      document={{
        title: "お問い合わせ",
        description: "ご不明点・不具合・個人情報に関するご請求はこちらからお問い合わせください。",
        sections: [],
      }}
      backHref={resolveLegalBackHref(params.back)}
    >
      <section className="mb-surface mt-4 space-y-4 p-5">
        <p className="text-sm font-medium leading-relaxed text-[var(--mb-forest-light)]">
          通常 {company.businessHours} に順次対応いたします。お急ぎの店舗での提供・精算については、各店舗へ直接お問い合わせください。
        </p>

        <a
          href={legalContactMailto("mybottleのお問い合わせ")}
          className="mb-btn-primary flex w-full items-center justify-center gap-2 py-3.5 text-sm"
        >
          <Mail className="h-4 w-4" strokeWidth={2.25} aria-hidden />
          メールで問い合わせる
        </a>

        <p className="text-center text-xs font-medium text-[var(--mb-forest-light)]">{company.email}</p>
      </section>

      <section className="mb-surface mt-4 p-5">
        <h2 className="flex items-center gap-2 text-sm font-extrabold text-[var(--mb-ink)]">
          <MessageCircleQuestion className="h-4 w-4 text-[var(--mb-teal-dark)]" strokeWidth={2.25} />
          よくあるご質問
        </h2>
        <ul className="mt-4 space-y-3">
          {FAQ.map((item) => (
            <li key={item.q} className="rounded-xl bg-[var(--mb-muted)]/50 p-3.5">
              <p className="text-sm font-extrabold text-[var(--mb-ink)]">Q. {item.q}</p>
              <p className="mt-1.5 text-xs font-medium leading-relaxed text-[var(--mb-forest-light)]">
                A. {item.a}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-center text-xs font-medium text-[var(--mb-forest-light)]">
          退会は
          <Link href="/legal/delete-account" className="font-extrabold text-[var(--mb-teal-dark)]">
            退会ページ
          </Link>
          から手続きできます
        </p>
      </section>
    </LegalDocumentPage>
  );
}
