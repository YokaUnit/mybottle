"use client";

import { useRouter } from "next/navigation";
import { AppleMark, GoogleMark } from "@/components/mybottle/login-mark";
import { persistBrowserSession } from "@/lib/mybottle/session";

function enterApp(router: ReturnType<typeof useRouter>, mode: string) {
  persistBrowserSession(mode);
  router.push("/");
  router.refresh();
}

export function LoginPrimaryActions() {
  const router = useRouter();

  return (
    <div className="w-full max-w-sm space-y-3">
      <button
        type="button"
        onClick={() => enterApp(router, "phone")}
        className="flex w-full items-center justify-center rounded-2xl bg-[var(--mb-forest)] px-4 py-4 text-center text-base font-bold text-white shadow-lg ring-1 ring-white/10 transition active:opacity-90"
      >
        電話番号でログイン
      </button>
      <button
        type="button"
        onClick={() => enterApp(router, "apple")}
        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-4 py-4 text-center text-base font-bold text-neutral-900 shadow-md ring-1 ring-black/5 transition active:bg-neutral-100"
      >
        <AppleMark className="h-5 w-5 shrink-0" />
        Appleで続ける
      </button>
      <button
        type="button"
        onClick={() => enterApp(router, "google")}
        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-4 py-4 text-center text-base font-bold text-neutral-900 shadow-md ring-1 ring-black/5 transition active:bg-neutral-100"
      >
        <GoogleMark className="h-5 w-5 shrink-0" />
        Googleで続ける
      </button>
    </div>
  );
}

export function LoginGuestAction() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => enterApp(router, "guest")}
      className="block w-full pb-[max(0.5rem,env(safe-area-inset-bottom))] text-center text-sm font-semibold text-white underline decoration-white/90 underline-offset-4"
    >
      ゲストではじめる
    </button>
  );
}
