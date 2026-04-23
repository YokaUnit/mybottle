import { StoreDashboard } from "@/components/mybottle/store-dashboard";
import Link from "next/link";
import { requireRole } from "@/lib/auth/roles";

export default async function DashboardPage() {
  await requireRole(["staff", "admin"]);

  return (
    <main className="space-y-4 pb-4 pt-2">
      <header>
        <h1 className="mb-screen-title">店舗ダッシュボード</h1>
        <p className="mt-1 text-sm font-medium text-[var(--mb-forest-light)]">提供数・在庫の概要（運営向け）</p>
      </header>
      <Link
        href="/dashboard/pricing"
        className="inline-flex rounded-full bg-[var(--mb-forest)] px-4 py-2 text-sm font-semibold text-white"
      >
        価格変更申請へ
      </Link>
      <StoreDashboard />
    </main>
  );
}
