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
    <div className="space-y-3">
      <section
        className="overflow-hidden rounded-[1.25rem] border border-[#0a3d38]/20 bg-[#0d4f4a] shadow-[0_8px_24px_rgba(13,79,74,0.22)]"
        aria-label="店舗スタッフ向けメニュー"
      >
        <div className="border-b border-white/10 px-5 py-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#99f6e4]">店舗スタッフ向け</p>
          <p className="mt-0.5 text-xs font-medium text-white/70">担当店舗の管理はこちらから</p>
        </div>

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
              <span className="mt-0.5 block text-[11px] font-medium text-white/60">ボトル・PIN・特典など</span>
            </span>
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-white/45" strokeWidth={2.5} aria-hidden />
        </Link>
      </section>

      {isAdmin ? (
        <section
          className="overflow-hidden rounded-[1.25rem] border border-[#92400e]/25 bg-[#b45309] shadow-[0_8px_24px_rgba(180,83,9,0.28)]"
          aria-label="管理者向けメニュー"
        >
          <div className="border-b border-white/10 px-5 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#fde68a]">プラットフォーム管理者向け</p>
            <p className="mt-0.5 text-xs font-medium text-white/75">ユーザー・店舗・商品の全体管理</p>
          </div>

          <Link
            href="/admin"
            className="flex items-center justify-between px-5 py-4 transition active:bg-white/5"
          >
            <span className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 text-[#fef08a]">
                <Shield className="h-5 w-5" strokeWidth={2.25} aria-hidden />
              </span>
              <span>
                <span className="block text-sm font-extrabold text-white">管理者ダッシュボード</span>
                <span className="mt-0.5 block text-[11px] font-medium text-white/65">
                  店舗・ユーザー・お知らせ
                </span>
              </span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-white/50" strokeWidth={2.5} aria-hidden />
          </Link>
        </section>
      ) : null}
    </div>
  );
}
