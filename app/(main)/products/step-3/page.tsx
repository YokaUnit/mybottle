import { MobileStepHeader } from "@/components/mybottle/mobile-step-header";
import { ProductStep3Client } from "@/components/mybottle/products/product-step3-client";
import { getStoreProductCatalog } from "@/lib/supabase/mybottle";

type Props = {
  searchParams: Promise<{ storeId?: string; productId?: string }>;
};

export default async function ProductStep3Page({ searchParams }: Props) {
  const params = await searchParams;
  const storeId = params.storeId ?? "chigasaki-a";
  const catalog = await getStoreProductCatalog(storeId);
  const productId = params.productId ?? catalog[0]?.id;
  const product = catalog.find((item) => item.id === productId) ?? catalog[0];
  if (!product) {
    return (
      <main className="space-y-4">
        <MobileStepHeader title="セット数を選択" step={3} />
        <p className="mb-surface p-6 text-center text-sm font-bold text-[var(--mb-forest-light)]">
          選択できるボトルがありません。
        </p>
      </main>
    );
  }

  return (
    <main className="space-y-4">
      <MobileStepHeader title="セット数を選択" step={3} />
      <ProductStep3Client storeId={storeId} product={product} />
    </main>
  );
}
