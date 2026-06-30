import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminManageNav } from "@/components/mybottle/admin/admin-manage-nav";
import { requireRole } from "@/lib/auth/roles";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "管理",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  await requireRole(["admin"]);

  return (
    <>
      {children}
      <Suspense fallback={null}>
        <AdminManageNav />
      </Suspense>
    </>
  );
}
