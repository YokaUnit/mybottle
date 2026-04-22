"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gift, History, Home, MapPinned, UserRound } from "lucide-react";

const links = [
  { href: "/", label: "ホーム", Icon: Home },
  { href: "/history", label: "履歴", Icon: History },
  { href: "/stores", label: "店舗", Icon: MapPinned },
  { href: "/benefits", label: "特典", Icon: Gift },
  { href: "/mypage", label: "マイページ", Icon: UserRound },
] as const;

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--mb-ring)] bg-[var(--mb-card)]/92 pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur-[var(--mb-shell-blur)]">
      <div className="mx-auto flex w-full max-w-md px-2">
        {links.map((link) => {
          const active =
            link.href === "/"
              ? pathname === "/"
              : pathname === link.href || pathname.startsWith(`${link.href}/`);
          const Icon = link.Icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-1.5 text-[10px] font-medium tracking-tight active:opacity-70 ${
                active ? "text-[var(--mb-forest)]" : "text-[var(--mb-forest-light)]/75 hover:text-[var(--mb-ink)]"
              }`}
            >
              <span
                className={`grid h-9 w-9 place-items-center rounded-full ${
                  active ? "bg-[var(--mb-accent)]/28 text-[var(--mb-forest)]" : "text-[var(--mb-forest-light)]"
                }`}
              >
                <Icon className="h-[1.2rem] w-[1.2rem]" strokeWidth={active ? 2.25 : 1.85} aria-hidden />
              </span>
              <span className="max-w-[4.25rem] truncate">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
