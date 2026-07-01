import Link from "next/link";
import { ChevronRight, FileText, Scale, Shield, Cookie, Mail, Building2, UserX } from "lucide-react";
import { LEGAL_NAV_ITEMS } from "@/lib/legal/documents";

const ICONS = {
  "/legal/terms": FileText,
  "/legal/privacy": Shield,
  "/legal/tokushoho": Scale,
  "/legal/cookies": Cookie,
  "/legal/contact": Mail,
  "/legal/company": Building2,
  "/legal/delete-account": UserX,
} as const;

type Props = {
  variant?: "menu" | "compact";
  showDeleteAccount?: boolean;
  backQuery?: string;
};

export function LegalLinksSection({ variant = "menu", showDeleteAccount = true, backQuery }: Props) {
  const items = showDeleteAccount
    ? LEGAL_NAV_ITEMS
    : LEGAL_NAV_ITEMS.filter((item) => item.href !== "/legal/delete-account");

  const hrefFor = (path: string) => (backQuery ? `${path}?${backQuery}` : path);

  if (variant === "compact") {
    return (
      <nav className="flex flex-wrap justify-center gap-x-2.5 gap-y-1 text-[10px] font-bold text-[#64748b]">
        {items.map((item) => (
          <Link key={item.href} href={hrefFor(item.href)} className="hover:text-[#0d9488]">
            {item.label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <section className="mb-surface overflow-hidden" aria-label="法律・サポート">
      <div className="border-b border-[var(--mb-muted-strong)] px-5 py-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--mb-forest-light)]">
          法律・サポート
        </p>
      </div>
      <ul>
        {items.map((item) => {
          const Icon = ICONS[item.href as keyof typeof ICONS] ?? FileText;
          const isDestructive = item.href === "/legal/delete-account";
          return (
            <li key={item.href}>
              <Link
                href={hrefFor(item.href)}
                className={`flex items-center justify-between border-b border-[var(--mb-muted-strong)] px-5 py-3.5 transition last:border-b-0 active:bg-[var(--mb-muted)]/50 ${
                  isDestructive ? "text-[#e11d48]" : "text-[var(--mb-ink)]"
                }`}
              >
                <span className="flex items-center gap-3 text-sm font-extrabold">
                  <span
                    className={`grid h-8 w-8 place-items-center rounded-lg ${
                      isDestructive
                        ? "bg-[#fff1f2] text-[#e11d48]"
                        : "bg-[var(--mb-teal)]/10 text-[var(--mb-teal-dark)]"
                    }`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={2.25} aria-hidden />
                  </span>
                  {item.label}
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 opacity-40" strokeWidth={2.5} aria-hidden />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
