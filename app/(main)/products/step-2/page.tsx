import { MobileStepHeader } from "@/components/mybottle/mobile-step-header";
import { PurchaseProductRow } from "@/components/mybottle/purchase-product-row";
import { HorizontalDragScroll } from "@/components/mybottle/horizontal-drag-scroll";
import { getMasterData } from "@/lib/supabase/mybottle";
import type { Product } from "@/lib/mybottle/types";

type Props = {
  searchParams: Promise<{ storeId?: string }>;
};

export default async function ProductStep2Page({ searchParams }: Props) {
  const params = await searchParams;
  const storeId = params.storeId ?? "chigasaki-a";
  const { products, stores } = await getMasterData();
  const storeName = stores.find((store) => store.id === storeId)?.name ?? "加盟店";
  const categoryOrder = ["ビール", "焼酎", "ハイボール", "サワー", "ジン", "カクテル", "ワイン"] as const;
  const groupedProducts = products.reduce<Record<string, Product[]>>((acc, product) => {
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
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--mb-forest)]/20 bg-[var(--mb-accent)]/35 px-3 py-1.5 ring-1 ring-[var(--mb-forest)]/10">
          <span className="text-[10px] font-semibold tracking-[0.08em] text-[var(--mb-forest-light)]">対象店舗</span>
          <span className="text-sm font-semibold text-[var(--mb-ink)]">{storeName}</span>
        </div>
        <p className="text-sm font-medium text-[var(--mb-forest-light)]">
          飲みたい種類を選ぶと、次の画面でセット数（何セット買うか）を決められます。
        </p>
        {orderedCategories.map((category) => (
          <section key={category} className="space-y-2">
            <h2 className="text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[var(--mb-forest-light)]">
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
        ))}
      </section>
    </main>
  );
}