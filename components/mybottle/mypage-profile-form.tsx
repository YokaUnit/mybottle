"use client";

import { useActionState } from "react";
import { updateProfileAction, type ProfileFormState } from "@/app/(main)/mypage/edit/actions";

const initialState: ProfileFormState = {
  ok: false,
  message: "",
};

type Props = {
  defaultDisplayName: string;
  defaultEmail: string;
  defaultPhone: string;
};

export function MyPageProfileForm({ defaultDisplayName, defaultEmail, defaultPhone }: Props) {
  const [state, formAction, pending] = useActionState(updateProfileAction, initialState);

  return (
    <form action={formAction} className="mb-surface space-y-4 p-5">
      <div className="space-y-2">
        <label htmlFor="display_name" className="text-xs font-semibold text-[var(--mb-forest-light)]">
          表示名
        </label>
        <input
          id="display_name"
          name="display_name"
          defaultValue={defaultDisplayName}
          placeholder="表示名を入力"
          className="w-full rounded-xl border border-[var(--mb-ring)] bg-white px-3 py-3 text-base font-medium text-[var(--mb-ink)] outline-none ring-[var(--mb-accent)]/40 transition focus:ring-2"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-xs font-semibold text-[var(--mb-forest-light)]">
          メールアドレス（Google連携）
        </label>
        <input
          id="email"
          name="email"
          defaultValue={defaultEmail}
          disabled
          className="w-full rounded-xl border border-[var(--mb-ring)] bg-[var(--mb-muted)] px-3 py-3 text-base font-medium text-[var(--mb-forest-light)]"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="text-xs font-semibold text-[var(--mb-forest-light)]">
          電話番号
        </label>
        <input
          id="phone"
          name="phone"
          defaultValue={defaultPhone}
          placeholder="090-1234-5678"
          className="w-full rounded-xl border border-[var(--mb-ring)] bg-white px-3 py-3 text-base font-medium text-[var(--mb-ink)] outline-none ring-[var(--mb-accent)]/40 transition focus:ring-2"
        />
      </div>

      {state.message ? (
        <p className={`text-sm font-semibold ${state.ok ? "text-emerald-700" : "text-red-600"}`}>{state.message}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-[var(--mb-forest)] px-4 py-3.5 text-base font-semibold text-white transition active:opacity-90 disabled:opacity-60"
      >
        {pending ? "更新中..." : "プロフィールを更新"}
      </button>
    </form>
  );
}
