"use client";

import { FriendsProvider } from "@/components/mybottle/friends-provider";
import { StockProvider } from "@/components/mybottle/stock-provider";
import { MasterDataProvider } from "@/components/mybottle/master-data-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MasterDataProvider>
      <StockProvider>
        <FriendsProvider>{children}</FriendsProvider>
      </StockProvider>
    </MasterDataProvider>
  );
}
