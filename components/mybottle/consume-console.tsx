"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BottleProductImage } from "@/components/mybottle/bottle-product-image";
import { useStock } from "@/components/mybottle/stock-provider";
import { stores } from "@/lib/mybottle/stores";

function createToken() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function ConsumeConsole() {
  const searchParams = useSearchParams();
  const initialProductId = searchParams.get("productId") ?? "";
  const initialStoreId = searchParams.get("storeId") ?? stores[0].id;
  const { stock, consume } = useStock();

  const [selectedProductId, setSelectedProductId] = useState(initialProductId);
  const [selectedStoreId, setSelectedStoreId] = useState(initialStoreId);
  const [token, setToken] = useState("");
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const selectedItem = useMemo(
    () =>
      stock.find(
        (item) =>
          item.productId === selectedProductId &&
          (item.storeId === selectedStoreId || item.type === "virtual"),
      ),
    [stock, selectedProductId, selectedStoreId],
  );

  useEffect(() => {
    if (!expiresAt) return;
    const timer = window.setInterval(() => {
      const diff = Math.max(Math.ceil((expiresAt - Date.now()) / 1000), 0);
      setRemainingSeconds(diff);
      if (diff <= 0) {
        setExpiresAt(null);
        setToken("");
      }
    }, 200);
    return () => window.clearInterval(timer);
  }, [expiresAt]);

  if (stock.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-600">
        消費する在庫がありません。購入画面で先にまとめ買いしてください。
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {message ? (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>
      ) : null}

      <div className="rounded-2xl border border-zinc-200 bg-white p-5">
        <label className="mb-2 block text-sm font-medium">提示先の店舗</label>
        <select
          className="mb-4 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm"
          value={selectedStoreId}
          onChange={(event) => setSelectedStoreId(event.target.value)}
        >
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>

        <label className="mb-2 block text-sm font-medium">消費する商品</label>
        <select
          className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm"
          value={selectedProductId}
          onChange={(event) => setSelectedProductId(event.target.value)}
        >
          <option value="">選択してください</option>
          {stock.map((item) => (
            <option key={`${item.storeId}-${item.productId}`} value={item.productId}>
              {item.productName}（残り {item.remainingUnits}
              {item.unitLabel}）
            </option>
          ))}
        </select>

        {selectedItem ? (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
            <BottleProductImage
              key={`${selectedItem.storeId}-${selectedItem.productId}`}
              productId={selectedItem.productId}
              type={selectedItem.type}
              frameClassName="h-16 w-16 shrink-0"
              fallbackEmojiClassName="text-2xl"
            />
            <div className="min-w-0 text-sm">
              <p className="font-bold text-zinc-900">{selectedItem.productName}</p>
              <p className="text-zinc-500">
                残り {selectedItem.remainingUnits}
                {selectedItem.unitLabel}
              </p>
            </div>
          </div>
        ) : null}

        <button
          type="button"
          className="mt-4 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
          onClick={() => {
            if (!selectedItem) return;
            const newToken = createToken();
            setToken(newToken);
            setExpiresAt(Date.now() + 15000);
            setRemainingSeconds(15);
            setMessage("提示画面を生成しました。店員確認後に提供完了を押してください。");
          }}
          disabled={!selectedItem}
        >
          提示画面を表示
        </button>
      </div>

      {token && selectedItem ? (
        <div className="rounded-2xl border border-zinc-900 bg-zinc-900 p-6 text-white">
          <div className="flex gap-4">
            <div className="rounded-xl bg-white/10 p-1 ring-1 ring-white/10">
              <BottleProductImage
                key={`tok-${selectedItem.productId}`}
                productId={selectedItem.productId}
                type={selectedItem.type}
                frameClassName="h-20 w-20"
                fallbackEmojiClassName="text-3xl"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs tracking-[0.15em] text-zinc-400">MYBOTTLE VERIFY</p>
              <p className="mt-2 text-xl font-bold">{selectedItem.productName}</p>
            </div>
          </div>
          <p className="mt-1 text-sm text-zinc-300">店員確認用ワンタイムコード</p>

          <div className="mt-4 inline-flex animate-pulse rounded-xl bg-emerald-400/20 px-4 py-2 text-3xl font-semibold tabular-nums tracking-widest text-emerald-300">
            {token}
          </div>

          <p className="mt-3 text-sm text-zinc-300">有効期限: あと {remainingSeconds} 秒</p>
              <p className="mt-1 text-xs text-zinc-400">
                店舗: {stores.find((store) => store.id === selectedStoreId)?.name}
              </p>

          <button
            type="button"
            className="mt-5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-900"
            onClick={() => {
              const ok = consume({
                storeId: selectedStoreId,
                productId: selectedItem.productId,
              });
              if (!ok) {
                setMessage("在庫不足のため消費を確定できませんでした。");
                return;
              }
              setToken("");
              setExpiresAt(null);
              setRemainingSeconds(0);
              setMessage(`${selectedItem.productName} を1${selectedItem.unitLabel}消費しました。`);
            }}
          >
            提供完了として1{selectedItem.unitLabel}消費
          </button>
        </div>
      ) : null}
    </section>
  );
}
