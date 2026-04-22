import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AppRole = "user" | "staff" | "admin";

const ROLE_PRIORITY: Record<AppRole, number> = {
  user: 1,
  staff: 2,
  admin: 3,
};

export function hasRequiredRole(currentRole: AppRole, allowedRoles: AppRole[]) {
  const current = ROLE_PRIORITY[currentRole] ?? ROLE_PRIORITY.user;
  return allowedRoles.some((role) => current >= ROLE_PRIORITY[role]);
}

export async function getCurrentUserRole(): Promise<AppRole> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return "user";

  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  const role = data?.role;
  return role === "admin" || role === "staff" ? role : "user";
}

export async function requireRole(allowedRoles: AppRole[]) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  const role = data?.role === "admin" || data?.role === "staff" ? data.role : "user";

  if (!hasRequiredRole(role, allowedRoles)) {
    redirect("/");
  }

  return { user, role };
}
