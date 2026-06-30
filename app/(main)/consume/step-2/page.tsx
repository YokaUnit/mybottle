import { ConsumeFlowHeader } from "@/components/mybottle/consume/consume-flow-header";
import { ConsumeStep4Client } from "@/components/mybottle/consume/consume-step4-client";

type Props = {
  searchParams: Promise<{ storeId?: string; productId?: string }>;
};

export default async function ConsumeStep2Page({ searchParams }: Props) {
  const params = await searchParams;
  const storeId = params.storeId ?? "";
  const productId = params.productId ?? "";

  return (
    <main className="space-y-1">
      <ConsumeFlowHeader
        step={2}
        title="杯数を選ぶ"
        subtitle="今回使う杯数を選んでください"
        backHref={
          storeId && productId
            ? `/consume/step-1?storeId=${storeId}&productId=${productId}`
            : "/consume/step-1"
        }
      />
      <ConsumeStep4Client storeId={storeId} productId={productId} />
    </main>
  );
}
