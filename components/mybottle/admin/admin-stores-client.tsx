"use client";

import { useState } from "react";
import { toggleStoreActiveAction, updateStoreUiMetaAction } from "@/app/(admin-manage)/admin/actions";
import { ChevronDown } from "lucide-react";

export type StoreAdminItem = {
  id: string;
  name: string;
  area: string;
  isActive: boolean;
  openHours: string;
  imageSrc: string;
  intro: string;
  featuresCsv: string;
};

export function AdminStoresClient({ stores }: { stores: StoreAdminItem[] }) {
  const [openId, setOpenId] = useState<string | null>(stores[0]?.id ?? null);

  return (
    <ul className="space-y-2">
      {stores.map((store) => {
        const open = openId === store.id;
        return (
          <li key={store.id} className="overflow-hidden rounded-2xl bg-white ring-1 ring-[#e7e5e4]">
            <button
              type="button"
              onClick={() => setOpenId(open ? null : store.id)}
              className="flex w-full items-center justify-between gap-2 px-4 py-3.5 text-left"
            >
              <span>
                <span className="block font-extrabold text-[#292524]">{store.name}</span>
                <span className="mt-0.5 block text-xs font-medium text-[#78716c]">{store.area}</span>
              </span>
              <span className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                    store.isActive ? "bg-emerald-100 text-emerald-800" : "bg-neutral-200 text-neutral-600"
                  }`}
                >
                  {store.isActive ? "公開" : "非公開"}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-[#a8a29e] transition ${open ? "rotate-180" : ""}`}
                  strokeWidth={2.5}
                />
              </span>
            </button>

            {open ? (
              <div className="space-y-3 border-t border-[#f5f5f4] px-4 py-3">
                <form action={toggleStoreActiveAction}>
                  <input type="hidden" name="store_id" value={store.id} />
                  <input type="hidden" name="next_active" value={store.isActive ? "false" : "true"} />
                  <button
                    type="submit"
                    className="w-full rounded-full border border-[#e7e5e4] bg-[#fffbeb] py-2 text-xs font-extrabold text-[#57534e]"
                  >
                    {store.isActive ? "非公開にする" : "公開する"}
                  </button>
                </form>

                <form action={updateStoreUiMetaAction} className="space-y-2">
                  <input type="hidden" name="store_id" value={store.id} />
                  <input
                    name="open_hours"
                    defaultValue={store.openHours}
                    className="w-full rounded-xl border border-[#e7e5e4] px-3 py-2 text-sm"
                    placeholder="営業時間"
                  />
                  <input
                    name="image_src"
                    defaultValue={store.imageSrc}
                    className="w-full rounded-xl border border-[#e7e5e4] px-3 py-2 text-sm"
                    placeholder="画像パス"
                  />
                  <input
                    name="features_csv"
                    defaultValue={store.featuresCsv}
                    className="w-full rounded-xl border border-[#e7e5e4] px-3 py-2 text-sm"
                    placeholder="特徴（カンマ区切り）"
                  />
                  <textarea
                    name="intro"
                    defaultValue={store.intro}
                    rows={2}
                    className="w-full rounded-xl border border-[#e7e5e4] px-3 py-2 text-sm"
                    placeholder="店舗紹介"
                  />
                  <button
                    type="submit"
                    className="w-full rounded-full bg-[#b45309] py-2.5 text-xs font-extrabold text-white"
                  >
                    表示情報を保存
                  </button>
                </form>
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
