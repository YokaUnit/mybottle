import Link from "next/link";
import { QrCode } from "lucide-react";

export default function AddBottlePage() {
  return (
    <main className="space-y-5 pb-4 pt-2">
      <h1 className="mb-screen-title">ボトルを追加</h1>
      <p className="text-sm font-bold text-[var(--mb-forest-light)]">店舗のQRコードをスキャンして登録します</p>

      <div className="relative aspect-[3/4] overflow-hidden rounded-[1.35rem] border-4 border-[var(--mb-teal)]/30 bg-[#0f172a] shadow-[var(--mb-shadow-pop)]">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <QrCode className="h-12 w-12 text-[var(--mb-teal)]" strokeWidth={1.75} aria-hidden />
          <p className="mt-4 text-sm font-extrabold">カメラプレビュー</p>
          <p className="mt-2 px-6 text-center text-xs font-medium text-white/70">
            QR枠の中にコードを合わせてください
          </p>
        </div>
        <div className="pointer-events-none absolute inset-10 rounded-2xl border-4 border-[var(--mb-yellow)] shadow-[0_0_0_9999px_rgba(15,23,42,0.35)]" />
      </div>

      <p className="text-center text-sm font-bold text-[var(--mb-forest-light)]">
        店舗のQRコードを枠内に合わせてください
      </p>

      <Link href="/products/step-1" className="mb-btn-secondary w-full py-4 text-base">
        手動で登録する
      </Link>
      <Link href="/" className="block text-center text-sm font-extrabold text-[var(--mb-teal-dark)]">
        キャンセルしてホームへ
      </Link>
    </main>
  );
}
