import { unstable_noStore as noStore } from "next/cache";
import { AdminManageHeader } from "@/components/mybottle/admin/admin-manage-nav";
import { AdminUsersClient } from "@/components/mybottle/admin/admin-users-client";
import { supabaseAdmin } from "@/lib/supabase/admin";

export default async function AdminUsersPage() {
  noStore();
  const [{ data: profiles }, { data: staffProfiles }, { data: stores }, { data: memberships }] =
    await Promise.all([
      supabaseAdmin
        .from("profiles")
        .select("id,email,display_name,role")
        .order("created_at", { ascending: false })
        .limit(100),
      supabaseAdmin.from("profiles").select("id,email,display_name,role").eq("role", "staff"),
      supabaseAdmin.from("stores").select("id,name").order("name"),
      supabaseAdmin
        .from("staff_store_memberships")
        .select("id,user_id,store_id,is_active,stores(name)")
        .order("created_at", { ascending: false }),
    ]);

  const profileList =
    (profiles as { id: string; email: string | null; display_name: string | null; role: "user" | "staff" | "admin" }[] | null) ??
    [];

  return (
    <main className="pt-1">
      <AdminManageHeader title="ユーザー管理" subtitle="権限変更とスタッフの店舗割り当て" />
      <AdminUsersClient
        profiles={profileList}
        staffProfiles={
          (staffProfiles as { id: string; email: string | null; display_name: string | null; role: "user" | "staff" | "admin" }[] | null) ??
          []
        }
        stores={(stores as { id: string; name: string }[] | null) ?? []}
        memberships={(
          (memberships as { id: string; user_id: string; store_id: string; is_active: boolean; stores: { name: string } | null }[] | null) ??
          []
        ).map((m) => ({
          id: m.id,
          user_id: m.user_id,
          store_id: m.store_id,
          is_active: m.is_active,
          storeName: m.stores?.name ?? "-",
        }))}
      />
    </main>
  );
}
