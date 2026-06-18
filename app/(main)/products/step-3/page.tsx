import Link from "next/link";
import { MobileStepHeader } from "@/components/mybottle/mobile-step-header";
import { ProductStep3Client } from "@/components/mybottle/product-step3-client";
import { getMasterData } from "@/lib/supabase/mybottle";

type Props = {
  searchParams: Promise<{ storeId?: string; productId?: string }>;
};

export default async function ProductStep3Page({ searchParams }: Props) {
  const params = await searchParams;
  const { products } = await getMasterData();
  const storeId = params.storeId ?? "chigasaki-a";
  const productId = params.productId ?? products[0]?.id;
  const product = products.find((item) => item.id === productId) ?? products[0];
  if (!product) return null;

  return (
    <main className="space-y-4">
      <MobileStepHeader title="セット数を選択" step={3} />
      <ProductStep3Client storeId={storeId} product={product} />
    </main>
  );
}
