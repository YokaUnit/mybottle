"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const MENU_LINKS = [
  { href: "#top", label: "トップ" },
  { href: "#value", label: "杯数キープ" },
  { href: "#dashboard", label: "加盟店向け" },
  { href: "#pricing", label: "料金" },
  { href: "#faq", label: "よくある質問" },
  { href: "/login", label: "加盟店ログイン" },
  { href: "/legal/contact", label: "お問い合わせ" },
] as const;

export function StoreLpHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-[var(--mb-ring)] bg-white/78 backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-md items-center justify-between px-4">
          <Link href="/staff" className="flex min-w-0 shrink-0 items-center gap-2" onClick={() => setOpen(false)}>
            <div className="relative h-9 w-9 shrink-0">
              <Image
                src="/images/header_logo.png"
                alt="mybottle ロゴ"
                fill
                priority
                unoptimized
                sizes="36px"
                className="object-contain"
              />
            </div>
            <span className="text-[1.3rem] font-bold tracking-[-0.02em] text-[#334155]">
              mybottle
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-1">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-full px-3 py-2 text-sm font-extrabold text-[#0d9488] transition active:bg-[#f0fdfa]"
            >
              ログイン
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-full text-[#64748b] transition active:bg-[#f1f5f9]"
              aria-label={open ? "メニューを閉じる" : "メニューを開く"}
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" strokeWidth={2.25} /> : <Menu className="h-5 w-5" strokeWidth={2.25} />}
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-30 bg-black/20 backdrop-blur-[2px]" onClick={() => setOpen(false)} aria-hidden />
      ) : null}

      <nav
        className={`fixed inset-x-0 top-14 z-40 mx-auto w-full max-w-md border-b border-[var(--mb-ring)] bg-white/95 px-4 py-3 shadow-lg backdrop-blur-xl transition-all duration-200 ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
        }`}
        aria-hidden={!open}
      >
        <ul className="space-y-0.5">
          {MENU_LINKS.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-2.5 text-sm font-bold text-[#334155] transition active:bg-[#f8fafc]"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
