"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  ChevronRight,
  Crown,
  Plus,
  ShoppingBag,
  Star,
  TrendingUp,
} from "lucide-react";
import { HomeBottlesSection } from "@/components/mybottle/home-bottles-section";
import { RecCoinsArt, RecCouponArt, RecGiftArt } from "@/components/mybottle/home-rec-art";
import { useStock } from "@/components/mybottle/stock-provider";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const RECOMMENDATIONS = [
  {
    href: "/benefits",
    tag: "まずは乾杯！",
    tagColor: "text-[#14b8a6]",
    subtitle: "ドリンク1杯",
    title: "無料クーポン",
    titleColor: "text-[#14b8a6]",
    bg: "bg-gradient-to-br from-[#ecfdf8] via-[#e4f9f3] to-[#d8f5ec]",
    sparkle: "text-[#fbbf24]",
    Art: RecCouponArt,
  },
  {
    href: "/benefits",
    tag: "貯めてお得！",
    tagColor: "text-[#7c5cfc]",
    subtitle: "来店でポイント",
    title: "GET",
    titleColor: "text-[#7c5cfc]",
    bg: "bg-gradient-to-br from-[#f5f2ff] via-[#ede9fe] to-[#e8e2ff]",
    sparkle: "text-[#c4b5fd]",
    Art: RecCoinsArt,
  },
  {
    href: "/benefits",
    tag: "プレゼントも！",
    tagColor: "text-[#f43f8e]",
    subtitle: "ボトルを贈ると",
    title: "特典GET",
    titleColor: "text-[#f43f8e]",
    bg: "bg-gradient-to-br from-[#fff1f5] via-[#ffe8f0] to-[#ffdce8]",
    sparkle: "text-[#fda4af]",
    Art: RecGiftArt,
  },
] as const;

