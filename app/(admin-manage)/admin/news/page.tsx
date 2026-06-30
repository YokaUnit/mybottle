import { unstable_noStore as noStore } from "next/cache";
import { AdminManageHeader } from "@/components/mybottle/admin/admin-manage-nav";
import { AdminNewsClient } from "@/components/mybottle/admin/admin-news-client";
import { supabaseAdmin } from "@/lib/supabase/admin";

export default async function AdminNewsPage() {
  noStore();
  const { data: rows } = await supabaseAdmin
    .from("benefit_news")
    .select("id,badge_label,title,body,sort_order,is_active")
    .order("sort_order", { ascending: false });

  return (
    <main className="pt-1">
      <AdminManageHeader title="お知らせ" subtitle="通知ベルと特典ページに配信" />
      <AdminNewsClient
        items={(
          (rows as {
            id: string;
            badge_label: string;
            title: string;
            body: string;
            sort_order: number;
            is_active: boolean;
          }[] | null) ?? []
        ).map((row) => ({
          id: row.id,
          badgeLabel: row.badge_label,
          title: row.title,
          body: row.body,
          sortOrder: row.sort_order,
          isActive: row.is_active,
        }))}
      />
    </main>
  );
}
