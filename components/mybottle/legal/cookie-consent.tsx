"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

const CONSENT_KEY = "mb_cookie_consent_v1";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (!stored) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(CONSENT_KEY, "accepted");
    } catch {
      // ignore
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[90] px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2"
      role="dialog"
      aria-label="Cookieの利用について"
    >
      <div className="mx-auto flex max-w-md flex-col gap-3 rounded-2xl bg-[#0f172a] p-4 text-white shadow-[0_12px_40px_rgba(15,23,42,0.35)] ring-1 ring-white/10">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-medium leading-relaxed text-white/85">
            本サービスでは、ログイン維持等のためにCookieを使用します。詳細は
            <Link href="/legal/cookies" className="font-extrabold text-[#5eead4] underline-offset-2 hover:underline">
              Cookieポリシー
            </Link>
            をご確認ください。
          </p>
          <button
            type="button"
            onClick={accept}
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-white/50 hover:text-white"
            aria-label="閉じる"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={accept}
          className="rounded-xl bg-[#14b8a6] py-2.5 text-xs font-extrabold text-white"
        >
          同意して閉じる
        </button>
      </div>
    </div>
  );
}
