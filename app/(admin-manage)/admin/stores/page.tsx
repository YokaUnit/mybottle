import { unstable_noStore as noStore } from "next/cache";
import { AdminManageHeader } from "@/components/mybottle/admin/admin-manage-nav";
import { AdminStoresClient } from "@/components/mybottle/admin/admin-stores-client";
import { supabaseAdmin } from "@/lib/supabase/admin";

export default async function AdminStoresPage() {
  noStore();
  const [{ data: stores }, { data: storeUiRows }] = await Promise.all([
    supabaseAdmin.from("stores").select("id,name,area,is_active").order("name"),
    supabaseAdmin.from("store_ui_meta").select("store_id,image_src,intro,features,open_hours"),
  ]);

  const uiById = Object.fromEntries(
    ((storeUiRows as { store_id: string; image_src: string; intro: string; features: unknown; open_hours: string }[] | null) ??
      []
    ).map((row) => [row.store_id, row]),
  );

  return (
    <main className="pt-1">
      <AdminManageHeader title="店舗管理" subtitle="公開状態と店舗ページの表示" />
      <AdminStoresClient
        stores={(
          (stores as { id: string; name: string; area: string; is_active: boolean }[] | null) ?? []
        ).map((store) => {
          const ui = uiById[store.id];
          const featuresCsv = Array.isArray(ui?.features)
            ? ui.features.filter((v): v is string => typeof v === "string").join(", ")
            : "";
          return {
            id: store.id,
            name: store.name,
            area: store.area,
            isActive: store.is_active,
            openHours: ui?.open_hours ?? "-",
            imageSrc: ui?.image_src ?? "/store/test1.png",
            intro: ui?.intro ?? "",
            featuresCsv,
          };
        })}
      />
    </main>
  );
}
