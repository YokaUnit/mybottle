import { supabaseAdmin } from "@/lib/supabase/admin";

export type AdminDashboardMetrics = {
  activeStores: number;
  totalStores: number;
  staffUsers: number;
  totalUsers: number;
  activeNews: number;
};

export async function getAdminDashboardMetrics(): Promise<AdminDashboardMetrics> {
  const [
    { count: activeStores },
    { count: totalStores },
    { count: staffUsers },
    { count: totalUsers },
    { count: activeNews },
  ] = await Promise.all([
    supabaseAdmin.from("stores").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabaseAdmin.from("stores").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("profiles").select("id", { count: "exact", head: true }).eq("role", "staff"),
    supabaseAdmin.from("profiles").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("benefit_news").select("id", { count: "exact", head: true }).eq("is_active", true),
  ]);

  return {
    activeStores: activeStores ?? 0,
    totalStores: totalStores ?? 0,
    staffUsers: staffUsers ?? 0,
    totalUsers: totalUsers ?? 0,
    activeNews: activeNews ?? 0,
  };
}
