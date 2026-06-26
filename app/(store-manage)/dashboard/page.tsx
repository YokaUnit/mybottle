import Link from "next/link";
import { StoreManageHeader } from "@/components/mybottle/store-manage-nav";
import { getAccessibleStores, requireStoreAccess, resolveStoreId } from "@/lib/store-manage/access";
import { getStoreDashboardMetrics, getStorePurchasePin } from "@/lib/store-manage/queries";

type Props = {
  searchParams: Promise<{ storeId?: string }>;
};

function formatJpy(n: number) {
  return new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 }).format(n);
}

export default async function DashboardPage({ searchParams }: Props) {
  const params = await searchParams;
  const { stores } = await getAccessibleStores();
  if (stores.length === 0) {
    return (
      <main className="pt-1">
        <p className="rounded-2xl bg-white p-6 text-center text-sm font-bold text-[#64748b] ring-1 ring-[#cbd5e1]">
          担当店舗が割り当てられていません。
        </p>
      </main>
    );
  }

  const storeId = resolveStoreId(stores, params.storeId);
  await requireStoreAccess(storeId);
  const [metrics, purchasePin] = await Promise.all([
    getStoreDashboardMetrics(storeId),
    getStorePurchasePin(storeId),
  ]);
  const q = `?storeId=${storeId}`;
  const hasPin = Boolean(purchasePin?.pinCode);

  return (
    <main className="pt-1">
      <StoreManageHeader stores={stores} storeId={storeId} title="ダッシュボード" />

      <div className="grid grid-cols-1 gap-3">
        {[
          { label: "利用中ボトル", value: `${metrics.activeBottles}本` },
          { label: "今月の提供数", value: `${metrics.monthlyUses}回` },
          { label: "今月の販売（ボトル）", value: formatJpy(metrics.monthlySalesJpy) },
        ].map((item) => (
          <article key={item.label} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#cbd5e1]">
            <p className="text-xs font-bold text-[#64748b]">{item.label}</p>
            <p className="mt-2 text-2xl font-extrabold tracking-[-0.02em] text-[#0d4f4a]">{item.value}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Link
          href={`/dashboard/bottles${q}`}
          className="rounded-2xl bg-[#0d9488] p-4 text-center text-sm font-extrabold text-white"
        >
          ボトル管理
        </Link>
        <Link
          href={`/dashboard/benefits${q}`}
          className="rounded-2xl bg-white p-4 text-center text-sm font-extrabold text-[#0d9488] ring-1 ring-[#99f6e4]"
        >
          特典管理
        </Link>
      </div>

      <Link
        href={`/dashboard/settings${q}#purchase-pin`}
        className={`mt-3 block rounded-2xl p-4 text-center text-sm font-extrabold ${
          hasPin ? "bg-white text-[#0d9488] ring-1 ring-[#99f6e4]" : "bg-amber-50 text-amber-900 ring-1 ring-amber-200"
        }`}
      >
        {hasPin ? "購入確認 PIN を変更" : "購入確認 PIN を設定"}
      </Link>
    </main>
  );
}
