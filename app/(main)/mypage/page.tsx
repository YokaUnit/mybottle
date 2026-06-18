import Link from "next/link";
import {
  Beer,
  ChevronRight,
  Gift,
  Heart,
  History,
  Settings,
  UserRound,
} from "lucide-react";
import { LogoutButton } from "@/components/mybottle/logout-button";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const menuItems = [
  { href: "/bottles", label: "ボトル一覧", Icon: Beer },
  { href: "/history", label: "利用履歴", Icon: History },
  { href: "/benefits", label: "特典・クーポン", Icon: Gift },
  { href: "/favorites", label: "お気に入り店舗", Icon: Heart },
  { href: "/mypage/edit", label: "設定", Icon: Settings },
] as const;

export default async function MyPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id ?? null;
  const { data: profile } = userId
    ? await supabase
        .from("profiles")
        .select("display_name, email, phone, avatar_url, role")
        .eq("id", userId)
        .maybeSingle()
    : { data: null };

  const displayName = profile?.display_name ?? user?.user_metadata?.name ?? "未設定";
  const email = profile?.email ?? user?.email ?? "メール未設定";
  const handle = email.includes("@") ? `@${email.split("@")[0]}` : "@user";
  const role = profile?.role === "admin" || profile?.role === "staff" ? profile.role : "user";
  const canUseDashboard = role === "staff" || role === "admin";
  const isAdmin = role === "admin";

  return (
    <main className="space-y-5 pb-4 pt-2">
      <h1 className="mb-screen-title">マイページ</h1>

      <section className="mb-pop-card mb-pop-card--teal flex items-center gap-4 rounded-[1.25rem] p-5">
        {profile?.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatar_url}
            alt="プロフィール画像"
            className="h-16 w-16 rounded-full object-cover ring-2 ring-white/40"
          />
        ) : (
          <div className="grid h-16 w-16 place-items-center rounded-full bg-white/20 text-white ring-2 ring-white/40">
            <UserRound className="h-8 w-8" strokeWidth={2} aria-hidden />
          </div>
        )}
        <div>
          <p className="text-lg font-extrabold text-white">{displayName}</p>
          <p className="text-sm font-bold text-white/80">{handle}</p>
        </div>
      </section>

      <nav className="mb-surface overflow-hidden">
        {menuItems.map((row) => {
          const Icon = row.Icon;
          return (
            <Link
              key={row.label}
              href={user ? row.href : "/login"}
              className="flex items-center justify-between border-b border-[var(--mb-muted-strong)] px-5 py-4 transition active:bg-[var(--mb-muted)]/60"
            >
              <span className="flex items-center gap-3 text-sm font-extrabold text-[var(--mb-ink)]">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--mb-teal)]/12 text-[var(--mb-teal-dark)]">
                  <Icon className="h-4 w-4" strokeWidth={2.25} aria-hidden />
                </span>
                {row.label}
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-[var(--mb-forest-light)]" strokeWidth={2.5} aria-hidden />
            </Link>
          );
        })}
        <LogoutButton />
      </nav>

      {canUseDashboard ? (
        <Link href="/dashboard" className="block text-center text-xs font-bold text-[var(--mb-forest-light)]">
          店舗向けダッシュボード（運営）
        </Link>
      ) : null}
      {isAdmin ? (
        <Link href="/admin" className="block text-center text-xs font-extrabold text-[var(--mb-teal-dark)]">
          管理者ページへ
        </Link>
      ) : null}
    </main>
  );
}
