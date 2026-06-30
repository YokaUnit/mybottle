"use client";

import Link from "next/link";
import { NavTransitionLink } from "@/components/mybottle/nav-transition-link";
import { usePathname, useSearchParams } from "next/navigation";
import { Gift, History, LayoutDashboard, Settings, Wine } from "lucide-react";

const LINKS = [
  { href: "/dashboard", label: "ホーム", Icon: LayoutDashboard, match: (p: string) => p === "/dashboard" },
  { href: "/dashboard/bottles", label: "ボトル", Icon: Wine, match: (p: string) => p.startsWith("/dashboard/bottles") },
  { href: "/dashboard/history", label: "履歴", Icon: History, match: (p: string) => p.startsWith("/dashboard/history") },
  { href: "/dashboard/benefits", label: "特典", Icon: Gift, match: (p: string) => p.startsWith("/dashboard/benefits") },
  { href: "/dashboard/settings", label: "設定", Icon: Settings, match: (p: string) => p.startsWith("/dashboard/settings") },
] as const;

export function StoreManageNav() {
  const pathname = usePathname();
  const search = useSearchParams();
  const storeId = search.get("storeId") ?? "";
  const q = storeId ? `?storeId=${storeId}` : "";

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#083b36] bg-[#0a403b] pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-6px_24px_rgba(8,59,54,0.35)]">
      <div className="mx-auto grid w-full max-w-md grid-cols-5 px-1">
        {LINKS.map(({ href, label, Icon, match }) => {
          const active = match(pathname);
          return (
            <NavTransitionLink
              key={href}
              href={`${href}${q}`}
              className={`flex flex-col items-center gap-0.5 py-1.5 text-[9px] font-extrabold ${
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

export function StoreManageHeader({
  stores,
  storeId,
  title,
}: {
  stores: { id: string; name: string }[];
  storeId: string;
  title: string;
}) {
  const pathname = usePathname();

  return (
    <header className="mb-4 space-y-3">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#0f766e]">店舗ダッシュボード</p>
        <h1 className="text-lg font-extrabold tracking-[-0.02em] text-[#0f2f2c]">{title}</h1>
      </div>
      {stores.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-0.5">
          {stores.map((store) => {
            const active = store.id === storeId;
            return (
              <Link
                key={store.id}
                href={`${pathname}?storeId=${store.id}`}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-extrabold transition ${
                  active ? "bg-[#0d9488] text-white" : "bg-white text-[#64748b] ring-1 ring-[#cbd5e1]"
                }`}
              >
                {store.name}
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="text-sm font-bold text-[#475569]">{stores[0]?.name}</p>
      )}
    </header>
  );
}
