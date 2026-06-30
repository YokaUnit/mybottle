import { MobileStepHeader } from "@/components/mybottle/mobile-step-header";
import { ProductStep4Client } from "@/components/mybottle/products/product-step4-client";
import { getStoreName } from "@/lib/store-manage/purchase-pin";
import { getStoreProductCatalog } from "@/lib/supabase/mybottle";
import { notFound } from "next/navigation";

type Props = {
  searchParams: Promise<{ storeId?: string; productId?: string; quantity?: string }>;
};

export default async function ProductStep4Page({ searchParams }: Props) {
  const params = await searchParams;
  const storeId = params.storeId ?? "chigasaki-a";
  const [catalog, storeName] = await Promise.all([
    getStoreProductCatalog(storeId),
    getStoreName(storeId),
  ]);
  const productId = params.productId ?? catalog[0]?.id ?? "";
  const product = catalog.find((p) => p.id === productId);
  if (!product) notFound();

  const parsedQuantity = Number(params.quantity ?? String(product.minPurchaseSets ?? 1));
  const minQ = product.minPurchaseSets ?? 1;
  const maxQ = product.maxPurchaseSets ?? 10;
  const quantity = Number.isFinite(parsedQuantity)
    ? Math.min(maxQ, Math.max(Math.floor(parsedQuantity), minQ))
    : minQ;

  return (
    <main className="space-y-4">
      <MobileStepHeader title="店員に PIN を入力してもらう" step={4} />
      <ProductStep4Client
        storeId={storeId}
        storeName={storeName}
        product={{
          id: product.id,
          name: product.name,
          priceJpy: product.priceJpy,
          type: product.type,
        }}
        quantity={quantity}
      />
    </main>
  );
}
