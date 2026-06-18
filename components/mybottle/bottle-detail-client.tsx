"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Beer } from "lucide-react";
import { BottleProductImage } from "@/components/mybottle/bottle-product-image";
import { useStock } from "@/components/mybottle/stock-provider";
import { useMasterData } from "@/components/mybottle/master-data-provider";

type Props = {
  storeId: string;
  productId: string;
};

function expiryLabel(updatedAt: string) {
  const d = new Date(updatedAt);
  d.setMonth(d.getMonth() + 3);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

export function BottleDetailClient({ storeId, productId }: Props) {
  const router = useRouter();
  const { stock, logs, removeBottle } = useStock();
  const { stores } = useMasterData();
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

  const productLogs = useMemo(
    () => logs.filter((l) => l.productId === productId).slice(0, 8),
    [logs, productId],
  );

  if (!item) {
    return (
      <div className="mb-surface px-5 py-10 text-center text-sm font-bold text-[var(--mb-forest-light)]">
        このボトルは見つかりませんでした。
        <Link href="/bottles" className="mt-4 block font-extrabold text-[var(--mb-teal-dark)]">
          ボトル一覧へ
        </Link>
      </div>
    );
  }

  const storeName = stores.find((s) => s.id === item.storeId)?.name ?? "加盟店";
  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(expiryLabel(item.updatedAt)).getTime() - now) / 86400000),
  );

  return (
    <>
      <div className="space-y-4 pb-4">
        <div className="mb-surface flex flex-col items-center px-5 py-8">
          <div className="mb-bottle-stage mb-bottle-stage--hero">
            <div className="mb-bottle-stage__bottle flex justify-center">
              <BottleProductImage
                key={item.productId}
                productId={item.productId}
                type={item.type}
                frameClassName="h-40 w-32"
                fallbackEmojiClassName="text-6xl"
                plain
              />
            </div>
          </div>
          <h1 className="mt-5 text-center text-[1.35rem] font-extrabold tracking-[-0.03em] text-[var(--mb-ink)]">
            {item.productName}
          </h1>
          <p className="mt-1 text-sm font-bold text-[var(--mb-forest-light)]">{storeName}</p>
        </div>

        <div className="mb-pop-card mb-pop-card--yellow rounded-[1.25rem] px-5 py-6 text-center shadow-[0_8px_24px_rgba(234,179,8,0.25)]">
          <p className="text-[0.6875rem] font-extrabold uppercase tracking-[0.12em] text-[#92400e]/75">残量</p>
          <p className="mt-2 text-[2.75rem] font-extrabold leading-none tracking-[-0.04em] text-red-600 tabular-nums">
            残り {item.remainingUnits}
            <span className="text-xl">{item.unitLabel}</span>
          </p>
          <p className="mt-3 text-sm font-bold text-[#78350f]">
            有効期限 {expiryLabel(item.updatedAt)}
            <span className="text-[var(--mb-forest-light)]"> · あと約 {daysLeft} 日</span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link
            href={`/consume/step-1?storeId=${storeId}&productId=${productId}`}
            className="mb-btn-primary w-full py-3.5 text-sm"
          >
            使用する
          </Link>
          <Link
            href={`/products/step-2?storeId=${storeId}`}
            className="mb-btn-secondary w-full py-3.5 text-sm"
          >
            追加購入
          </Link>
        </div>

        <section className="mb-surface p-5">
          <h2 className="flex items-center gap-2 text-sm font-extrabold text-[var(--mb-ink)]">
            <Beer className="h-4 w-4 text-[var(--mb-teal-dark)]" strokeWidth={2.5} aria-hidden />
            利用履歴
          </h2>
          <ul className="mt-4 space-y-0 text-sm">
            {productLogs.length === 0 ? (
              <li className="py-2 font-medium text-[var(--mb-forest-light)]">履歴はまだありません</li>
            ) : (
              productLogs.map((log) => (
                <li
                  key={log.id}
                  className="flex items-center justify-between gap-3 border-b border-[var(--mb-muted-strong)] py-3 last:border-0"
                >
                  <span className="text-xs font-bold text-[var(--mb-forest-light)]">
                    {new Date(log.createdAt).toLocaleDateString("ja-JP")}
                  </span>
                  <span className="font-extrabold text-[var(--mb-teal-dark)]">
                    -{log.units}
                    {log.unitLabel}
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>

        <Link href="/bottles" className="mb-btn-secondary w-full py-3.5 text-sm">
          一覧へ戻る
        </Link>

        <button
          type="button"
          className="w-full rounded-full border-2 border-red-200 bg-red-50 py-3.5 text-center text-sm font-extrabold text-red-600 transition active:opacity-90"
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
            className="w-full max-w-sm rounded-[var(--mb-radius-pop)] border border-red-200 bg-white p-6 shadow-[var(--mb-shadow-pop)]"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-base font-extrabold text-red-700">このボトルを削除しますか？</p>
            <p className="mt-2 text-sm font-medium text-red-600/90">この操作は取り消せません。</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="mb-btn-secondary w-full py-3 text-sm"
                onClick={() => setConfirmDelete(false)}
              >
                キャンセル
              </button>
              <button
                type="button"
                className="w-full rounded-full bg-red-500 py-3 text-sm font-extrabold text-white transition active:opacity-95"
                onClick={async () => {
                  await removeBottle({ storeId, productId });
                  router.push("/bottles");
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
