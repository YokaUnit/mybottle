"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { ChevronRight, Heart, ShieldCheck, Smartphone, Timer } from "lucide-react";
import { GoogleMark } from "@/components/mybottle/login-mark";
import { LegalLinksSection } from "@/components/mybottle/legal/legal-links-section";
import { LoginShopArt } from "@/components/mybottle/login-shop-art";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import "./login.css";

async function signInWithGoogle() {
  const supabase = createSupabaseBrowserClient();
  const configuredRedirectBase = process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL;
  const runtimeOrigin = window.location.origin;
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? runtimeOrigin
      : configuredRedirectBase || process.env.NEXT_PUBLIC_APP_URL || runtimeOrigin;
  const redirectTo = `${baseUrl.replace(/\/$/, "")}/auth/callback?next=/`;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });
  return error;
}

const FEATURES = [
  {
    Icon: Smartphone,
    iconClass: "text-[#14b8a6]",
    label: "アプリ不要",
    sub: "ブラウザで使える",
  },
  {
    Icon: Heart,
    iconClass: "text-[#f472b6]",
    label: "完全無料",
    sub: "追加料金なし",
  },
  {
    Icon: Timer,
    iconClass: "text-[#eab308]",
    label: "30秒で開始",
    sub: "すぐに使える",
  },
] as const;

function MerchantDeco() {
  const gems = [
    { className: "mb-login-merchant-deco__gem--tl", color: "#2dd4bf" },
    { className: "mb-login-merchant-deco__gem--tr", color: "#facc15" },
    { className: "mb-login-merchant-deco__gem--bl", color: "#f472b6" },
    { className: "mb-login-merchant-deco__gem--br", color: "#2dd4bf" },
  ] as const;

  return (
    <div className="mb-login-merchant-deco" aria-hidden>
      {gems.map(({ className, color }) => (
        <span key={className} className={`mb-login-merchant-deco__gem ${className}`} style={{ backgroundColor: color }} />
      ))}
    </div>
  );
}

function HeadlineScribble() {
  return (
    <svg
      className="mb-login-headline-scribble"
      viewBox="0 0 110 10"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path d="M2 7C20 3 42 8 62 5C82 2 98 7 108 5" />
    </svg>
  );
}

