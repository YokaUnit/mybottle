import { MobileStepHeader } from "@/components/mybottle/mobile-step-header";
import { AppErrorScreen } from "@/components/mybottle/app-error-screen";
import { ProductStep3Client } from "@/components/mybottle/products/product-step3-client";
import { getProductPurchaseState, getStoreProductCatalog } from "@/lib/supabase/mybottle";

type Props = {
  searchParams: Promise<{ storeId?: string; productId?: string }>;
};

export default async function ProductStep3Page({ searchParams }: Props) {
  const params = await searchParams;
  const storeId = params.storeId ?? "chigasaki-a";
  const productId = params.productId;

  if (productId) {
    const purchaseState = await getProductPurchaseState(storeId, productId);
    if (purchaseState.kind === "unavailable") {
      return (
        <main className="space-y-4">
          <MobileStepHeader title="セット数を選択" step={3} />
          <AppErrorScreen
            variant="product-unavailable"
            productName={purchaseState.productName}
            storeId={storeId}
          />
        </main>
      );
    }
    if (purchaseState.kind === "ok") {
      return (
        <main className="space-y-4">
          <MobileStepHeader title="セット数を選択" step={3} />
          <ProductStep3Client storeId={storeId} product={purchaseState.offering} />
        </main>
      );
    }
  }

  const catalog = await getStoreProductCatalog(storeId);
  const resolvedProductId = productId ?? catalog[0]?.id;
  const product = catalog.find((item) => item.id === resolvedProductId) ?? catalog[0];

  if (!product) {
    return (
      <main className="space-y-4">
        <MobileStepHeader title="セット数を選択" step={3} />
        <AppErrorScreen variant="product-unavailable" storeId={storeId} />
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
