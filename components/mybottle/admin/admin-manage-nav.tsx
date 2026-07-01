"use client";

import { NavTransitionLink } from "@/components/mybottle/nav-transition-link";
import { usePathname } from "next/navigation";
import { Bell, LayoutDashboard, ScrollText, Store, Users } from "lucide-react";

const LINKS = [
  { href: "/admin", label: "ホーム", Icon: LayoutDashboard, match: (p: string) => p === "/admin" },
  { href: "/admin/logs", label: "ログ", Icon: ScrollText, match: (p: string) => p.startsWith("/admin/logs") },
  { href: "/admin/stores", label: "店舗", Icon: Store, match: (p: string) => p.startsWith("/admin/stores") },
  { href: "/admin/users", label: "ユーザー", Icon: Users, match: (p: string) => p.startsWith("/admin/users") },
  { href: "/admin/news", label: "お知らせ", Icon: Bell, match: (p: string) => p.startsWith("/admin/news") },
] as const;

export function AdminManageNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#78350f] bg-[#92400e] pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-6px_24px_rgba(120,53,15,0.35)]">
      <div className="mx-auto grid w-full max-w-md grid-cols-5 px-0.5">
        {LINKS.map(({ href, label, Icon, match }) => {
          const active = match(pathname);
          return (
            <NavTransitionLink
              key={href}
              href={href}
              className={`relative flex flex-col items-center gap-0.5 py-1.5 text-[9px] font-extrabold ${
                active ? "text-[#fde047]" : "text-white/55"
              }`}
            >
              <Icon className="h-[1.1rem] w-[1.1rem]" strokeWidth={active ? 2.5 : 2} aria-hidden />
              {label}
            </NavTransitionLink>
          );
        })}
      </div>
    </nav>
  );
}

export function AdminManageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#b45309]">管理者ダッシュボード</p>
      <h1 className="text-lg font-extrabold tracking-[-0.02em] text-[#422006]">{title}</h1>
      {subtitle ? <p className="mt-1 text-xs font-medium text-[#78716c]">{subtitle}</p> : null}
    </header>
  );
}
