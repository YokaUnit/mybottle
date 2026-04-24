"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";

type Props = {
  open: boolean;
};

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
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#0a1210]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <div className="mb-post-login-boot-aurora" />
            <div className="mb-post-login-boot-grid" />
          </div>

          <motion.div
            className="relative z-10 flex max-w-[min(88vw,20rem)] flex-col items-center gap-8 px-6 text-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="relative w-[min(72vw,220px)]"
              style={{ aspectRatio: "280 / 120" }}
              animate={reduceMotion ? undefined : { scale: [1, 1.03, 1] }}
              transition={
                reduceMotion
                  ? undefined
                  : { duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }
              }
            >
              <Image
                src="/images/logo-bottle.png"
                alt=""
                fill
                priority
                unoptimized
                className="object-contain object-center drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
                sizes="220px"
              />
            </motion.div>

            <div className="space-y-2">
              <p className="text-[0.9375rem] font-semibold tracking-[-0.02em] text-white/95">
                マイボトルを同期しています
              </p>
              <p className="text-xs font-medium leading-relaxed text-white/55">
                登録ボトルと履歴を読み込んでいます。しばらくお待ちください。
              </p>
            </div>

            <div className="mb-post-login-boot-bar" aria-hidden>
              <div className="mb-post-login-boot-bar-fill" />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
