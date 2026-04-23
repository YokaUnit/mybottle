import { MobileStepHeader } from "@/components/mybottle/mobile-step-header";
import { ConsumeStep3Client } from "@/components/mybottle/consume-step3-client";

type Props = {
  searchParams: Promise<{ storeId?: string; productId?: string; units?: string }>;
};

export default async function ConsumeStep4Page({ searchParams }: Props) {
  const params = await searchParams;
  const storeId = params.storeId ?? "";
  const productId = params.productId ?? "";
  const units = Number(params.units ?? "1");

  return (
    <main className="space-y-4">
      <MobileStepHeader title="店員に提示して確定" step={4} />
      <ConsumeStep3Client
        storeId={storeId}
        productId={productId}
        units={Number.isFinite(units) ? units : 1}
      />
    </main>
  );
}