function NameScribble() {
  return (
    <svg
      className="pointer-events-none absolute -bottom-1 left-0 h-2 w-[92%]"
      viewBox="0 0 200 10"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M2 7C30 3 55 8 82 5C108 2 132 8 158 4C174 2 188 6 198 5"
        stroke="#FACC15"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function visitsThisMonth(logs: { action: string; createdAt: string }[]) {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  return logs.filter((log) => {
    if (log.action !== "consume" && log.action !== "gift") return false;
    const d = new Date(log.createdAt);
    return d.getFullYear() === y && d.getMonth() === m;
  }).length;
}

export function HomeDashboard() {
  const { stock, totalUnits, logs } = useStock();
  const [displayName, setDisplayName] = useState("ゲスト");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const bottleCount = stock.length;

  const monthVisits = useMemo(() => visitsThisMonth(logs), [logs]);
  const points = useMemo(
    () => monthVisits * 20 + bottleCount * 50 + totalUnits * 2,
    [monthVisits, bottleCount, totalUnits],
  );

  useEffect(() => {
    let active = true;
    async function loadProfile() {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || !active) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      if (!active) return;
      const name =
        profile?.display_name ??
        user.user_metadata?.name ??
        user.user_metadata?.full_name ??
        user.email?.split("@")[0] ??
        "ユーザー";
      setDisplayName(name);
      setAvatarUrl(profile?.avatar_url ?? null);
    }

    loadProfile();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6 pb-2 pt-0.5">
      <div className="space-y-2.5">
        <p className="text-[0.9375rem] font-extrabold text-[#334155]">
          やっほー！ <span aria-hidden>👋</span>
        </p>
        <Link href="/mypage" className="flex items-center gap-2.5 transition active:opacity-80">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt=""
              className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-white"
            />
          ) : (
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#c4a882] text-sm font-extrabold text-white">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="relative inline-block pb-1">
            <p className="text-[1.3rem] font-extrabold leading-tight tracking-[-0.02em] text-[#1e293b]">
              {displayName}さん
            </p>
            <NameScribble />
          </div>
          <ChevronRight className="ml-auto h-5 w-5 shrink-0 text-[#cbd5e1]" strokeWidth={2.5} aria-hidden />
        </Link>
      </div>

      <section aria-label="マイボトル概要" className="mb-home-hero">
        <div className="mb-home-hero__surface">
          <Image
            src="/images/herocard.png"
            alt=""
            fill
            priority
            unoptimized
            sizes="(max-width: 448px) 100vw, 408px"
            className="mb-home-hero__image"
            draggable={false}
          />
          <div className="mb-home-hero__scrim" aria-hidden />
          <div className="mb-home-hero__content">
            <span className="mb-home-hero__label">マイボトル</span>
            <p className="mb-home-hero__caption">登録ボトル</p>
            <div className="mb-home-hero__metric" aria-label={`登録ボトル ${bottleCount} 本`}>
              <span className="mb-home-hero__number tabular-nums">{bottleCount}</span>
              <span className="mb-home-hero__unit">本</span>
            </div>
            <p className="mb-home-hero__remaining">
              残り <span className="tabular-nums">{totalUnits}</span> 杯
            </p>
          </div>
        </div>
      </section>

      <section id="home-bottles" className="scroll-mt-20">
        <HomeBottlesSection />
      </section>

      <section aria-label="クイックアクション" className="grid grid-cols-2 gap-2.5">
        <Link
          href="/add-bottle"
          className="flex items-center justify-center gap-1.5 rounded-full bg-[#14b8a6] py-3.5 text-[0.8125rem] font-extrabold text-white shadow-[0_4px_14px_rgba(20,184,166,0.35)] transition active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" strokeWidth={2.75} aria-hidden />
          ボトルを追加
        </Link>
        <Link
          href="/products/step-1"
          className="flex items-center justify-center gap-1.5 rounded-full border-2 border-[#14b8a6] bg-white py-3.5 text-[0.8125rem] font-extrabold text-[#0d9488] shadow-sm transition active:scale-[0.98]"
        >
          <ShoppingBag className="h-4 w-4" strokeWidth={2.5} aria-hidden />
          購入する
        </Link>
      </section>

      <section aria-labelledby="home-recommend-heading">
        <div className="flex items-center justify-between gap-3">
          <h2 id="home-recommend-heading" className="text-[0.9375rem] font-extrabold text-[#1e293b]">
            おトクな特典
          </h2>
          <Link
            href="/benefits"
            className="flex shrink-0 items-center gap-0.5 text-[0.75rem] font-bold text-[#94a3b8] transition active:opacity-70"
          >
            すべて見る
            <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
          </Link>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {RECOMMENDATIONS.map((item) => {
            const Art = item.Art;
            return (
              <Link
                key={item.tag}
                href={item.href}
                className={`relative flex min-w-0 flex-col overflow-hidden rounded-[1.1rem] ${item.bg} p-2.5 shadow-[0_2px_12px_rgba(15,23,42,0.06)] ring-1 ring-white/90 transition active:scale-[0.97]`}
              >
                <span
                  className={`pointer-events-none absolute right-1.5 top-1.5 text-[0.5rem] leading-none ${item.sparkle}`}
                  aria-hidden
                >
                  ✦
                </span>

                <span
                  className={`inline-flex w-fit max-w-full truncate rounded-full bg-white px-1.5 py-0.5 text-[0.5625rem] font-extrabold shadow-[0_1px_3px_rgba(15,23,42,0.05)] ${item.tagColor}`}
                >
                  {item.tag}
                </span>

                <p className="mt-1.5 text-[0.5625rem] font-bold leading-tight text-[#64748b]">{item.subtitle}</p>
                <p
                  className={`mt-0.5 text-[0.8125rem] font-extrabold leading-tight tracking-[-0.02em] ${item.titleColor}`}
                >
                  {item.title}
                </p>

                <div className="mt-2 flex items-end justify-between gap-1">
                  <Art className="h-10 w-10 shrink-0" />
                  <span
                    className="mb-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#1e293b] text-white shadow-[0_2px_6px_rgba(15,23,42,0.18)]"
                    aria-hidden
                  >
                    <ChevronRight className="h-3 w-3" strokeWidth={2.75} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section
        aria-label="ステータス"
        className="grid grid-cols-4 divide-x divide-[#e8ecf0] overflow-hidden rounded-[1.15rem] border border-[#e8ecf0] bg-white shadow-[0_2px_10px_rgba(15,23,42,0.04)]"
      >
        {[
          { icon: Calendar, iconClass: "text-[#eab308]", label: "今月の来店回数", value: `${monthVisits}回` },
          { icon: TrendingUp, iconClass: "text-[#22c55e]", label: "累計ボトル数", value: `${bottleCount}本` },
          { icon: Crown, iconClass: "text-[#3b82f6]", label: "ランク", value: "ブロンズ" },
          { icon: Star, iconClass: "text-[#f472b6]", label: "ポイント", value: `${points}pt` },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="flex flex-col items-center px-1 py-3.5 text-center">
              <Icon className={`h-4 w-4 ${stat.iconClass}`} strokeWidth={2.25} aria-hidden />
              <p className="mt-1.5 text-[0.5rem] font-bold leading-tight text-[#94a3b8]">{stat.label}</p>
              <p className="mt-0.5 text-[0.7rem] font-extrabold text-[#1e293b]">{stat.value}</p>
            </div>
          );
        })}
      </section>
    </div>
  );
}
