import { MobileStepHeader } from "@/components/mybottle/mobile-step-header";
import { ConsumeStep4Client } from "@/components/mybottle/consume-step4-client";

type Props = {
  searchParams: Promise<{ storeId?: string; productId?: string }>;
};

export default async function ConsumeStep4Page({ searchParams }: Props) {
  const params = await searchParams;
  const storeId = params.storeId ?? "";
  const productId = params.productId ?? "";

  return (
    <main className="space-y-4">
      <MobileStepHeader title="使用を確定" step={4} />
      <ConsumeStep4Client storeId={storeId} productId={productId} />
    </main>
  );
}
