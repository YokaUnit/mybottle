import { MobileStepHeader } from "@/components/mybottle/mobile-step-header";
import { ConsumeStep4Client } from "@/components/mybottle/consume-step4-client";

type Props = {
  searchParams: Promise<{ storeId?: string; productId?: string; units?: string }>;
};

export default async function ConsumeStep3Page({ searchParams }: Props) {
  const params = await searchParams;
  const storeId = params.storeId ?? "";
  const productId = params.productId ?? "";
  const units = Number(params.units ?? "1");

  return (
    <main className="space-y-4">
      <MobileStepHeader title="使用杯数を選択" step={3} />
      <ConsumeStep4Client
        storeId={storeId}
        productId={productId}
        initialUnits={Number.isFinite(units) ? units : 1}
      />
    </main>
  );
}
