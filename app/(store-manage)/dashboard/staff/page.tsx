import { redirect } from "next/navigation";

type Props = { searchParams: Promise<{ storeId?: string }> };

export default async function DashboardStaffPage({ searchParams }: Props) {
  const params = await searchParams;
  const q = params.storeId ? `?storeId=${params.storeId}#purchase-pin` : "#purchase-pin";
  redirect(`/dashboard/settings${q}`);
}
