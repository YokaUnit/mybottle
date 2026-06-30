"use client";

import { useTransition } from "react";
import { updateStoreSettingsAction } from "@/app/(store-manage)/dashboard/actions";
import { StoreManagePinClient } from "@/components/mybottle/store-manage/store-manage-pin-client";
import type { StoreManageSettings } from "@/lib/store-manage/types";

type Props = {
  storeId: string;
  settings: StoreManageSettings;
  pinCode: string | null;
};

export function StoreManageSettingsClient({ storeId, settings, pinCode }: Props) {
  const [pending, start] = useTransition();

  return (
    <div className="space-y-4">
      <StoreManagePinClient storeId={storeId} pinCode={pinCode} />

      <form
        className="space-y-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#cbd5e1]"
        action={(fd) => {
          start(async () => {
            fd.set("storeId", storeId);
            fd.set("imageSrc", "/store/test1.png");
            await updateStoreSettingsAction(fd);
          });
        }}
      >
        <h2 className="text-sm font-extrabold text-[#1e293b]">店舗設定</h2>
        {(
          [
            ["name", "店舗名", settings.name],
            ["phone", "電話番号", settings.phone ?? ""],
            ["openHours", "営業時間", settings.openHours],
            ["regularHoliday", "定休日", settings.regularHoliday ?? ""],
            ["address", "住所", settings.address ?? ""],
          ] as const
        ).map(([name, label, value]) => (
          <label key={name} className="block space-y-1">
            <span className="text-[10px] font-bold text-[#64748b]">{label}</span>
            <input
              name={name}
              defaultValue={value}
              className="w-full rounded-xl border border-[#e2e8f0] px-3 py-2 text-sm font-bold"
            />
          </label>
        ))}
        <label className="block space-y-1">
          <span className="text-[10px] font-bold text-[#64748b]">紹介文</span>
          <textarea
            name="intro"
            defaultValue={settings.intro}
            rows={3}
            className="w-full rounded-xl border border-[#e2e8f0] px-3 py-2 text-sm font-medium"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-[#0d9488] py-3 text-sm font-extrabold text-white disabled:opacity-60"
        >
          保存する
        </button>
      </form>
    </div>
  );
}
