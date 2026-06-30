import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft, Shield } from "lucide-react";

export default function AdminManageShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-[#fffbeb] text-[#1e293b]">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-[#92400e]/30 bg-[#b45309] shadow-md">
        <div className="mx-auto flex h-14 w-full max-w-md items-center justify-between px-4">
          <div className="flex min-w-0 items-center gap-2 text-white">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/15">
              <Shield className="h-4 w-4" strokeWidth={2.25} aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#fde68a]">Admin Console</p>
              <p className="truncate text-sm font-extrabold">プラットフォーム管理</p>
            </div>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-extrabold text-white transition active:bg-white/25"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            お客様画面
          </Link>
        </div>
      </header>

      <div className="relative z-10 mx-auto w-full max-w-md px-4 pb-[calc(4.75rem+env(safe-area-inset-bottom))] pt-[calc(3.75rem+env(safe-area-inset-top))]">
        <Suspense>{children}</Suspense>
      </div>
    </div>
  );
}
