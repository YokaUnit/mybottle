"use client";

import { FriendsProvider } from "@/components/mybottle/friends-provider";
import { CookieConsent } from "@/components/mybottle/legal/cookie-consent";
import { OfflineOverlay } from "@/components/mybottle/offline-overlay";
import { StockProvider } from "@/components/mybottle/stock-provider";
import { MasterDataProvider } from "@/components/mybottle/master-data-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MasterDataProvider>
      <StockProvider>
        <FriendsProvider>
          {children}
          <OfflineOverlay />
          <CookieConsent />
        </FriendsProvider>
      </StockProvider>
    </MasterDataProvider>
  );
}
