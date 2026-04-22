"use client";

import { useRouter } from "next/navigation";
import { clearBrowserSession } from "@/lib/mybottle/session";

export function LogoutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      className="block w-full px-5 py-4 text-left text-sm font-semibold text-[var(--mb-accent-dark)] transition active:opacity-80"
      onClick={() => {
        clearBrowserSession();
        router.push("/login");
        router.refresh();
      }}
    >
      ログアウト
    </button>
  );
}
