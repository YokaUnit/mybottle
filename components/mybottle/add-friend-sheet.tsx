"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { FriendUser } from "@/lib/mybottle/friends";

/** メインレイアウトのヘッダー(h-14)・ボトムナビと揃える */
const SHEET_CHROME =
  "fixed inset-x-0 top-14 bottom-[calc(5.75rem+env(safe-area-inset-bottom))] z-30 mx-auto w-full max-w-md";

function SheetAvatar({ friend }: { friend: FriendUser }) {
  const initial = (friend.displayName.trim()[0] ?? "?").toUpperCase();

  return (
    <div className="relative">
      <div
        className="absolute inset-0 scale-110 rounded-full bg-[#14b8a6]/20 blur-md"
        aria-hidden
      />
      {friend.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={friend.avatarUrl}
          alt=""
          className="relative h-[4.75rem] w-[4.75rem] rounded-full object-cover ring-4 ring-white shadow-[0_8px_24px_rgba(15,23,42,0.12)]"
        />
      ) : (
        <span
          className="relative grid h-[4.75rem] w-[4.75rem] place-items-center rounded-full bg-gradient-to-br from-[#ecfdf5] to-[#d1faf0] text-2xl font-extrabold text-[#0d9488] ring-4 ring-white shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
          aria-hidden
        >
          {initial}
        </span>
      )}
    </div>
  );
}

type Props = {
  friend: FriendUser | null;
  pending: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export function AddFriendSheet({ friend, pending, onConfirm, onClose }: Props) {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!friend) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [friend]);

  const cardTransition = reduceMotion
    ? { duration: 0.01 }
    : { type: "spring" as const, damping: 28, stiffness: 340, mass: 0.9 };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {friend ? (
        <div className={`${SHEET_CHROME} pointer-events-none`}>
          <motion.button
            type="button"
            aria-label="閉じる"
            className="pointer-events-auto absolute inset-0 bg-[#0f172a]/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.2 }}
            onClick={() => !pending && onClose()}
          />

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-5">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="add-friend-sheet-title"
              aria-busy={pending}
              className="pointer-events-auto w-full max-w-[19rem]"
              initial={{ opacity: 0, y: 28, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={cardTransition}
            >
              <div className="overflow-hidden rounded-[1.35rem] border border-[#e2e8f0]/90 bg-white px-6 py-7 shadow-[0_20px_50px_rgba(15,23,42,0.18)]">
                <div className="flex flex-col items-center text-center">
                  <SheetAvatar friend={friend} />

                  <p
                    id="add-friend-sheet-title"
                    className="mt-5 text-[1.0625rem] font-extrabold leading-snug tracking-[-0.02em] text-[#1e293b]"
                  >
                    <span className="text-[#0d9488]">{friend.displayName}</span>
                    <span className="text-[#64748b]"> さんを</span>
                    <br />
                    友だちに追加しますか？
                  </p>
                  <p className="mx-auto mt-3 max-w-[15rem] text-[0.8125rem] font-medium leading-relaxed text-[#64748b]">
                    追加すると杯数を
                    <br />
                    送れるようになります
                  </p>

                  <div className="mt-7 w-full space-y-2.5">
                    <button
                      type="button"
                      disabled={pending}
                      onClick={onConfirm}
                      className="mb-btn-primary flex w-full items-center justify-center gap-2 py-3.5 text-[0.9375rem] shadow-[0_8px_22px_rgba(20,184,166,0.32)] disabled:opacity-60"
                    >
                      <UserPlus className="h-4 w-4" strokeWidth={2.25} aria-hidden />
                      {pending ? "追加中..." : "追加する"}
                    </button>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={onClose}
                      className="w-full rounded-full py-3 text-sm font-extrabold text-[#64748b] transition active:bg-[#f1f5f9] disabled:opacity-50"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
