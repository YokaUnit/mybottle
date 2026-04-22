"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { LoginPrimaryActions } from "@/components/mybottle/login-continue";

export default function LoginPage() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <main className="relative flex min-h-dvh flex-col bg-black">
      <Image
        src="/images/start_page.png"
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      <div className="relative z-10 flex min-h-dvh flex-col px-5 pb-8 pt-[max(2.2rem,env(safe-area-inset-top))]">
        <div className="flex flex-1 flex-col items-center justify-center gap-7">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative w-[min(94vw,420px)] drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]"
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
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.06, ease: "easeOut" }}
            className="w-full max-w-sm space-y-2.5 text-center text-white"
          >
            <h1 className="whitespace-nowrap text-[clamp(1.95rem,8vw,2.2rem)] font-black leading-[1.2] tracking-[-0.015em]">
              ボトルキープを、もっとスマートに。
            </h1>
            <p className="text-[0.95rem] font-semibold leading-[1.75] text-white/88">
              お気に入りのボトルを、アプリでかんたん管理。
              <br />
              お店でも、いつもの一杯を。
            </p>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12, ease: "easeOut" }}
            className="w-full"
          >
            <LoginPrimaryActions />
          </motion.div>
        </div>

      </div>
    </main>
  );
}
