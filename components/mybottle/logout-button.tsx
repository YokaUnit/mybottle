"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      className="block w-full px-5 py-4 text-left text-sm font-semibold text-[var(--mb-accent-dark)] transition active:opacity-80"
      onClick={async () => {
        const supabase = createSupabaseBrowserClient();
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
      }}
    >
      ログアウト
    </button>
  );
}
