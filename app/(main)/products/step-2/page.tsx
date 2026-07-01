import { notFound } from "next/navigation";
import { MobileStepHeader } from "@/components/mybottle/mobile-step-header";
import { AppErrorScreen } from "@/components/mybottle/app-error-screen";
import { PurchaseProductRow } from "@/components/mybottle/products/purchase-product-row";
import { HorizontalDragScroll } from "@/components/mybottle/horizontal-drag-scroll";
import { getMasterData, getStorePageState, getStoreProductCatalog } from "@/lib/supabase/mybottle";
import type { StoreProductOffering } from "@/lib/mybottle/types";

type Props = {
  searchParams: Promise<{ storeId?: string }>;
};

export default async function ProductStep2Page({ searchParams }: Props) {
  const params = await searchParams;
  const storeId = params.storeId ?? "chigasaki-a";

  const storeState = await getStorePageState(storeId);
  if (storeState.kind === "not_found") notFound();
  if (storeState.kind === "inactive") {
    return (
      <main className="space-y-4">
        <MobileStepHeader title="ボトルを選択" step={2} />
        <AppErrorScreen variant="store-unavailable" storeName={storeState.storeName} />
      </main>
    );
  }

  const [{ stores }, catalog] = await Promise.all([getMasterData(), getStoreProductCatalog(storeId)]);
  const storeName = stores.find((store) => store.id === storeId)?.name ?? "加盟店";
  const categoryOrder = ["ビール", "焼酎", "ハイボール", "サワー", "ジン", "カクテル", "ワイン"] as const;
  const groupedProducts = catalog.reduce<Record<string, StoreProductOffering[]>>((acc, product) => {
    const category = product.category || "その他";
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});
  const orderedCategories = Object.keys(groupedProducts).sort((a, b) => {
    const aIndex = categoryOrder.indexOf(a as (typeof categoryOrder)[number]);
    const bIndex = categoryOrder.indexOf(b as (typeof categoryOrder)[number]);
    const aRank = aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex;
    const bRank = bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex;
    if (aRank !== bRank) return aRank - bRank;
    return a.localeCompare(b, "ja");
  });

  return (
    <main className="space-y-4">
      <MobileStepHeader title="ボトルを選択" step={2} />
      <section className="mb-surface space-y-5 p-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-[var(--mb-yellow)]/50 px-3 py-1.5 ring-2 ring-[var(--mb-yellow-dark)]/20">
          <span className="text-[10px] font-extrabold tracking-[0.08em] text-[#92400e]">対象店舗</span>
          <span className="text-sm font-extrabold text-[#713f12]">{storeName}</span>
        </div>
        <p className="text-sm font-bold text-[var(--mb-forest-light)]">
          飲みたい種類を選ぶと、次の画面でセット数（何セット買うか）を決められます。
        </p>
        {catalog.length === 0 ? (
          <p className="rounded-xl bg-[var(--mb-muted)] p-4 text-center text-sm font-bold text-[var(--mb-forest-light)]">
            現在この店舗で購入できるボトルがありません。
          </p>
        ) : (
          orderedCategories.map((category) => (
            <section key={category} className="space-y-2">
              <h2 className="text-[0.82rem] font-extrabold uppercase tracking-[0.1em] text-[var(--mb-teal-dark)]">
                {category}
              </h2>
              <HorizontalDragScroll>
                <div className="flex w-max gap-2.5">
                  {groupedProducts[category].map((product) => (
                    <PurchaseProductRow key={product.id} storeId={storeId} product={product} />
                  ))}
                </div>
              </HorizontalDragScroll>
            </section>
          ))
        )}
      </section>
    </main>
  );
}
