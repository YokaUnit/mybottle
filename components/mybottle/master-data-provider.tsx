"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Product, Store } from "@/lib/mybottle/types";
import { StoreUiMeta } from "@/lib/supabase/mybottle";

type MasterDataContextValue = {
  stores: Store[];
  products: Product[];
  storeUiById: Record<string, StoreUiMeta>;
  loading: boolean;
};

const MasterDataContext = createContext<MasterDataContextValue | null>(null);

export function MasterDataProvider({ children }: { children: React.ReactNode }) {
  const [stores, setStores] = useState<Store[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [storeUiById, setStoreUiById] = useState<Record<string, StoreUiMeta>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const response = await fetch("/api/master-data", { credentials: "include" });
        if (!response.ok) return;
        const data = (await response.json()) as {
          stores: Store[];
          products: Product[];
          storeUiById: Record<string, StoreUiMeta>;
        };
        if (!active) return;
        setStores(data.stores ?? []);
        setProducts(data.products ?? []);
        setStoreUiById(data.storeUiById ?? {});
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(
    () => ({ stores, products, storeUiById, loading }),
    [stores, products, storeUiById, loading],
  );

  return <MasterDataContext.Provider value={value}>{children}</MasterDataContext.Provider>;
}

export function useMasterData() {
  const context = useContext(MasterDataContext);
  if (!context) {
    throw new Error("useMasterData must be used within MasterDataProvider");
  }
  return context;
}
