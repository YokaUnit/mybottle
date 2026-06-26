import Link from "next/link";
import { ChevronRight, LayoutDashboard, Shield } from "lucide-react";
import type { AppRole } from "@/lib/auth/roles";

type Props = {
  role: AppRole;
};

export function MyPageOperationsSection({ role }: Props) {
  if (role !== "staff" && role !== "admin") return null;

  const isAdmin = role === "admin";

  return (
    <section
      className="overflow-hidden rounded-[1.25rem] border border-[#0a3d38]/20 bg-[#0d4f4a] shadow-[0_8px_24px_rgba(13,79,74,0.22)]"
      aria-label="運営向けメニュー"
    >
      <div className="border-b border-white/10 px-5 py-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#99f6e4]">
          {isAdmin ? "運営者向け" : "店舗スタッフ向け"}
        </p>
        <p className="mt-0.5 text-xs font-medium text-white/70">
          {isAdmin
            ? "お客様向け画面とは別の管理画面です"
            : "担当店舗の管理はこちらから"}
        </p>
      </div>

      <div className="divide-y divide-white/10">
        <Link
          href="/dashboard"
          className="flex items-center justify-between px-5 py-4 transition active:bg-white/5"
        >
          <span className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-[#fde047]">
              <LayoutDashboard className="h-5 w-5" strokeWidth={2.25} aria-hidden />
            </span>
            <span>
              <span className="block text-sm font-extrabold text-white">店舗管理ダッシュボード</span>
              <span className="mt-0.5 block text-[11px] font-medium text-white/60">
                ボトル・PIN・特典など
              </span>
            </span>
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-white/45" strokeWidth={2.5} aria-hidden />
        </Link>

        {isAdmin ? (
          <Link
            href="/admin"
            className="flex items-center justify-between px-5 py-4 transition active:bg-white/5"
          >
            <span className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-[#fde047]">
                <Shield className="h-5 w-5" strokeWidth={2.25} aria-hidden />
              </span>
              <span>
                <span className="block text-sm font-extrabold text-white">プラットフォーム管理</span>
                <span className="mt-0.5 block text-[11px] font-medium text-white/60">
                  ユーザー・店舗・商品の管理
                </span>
              </span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-white/45" strokeWidth={2.5} aria-hidden />
          </Link>
        ) : null}
      </div>
    </section>
  );
}
