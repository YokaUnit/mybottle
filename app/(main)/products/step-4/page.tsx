import { MobileStepHeader } from "@/components/mybottle/mobile-step-header";
import { AppErrorScreen } from "@/components/mybottle/app-error-screen";
import { ProductStep4Client } from "@/components/mybottle/products/product-step4-client";
import { getStoreName } from "@/lib/store-manage/purchase-pin";
import { getProductPurchaseState } from "@/lib/supabase/mybottle";

type Props = {
  searchParams: Promise<{ storeId?: string; productId?: string; quantity?: string }>;
};

export default async function ProductStep4Page({ searchParams }: Props) {
  const params = await searchParams;
  const storeId = params.storeId ?? "chigasaki-a";
  const productId = params.productId ?? "";

  if (!productId) {
    return (
      <main className="space-y-4">
        <MobileStepHeader title="店員に PIN を入力してもらう" step={4} />
        <AppErrorScreen variant="product-unavailable" storeId={storeId} />
      </main>
    );
  }

  const [purchaseState, storeName] = await Promise.all([
    getProductPurchaseState(storeId, productId),
    getStoreName(storeId),
  ]);

  if (purchaseState.kind === "unavailable") {
    return (
      <main className="space-y-4">
        <MobileStepHeader title="店員に PIN を入力してもらう" step={4} />
        <AppErrorScreen
          variant="product-unavailable"
          productName={purchaseState.productName}
          storeId={storeId}
        />
      </main>
    );
  }

  if (purchaseState.kind === "not_found") {
    return (
      <main className="space-y-4">
        <MobileStepHeader title="店員に PIN を入力してもらう" step={4} />
        <AppErrorScreen variant="product-unavailable" storeId={storeId} />
      </main>
    );
  }

  const product = purchaseState.offering;
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
