import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getLegalCompanyInfo } from "@/lib/legal/company";
import type { LegalDocument } from "@/lib/legal/documents";

type Props = {
  document: LegalDocument;
  backHref?: string;
  backLabel?: string;
  children?: React.ReactNode;
};

export function LegalDocumentPage({ document, backHref = "/login", backLabel = "戻る", children }: Props) {
  const company = getLegalCompanyInfo();

  return (
    <div className="relative min-h-dvh bg-[var(--mb-bg)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#ecfdf5]/80 to-transparent" aria-hidden />

      <div className="relative mx-auto w-full max-w-md px-4 pb-10 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="flex items-center justify-between gap-3 py-3">
          <Link
            href={backHref}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[var(--mb-ink)] shadow-sm ring-1 ring-[var(--mb-muted-strong)]"
            aria-label={backLabel}
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <Image
            src="/images/header_logo.png"
            alt="mybottle"
            width={100}
            height={28}
            className="h-7 w-auto opacity-90"
          />
          <span className="w-9" aria-hidden />
        </div>

        <header className="mb-surface mt-2 p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--mb-teal-dark)]">Legal</p>
          <h1 className="mt-1 text-[1.25rem] font-extrabold tracking-[-0.03em] text-[var(--mb-ink)]">
            {document.title}
          </h1>
          <p className="mt-2 text-sm font-medium leading-relaxed text-[var(--mb-forest-light)]">
            {document.description}
          </p>
          <p className="mt-3 text-xs font-bold text-[var(--mb-forest-light)]">最終更新日: {company.lastUpdated}</p>
        </header>

        {document.sections.length > 0 ? (
          <section className="mb-surface mt-4 space-y-5 p-5 text-sm font-medium leading-relaxed text-[var(--mb-forest-light)]">
            {document.sections.map((section) => (
              <article key={section.title} className="space-y-2">
                <h2 className="text-sm font-extrabold text-[var(--mb-ink)]">{section.title}</h2>
                {section.body.map((line) => (
                  <p key={line}>{line}</p>
                ))}
                {section.list ? (
                  <ul className="list-disc space-y-1.5 pl-5">
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </section>
        ) : null}

        {children}

        <LegalFooterLinks />
      </div>
    </div>
  );
}

export function TokushohoTable({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <section className="mb-surface mt-4 overflow-hidden">
      <dl>
        {rows.map((row, index) => (
          <div
            key={row.label}
            className={`grid gap-1 px-5 py-4 ${index > 0 ? "border-t border-[var(--mb-muted-strong)]" : ""}`}
          >
            <dt className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[var(--mb-teal-dark)]">
              {row.label}
            </dt>
            <dd className="whitespace-pre-wrap text-sm font-medium leading-relaxed text-[var(--mb-forest-light)]">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function LegalFooterLinks() {
  const company = getLegalCompanyInfo();

  return (
    <footer className="mt-6 space-y-3 pb-4 text-center">
      <nav className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[11px] font-bold text-[var(--mb-teal-dark)]">
        <Link href="/legal/terms">利用規約</Link>
        <Link href="/legal/privacy">プライバシー</Link>
        <Link href="/legal/tokushoho">特商法</Link>
        <Link href="/legal/cookies">Cookie</Link>
        <Link href="/legal/contact">お問い合わせ</Link>
      </nav>
      <p className="text-[10px] font-medium text-[var(--mb-forest-light)]">
        © {new Date().getFullYear()} {company.operatorName}
      </p>
    </footer>
  );
}
