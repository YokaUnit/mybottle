import { MobileStepHeader } from "@/components/mybottle/mobile-step-header";
import { ConsumeStep3Client } from "@/components/mybottle/consume-step3-client";

type Props = {
  searchParams: Promise<{ storeId?: string; productId?: string }>;
};

export default async function ConsumeStep3Page({ searchParams }: Props) {
  const params = await searchParams;
  const storeId = params.storeId ?? "";
  const productId = params.productId ?? "";

  return (
    <main className="space-y-4">
      <MobileStepHeader title="店員に提示する" step={3} />
      <ConsumeStep3Client storeId={storeId} productId={productId} />
    </main>
  );
}
