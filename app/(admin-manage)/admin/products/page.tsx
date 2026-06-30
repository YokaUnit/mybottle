import { unstable_noStore as noStore } from "next/cache";
import { AdminManageHeader } from "@/components/mybottle/admin/admin-manage-nav";
import { AdminProductsClient } from "@/components/mybottle/admin/admin-products-client";
import { supabaseAdmin } from "@/lib/supabase/admin";

export default async function AdminProductsPage() {
  noStore();
  const { data: products } = await supabaseAdmin
    .from("products")
    .select("id,name,category,type,price_jpy,bundle_size,description,image_path,is_active")
    .order("name");

  return (
    <main className="pt-1">
      <AdminManageHeader title="商品マスタ" subtitle="全店舗共通の商品情報" />
      <AdminProductsClient
        products={(
          (products as {
            id: string;
            name: string;
            category: string;
            type: "virtual" | "physical";
            price_jpy: number;
            bundle_size: number;
            description: string;
            image_path: string | null;
            is_active: boolean;
          }[] | null) ?? []
        ).map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          type: p.type,
          priceJpy: p.price_jpy,
          bundleSize: p.bundle_size,
          description: p.description,
          imagePath: p.image_path,
          isActive: p.is_active,
        }))}
      />
    </main>
  );
}
