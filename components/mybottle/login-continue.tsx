"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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

  return (
    <div className="mx-auto w-full max-w-sm space-y-4">
      <motion.button
        type="button"
        onClick={async () => {
          setErrorMessage(null);
          const error = await signInWithGoogle();
          if (error) {
            setErrorMessage("ログインの開始に失敗しました。時間をおいて再度お試しください。");
          }
        }}
        className="flex h-[4.8rem] w-full items-center justify-center gap-3 rounded-[1.35rem] bg-white px-4 text-center text-xl font-bold text-neutral-900 shadow-md ring-1 ring-black/5 transition active:bg-neutral-100"
        whileTap={{ scale: 0.985 }}
      >
        <GoogleMark className="h-7 w-7 shrink-0" />
        Googleで続ける
      </motion.button>

      <p className="flex items-center justify-center gap-2 text-[0.95rem] font-semibold text-white/85">
        <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" aria-hidden>
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
