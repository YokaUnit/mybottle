"use client";

import Link from "next/link";
import { useState } from "react";
import { deleteAccountAction } from "@/app/legal/actions";
import { AlertTriangle } from "lucide-react";

type Props = {
  userEmail: string;
  isAdmin: boolean;
  isLastAdmin: boolean;
};

export function DeleteAccountClient({ userEmail, isAdmin, isLastAdmin }: Props) {
  const [confirmed, setConfirmed] = useState(false);
  const [understood, setUnderstood] = useState(false);
  const [phrase, setPhrase] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = confirmed && understood && phrase === "退会" && !isLastAdmin && !isSubmitting;

  async function handleDelete() {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setError(null);
    const result = await deleteAccountAction();
    if (!result.ok) {
      setError(
        result.error === "last_admin"
          ? "最後の管理者アカウントは退会できません。別の管理者を任命してから再度お試しください。"
          : "退会処理に失敗しました。お問い合わせページよりご連絡ください。",
      );
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mb-surface mt-4 space-y-4 p-5">
      <div className="flex gap-3 rounded-xl bg-[#fff1f2] p-4 ring-1 ring-[#fecdd3]">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#e11d48]" strokeWidth={2.25} aria-hidden />
        <div className="text-sm font-medium leading-relaxed text-[#9f1239]">
          <p className="font-extrabold">退会すると元に戻せません</p>
          <p className="mt-1 text-[#be123c]">
            アカウント・保有ボトル・利用履歴・友だち関係が削除されます。店舗での実際のボトルキープは店舗の記録に残る場合があります。
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-[var(--mb-muted)]/60 p-4 text-sm font-medium text-[var(--mb-forest-light)]">
        <p className="font-extrabold text-[var(--mb-ink)]">対象アカウント</p>
        <p className="mt-1">{userEmail}</p>
        {isAdmin ? (
          <p className="mt-2 text-xs font-bold text-[#b45309]">管理者権限が付与されています</p>
        ) : null}
      </div>

      {isLastAdmin ? (
        <p className="rounded-xl bg-[#fffbeb] p-4 text-sm font-bold text-[#b45309] ring-1 ring-[#fde68a]">
          現在、管理者はあなたのみです。サービス運営のため、別の管理者を任命してから退会してください。
        </p>
      ) : (
        <>
          <label className="flex items-start gap-3 text-sm font-medium text-[var(--mb-forest-light)]">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-[var(--mb-muted-strong)]"
            />
            <span>退会後、保有ボトル・履歴・友だち情報が削除されることを理解しました</span>
          </label>

          <label className="flex items-start gap-3 text-sm font-medium text-[var(--mb-forest-light)]">
            <input
              type="checkbox"
              checked={understood}
              onChange={(e) => setUnderstood(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-[var(--mb-muted-strong)]"
            />
            <span>
              店舗での精算・返金等は店舗のルールに従うものであり、退会だけでは解決しない場合があることを理解しました
            </span>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-extrabold text-[var(--mb-ink)]">
              確認のため「退会」と入力してください
            </span>
            <input
              type="text"
              value={phrase}
              onChange={(e) => setPhrase(e.target.value)}
              placeholder="退会"
              autoComplete="off"
              className="h-11 w-full rounded-xl border border-[var(--mb-muted-strong)] bg-white px-4 text-sm font-semibold"
            />
          </label>

          {error ? <p className="text-sm font-bold text-red-500">{error}</p> : null}

          <button
            type="button"
            onClick={handleDelete}
            disabled={!canSubmit}
            className="w-full rounded-xl bg-[#e11d48] py-3.5 text-sm font-extrabold text-white disabled:opacity-40"
          >
            {isSubmitting ? "処理中…" : "アカウントを退会する"}
          </button>
        </>
      )}

      <p className="text-center text-xs font-medium text-[var(--mb-forest-light)]">
        退会に関するご相談は
        <Link href="/legal/contact" className="font-extrabold text-[var(--mb-teal-dark)]">
          お問い合わせ
        </Link>
        からどうぞ
      </p>
    </section>
  );
}
