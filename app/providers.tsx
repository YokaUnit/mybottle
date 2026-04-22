"use client";

import { StockProvider } from "@/components/mybottle/stock-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <StockProvider>{children}</StockProvider>;
}
