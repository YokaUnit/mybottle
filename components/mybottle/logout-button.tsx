"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 px-5 py-4 text-left text-sm font-extrabold text-red-500 transition active:bg-red-50/80"
      onClick={async () => {
        const supabase = createSupabaseBrowserClient();
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
      }}
    >
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-red-50 text-red-500">
        <LogOut className="h-4 w-4" strokeWidth={2.25} aria-hidden />
      </span>
      ログアウト
    </button>
  );
}