function HeadlineSparkles() {
  return (
    <svg
      className="mb-login-headline-sparkle"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
    >
      <path
        d="M10 1.5v3.2M10 15.3v3.2M2.5 10h3.2M14.3 10h3.2M5.2 5.2l2.3 2.3M12.5 12.5l2.3 2.3M14.8 5.2l-2.3 2.3M7.5 12.5l-2.3 2.3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function LoginPage() {
  const searchParams = useSearchParams();
  const deleted = searchParams.get("deleted") === "1";
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleGoogleSignIn() {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    const error = await signInWithGoogle();
    if (error) {
      setErrorMessage("ログインの開始に失敗しました。時間をおいて再度お試しください。");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mb-login-root">
      <div className="mb-login-bg" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/start_page.png"
          alt=""
          className="mb-login-bg__img"
          fetchPriority="high"
          decoding="sync"
        />
      </div>

      <div className="mb-login-shell">
        <header className="mb-login-enter mb-login-enter--1 mb-login-header">
          <div className="mb-login-logo-glow" aria-hidden />
          <div className="mb-login-logo-content">
            <Image
              src="/images/header_logo.png"
              alt=""
              width={72}
              height={72}
              priority
              unoptimized
              className="mb-login-logo-icon"
            />
            <p className="mb-login-logo-text">mybottle</p>
          </div>
        </header>

        <section className="mb-login-enter mb-login-enter--2 mb-login-hero">
          <div className="mb-login-hero__copy">
            <div className="relative mb-login-headline-wrap">
              <HeadlineSparkles />
              <h1 className="mb-login-headline">
                ボトルキープを、
                <br />
                <span className="mb-login-headline__accent">
                  もっとスマートに。
                  <HeadlineScribble />
                </span>
              </h1>
            </div>
            <p className="mb-login-subtext">
              <span className="block">お気に入りのボトルを、</span>
              <span className="block">
                スマホで
                <span className="font-extrabold text-[#14b8a6]">かんたん管理</span>。
              </span>
              <span className="mb-login-subtext__gap block">いつものお店を、</span>
              <span className="block">
                <span className="font-extrabold text-[#14b8a6]">もっと身近に</span>
                。
              </span>
            </p>
          </div>

          <div className="mb-login-hero__pare mb-login-bottle-bob">
            <Image
              src="/images/bottle_pare.png"
              alt=""
              width={1024}
              height={1024}
              priority
              unoptimized
              sizes="(max-width: 390px) 64vw, 260px"
              className="h-auto w-full"
            />
          </div>
        </section>

        <section className="mb-login-enter mb-login-enter--3 mb-login-cta space-y-3">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="flex h-14 w-full items-center rounded-full bg-gradient-to-r from-[#2dd4bf] via-[#14b8a6] to-[#0d9488] pl-3.5 pr-4 text-white shadow-[0_8px_24px_rgba(20,184,166,0.34)] transition active:scale-[0.98] disabled:opacity-60"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
              <GoogleMark className="h-5 w-5" />
            </span>
            <span className="flex-1 text-center text-[0.9375rem] font-extrabold tracking-[-0.01em]">
              {isSubmitting ? "移動中..." : "Googleで続ける"}
            </span>
            <ChevronRight className="h-5 w-5 shrink-0 text-white/95" strokeWidth={2.5} aria-hidden />
          </button>

          <p className="flex items-center justify-center gap-1.5 text-[0.6875rem] font-bold text-[#94a3b8]">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-[#ecfdf5] text-[#14b8a6]">
              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden />
            </span>
            安全にログインできます
          </p>

          <p className="text-center text-[0.625rem] font-medium leading-relaxed text-[#94a3b8]">
            ログインすると
            <Link href="/legal/terms" className="font-extrabold text-[#0d9488] underline-offset-2 hover:underline">
              利用規約
            </Link>
            と
            <Link href="/legal/privacy" className="font-extrabold text-[#0d9488] underline-offset-2 hover:underline">
              プライバシーポリシー
            </Link>
            に同意したものとみなします
          </p>

          {deleted ? (
            <p className="text-center text-sm font-bold text-[#0d9488]">
              アカウントを退会しました。ご利用ありがとうございました。
            </p>
          ) : null}

          {errorMessage ? (
            <p className="text-center text-sm font-bold text-red-500">{errorMessage}</p>
          ) : null}
        </section>

        <section className="mb-login-enter mb-login-enter--4 mb-login-bottom">
          <div className="mb-login-features">
            {FEATURES.map(({ Icon, iconClass, label, sub }, index) => (
              <div
                key={label}
                className={`mb-login-features__item${index < FEATURES.length - 1 ? " mb-login-features__item--divided" : ""}`}
              >
                <Icon className={`mb-login-features__icon ${iconClass}`} strokeWidth={2} aria-hidden />
                <span className="mb-login-features__label">{label}</span>
                <span className="mb-login-features__sub">{sub}</span>
              </div>
            ))}
          </div>

          <div className="mb-login-or-divider">
            <span className="mb-login-or-divider__line" aria-hidden />
            <span className="mb-login-or-divider__label">または</span>
            <span className="mb-login-or-divider__line" aria-hidden />
          </div>

          <div className="mb-login-merchant-card">
            <MerchantDeco />
            <LoginShopArt className="mb-login-merchant-card__art" />
            <div className="mb-login-merchant-card__body">
              <p className="mb-login-merchant-card__title">お店の方はこちら</p>
              <p className="mb-login-merchant-card__desc">
                加盟店としてはじめると、管理がもっと便利に。
              </p>
              <Link href="/staff" className="mb-login-merchant-card__btn">
                加盟店としてはじめる
                <ChevronRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
              </Link>
            </div>
          </div>
        </section>

        <section className="mb-login-enter mb-login-enter--5 px-2 pb-6 pt-2">
          <LegalLinksSection variant="compact" />
        </section>

        <div className="mb-login-wave-guard" aria-hidden />
      </div>
    </div>
  );
}
