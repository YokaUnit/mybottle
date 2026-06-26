import { StoreManageSettingsClient } from "@/components/mybottle/store-manage-settings-client";
import { StoreManageHeader } from "@/components/mybottle/store-manage-nav";
import { getAccessibleStores, requireStoreAccess, resolveStoreId } from "@/lib/store-manage/access";
import { getStoreManageSettings, getStorePurchasePin } from "@/lib/store-manage/queries";

type Props = { searchParams: Promise<{ storeId?: string }> };

export default async function DashboardSettingsPage({ searchParams }: Props) {
  const params = await searchParams;
  const { stores } = await getAccessibleStores();
  const storeId = resolveStoreId(stores, params.storeId);
  await requireStoreAccess(storeId);
  const [settings, purchasePin] = await Promise.all([
    getStoreManageSettings(storeId),
    getStorePurchasePin(storeId),
  ]);
  if (!settings) return null;

  return (
    <main className="pt-1">
      <StoreManageHeader stores={stores} storeId={storeId} title="店舗設定" />
      <StoreManageSettingsClient
        storeId={storeId}
        settings={settings}
        pinCode={purchasePin?.pinCode ?? null}
      />
    </main>
  );
}
