import { StoreManageBottlesClient } from "@/components/mybottle/store-manage-bottles-client";
import { StoreManageHeader } from "@/components/mybottle/store-manage-nav";
import { getAccessibleStores, requireStoreAccess, resolveStoreId } from "@/lib/store-manage/access";
import { getStoreProductsForManage } from "@/lib/store-manage/queries";

type Props = { searchParams: Promise<{ storeId?: string }> };

export default async function DashboardBottlesPage({ searchParams }: Props) {
  const params = await searchParams;
  const { stores } = await getAccessibleStores();
  const storeId = resolveStoreId(stores, params.storeId);
  await requireStoreAccess(storeId);
  const products = await getStoreProductsForManage(storeId);

  return (
    <main className="px-4 pt-2">
      <StoreManageHeader stores={stores} storeId={storeId} title="ボトル管理" />
      <StoreManageBottlesClient storeId={storeId} products={products} />
    </main>
  );
}
