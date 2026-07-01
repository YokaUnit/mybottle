"use client";

import { useEffect } from "react";
import { AppErrorScreen } from "@/components/mybottle/app-error-screen";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

function isLikelyNetworkError(error: Error) {
  const msg = error.message.toLowerCase();
  return (
    msg.includes("fetch") ||
    msg.includes("network") ||
    msg.includes("failed to fetch") ||
    msg.includes("load failed") ||
    msg.includes("timeout")
  );
}

export default function MainError({ error, reset }: Props) {
  useEffect(() => {
    console.error("[app error]", error);
  }, [error]);

  const network = isLikelyNetworkError(error);

  return (
    <main>
      <AppErrorScreen
      variant={network ? "network" : "not-found"}
      actions={
        network
          ? [
              { label: "もう一度試す", href: "", primary: true, onClick: () => reset() },
              { label: "ホームへ", href: "/" },
            ]
          : [
              { label: "ホームへ", href: "/", primary: true },
              { label: "店舗を探す", href: "/stores" },
            ]
      }
    />
    </main>
  );
}
