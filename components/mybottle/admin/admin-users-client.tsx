"use client";

import { useState } from "react";
import {
  addStaffStoreMembershipAction,
  toggleStaffStoreMembershipAction,
  updateUserRoleAction,
} from "@/app/(admin-manage)/admin/actions";

type Profile = {
  id: string;
  email: string | null;
  display_name: string | null;
  role: "user" | "staff" | "admin";
};

type Store = { id: string; name: string };

type Membership = {
  id: string;
  user_id: string;
  store_id: string;
  is_active: boolean;
  storeName: string;
};

type Props = {
  profiles: Profile[];
  staffProfiles: Profile[];
  stores: Store[];
  memberships: Membership[];
};

const ROLE_LABELS = { user: "一般", staff: "スタッフ", admin: "管理者" } as const;

export function AdminUsersClient({ profiles, staffProfiles, stores, memberships }: Props) {
  const [tab, setTab] = useState<"roles" | "staff">("roles");

  return (
    <div className="space-y-4">
      <div className="flex rounded-full bg-[#fef3c7]/80 p-1 ring-1 ring-[#fde68a]">
        {(
          [
            ["roles", "権限管理"],
            ["staff", "スタッフ所属"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`flex-1 rounded-full py-2.5 text-xs font-extrabold transition ${
              tab === id ? "bg-white text-[#b45309] shadow-sm" : "text-[#78716c]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "roles" ? (
        <ul className="space-y-2">
          {profiles.map((user) => (
            <li key={user.id}>
              <form
                action={updateUserRoleAction}
                className="rounded-2xl bg-white p-4 ring-1 ring-[#e7e5e4]"
              >
                <input type="hidden" name="user_id" value={user.id} />
                <p className="font-extrabold text-[#292524]">{user.display_name ?? "名前未設定"}</p>
                <p className="mt-0.5 text-xs font-medium text-[#78716c]">{user.email ?? "メール未設定"}</p>
                <div className="mt-3 flex gap-2">
                  <select
                    name="role"
                    defaultValue={user.role}
                    className="h-10 flex-1 rounded-xl border border-[#e7e5e4] bg-[#fffbeb] px-3 text-sm font-semibold"
                  >
                    <option value="user">一般ユーザー</option>
                    <option value="staff">スタッフ</option>
                    <option value="admin">管理者</option>
                  </select>
                  <button
                    type="submit"
                    className="shrink-0 rounded-full bg-[#b45309] px-4 text-xs font-extrabold text-white"
                  >
                    保存
                  </button>
                </div>
                <p className="mt-2 text-[10px] font-medium text-[#a8a29e]">
                  現在: {ROLE_LABELS[user.role]}
                </p>
              </form>
            </li>
          ))}
        </ul>
      ) : (
        <div className="space-y-3">
          <form
            action={addStaffStoreMembershipAction}
            className="rounded-2xl bg-white p-4 ring-1 ring-[#e7e5e4]"
          >
            <p className="text-xs font-extrabold text-[#b45309]">スタッフに店舗を割り当て</p>
            <div className="mt-3 space-y-2">
              <select
                name="user_id"
                required
                className="h-10 w-full rounded-xl border border-[#e7e5e4] bg-[#fffbeb] px-3 text-sm"
              >
                <option value="">スタッフを選択</option>
                {staffProfiles.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.display_name ?? "名前未設定"} / {s.email ?? ""}
                  </option>
                ))}
              </select>
              <select
                name="store_id"
                required
                className="h-10 w-full rounded-xl border border-[#e7e5e4] bg-[#fffbeb] px-3 text-sm"
              >
                <option value="">店舗を選択</option>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="mt-3 w-full rounded-full bg-[#b45309] py-2.5 text-xs font-extrabold text-white"
            >
              紐付けを追加
            </button>
          </form>

          <ul className="space-y-2">
            {memberships.length === 0 ? (
              <li className="rounded-2xl bg-white px-4 py-8 text-center text-sm font-bold text-[#78716c] ring-1 ring-[#e7e5e4]">
                まだ紐付けがありません
              </li>
            ) : (
              memberships.map((m) => (
                <li key={m.id} className="rounded-2xl bg-white p-4 ring-1 ring-[#e7e5e4]">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-extrabold text-[#292524]">
                        {profiles.find((p) => p.id === m.user_id)?.display_name ?? "名前未設定"}
                      </p>
                      <p className="mt-0.5 text-xs text-[#78716c]">担当: {m.storeName}</p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                        m.is_active ? "bg-emerald-100 text-emerald-800" : "bg-neutral-200 text-neutral-600"
                      }`}
                    >
                      {m.is_active ? "有効" : "無効"}
                    </span>
                  </div>
                  <form action={toggleStaffStoreMembershipAction} className="mt-3">
                    <input type="hidden" name="membership_id" value={m.id} />
                    <input type="hidden" name="next_active" value={m.is_active ? "false" : "true"} />
                    <button
                      type="submit"
                      className="rounded-full border border-[#e7e5e4] bg-[#fffbeb] px-3 py-1.5 text-xs font-extrabold text-[#57534e]"
                    >
                      {m.is_active ? "無効にする" : "有効にする"}
                    </button>
                  </form>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
