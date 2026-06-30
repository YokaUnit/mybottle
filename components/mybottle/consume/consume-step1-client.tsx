"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Check, MapPin, Plus, Search, ShoppingBag, Store, Wine, X } from "lucide-react";
import { BottleProductImage } from "@/components/mybottle/bottle-product-image";
import { useStock } from "@/components/mybottle/stock-provider";
import { useMasterData } from "@/components/mybottle/master-data-provider";
import type { StockItem, Store as StoreType } from "@/lib/mybottle/types";

type Props = {
  initialKey?: string;
  preferredStoreId?: string;
};

type StoreGroup = {
  store: StoreType;
  items: StockItem[];
};

function storeHaystack(store: StoreType) {
  return `${store.name} ${store.area}`;
}

export function ConsumeStep1Client({ initialKey = "", preferredStoreId = "" }: Props) {
  const { stock } = useStock();
  const { stores } = useMasterData();
  const [selectedKey, setSelectedKey] = useState(initialKey);
  const [query, setQuery] = useState("");
  const [storeFilterId, setStoreFilterId] = useState(preferredStoreId || "all");

  const stockByStoreId = useMemo(() => {
    const map = new Map<string, StockItem[]>();
    for (const item of stock) {
      const list = map.get(item.storeId) ?? [];
      list.push(item);
      map.set(item.storeId, list);
    }
    return map;
  }, [stock]);

  const storesWithStock = useMemo(() => {
    return stores
      .filter((store) => (stockByStoreId.get(store.id)?.length ?? 0) > 0)
      .sort((a, b) => a.name.localeCompare(b.name, "ja"));
  }, [stores, stockByStoreId]);

  const searchQuery = query.trim().toLowerCase();

  const matchingStores = useMemo(() => {
    return storesWithStock.filter((store) => {
      if (!searchQuery) return true;
      return storeHaystack(store).toLowerCase().includes(searchQuery);
    });
  }, [storesWithStock, searchQuery]);

  const visibleStoreGroups = useMemo((): StoreGroup[] => {
    const targetStores =
      storeFilterId === "all"
        ? matchingStores
        : matchingStores.filter((store) => store.id === storeFilterId);

    return targetStores
      .map((store) => ({
        store,
        items: [...(stockByStoreId.get(store.id) ?? [])].sort((a, b) =>
          a.productName.localeCompare(b.productName, "ja"),
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [matchingStores, stockByStoreId, storeFilterId]);

  const visibleStock = useMemo(
    () => visibleStoreGroups.flatMap((group) => group.items),
    [visibleStoreGroups],
  );

  useEffect(() => {
    if (preferredStoreId && storesWithStock.some((s) => s.id === preferredStoreId)) {
      setStoreFilterId(preferredStoreId);
    }
  }, [preferredStoreId, storesWithStock]);

  useEffect(() => {
    if (storeFilterId !== "all" && !matchingStores.some((s) => s.id === storeFilterId)) {
      setStoreFilterId("all");
    }
  }, [matchingStores, storeFilterId]);

  useEffect(() => {
    if (visibleStock.length === 0) return;
    const hasSelected = visibleStock.some((item) => `${item.storeId}:${item.productId}` === selectedKey);
    if (hasSelected) return;
    setSelectedKey(`${visibleStock[0].storeId}:${visibleStock[0].productId}`);
  }, [visibleStock, selectedKey]);

  const selected = useMemo(
    () => visibleStock.find((item) => `${item.storeId}:${item.productId}` === selectedKey),
    [selectedKey, visibleStock],
  );

  const selectedStoreName = selected
    ? (stores.find((s) => s.id === selected.storeId)?.name ?? "加盟店")
    : null;

  if (stock.length === 0) {
    return (
      <section className="mt-4 rounded-[1.25rem] border border-dashed border-[#cbd5e1] bg-white px-5 py-10 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#f0fdfa] text-[#14b8a6]">
          <Wine className="h-7 w-7" strokeWidth={2} aria-hidden />
        </div>
        <h2 className="mt-4 text-base font-extrabold text-[#1e293b]">使えるボトルがありません</h2>
        <p className="mt-2 text-sm font-medium leading-relaxed text-[#64748b]">
          QRでボトルを追加するか、店舗で購入してください。
        </p>
        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <Link
            href="/add-bottle"
            className="mb-btn-primary inline-flex w-full items-center justify-center gap-1.5 py-3.5 text-sm sm:w-auto sm:px-6"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden />
            ボトルを追加
          </Link>
          <Link
            href="/products/step-1"
            className="mb-btn-secondary inline-flex w-full items-center justify-center gap-1.5 py-3.5 text-sm sm:w-auto sm:px-6"
          >
            <ShoppingBag className="h-4 w-4" strokeWidth={2.25} aria-hidden />
            購入する
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="mt-4 space-y-4">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-[1.05rem] w-[1.05rem] -translate-y-1/2 text-[#0d9488]"
            strokeWidth={2.5}
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="店舗名・エリアで検索"
            className="mb-search-input"
            aria-label="店舗を検索"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-[#94a3b8] transition active:bg-[#f1f5f9]"
              aria-label="検索をクリア"
            >
              <X className="h-4 w-4" strokeWidth={2.5} />
            </button>
          ) : null}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => setStoreFilterId("all")}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-extrabold transition active:scale-[0.98] ${
              storeFilterId === "all"
                ? "bg-[#14b8a6] text-white shadow-[0_2px_8px_rgba(20,184,166,0.3)]"
                : "bg-white text-[#64748b] ring-1 ring-[#e2e8f0]"
            }`}
          >
            すべて（{storesWithStock.length}店舗）
          </button>
          {matchingStores.map((store) => {
            const count = stockByStoreId.get(store.id)?.length ?? 0;
            const active = storeFilterId === store.id;
            return (
              <button
                key={store.id}
                type="button"
                onClick={() => setStoreFilterId(store.id)}
                className={`max-w-[9rem] shrink-0 truncate rounded-full px-3 py-1.5 text-xs font-extrabold transition active:scale-[0.98] ${
                  active
                    ? "bg-[#14b8a6] text-white shadow-[0_2px_8px_rgba(20,184,166,0.3)]"
                    : "bg-white text-[#64748b] ring-1 ring-[#e2e8f0]"
                }`}
              >
                {store.name}（{count}）
              </button>
            );
          })}
        </div>

        {visibleStoreGroups.length === 0 ? (
          <div className="rounded-[1.15rem] border border-dashed border-[#cbd5e1] bg-white px-5 py-8 text-center">
            <Store className="mx-auto h-8 w-8 text-[#94a3b8]" strokeWidth={2} aria-hidden />
            <p className="mt-3 text-sm font-extrabold text-[#334155]">該当する店舗がありません</p>
            <p className="mt-1 text-xs font-medium text-[#94a3b8]">検索条件を変えてお試しください</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setStoreFilterId("all");
              }}
              className="mt-4 text-sm font-extrabold text-[#0d9488] underline-offset-2 active:underline"
            >
              絞り込みをリセット
            </button>
          </div>
        ) : (
          <div className="space-y-5" role="listbox" aria-label="店舗別のボトル一覧">
            {visibleStoreGroups.map((group) => (
              <div key={group.store.id} className="space-y-2.5">
                <div className="flex items-start gap-2 px-0.5">
                  <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#f0fdfa] text-[#14b8a6]">
                    <Store className="h-4 w-4" strokeWidth={2.25} aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-[0.9375rem] font-extrabold text-[#1e293b]">{group.store.name}</h2>
                    <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-[#64748b]">
                      <MapPin className="h-3 w-3 shrink-0 text-[#14b8a6]" strokeWidth={2.5} aria-hidden />
                      <span className="truncate">{group.store.area}</span>
                      <span className="text-[#cbd5e1]">·</span>
                      <span className="shrink-0 font-bold text-[#0d9488]">ボトル {group.items.length}本</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {group.items.map((item) => {
                    const key = `${item.storeId}:${item.productId}`;
                    const active = selectedKey === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        role="option"
                        aria-selected={active}
                        onClick={() => setSelectedKey(key)}
                        className={`flex w-full items-center gap-3 rounded-[1.15rem] border-2 bg-white p-3 text-left shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition active:scale-[0.99] ${
                          active
                            ? "border-[#14b8a6] bg-[#f0fdfa] ring-2 ring-[#14b8a6]/15"
                            : "border-[#e8ecf0] hover:border-[#99f6e4]"
                        }`}
                      >
                        <div className="mb-bottle-stage mb-bottle-stage--thumb shrink-0">
                          <div className="mb-bottle-stage__bottle">
                            <BottleProductImage
                              productId={item.productId}
                              type={item.type}
                              frameClassName="h-12 w-12"
                              fallbackEmojiClassName="text-xl"
                              plain
                            />
                          </div>
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[0.9375rem] font-extrabold text-[#1e293b]">
                            {item.productName}
                          </p>
                          <p className="mt-1 text-xs font-extrabold text-[#0d9488]">
                            残り {item.remainingUnits}
                            {item.unitLabel}
                          </p>
                        </div>

                        <span
                          className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition ${
                            active ? "border-[#14b8a6] bg-[#14b8a6] text-white" : "border-[#cbd5e1] bg-white"
                          }`}
                          aria-hidden
                        >
                          {active ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : null}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="fixed inset-x-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-30 mx-auto max-w-md px-4 sm:px-5">
        <div className="rounded-[1.15rem] border border-[#e2e8f0] bg-white/95 p-3 shadow-[0_-4px_24px_rgba(15,23,42,0.08)] backdrop-blur-sm">
          {selected && selectedStoreName ? (
            <p className="mb-2 truncate text-center text-xs font-bold text-[#64748b]">
              {selectedStoreName} · {selected.productName}
            </p>
          ) : null}
          <Link
            href={
              selected ? `/consume/step-2?storeId=${selected.storeId}&productId=${selected.productId}` : "#"
            }
            className={`mb-btn-primary w-full py-3.5 text-base ${selected ? "" : "pointer-events-none opacity-50"}`}
            aria-disabled={!selected}
          >
            次へ：杯数を選ぶ
          </Link>
        </div>
      </div>

      <div className="h-28" aria-hidden />
    </>
  );
}
