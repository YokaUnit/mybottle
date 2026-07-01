"use client";

import { useEffect, useState } from "react";
import { AppErrorScreen } from "@/components/mybottle/app-error-screen";

export function OfflineOverlay() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const sync = () => setOffline(!navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[var(--mb-bg)]">
      <AppErrorScreen
        variant="network"
        actions={[
          {
            label: "再接続を確認",
            href: "/",
            primary: true,
            onClick: () => window.location.reload(),
          },
          { label: "店舗一覧へ", href: "/stores" },
        ]}
      />
    </div>
  );
}
