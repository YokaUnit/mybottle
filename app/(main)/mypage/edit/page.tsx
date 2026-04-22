import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { MyPageProfileForm } from "@/components/mybottle/mypage-profile-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function MyPageEditPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, email, phone")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <main className="space-y-4 pb-4 pt-2">
      <header className="mb-surface flex items-center gap-3 p-5">
        <Link
          href="/mypage"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--mb-muted)] text-[var(--mb-ink)]"
          aria-label="マイページへ戻る"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-[1.2rem] font-semibold tracking-[-0.02em] text-[var(--mb-ink)]">プロフィール編集</h1>
      </header>

      <MyPageProfileForm
        defaultDisplayName={profile?.display_name ?? user.user_metadata?.name ?? ""}
        defaultEmail={profile?.email ?? user.email ?? ""}
        defaultPhone={profile?.phone ?? user.phone ?? ""}
      />
    </main>
  );
}
