import { Suspense } from "react";
import { requireRole } from "@/lib/auth/roles";
import { StoreManageNav } from "@/components/mybottle/store-manage/store-manage-nav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireRole(["staff", "admin"]);

  return (
    <>
      {children}
      <Suspense fallback={null}>
        <StoreManageNav />
      </Suspense>
    </>
  );
}
