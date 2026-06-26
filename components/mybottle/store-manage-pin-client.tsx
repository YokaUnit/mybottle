"use client";

import { useState, useTransition } from "react";
import { updateStorePurchasePinAction } from "@/app/(store-manage)/dashboard/actions";

type Props = {
  storeId: string;
  pinCode: string | null;
};

export function StoreManagePinClient({ storeId, pinCode }: Props) {
  const [pending, start] = useTransition();
  const [editing, setEditing] = useState(!pinCode);
  const [savedPin, setSavedPin] = useState(pinCode);

  if (editing) {
    return (
      <section id="purchase-pin" className="scroll-mt-4 space-y-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#cbd5e1]">
        <div>
          <h2 className="text-sm font-extrabold text-[#1e293b]">購入確認 PIN</h2>
          <p className="mt-1 text-xs font-medium leading-relaxed text-[#64748b]">
            購入確定時に店員が入力する、店舗共通の4桁 PIN です。お客様には伝わらないよう管理してください。
          </p>
        </div>
        <form
          action={(fd) => {
            start(async () => {
              fd.set("storeId", storeId);
              await updateStorePurchasePinAction(fd);
              const nextPin = String(fd.get("pinCode") ?? "").padStart(4, "0").slice(-4);
              setSavedPin(nextPin);
              setEditing(false);
            });
          }}
        >
          <input
            name="pinCode"
            defaultValue={savedPin ?? ""}
            placeholder="4桁 PIN"
            pattern="[0-9]{4}"
            maxLength={4}
            inputMode="numeric"
            required
            className="w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-center font-mono text-2xl font-extrabold tracking-[0.35em] text-[#0d4f4a]"
          />
          <div className="mt-3 flex gap-2">
            <button
              type="submit"
              disabled={pending}
              className="flex-1 rounded-full bg-[#0d4f4a] py-3 text-sm font-extrabold text-white disabled:opacity-60"
            >
              保存する
            </button>
            {savedPin ? (
              <button
                type="button"
                disabled={pending}
                onClick={() => setEditing(false)}
                className="rounded-full bg-[#e2e8f0] px-4 py-3 text-sm font-extrabold text-[#64748b]"
              >
                キャンセル
              </button>
            ) : null}
          </div>
        </form>
      </section>
    );
  }

  return (
    <section id="purchase-pin" className="scroll-mt-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#cbd5e1]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-extrabold text-[#1e293b]">購入確認 PIN</h2>
          <p className="mt-3 font-mono text-3xl font-extrabold tracking-[0.4em] text-[#0d9488]">{savedPin}</p>
          <p className="mt-2 text-xs text-[#64748b]">
            お客様には伝わらないよう、購入確定時は店員がこの PIN を入力してください。
          </p>
        </div>
        <button
          type="button"
          disabled={pending}
          onClick={() => setEditing(true)}
          className="shrink-0 rounded-full bg-[#0d4f4a] px-4 py-2 text-xs font-extrabold text-white"
        >
          変更
        </button>
      </div>
    </section>
  );
}
