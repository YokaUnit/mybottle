"use client";

import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { catalog } from "@/lib/mybottle/catalog";
import { ActivityLog, PaymentMethod, StockItem } from "@/lib/mybottle/types";
import { stores } from "@/lib/mybottle/stores";

const STORAGE_KEY = "mybottle.stock.v1";

type StockContextValue = {
  stock: StockItem[];
  logs: ActivityLog[];
  purchase: (params: {
    storeId: string;
    productId: string;
    paymentMethod: PaymentMethod;
  }) => void;
  consume: (params: { storeId: string; productId: string }) => boolean;
  giftOne: (params: { storeId: string; productId: string; friendName: string }) => boolean;
  transferOneToAnotherStore: (params: {
    fromStoreId: string;
    toStoreId: string;
    productId: string;
  }) => boolean;
  removeBottle: (params: { storeId: string; productId: string }) => void;
  setRemainingUnits: (params: {
    storeId: string;
    productId: string;
    remainingUnits: number;
  }) => void;
  getItem: (storeId: string, productId: string) => StockItem | undefined;
  totalUnits: number;
  totalSalesJpy: number;
};

const StockContext = createContext<StockContextValue | null>(null);

type PersistedState = {
  stock: StockItem[];
  logs: ActivityLog[];
};

function createLog(input: Omit<ActivityLog, "id" | "createdAt">): ActivityLog {
  return {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
}

function upsertStockItem(stock: StockItem[], storeId: string, productId: string): StockItem[] {
  const product = catalog.find((item) => item.id === productId);
  if (!product) return stock;

  const existing = stock.find(
    (item) => item.productId === productId && item.storeId === storeId,
  );
  const now = new Date().toISOString();

  if (!existing) {
    return [
      ...stock,
      {
        storeId,
        productId: product.id,
        productName: product.name,
        type: product.type,
        remainingUnits: product.bundleSize,
        unitLabel: product.unitLabel,
        updatedAt: now,
      },
    ];
  }

  return stock.map((item) =>
    item.productId === productId && item.storeId === storeId
      ? {
          ...item,
          remainingUnits: item.remainingUnits + product.bundleSize,
          updatedAt: now,
        }
      : item,
  );
}

function decrementStock(stock: StockItem[], storeId: string, productId: string): StockItem[] {
  return stock
    .map((item) =>
      item.productId === productId && item.storeId === storeId
        ? {
            ...item,
            remainingUnits: Math.max(item.remainingUnits - 1, 0),
            updatedAt: new Date().toISOString(),
          }
        : item,
    )
    .filter((item) => item.remainingUnits > 0);
}

const emptyState: PersistedState = { stock: [], logs: [] };

export function StockProvider({ children }: { children: React.ReactNode }) {
  /** SSR と初回クライアント描画を一致させる（localStorage はマウント後に読む） */
  const [state, setState] = useState<PersistedState>(emptyState);
  const [rehydrated, setRehydrated] = useState(false);

  const stock = state.stock;
  const logs = state.logs;

  useEffect(() => {
    startTransition(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as PersistedState;
          setState({
            stock: Array.isArray(parsed?.stock) ? parsed.stock : [],
            logs: Array.isArray(parsed?.logs) ? parsed.logs : [],
          });
        }
      } catch {
        /* 壊れたデータは無視 */
      }
      setRehydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!rehydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, rehydrated]);

  const purchase = useCallback(
    ({
      storeId,
      productId,
      paymentMethod,
    }: {
      storeId: string;
      productId: string;
      paymentMethod: PaymentMethod;
    }) => {
      const product = catalog.find((item) => item.id === productId);
      if (!product) return;

      setState((prev) => ({
        stock: upsertStockItem(prev.stock, storeId, productId),
        logs: [
          createLog({
            action: "purchase",
            storeId,
            productId,
            productName: product.name,
            units: product.bundleSize,
            unitLabel: product.unitLabel,
            detail:
              paymentMethod === "apple_pay"
                ? "Apple Payで前払い決済"
                : "クレジットカードで前払い決済",
          }),
          ...prev.logs,
        ].slice(0, 200),
      }));
    },
    [],
  );

  const consume = useCallback(({ storeId, productId }: { storeId: string; productId: string }) => {
    let consumed = false;
    const product = catalog.find((item) => item.id === productId);
    if (!product) return false;

    setState((prev) => {
      const target = prev.stock.find(
        (item) =>
          item.productId === productId && (item.storeId === storeId || item.type === "virtual"),
      );
      if (!target || target.remainingUnits <= 0) return prev;
      consumed = true;

      return {
        stock: decrementStock(
          prev.stock,
          target.type === "virtual" ? target.storeId : storeId,
          productId,
        ),
        logs: [
          createLog({
            action: "consume",
            storeId,
            productId,
            productName: target.productName,
            units: 1,
            unitLabel: target.unitLabel,
            detail: `提示確認で${stores.find((store) => store.id === storeId)?.name ?? "店舗"}にて提供`,
          }),
          ...prev.logs,
        ].slice(0, 200),
      };
    });
    return consumed;
  }, []);

  const giftOne = useCallback(
    ({
      storeId,
      productId,
      friendName,
    }: {
      storeId: string;
      productId: string;
      friendName: string;
    }) => {
      let gifted = false;
      setState((prev) => {
        const target = prev.stock.find(
          (item) =>
            item.productId === productId && (item.storeId === storeId || item.type === "virtual"),
        );
        if (!target || target.remainingUnits <= 0) return prev;
        gifted = true;
        return {
          stock: decrementStock(
            prev.stock,
            target.type === "virtual" ? target.storeId : storeId,
            productId,
          ),
          logs: [
            createLog({
              action: "gift",
              storeId,
              productId,
              productName: target.productName,
              units: 1,
              unitLabel: target.unitLabel,
              detail: `${friendName} さんへLINEギフト`,
            }),
            ...prev.logs,
          ].slice(0, 200),
        };
      });
      return gifted;
    },
    [],
  );

  const transferOneToAnotherStore = useCallback(
    ({
      fromStoreId,
      toStoreId,
      productId,
    }: {
      fromStoreId: string;
      toStoreId: string;
      productId: string;
    }) => {
      if (fromStoreId === toStoreId) return false;
      let transferred = false;
      setState((prev) => {
        const target = prev.stock.find(
          (item) => item.storeId === fromStoreId && item.productId === productId,
        );
        if (!target || target.remainingUnits <= 0 || target.type !== "virtual") return prev;
        transferred = true;

        return {
          stock: upsertStockItem(
            decrementStock(prev.stock, fromStoreId, productId),
            toStoreId,
            productId,
          ),
          logs: [
            createLog({
              action: "transfer",
              storeId: toStoreId,
              productId,
              productName: target.productName,
              units: 1,
              unitLabel: target.unitLabel,
              detail: `${stores.find((s) => s.id === fromStoreId)?.name ?? "A店"}から移動`,
            }),
            ...prev.logs,
          ].slice(0, 200),
        };
      });
      return transferred;
    },
    [],
  );

  const getItem = useCallback(
    (storeId: string, productId: string) =>
      stock.find((item) => item.productId === productId && item.storeId === storeId),
    [stock],
  );

  const removeBottle = useCallback(({ storeId, productId }: { storeId: string; productId: string }) => {
    setState((prev) => {
      const target = prev.stock.find(
        (item) => item.storeId === storeId && item.productId === productId,
      );
      if (!target) return prev;
      return {
        stock: prev.stock.filter(
          (item) => !(item.storeId === storeId && item.productId === productId),
        ),
        logs: [
          createLog({
            action: "remove",
            storeId,
            productId,
            productName: target.productName,
            units: target.remainingUnits,
            unitLabel: target.unitLabel,
            detail: "ボトルを削除しました",
          }),
          ...prev.logs,
        ].slice(0, 200),
      };
    });
  }, []);

  const setRemainingUnits = useCallback(
    ({
      storeId,
      productId,
      remainingUnits,
    }: {
      storeId: string;
      productId: string;
      remainingUnits: number;
    }) => {
      setState((prev) => {
        const target = prev.stock.find(
          (item) => item.storeId === storeId && item.productId === productId,
        );
        if (!target) return prev;
        const nextUnits = Math.max(0, Math.round(remainingUnits));
        const nextStock =
          nextUnits === 0
            ? prev.stock.filter(
                (item) => !(item.storeId === storeId && item.productId === productId),
              )
            : prev.stock.map((item) =>
                item.storeId === storeId && item.productId === productId
                  ? {
                      ...item,
                      remainingUnits: nextUnits,
                      updatedAt: new Date().toISOString(),
                    }
                  : item,
              );
        return {
          stock: nextStock,
          logs: [
            createLog({
              action: "update",
              storeId,
              productId,
              productName: target.productName,
              units: nextUnits,
              unitLabel: target.unitLabel,
              detail: `残量を${nextUnits}${target.unitLabel}に更新`,
            }),
            ...prev.logs,
          ].slice(0, 200),
        };
      });
    },
    [],
  );

  const totalUnits = useMemo(
    () => stock.reduce((sum, item) => sum + item.remainingUnits, 0),
    [stock],
  );
  const totalSalesJpy = useMemo(
    () =>
      logs
        .filter((log) => log.action === "purchase")
        .reduce((sum, log) => {
          const product = catalog.find((item) => item.id === log.productId);
          return sum + (product?.priceJpy ?? 0);
        }, 0),
    [logs],
  );

  const value = useMemo(
    () => ({
      stock,
      logs,
      purchase,
      consume,
      giftOne,
      transferOneToAnotherStore,
      removeBottle,
      setRemainingUnits,
      getItem,
      totalUnits,
      totalSalesJpy,
    }),
    [
      stock,
      logs,
      purchase,
      consume,
      giftOne,
      transferOneToAnotherStore,
      removeBottle,
      setRemainingUnits,
      getItem,
      totalUnits,
      totalSalesJpy,
    ],
  );

  return <StockContext.Provider value={value}>{children}</StockContext.Provider>;
}

export function useStock() {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error("useStock must be used within StockProvider");
  }
  return context;
}
