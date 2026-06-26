"use client";

import Image from "next/image";
import { NavTransitionLink } from "@/components/mybottle/nav-transition-link";
import { usePathname } from "next/navigation";
import { Gift, Home, Search, UserRound } from "lucide-react";

export function AppNav() {
  const pathname = usePathname();

  const sideLinks = [
    {
      href: "/",
      label: "ホーム",
      Icon: Home,
      active: pathname === "/",
      filled: true,
    },
    {
      href: "/stores",
      label: "お店を探す",
      Icon: Search,
      active: pathname === "/stores" || pathname.startsWith("/stores/"),
      filled: false,
    },
    {
      href: "/benefits",
      label: "特典",
      Icon: Gift,
      active: pathname === "/benefits" || pathname.startsWith("/benefits/"),
      filled: false,
    },
    {
      href: "/mypage",
      label: "マイページ",
      Icon: UserRound,
      active: pathname === "/mypage" || pathname.startsWith("/mypage/"),
      filled: false,
    },
  ] as const;

  const useActive = pathname === "/consume" || pathname.startsWith("/consume/");

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--mb-ring)] bg-white/82 pb-[max(0.25rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-2px_16px_rgba(15,23,42,0.04)] backdrop-blur-xl">
      <div className="mx-auto grid w-full max-w-md grid-cols-5 items-end px-1">
        {sideLinks.slice(0, 2).map((link) => {
          const Icon = link.Icon;
          return (
            <NavTransitionLink
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-0.5 py-1 text-[9px] font-extrabold leading-tight ${
                link.active ? "text-[#14b8a6]" : "text-[#94a3b8]"
              }`}
            >
              <Icon
                className="h-[1.15rem] w-[1.15rem]"
                strokeWidth={link.active ? 2.5 : 2}
                fill={link.active && link.filled ? "currentColor" : "none"}
                aria-hidden
              />
              <span className="max-w-[4.25rem] truncate text-center">{link.label}</span>
            </NavTransitionLink>
          );
        })}

        <div className="flex flex-col items-center">
          <NavTransitionLink
            href="/consume"
            className={`-mt-7 flex h-[3.35rem] w-[3.35rem] items-center justify-center rounded-full bg-[#14b8a6] shadow-[0_6px_20px_rgba(20,184,166,0.45)] ring-4 ring-white transition active:scale-95 ${
              useActive ? "ring-[#ccfbf1]" : ""
            }`}
            aria-label="使う"
            aria-current={useActive ? "page" : undefined}
          >
            <div className="relative h-7 w-7">
              <Image
                src="/images/header_logo.png"
                alt=""
                fill
                unoptimized
                sizes="28px"
                className="object-contain brightness-0 invert"
              />
            </div>
          </NavTransitionLink>
          <span
            className={`mt-1 text-[9px] font-extrabold ${useActive ? "text-[#14b8a6]" : "text-[#94a3b8]"}`}
          >
            使う
          </span>
        </div>

        {sideLinks.slice(2).map((link) => {
          const Icon = link.Icon;
          return (
            <NavTransitionLink
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-0.5 py-1 text-[9px] font-extrabold leading-tight ${
                link.active ? "text-[#14b8a6]" : "text-[#94a3b8]"
              }`}
            >
              <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={link.active ? 2.5 : 2} aria-hidden />
              <span className="max-w-[4.25rem] truncate text-center">{link.label}</span>
            </NavTransitionLink>
          );
        })}
      </div>
    </nav>
  );
}
