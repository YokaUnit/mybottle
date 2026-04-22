"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AnimatedCircularGauge } from "@/components/mybottle/animated-circular-gauge";
import { BottleProductImage } from "@/components/mybottle/bottle-product-image";
import { catalog } from "@/lib/mybottle/catalog";
import { stores } from "@/lib/mybottle/stores";
import { useStock } from "@/components/mybottle/stock-provider";

type Props = {
  storeId: string;
  productId: string;
};

function maxUnits(productId: string) {
  return catalog.find((p) => p.id === productId)?.bundleSize ?? 5;
}

function expiryLabel(updatedAt: string) {
  const d = new Date(updatedAt);
  d.setMonth(d.getMonth() + 3);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

export function BottleDetailClient({ storeId, productId }: Props) {
  const router = useRouter();
  const { stock, logs, setRemainingUnits, removeBottle } = useStock();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const item = useMemo(
    () => stock.find((s) => s.storeId === storeId && s.productId === productId),
    [stock, storeId, productId],
  );

  const max = maxUnits(productId);
  const productLogs = useMemo(
    () => logs.filter((l) => l.productId === productId).slice(0, 8),
    [logs, productId],
  );

  if (!item) {
    return (
      <div className="mb-surface px-5 py-10 text-center text-sm font-medium text-[var(--mb-forest-light)]">
        このボトルは見つかりませんでした。
        <Link href="/" className="mt-4 block font-semibold text-[var(--mb-accent-dark)]">
          ホームへ
        </Link>
      </div>
    );
  }

  const pct = Math.min(100, Math.round((item.remainingUnits / max) * 100));
  const storeName = stores.find((s) => s.id === item.storeId)?.name ?? "加盟店";
  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(expiryLabel(item.updatedAt)).getTime() - now) / 86400000),
  );

  return (
    <>
      <div className="space-y-4 pb-4">
        <div className="mb-surface flex flex-col items-center px-5 py-8">
          <BottleProductImage
            key={item.productId}
            productId={item.productId}
            type={item.type}
            frameClassName="h-40 w-32"
            fallbackEmojiClassName="text-6xl"
          />
          <h1 className="mt-5 text-center text-[1.35rem] font-semibold tracking-[-0.03em] text-[var(--mb-ink)]">
            {item.productName}
          </h1>
          <p className="mt-1 text-sm font-medium text-[var(--mb-forest-light)]">{storeName}</p>
          <p className="mt-2 text-xs font-medium text-[var(--mb-forest-light)]">
            有効期限 {expiryLabel(item.updatedAt)}
          </p>
        </div>

        <div className="mb-surface flex flex-col items-center px-5 py-8">
          <AnimatedCircularGauge value={pct} />
          <p className="mt-4 text-sm font-medium text-[var(--mb-ink)]">残り約 {daysLeft} 日</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="rounded-full bg-[var(--mb-forest)] py-3.5 text-sm font-semibold text-white transition active:opacity-90"
            onClick={() => {
              const next = Math.max(1, Math.round(max * 0.6));
              setRemainingUnits({ storeId, productId, remainingUnits: next });
            }}
          >
            残量を更新
          </button>
          <Link
            href={`/consume/step-1?storeId=${storeId}&productId=${productId}`}
            className="rounded-full border border-[var(--mb-forest)]/30 bg-[var(--mb-card)] py-3.5 text-center text-sm font-semibold text-[var(--mb-forest)] ring-1 ring-[var(--mb-ring)] transition active:opacity-90"
          >
            使用する
          </Link>
        </div>

        <section className="mb-surface p-5">
          <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--mb-forest-light)]">利用履歴</h2>
          <ul className="mt-4 space-y-0 text-sm">
            {productLogs.length === 0 ? (
              <li className="py-2 font-medium text-[var(--mb-forest-light)]">履歴はまだありません</li>
            ) : (
              productLogs.map((log) => (
                <li
                  key={log.id}
                  className="flex gap-4 border-b border-[var(--mb-muted-strong)] py-4 last:border-0 last:pb-0 first:pt-0"
                >
                  <BottleProductImage
                    key={`${log.id}-${log.productId}`}
                    productId={log.productId}
                    type={item.type}
                    frameClassName="h-11 w-11 shrink-0"
                    fallbackEmojiClassName="text-lg"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-medium text-[var(--mb-forest-light)]">
                      {new Date(log.createdAt).toLocaleDateString("ja-JP")}
                    </span>
                    <p className="mt-0.5 font-medium leading-snug text-[var(--mb-ink)]">{log.detail}</p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </section>

        <Link
          href="/"
          className="block rounded-full border border-[var(--mb-ring)] bg-[var(--mb-muted)] py-3.5 text-center text-sm font-semibold text-[var(--mb-forest)] transition hover:bg-[var(--mb-muted-strong)] active:opacity-80"
        >
          一覧へ戻る
        </Link>

        <button
          type="button"
          className="w-full rounded-full border border-red-200/90 bg-red-50/90 py-3.5 text-center text-sm font-semibold text-red-700 transition active:opacity-90 hover:bg-red-50"
          onClick={() => setConfirmDelete(true)}
        >
          このボトルを削除
        </button>
      </div>

      {confirmDelete ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-label="ボトル削除の確認"
          onClick={() => setConfirmDelete(false)}
        >
          <div
            className="w-full max-w-sm rounded-[var(--mb-radius-card)] border border-red-200/80 bg-[var(--mb-card)] p-6 shadow-[var(--mb-shadow-card)]"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-base font-semibold text-red-800">このボトルを削除しますか？</p>
            <p className="mt-2 text-sm font-medium text-red-700/95">この操作は取り消せません。</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="rounded-full border border-[var(--mb-ring)] bg-[var(--mb-muted)] py-3 text-sm font-semibold text-[var(--mb-ink)] transition active:opacity-90"
                onClick={() => setConfirmDelete(false)}
              >
                キャンセル
              </button>
              <button
                type="button"
                className="rounded-full bg-red-600 py-3 text-sm font-semibold text-white transition hover:bg-red-700 active:opacity-95"
                onClick={() => {
                  removeBottle({ storeId, productId });
                  router.push("/");
                }}
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
