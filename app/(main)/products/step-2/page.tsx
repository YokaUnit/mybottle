import { MobileStepHeader } from "@/components/mybottle/mobile-step-header";
import { PurchaseProductRow } from "@/components/mybottle/purchase-product-row";
import { catalog } from "@/lib/mybottle/catalog";

type Props = {
  searchParams: Promise<{ storeId?: string }>;
};

export default async function ProductStep2Page({ searchParams }: Props) {
  const params = await searchParams;
  const storeId = params.storeId ?? "chigasaki-a";

  return (
    <main className="space-y-4">
      <MobileStepHeader title="ボトルを選択" step={2} />
      <section className="mb-surface space-y-3 p-5">
        {catalog.map((product) => (
          <PurchaseProductRow key={product.id} storeId={storeId} product={product} />
        ))}
      </section>
    </main>
  );
}