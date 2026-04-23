"use client";

import Image from "next/image";
import { LoginMerchantCta, LoginPrimaryActions } from "@/components/mybottle/login-continue";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-dvh flex-col bg-black">
      <Image
        src="/images/start_page.png"
        alt=""
        fill
        priority
        className="pointer-events-none object-cover object-center"
        sizes="100vw"
      />
      <div className="relative z-20 flex min-h-dvh flex-col px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(2.2rem,env(safe-area-inset-top))]">
        <div className="flex flex-1 flex-col items-center justify-center gap-8 pb-4">
          <div
            className="relative w-[min(92vw,420px)] drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]"
            style={{ aspectRatio: "280 / 120" }}
          >
            <Image
              src="/images/logo-bottle.png"
              alt="mybottle デジタルボトルキープ"
              fill
              priority
              unoptimized
              sizes="(max-width: 768px) 92vw, 360px"
              className="object-contain object-center"
            />
          </div>

          <div className="w-full max-w-[19.5rem] space-y-10 text-center text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)]">
            <div className="space-y-4 px-1">
              <h1 className="whitespace-nowrap text-[clamp(1.2rem,5.4vw,1.55rem)] font-semibold leading-snug tracking-[-0.03em]">
                ボトルキープを、もっとスマートに。
              </h1>
              <p className="text-[0.8125rem] font-medium leading-[1.85] tracking-[-0.01em] text-white/78">
                お気に入りのボトルを、アプリでかんたん管理。
                <br />
                お店でも、いつもの一杯を。
              </p>
            </div>

            <div className="relative z-30 w-full px-0.5">
              <LoginPrimaryActions />
            </div>
          </div>
        </div>

        <footer className="mt-auto shrink-0 pt-2">
          <LoginMerchantCta />
        </footer>
      </div>
    </main>
  );
}
