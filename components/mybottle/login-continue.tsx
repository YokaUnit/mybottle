"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, Heart, ShieldCheck, Smartphone, Timer } from "lucide-react";
import { GoogleMark } from "@/components/mybottle/login-mark";
import { LoginShopArt } from "@/components/mybottle/login-shop-art";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

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
  { Icon: Smartphone, color: "text-[#eab308]", bg: "bg-[#fef9c3]", label: "アプリ不要" },
  { Icon: Heart, color: "text-[#f472b6]", bg: "bg-[#fce7f3]", label: "完全無料" },
  { Icon: Timer, color: "text-[#14b8a6]", bg: "bg-[#ccfbf1]", label: "30秒で開始" },
] as const;

export function LoginPrimaryActions() {
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
    <div className="w-full space-y-3.5">
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isSubmitting}
        className="flex h-[3.35rem] w-full items-center rounded-full bg-gradient-to-r from-[#2dd4bf] via-[#14b8a6] to-[#0d9488] pl-3 pr-4 text-white shadow-[0_6px_22px_rgba(20,184,166,0.36)] transition active:scale-[0.98] disabled:opacity-60"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white shadow-sm">
          <GoogleMark className="h-5 w-5" />
        </span>
        <span className="flex-1 text-center text-[0.9375rem] font-extrabold tracking-[-0.01em]">
          {isSubmitting ? "移動中..." : "Googleで続ける"}
        </span>
        <ChevronRight className="h-5 w-5 shrink-0 opacity-95" strokeWidth={2.5} aria-hidden />
      </button>

      <p className="flex items-center justify-center gap-1.5 text-[0.6875rem] font-bold text-[#94a3b8]">
        <span className="grid h-5 w-5 place-items-center rounded-full bg-[#ecfdf5] text-[#14b8a6]">
          <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden />
        </span>
        安全にログインできます
      </p>

      {errorMessage ? <p className="text-center text-sm font-bold text-red-500">{errorMessage}</p> : null}

      <div className="grid grid-cols-3 gap-2">
        {FEATURES.map(({ Icon, color, bg, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1.5 rounded-[0.9rem] border border-[#f1f5f9] bg-white px-1 py-3 shadow-[0_2px_8px_rgba(15,23,42,0.04)]"
          >
            <span className={`relative grid h-9 w-9 place-items-center rounded-full ${bg}`}>
              <Icon className={`h-4 w-4 ${color}`} strokeWidth={2.25} aria-hidden />
              <span className="pointer-events-none absolute -right-0.5 -top-0.5 text-[0.45rem] text-[#facc15]" aria-hidden>
                ✦
              </span>
            </span>
            <span className="text-center text-[0.625rem] font-extrabold leading-tight text-[#475569]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LoginMerchantCta() {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2.5">
        <span className="h-px flex-1 border-t border-dashed border-[#cbd5e1]" aria-hidden />
        <span className="text-[0.6875rem] font-bold text-[#94a3b8]">または</span>
        <span className="h-px flex-1 border-t border-dashed border-[#cbd5e1]" aria-hidden />
      </div>

      <div className="flex items-center gap-3 rounded-[1.15rem] bg-[#fffbeb]/95 px-3.5 py-3.5 ring-1 ring-[#fde68a]/80 backdrop-blur-[1px]">
        <LoginShopArt className="h-[4.25rem] w-[4.25rem] shrink-0" />
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-[0.8125rem] font-extrabold text-[#334155]">
            お店の方はこちら
            <span className="ml-0.5 text-[#2dd4bf]" aria-hidden>
              ✦✦
            </span>
          </p>
          <Link
            href="/staff"
            className="flex h-10 w-full items-center justify-center gap-0.5 rounded-full border-2 border-[#14b8a6] bg-white text-[0.8125rem] font-extrabold text-[#0d9488] shadow-sm transition active:scale-[0.98] active:bg-[#f0fdfa]"
          >
            加盟店としてはじめる
            <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.75} aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}
