"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { BottleProductImage } from "@/components/mybottle/bottle-product-image";
import { catalog } from "@/lib/mybottle/catalog";
import { storeUiById } from "@/lib/mybottle/store-ui";
import { useStock } from "@/components/mybottle/stock-provider";
import { stores } from "@/lib/mybottle/stores";
import { PaymentMethod } from "@/lib/mybottle/types";
import { CreditCard, Smartphone } from "lucide-react";

function formatJpy(value: number) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value);
}

export function ProductCatalog() {
  const { purchase } = useStock();
  const [selectedStoreId, setSelectedStoreId] = useState(stores[0].id);
  const [selectedProductId, setSelectedProductId] = useState(catalog[0].id);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("apple_pay");
  const [message, setMessage] = useState("");

  const products = useMemo(
    () => [...catalog].sort((a, b) => a.priceJpy - b.priceJpy),
    [],
  );
  const selectedProduct = useMemo(
    () => products.find((item) => item.id === selectedProductId) ?? products[0],
    [products, selectedProductId],
  );
  const selectedStore = useMemo(
    () => stores.find((item) => item.id === selectedStoreId) ?? stores[0],
    [selectedStoreId],
  );
  const totalPrice = selectedProduct.priceJpy * quantity;

  return (
    <section className="mb-surface space-y-6 p-6">
      <header className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--mb-ink)]">ボトル購入方法</h2>
        <p className="text-sm font-medium text-[var(--mb-forest-light)]">STEP1〜STEP4（ワンページ版）</p>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        <section className="rounded-[var(--mb-radius-card)] border border-[var(--mb-ring)] bg-[var(--mb-muted)] p-4">
          <p className="mb-label-caps text-[var(--mb-forest)]">Step 1</p>
          <p className="mt-2 text-base font-semibold text-[var(--mb-ink)]">店舗を選択</p>
          <select
            value={selectedStoreId}
            onChange={(event) => setSelectedStoreId(event.target.value)}
            className="mt-3 w-full rounded-full border border-[var(--mb-ring)] bg-[var(--mb-card)] px-4 py-3 text-base font-medium text-[var(--mb-ink)] outline-none focus:ring-2 focus:ring-[var(--mb-accent)]/35"
          >
            {stores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}（{store.area}）
              </option>
            ))}
          </select>
          <div className="mt-3 flex items-center gap-3 rounded-[0.85rem] border border-[var(--mb-ring)] bg-[var(--mb-card)] p-3">
            <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-[var(--mb-muted)] ring-1 ring-[var(--mb-ring)]">
              <Image
                src={storeUiById[selectedStore.id]?.imageSrc ?? "/store/test1.png"}
                alt={`${selectedStore.name} 店舗画像`}
                fill
                unoptimized
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[var(--mb-ink)]">{selectedStore.name}</p>
              <p className="text-xs font-medium text-[var(--mb-forest-light)]">{selectedStore.area}</p>
            </div>
          </div>
        </section>

        <section className="rounded-[var(--mb-radius-card)] border border-[var(--mb-ring)] bg-[var(--mb-muted)] p-4">
          <p className="mb-label-caps text-[var(--mb-forest)]">Step 2</p>
          <p className="mt-2 text-base font-semibold text-[var(--mb-ink)]">ボトルを選択</p>
          <div className="mt-3 space-y-2">
            {products.map((product) => {
              const active = selectedProductId === product.id;
              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => setSelectedProductId(product.id)}
                  className={`flex w-full items-center gap-3 rounded-[0.85rem] border px-2 py-2 text-left transition active:opacity-90 ${
                    active
                      ? "border-[var(--mb-forest)]/35 bg-[var(--mb-card)] shadow-sm ring-1 ring-[var(--mb-ring)]"
                      : "border-transparent bg-[var(--mb-card)]/70 hover:bg-[var(--mb-card)]"
                  }`}
                >
                  <BottleProductImage
                    key={product.id}
                    productId={product.id}
                    type={product.type}
                    frameClassName="h-14 w-14 shrink-0"
                    fallbackEmojiClassName="text-xl"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[var(--mb-ink)]">{product.name}</p>
                    <p className="text-xs font-medium text-[var(--mb-forest-light)]">{formatJpy(product.priceJpy)}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-[var(--mb-radius-card)] border border-[var(--mb-ring)] bg-[var(--mb-muted)] p-4">
          <p className="mb-label-caps text-[var(--mb-forest)]">Step 3</p>
          <p className="mt-2 text-base font-semibold text-[var(--mb-ink)]">本数を選択</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {[1, 2, 3, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setQuantity(value)}
                className={`rounded-full px-4 py-2 text-base font-semibold transition active:opacity-90 ${
                  quantity === value
                    ? "bg-[var(--mb-forest)] text-white"
                    : "border border-[var(--mb-ring)] bg-[var(--mb-card)] text-[var(--mb-ink)]"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm font-medium text-[var(--mb-forest-light)]">
            合計{" "}
            <span className="text-xl font-semibold tabular-nums text-[var(--mb-forest)]">{formatJpy(totalPrice)}</span>
          </p>
          <p className="mt-1 text-xs font-medium text-[var(--mb-forest-light)]">
            {selectedProduct.bundleSize * quantity}
            {selectedProduct.unitLabel}がストックされます
          </p>
        </section>

        <section className="rounded-[var(--mb-radius-card)] border border-[var(--mb-ring)] bg-[var(--mb-muted)] p-4">
          <p className="mb-label-caps text-[var(--mb-forest)]">Step 4</p>
          <p className="mt-2 text-base font-semibold text-[var(--mb-ink)]">決済方法</p>
          <div className="mt-3 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod("apple_pay")}
              className={`flex items-center justify-center gap-2 rounded-full px-3 py-3 text-sm font-semibold transition active:opacity-90 ${
                paymentMethod === "apple_pay"
                  ? "bg-[var(--mb-forest)] text-white"
                  : "border border-[var(--mb-ring)] bg-[var(--mb-card)] text-[var(--mb-ink)]"
              }`}
            >
              <Smartphone className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
              Apple Pay
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("card")}
              className={`flex items-center justify-center gap-2 rounded-full px-3 py-3 text-sm font-semibold transition active:opacity-90 ${
                paymentMethod === "card"
                  ? "bg-[var(--mb-forest)] text-white"
                  : "border border-[var(--mb-ring)] bg-[var(--mb-card)] text-[var(--mb-ink)]"
              }`}
            >
              <CreditCard className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
              クレジットカード
            </button>
          </div>
          <button
            type="button"
            className="mt-4 w-full rounded-full bg-[var(--mb-forest)] px-4 py-4 text-base font-semibold text-white shadow-sm transition active:opacity-90"
            onClick={() => {
              for (let i = 0; i < quantity; i += 1) {
                purchase({
                  storeId: selectedStoreId,
                  productId: selectedProduct.id,
                  paymentMethod,
                });
              }
              setMessage(
                `${selectedStore.name}で ${selectedProduct.name} を${quantity}セット購入しました（合計${selectedProduct.bundleSize * quantity}${selectedProduct.unitLabel}）`,
              );
            }}
          >
            支払い
          </button>
        </section>
      </div>

      {message ? (
        <p className="rounded-[0.85rem] border border-[var(--mb-accent-dark)]/30 bg-[var(--mb-accent)]/25 px-4 py-3 text-sm font-medium text-[var(--mb-ink)]">
          {message}
        </p>
      ) : null}
    </section>
  );
}
