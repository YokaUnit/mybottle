"use client";

import { useTransition } from "react";
import {
  toggleStoreProductSellingAction,
  toggleStoreProductSoldOutAction,
  updateStoreProductAction,
} from "@/app/(store-manage)/dashboard/actions";
import type { StoreProductManage } from "@/lib/store-manage/types";

function formatJpy(n: number) {
  return new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 }).format(n);
}

type Props = {
  storeId: string;
  products: StoreProductManage[];
};

export function StoreManageBottlesClient({ storeId, products }: Props) {
  const [pending, start] = useTransition();

  if (products.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-[#e2e8f0]">
        <p className="text-sm font-bold text-[#64748b]">この店舗のボトルがまだ登録されていません。</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {products.map((product) => (
        <article key={product.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#e2e8f0]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-extrabold text-[#1e293b]">{product.productName}</p>
              <p className="mt-0.5 text-xs font-medium text-[#64748b]">
                残り目安: {product.bundleSize}
                {product.unitLabel}/セット
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <ToggleChip
                label="販売"
                on={product.isSelling}
                disabled={pending}
                onToggle={(next) =>
                  start(async () => {
                    const fd = new FormData();
                    fd.set("storeId", storeId);
                    fd.set("productRowId", product.id);
                    fd.set("isSelling", String(next));
                    await toggleStoreProductSellingAction(fd);
                  })
                }
              />
              <ToggleChip
                label="在庫切れ"
                on={product.isSoldOut}
                tone="warn"
                disabled={pending}
                onToggle={(next) =>
                  start(async () => {
                    const fd = new FormData();
                    fd.set("storeId", storeId);
                    fd.set("productRowId", product.id);
                    fd.set("isSoldOut", String(next));
                    await toggleStoreProductSoldOutAction(fd);
                  })
                }
              />
            </div>
          </div>

          <form
            className="mt-4 grid grid-cols-2 gap-3"
            action={(fd) => {
              start(async () => {
                fd.set("storeId", storeId);
                fd.set("productRowId", product.id);
                fd.set("isSelling", String(product.isSelling));
                await updateStoreProductAction(fd);
              });
            }}
          >
            <label className="space-y-1">
              <span className="text-[10px] font-bold text-[#64748b]">通常価格</span>
              <input
                name="regularPriceJpy"
                type="number"
                min={100}
                defaultValue={product.regularPriceJpy}
                className="w-full rounded-xl border border-[#e2e8f0] px-3 py-2 text-sm font-bold"
              />
            </label>
            <label className="space-y-1">
              <span className="text-[10px] font-bold text-[#0d9488]">mybottle価格</span>
              <input
                name="mybottlePriceJpy"
                type="number"
                min={100}
                defaultValue={product.mybottlePriceJpy}
                className="w-full rounded-xl border border-[#99f6e4] bg-[#f0fdfa] px-3 py-2 text-sm font-bold text-[#0f766e]"
              />
            </label>
            <label className="space-y-1">
              <span className="text-[10px] font-bold text-[#64748b]">最低購入（セット）</span>
              <input
                name="minPurchaseSets"
                type="number"
                min={1}
                max={99}
                defaultValue={product.minPurchaseSets}
                className="w-full rounded-xl border border-[#e2e8f0] px-3 py-2 text-sm font-bold"
              />
            </label>
            <label className="space-y-1">
              <span className="text-[10px] font-bold text-[#64748b]">最大購入（セット）</span>
              <input
                name="maxPurchaseSets"
                type="number"
                min={1}
                max={99}
                defaultValue={product.maxPurchaseSets ?? ""}
                placeholder="制限なし"
                className="w-full rounded-xl border border-[#e2e8f0] px-3 py-2 text-sm font-bold"
              />
            </label>
            <label className="col-span-2 space-y-1">
              <span className="text-[10px] font-bold text-[#64748b]">有効期限（購入日から・日）</span>
              <input
                name="validityDays"
                type="number"
                min={1}
                max={365}
                defaultValue={product.validityDays}
                className="w-full rounded-xl border border-[#e2e8f0] px-3 py-2 text-sm font-bold"
              />
            </label>
            <p className="col-span-2 text-xs font-medium text-[#94a3b8]">
              通常 {formatJpy(product.regularPriceJpy)} → mybottle {formatJpy(product.mybottlePriceJpy)}
            </p>
            <button
              type="submit"
              disabled={pending}
              className="col-span-2 rounded-full bg-[#0d9488] py-3 text-sm font-extrabold text-white disabled:opacity-60"
            >
              保存する
            </button>
          </form>
        </article>
      ))}
    </div>
  );
}

function ToggleChip({
  label,
  on,
  onToggle,
  disabled,
  tone = "default",
}: {
  label: string;
  on: boolean;
  onToggle: (next: boolean) => void;
  disabled?: boolean;
  tone?: "default" | "warn";
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onToggle(!on)}
      className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold transition ${
        on
          ? tone === "warn"
            ? "bg-[#fef2f2] text-[#dc2626] ring-1 ring-[#fecaca]"
            : "bg-[#ecfdf5] text-[#0d9488] ring-1 ring-[#99f6e4]"
          : "bg-[#f1f5f9] text-[#94a3b8]"
      }`}
    >
      {label}: {on ? "ON" : "OFF"}
    </button>
  );
}
