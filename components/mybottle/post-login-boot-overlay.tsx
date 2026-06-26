"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";

type Props = {
  open: boolean;
};

const BOOT_GEMS = [
  { className: "mb-post-login-boot-gem--tl", color: "#2dd4bf" },
  { className: "mb-post-login-boot-gem--tr", color: "#facc15" },
  { className: "mb-post-login-boot-gem--bl", color: "#f472b6" },
  { className: "mb-post-login-boot-gem--br", color: "#2dd4bf" },
] as const;

/**
 * OAuth 直後（`?fresh=1`）に在庫同期が終わるまで表示するフルスクリーンブート。
 * 「0本」と一瞬だけ見える不安を避ける。
 */
export function PostLoginBootOverlay({ open }: Props) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="post-login-boot"
          role="status"
          aria-live="polite"
          aria-busy="true"
          aria-label="マイボトルのデータを読み込み中"
          className="mb-post-login-boot-root fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-post-login-boot-bg" aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/start_page.png"
              alt=""
              className="mb-post-login-boot-bg__img"
              fetchPriority="high"
              decoding="sync"
            />
          </div>

          <div className="mb-post-login-boot-blobs" aria-hidden>
            <div className="mb-post-login-boot-blob mb-post-login-boot-blob--teal" />
            <div className="mb-post-login-boot-blob mb-post-login-boot-blob--yellow" />
            <div className="mb-post-login-boot-blob mb-post-login-boot-blob--pink" />
          </div>

          <div className="mb-post-login-boot-gems" aria-hidden>
            {BOOT_GEMS.map(({ className, color }) => (
              <span
                key={className}
                className={`mb-post-login-boot-gem ${className}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <motion.div
            className="relative z-10 flex w-full max-w-[min(88vw,20rem)] flex-col items-center gap-6 px-6"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-post-login-boot-logo-wrap">
              <div className="mb-post-login-boot-logo-glow" aria-hidden />
              <motion.div
                className="relative z-10 flex flex-col items-center"
                animate={reduceMotion ? undefined : { scale: [1, 1.04, 1] }}
                transition={
                  reduceMotion
                    ? undefined
                    : { duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }
                }
              >
                <Image
                  src="/images/header_logo.png"
                  alt=""
                  width={72}
                  height={72}
                  priority
                  unoptimized
                  className="h-[4.5rem] w-[4.5rem] object-contain"
                />
                <p className="mt-1.5 text-[1.5625rem] font-extrabold tracking-[-0.04em] text-[#334155]">
                  mybottle
                </p>
              </motion.div>
            </div>

            <div className="mb-post-login-boot-card w-full text-center">
              <p className="text-[0.9375rem] font-bold tracking-[-0.02em] text-[#1e293b]">
                マイボトルを同期しています
              </p>
              <p className="mt-2 text-xs font-medium leading-relaxed text-[#64748b]">
                登録ボトルと履歴を読み込んでいます。
                <br />
                しばらくお待ちください。
              </p>
              <div className="mb-post-login-boot-bar mt-5" aria-hidden>
                <div className="mb-post-login-boot-bar-fill" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="mb-post-login-boot-pare pointer-events-none absolute bottom-0 right-0 z-[5]"
            aria-hidden
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src="/images/bottle_pare.png"
              alt=""
              width={160}
              height={160}
              priority
              unoptimized
              className="mb-post-login-boot-pare__img h-auto w-[min(42vw,9.5rem)] object-contain"
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
