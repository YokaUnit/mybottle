import Link from "next/link";

export default function AddBottlePage() {
  return (
    <main className="space-y-5 pb-4 pt-2">
      <h1 className="mb-screen-title">ボトルを追加</h1>
      <p className="text-sm font-medium text-[var(--mb-forest-light)]">店舗のQRコードをスキャンして登録します</p>

      <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--mb-radius-card)] border border-[var(--mb-ring)] bg-black shadow-[var(--mb-shadow-card)]">
        {/* 差し替え: カメラオーバーレイ用のフレーム画像や実カメラUI */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1a1a1a] text-white">
          <p className="text-sm font-semibold">カメラプレビュー</p>
          <p className="mt-2 px-6 text-center text-xs font-medium text-white/70">
            QR枠のデザイン画像をここに配置できます
          </p>
        </div>
        <div className="pointer-events-none absolute inset-8 rounded-lg border-2 border-[var(--mb-accent)]" />
      </div>

      <p className="text-center text-sm font-medium text-[var(--mb-forest-light)]">
        店舗のQRコードを枠内に合わせてください
      </p>

      <Link
        href="/products/step-1"
        className="block rounded-full border border-[var(--mb-forest)]/25 bg-[var(--mb-card)] py-4 text-center text-base font-semibold text-[var(--mb-forest)] ring-1 ring-[var(--mb-ring)] transition active:opacity-90"
      >
        手動で登録する
      </Link>
      <Link href="/" className="block text-center text-sm font-semibold text-[var(--mb-accent-dark)]">
        キャンセルしてホームへ
      </Link>
    </main>
  );
}
