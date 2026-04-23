"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  consumeAction,
  getStockStateAction,
  purchaseAction,
  removeBottleAction,
  setRemainingUnitsAction,
} from "@/app/(main)/actions/stock-actions";
import { ActivityLog, PaymentMethod, StockItem } from "@/lib/mybottle/types";
import { useMasterData } from "@/components/mybottle/master-data-provider";

type StockContextValue = {
  stock: StockItem[];
  logs: ActivityLog[];
  purchase: (params: {
    storeId: string;
    productId: string;
    paymentMethod: PaymentMethod;
    quantitySets?: number;
  }) => Promise<void>;
  consume: (params: { storeId: string; productId: string; units?: number }) => Promise<boolean>;
  giftOne: (params: { storeId: string; productId: string; friendName: string }) => Promise<boolean>;
  transferOneToAnotherStore: (params: {
    fromStoreId: string;
    toStoreId: string;
    productId: string;
  }) => Promise<boolean>;
  removeBottle: (params: { storeId: string; productId: string }) => Promise<void>;
  setRemainingUnits: (params: {
    storeId: string;
    productId: string;
    remainingUnits: number;
  }) => Promise<void>;
  getItem: (storeId: string, productId: string) => StockItem | undefined;
  totalUnits: number;
  totalSalesJpy: number;
};

const StockContext = createContext<StockContextValue | null>(null);

type StockState = {
  stock: StockItem[];
  logs: ActivityLog[];
};

const emptyState: StockState = { stock: [], logs: [] };

export function StockProvider({ children }: { children: React.ReactNode }) {
  const { products } = useMasterData();
  const [state, setState] = useState<StockState>(emptyState);

  const stock = state.stock;
  const logs = state.logs;

  const refreshState = useCallback(async () => {
    const next = await getStockStateAction();
    setState(next);
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void refreshState();
    });
  }, [refreshState]);

  const purchase = useCallback(
    async ({
      storeId,
      productId,
      paymentMethod,
      quantitySets,
    }: {
      storeId: string;
      productId: string;
      paymentMethod: PaymentMethod;
      quantitySets?: number;
    }) => {
      await purchaseAction({ storeId, productId, paymentMethod, quantitySets });
      await refreshState();
    },
    [refreshState],
  );

  const consume = useCallback(
    async ({
      storeId,
      productId,
      units,
    }: {
      storeId: string;
      productId: string;
      units?: number;
    }) => {
      const ok = await consumeAction({ storeId, productId, units });
      await refreshState();
      return ok;
    },
    [refreshState],
  );

  const giftOne = useCallback(
    async ({
      storeId,
      productId,
      friendName,
    }: {
      storeId: string;
      productId: string;
      friendName: string;
    }) => {
      const ok = await consumeAction({ storeId, productId });
      if (!ok) return false;
      const product = products.find((item) => item.id === productId);
      if (!product) return false;
      setState((prev) => ({
        ...prev,
        logs: [
          {
            id: crypto.randomUUID(),
            action: "gift",
            storeId,
            productId,
            productName: product.name,
            units: 1,
            unitLabel: product.unitLabel,
            detail: `${friendName} さんへLINEギフト`,
            createdAt: new Date().toISOString(),
          },
          ...prev.logs,
        ],
      }));
      await refreshState();
      return true;
    },
    [products, refreshState],
  );

  const transferOneToAnotherStore = useCallback(
    async ({
      fromStoreId,
      toStoreId,
      productId,
    }: {
      fromStoreId: string;
      toStoreId: string;
      productId: string;
    }) => {
      if (fromStoreId === toStoreId) return false;
      const consumed = await consumeAction({ storeId: fromStoreId, productId });
      if (!consumed) return false;
      await purchaseAction({ storeId: toStoreId, productId, paymentMethod: "card" });
      await refreshState();
      return true;
    },
    [refreshState],
  );

  const getItem = useCallback(
    (storeId: string, productId: string) =>
      stock.find((item) => item.productId === productId && item.storeId === storeId),
    [stock],
  );

  const removeBottle = useCallback(
    async ({ storeId, productId }: { storeId: string; productId: string }) => {
      await removeBottleAction({ storeId, productId });
      await refreshState();
    },
    [refreshState],
  );

  const setRemainingUnits = useCallback(
    async ({
      storeId,
      productId,
      remainingUnits,
    }: {
      storeId: string;
      productId: string;
      remainingUnits: number;
    }) => {
      await setRemainingUnitsAction({ storeId, productId, remainingUnits });
      await refreshState();
    },
    [refreshState],
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
          const product = products.find((item) => item.id === log.productId);
          return sum + (product?.priceJpy ?? 0);
        }, 0),
    [logs, products],
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
