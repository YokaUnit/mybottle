import Link from "next/link";
import { ChevronRight, UserRound } from "lucide-react";
import { LogoutButton } from "@/components/mybottle/logout-button";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function MyPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id ?? null;
  const { data: profile } = userId
    ? await supabase
        .from("profiles")
        .select("display_name, email, phone, avatar_url")
        .eq("id", userId)
        .maybeSingle()
    : { data: null };

  const displayName = profile?.display_name ?? user?.user_metadata?.name ?? "未設定";
  const email = profile?.email ?? user?.email ?? "メール未設定";
  const phone = profile?.phone ?? user?.phone ?? "";

  return (
    <main className="space-y-5 pb-4 pt-2">
      <h1 className="mb-screen-title">マイページ</h1>

      <section className="mb-surface flex items-center gap-4 p-5">
        {profile?.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatar_url}
            alt="プロフィール画像"
            className="h-16 w-16 rounded-full object-cover ring-1 ring-[var(--mb-ring)]"
          />
        ) : (
          <div className="grid h-16 w-16 place-items-center rounded-full bg-[var(--mb-muted)] text-[var(--mb-forest)] ring-1 ring-[var(--mb-ring)]">
            <UserRound className="h-8 w-8" strokeWidth={1.75} aria-hidden />
          </div>
        )}
        <div>
          <p className="text-lg font-semibold tracking-[-0.02em] text-[var(--mb-ink)]">{displayName}</p>
          <p className="text-sm font-medium text-[var(--mb-forest-light)]">{email}</p>
          {phone ? <p className="text-xs font-medium text-[var(--mb-forest-light)]">{phone}</p> : null}
        </div>
      </section>

      <nav className="mb-surface overflow-hidden">
        {[
          { href: user ? "/mypage/edit" : "/login", label: "プロフィール編集" },
          { href: "#", label: "通知設定" },
          { href: "#", label: "パスコード設定" },
          { href: "#", label: "ヘルプ・お問い合わせ" },
        ].map((row) => (
          <Link
            key={row.label}
            href={row.href}
            className="flex items-center justify-between border-b border-[var(--mb-muted-strong)] px-5 py-4 text-sm font-medium text-[var(--mb-ink)] last:border-0"
          >
            {row.label}
            <ChevronRight className="h-4 w-4 shrink-0 text-[var(--mb-forest-light)]" strokeWidth={2} aria-hidden />
          </Link>
        ))}
        <LogoutButton />
      </nav>

      <Link
        href="/dashboard"
        className="block text-center text-xs font-medium text-[var(--mb-forest-light)]"
      >
        店舗向けダッシュボード（運営）
      </Link>
    </main>
  );
}
