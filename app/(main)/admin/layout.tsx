import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/roles";

/** 管理画面は常にDB最新を表示（フルルートキャッシュ・RSCキャッシュを使わない） */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Admin",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole(["admin"]);
  return children;
}
