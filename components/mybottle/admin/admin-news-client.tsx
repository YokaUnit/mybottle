"use client";

import { useState } from "react";
import {
  createBenefitNewsAction,
  deleteBenefitNewsAction,
  updateBenefitNewsAction,
} from "@/app/(admin-manage)/admin/actions";
import { ChevronDown, Plus } from "lucide-react";

export type NewsAdminItem = {
  id: string;
  badgeLabel: string;
  title: string;
  body: string;
  sortOrder: number;
  isActive: boolean;
};

export function AdminNewsClient({ items }: { items: NewsAdminItem[] }) {
  const [showCreate, setShowCreate] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium leading-relaxed text-[#78716c]">
        ここで作成したお知らせは、ユーザーの通知ベルと特典ページに表示されます。
      </p>

      <button
        type="button"
        onClick={() => setShowCreate((v) => !v)}
        className="flex w-full items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-[#fcd34d] bg-[#fffbeb] py-3 text-sm font-extrabold text-[#b45309]"
      >
        <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden />
        新しいお知らせ
      </button>

      {showCreate ? (
        <form action={createBenefitNewsAction} className="space-y-2 rounded-2xl bg-white p-4 ring-1 ring-[#fde68a]">
          <input
            name="badge_label"
            className="w-full rounded-xl border border-[#e7e5e4] px-3 py-2 text-sm"
            placeholder="ラベル（例: アップデート）"
          />
          <input
            name="title"
            required
            className="w-full rounded-xl border border-[#e7e5e4] px-3 py-2 text-sm"
            placeholder="タイトル"
          />
          <textarea
            name="body"
            required
            rows={3}
            className="w-full rounded-xl border border-[#e7e5e4] px-3 py-2 text-sm"
            placeholder="本文"
          />
          <input
            name="sort_order"
            type="number"
            defaultValue={0}
            className="w-full rounded-xl border border-[#e7e5e4] px-3 py-2 text-sm"
            placeholder="並び順（大きいほど上）"
          />
          <button type="submit" className="w-full rounded-full bg-[#b45309] py-2.5 text-xs font-extrabold text-white">
            公開して追加
          </button>
        </form>
      ) : null}

      <ul className="space-y-2">
        {items.length === 0 ? (
          <li className="rounded-2xl bg-white px-4 py-10 text-center text-sm font-bold text-[#78716c] ring-1 ring-[#e7e5e4]">
            お知らせはまだありません
          </li>
        ) : (
          items.map((row) => {
            const open = openId === row.id;
            return (
              <li key={row.id} className="overflow-hidden rounded-2xl bg-white ring-1 ring-[#e7e5e4]">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : row.id)}
                  className="flex w-full items-center justify-between gap-2 px-4 py-3.5 text-left"
                >
                  <span className="min-w-0 truncate font-extrabold text-[#292524]">{row.title}</span>
                  <span className="flex shrink-0 items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                        row.isActive ? "bg-emerald-100 text-emerald-800" : "bg-neutral-200 text-neutral-600"
                      }`}
                    >
                      {row.isActive ? "公開" : "非公開"}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-[#a8a29e] transition ${open ? "rotate-180" : ""}`}
                      strokeWidth={2.5}
                    />
                  </span>
                </button>

                {open ? (
                  <div className="space-y-3 border-t border-[#f5f5f4] px-4 py-3">
                    <form action={updateBenefitNewsAction} className="space-y-2">
                      <input type="hidden" name="id" value={row.id} />
                      <input
                        name="badge_label"
                        defaultValue={row.badgeLabel}
                        className="w-full rounded-xl border border-[#e7e5e4] px-3 py-2 text-sm"
                      />
                      <input
                        name="title"
                        required
                        defaultValue={row.title}
                        className="w-full rounded-xl border border-[#e7e5e4] px-3 py-2 text-sm"
                      />
                      <textarea
                        name="body"
                        required
                        rows={3}
                        defaultValue={row.body}
                        className="w-full rounded-xl border border-[#e7e5e4] px-3 py-2 text-sm"
                      />
                      <input
                        name="sort_order"
                        type="number"
                        defaultValue={row.sortOrder}
                        className="w-full rounded-xl border border-[#e7e5e4] px-3 py-2 text-sm"
                      />
                      <select
                        name="is_active"
                        defaultValue={row.isActive ? "true" : "false"}
                        className="h-10 w-full rounded-xl border border-[#e7e5e4] bg-[#fffbeb] px-3 text-sm"
                      >
                        <option value="true">公開</option>
                        <option value="false">非公開</option>
                      </select>
                      <button
                        type="submit"
                        className="w-full rounded-full bg-[#b45309] py-2.5 text-xs font-extrabold text-white"
                      >
                        保存
                      </button>
                    </form>
                    <form action={deleteBenefitNewsAction}>
                      <input type="hidden" name="id" value={row.id} />
                      <button type="submit" className="text-xs font-extrabold text-red-600">
                        このお知らせを削除
                      </button>
                    </form>
                  </div>
                ) : null}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
