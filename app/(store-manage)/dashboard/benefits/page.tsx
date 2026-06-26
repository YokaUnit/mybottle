import { StoreManageBenefitsClient } from "@/components/mybottle/store-manage-benefits-client";
import { StoreManageHeader } from "@/components/mybottle/store-manage-nav";
import { getAccessibleStores, requireStoreAccess, resolveStoreId } from "@/lib/store-manage/access";
import { getStoreBenefits } from "@/lib/store-manage/queries";

type Props = { searchParams: Promise<{ storeId?: string }> };

export default async function DashboardBenefitsPage({ searchParams }: Props) {
  const params = await searchParams;
  const { stores } = await getAccessibleStores();
  const storeId = resolveStoreId(stores, params.storeId);
  await requireStoreAccess(storeId);
  const benefits = await getStoreBenefits(storeId);

  return (
    <main className="px-4 pt-2">
      <StoreManageHeader stores={stores} storeId={storeId} title="特典・クーポン" />
      <StoreManageBenefitsClient storeId={storeId} benefits={benefits} />
    </main>
  );
}
