import { StoreDashboard } from "@/components/mybottle/store-dashboard";

export default function DashboardPage() {
  return (
    <main className="space-y-4 pb-4 pt-2">
      <header>
        <h1 className="mb-screen-title">店舗ダッシュボード</h1>
        <p className="mt-1 text-sm font-medium text-[var(--mb-forest-light)]">提供数・在庫の概要（運営向け）</p>
      </header>
      <StoreDashboard />
    </main>
  );
}
