import { MobileStepHeader } from "@/components/mybottle/mobile-step-header";
import { ProductStep4Client } from "@/components/mybottle/product-step4-client";
import { getMasterData } from "@/lib/supabase/mybottle";

type Props = {
  searchParams: Promise<{ storeId?: string; productId?: string; quantity?: string }>;
};

export default async function ProductStep4Page({ searchParams }: Props) {
  const params = await searchParams;
  const { products } = await getMasterData();
  const storeId = params.storeId ?? "chigasaki-a";
  const productId = params.productId ?? products[0]?.id ?? "";
  const parsedQuantity = Number(params.quantity ?? "1");
  const quantity = Number.isFinite(parsedQuantity) ? Math.max(Math.floor(parsedQuantity), 1) : 1;

  return (
    <main className="space-y-4">
      <MobileStepHeader title="お会計後に店員確認" step={4} />
      <ProductStep4Client storeId={storeId} productId={productId} quantity={quantity} />
    </main>
  );
}
