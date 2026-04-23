"use client";

import Link from "next/link";
import { useState } from "react";
import { GoogleMark } from "@/components/mybottle/login-mark";
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
    <div className="relative z-30 mx-auto w-full max-w-sm space-y-5">
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isSubmitting}
        className="flex h-12 w-full touch-manipulation items-center justify-center gap-2.5 rounded-full bg-white px-5 text-center text-[0.9375rem] font-semibold tracking-[-0.01em] text-neutral-900 shadow-sm ring-1 ring-black/[0.06] transition active:bg-neutral-100 disabled:opacity-70"
      >
        <GoogleMark className="h-5 w-5 shrink-0" />
        {isSubmitting ? "移動中..." : "Googleで続ける"}
      </button>

      <p className="flex items-center justify-center gap-1.5 text-xs font-medium text-white/72">
        <svg className="h-3.5 w-3.5 shrink-0 opacity-90" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M7.5 10V8a4.5 4.5 0 1 1 9 0v2m-10 0h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        安全にログインできます
      </p>
      {errorMessage ? <p className="text-center text-sm font-semibold text-red-200">{errorMessage}</p> : null}
    </div>
  );
}

/** ログイン画面下部: 「または」＋加盟店向けLPへの導線（画像のゲスト導線と同位置・同系統の見た目） */
export function LoginMerchantCta() {
  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="flex items-center gap-3 text-white/75">
        <span className="h-px min-w-0 flex-1 bg-white/35" aria-hidden />
        <span className="shrink-0 text-[0.7rem] font-semibold tracking-[0.12em] text-white/90">または</span>
        <span className="h-px min-w-0 flex-1 bg-white/35" aria-hidden />
      </div>
      <Link
        href="/staff"
        className="mt-5 block text-center text-[0.95rem] font-semibold text-white underline decoration-white/70 underline-offset-[0.35rem] transition active:opacity-85"
      >
        加盟店としてはじめる
      </Link>
    </div>
  );
}
