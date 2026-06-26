import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AppRole } from "@/lib/auth/roles";
import { requireRole } from "@/lib/auth/roles";

export type AccessibleStore = {
  id: string;
  name: string;
  area: string;
};

export async function getAccessibleStores(): Promise<{
  role: AppRole;
  stores: AccessibleStore[];
}> {
  const { role, user } = await requireRole(["staff", "admin"]);
  const supabase = await createSupabaseServerClient();

  if (role === "admin") {
    const { data } = await supabase.from("stores").select("id,name,area").order("name");
    return { role, stores: (data ?? []) as AccessibleStore[] };
  }

  const { data: memberships } = await supabase
    .from("staff_store_memberships")
    .select("store_id,stores(id,name,area)")
    .eq("user_id", user.id)
    .eq("is_active", true);

  const stores = (memberships ?? []).flatMap((row) => {
    const store = (row as { stores?: AccessibleStore | AccessibleStore[] | null }).stores;
    if (!store) return [];
    return Array.isArray(store) ? store : [store];
  });

  return { role, stores };
}

export async function requireStoreAccess(storeId: string) {
  const { role, stores } = await getAccessibleStores();
  const store = stores.find((s) => s.id === storeId);
  if (!store) {
    redirect("/dashboard");
  }
  return { role, store, stores };
}

export function resolveStoreId(
  stores: AccessibleStore[],
  preferredStoreId?: string | null,
): string {
  if (preferredStoreId && stores.some((s) => s.id === preferredStoreId)) {
    return preferredStoreId;
  }
  return stores[0]?.id ?? "";
}
