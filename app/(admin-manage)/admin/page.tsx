import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { AdminManageHeader } from "@/components/mybottle/admin/admin-manage-nav";
import { getAdminDashboardMetrics } from "@/lib/admin-manage/queries";
import { ChevronRight, Package, ScrollText, Store, Users } from "lucide-react";

export default async function AdminDashboardPage() {
  noStore();
  const metrics = await getAdminDashboardMetrics();

  const cards = [
    { label: "公開中の店舗", value: `${metrics.activeStores} / ${metrics.totalStores}` },
    { label: "スタッフユーザー", value: `${metrics.staffUsers}人` },
    { label: "登録ユーザー", value: `${metrics.totalUsers}人` },
    { label: "公開中お知らせ", value: `${metrics.activeNews}件` },
  ];

  const links = [
    {
      href: "/admin/logs",
      title: "利用ログ",
      desc: "購入・利用・送信の横断監査",
      Icon: ScrollText,
    },
    {
      href: "/admin/stores",
      title: "店舗管理",
      desc: "公開設定・店舗ページ",
      Icon: Store,
    },
    {
      href: "/admin/products",
      title: "商品マスタ",
      desc: "価格・画像・公開状態",
      Icon: Package,
    },
    {
      href: "/admin/users",
      title: "ユーザー・スタッフ",
      desc: "権限と店舗の紐付け",
      Icon: Users,
    },
  ] as const;

  return (
    <main className="pt-1">
      <AdminManageHeader title="ダッシュボード" subtitle="プラットフォーム全体の運用" />

      <div className="grid grid-cols-2 gap-2.5">
        {cards.map((item) => (
          <article key={item.label} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#e7e5e4]">
            <p className="text-[10px] font-bold text-[#78716c]">{item.label}</p>
            <p className="mt-1.5 text-xl font-extrabold tracking-[-0.02em] text-[#78350f]">{item.value}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {links.map(({ href, title, desc, Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#e7e5e4] transition active:scale-[0.99]"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#fef3c7] text-[#b45309]">
              <Icon className="h-5 w-5" strokeWidth={2.25} aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="font-extrabold text-[#292524]">{title}</span>
              <span className="mt-0.5 block text-xs font-medium text-[#78716c]">{desc}</span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-[#a8a29e]" strokeWidth={2.5} aria-hidden />
          </Link>
        ))}

        <Link
          href="/admin/news"
          className="mt-1 flex items-center justify-center gap-1 rounded-2xl border border-dashed border-[#d6d3d1] bg-[#fffbeb]/80 py-3 text-xs font-extrabold text-[#b45309]"
        >
          お知らせを編集（公開中 {metrics.activeNews}件）
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
        </Link>
      </div>
    </main>
  );
}
