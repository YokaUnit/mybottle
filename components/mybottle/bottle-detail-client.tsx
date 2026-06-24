"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { History, Sparkles } from "lucide-react";
import { AnimatedCircularGauge } from "@/components/mybottle/animated-circular-gauge";
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
  const { stores, products } = useMasterData();
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
  const product = products.find((p) => p.id === productId);
  const maxUnits = product?.bundleSize ?? 10;
  const stockPct = Math.min(100, Math.round((item.remainingUnits / maxUnits) * 100));
  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(expiryLabel(item.updatedAt)).getTime() - now) / 86400000),
  );

  return (
    <>
      <div className="mb-bottle-detail-page">
        <article className="mb-bottle-detail-card mb-bottle-detail-enter mb-bottle-detail-enter--1 overflow-hidden rounded-[1.05rem] border border-[#e2e8f0]/80 bg-white shadow-[0_4px_14px_rgba(15,23,42,0.07)]">
          <div className="mb-bottle-stage mb-bottle-stage--pop mb-bottle-stage--detail-hero">
            <div className="mb-bottle-stage__bottle">
              <BottleProductImage
                key={item.productId}
                productId={item.productId}
                type={item.type}
                frameClassName="h-36 w-28"
                fallbackEmojiClassName="text-6xl"
                plain
              />
            </div>
          </div>
          <div className="mb-bottle-card-foot mb-bottle-detail-card__foot">
            <h1 className="mb-bottle-detail-hero__title">{item.productName}</h1>
            <p className="mb-bottle-detail-hero__store">{storeName}</p>
          </div>
        </article>

        <div className="mb-bottle-detail-stock mb-bottle-detail-enter mb-bottle-detail-enter--2">
          <div className="mb-bottle-detail-stock__ring">
            <AnimatedCircularGauge
              value={stockPct}
              centerText={`${item.remainingUnits}${item.unitLabel}`}
              caption="残量"
              className="mb-bottle-detail-gauge"
            />
          </div>
          <p className="mb-bottle-detail-stock__meta">
            有効期限 {expiryLabel(item.updatedAt)}
            <span> · あと約 {daysLeft} 日</span>
          </p>
        </div>

        <div className="mb-bottle-detail-actions mb-bottle-detail-enter mb-bottle-detail-enter--3">
          <Link
            href={`/consume/step-1?storeId=${storeId}&productId=${productId}`}
            className="mb-btn-primary w-full py-3.5 text-sm"
          >
            <Sparkles className="h-4 w-4" strokeWidth={2.25} aria-hidden />
            使用する
          </Link>
          <Link
            href={`/products/step-2?storeId=${storeId}`}
            className="mb-btn-secondary w-full py-3.5 text-sm"
          >
            追加購入
          </Link>
        </div>

        <section className="mb-surface mb-bottle-detail-history mb-bottle-detail-enter mb-bottle-detail-enter--4">
          <h2 className="mb-bottle-detail-history__title">
            <History className="h-4 w-4 text-[#14b8a6]" strokeWidth={2.25} aria-hidden />
            利用履歴
          </h2>
          <ul className="mb-bottle-detail-history__list">
            {productLogs.length === 0 ? (
              <li className="py-2 text-sm font-medium text-[#94a3b8]">履歴はまだありません</li>
            ) : (
              productLogs.map((log, index) => (
                <li
                  key={log.id}
                  className="mb-bottle-detail-history__row"
                  style={{ "--mb-row-delay": `${index * 55}ms` } as CSSProperties}
                >
                  <span className="mb-bottle-detail-history__date">
                    {new Date(log.createdAt).toLocaleDateString("ja-JP")}
                  </span>
                  <span className="mb-bottle-detail-history__amount">
                    -{log.units}
                    {log.unitLabel}
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>

        <Link
          href="/bottles"
          className="mb-btn-secondary mb-bottle-detail-enter mb-bottle-detail-enter--5 w-full py-3.5 text-sm"
        >
          一覧へ戻る
        </Link>

        <button
          type="button"
          className="mb-bottle-detail-delete mb-bottle-detail-enter mb-bottle-detail-enter--5"
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
