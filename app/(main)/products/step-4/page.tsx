import { MobileStepHeader } from "@/components/mybottle/mobile-step-header";
import { ProductStep4Client } from "@/components/mybottle/product-step4-client";
import { catalog } from "@/lib/mybottle/catalog";

type Props = {
  searchParams: Promise<{ storeId?: string; productId?: string; quantity?: string }>;
};

export default async function ProductStep4Page({ searchParams }: Props) {
  const params = await searchParams;
  const storeId = params.storeId ?? "chigasaki-a";
  const productId = params.productId ?? catalog[0].id;
  const quantity = Math.max(Number(params.quantity ?? "1"), 1);

  return (
    <main className="space-y-4">
      <MobileStepHeader title="決済方法を選択" step={4} />
      <ProductStep4Client storeId={storeId} productId={productId} quantity={quantity} />
    </main>
  );
}
