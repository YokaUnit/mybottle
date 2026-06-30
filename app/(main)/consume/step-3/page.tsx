import { ConsumeFlowHeader } from "@/components/mybottle/consume/consume-flow-header";
import { ConsumeStep3Client } from "@/components/mybottle/consume/consume-step3-client";

type Props = {
  searchParams: Promise<{ storeId?: string; productId?: string; units?: string }>;
};

export default async function ConsumeStep3Page({ searchParams }: Props) {
  const params = await searchParams;
  const storeId = params.storeId ?? "";
  const productId = params.productId ?? "";
  const units = Number(params.units ?? "1");

  return (
    <main className="space-y-1">
      <ConsumeFlowHeader
        step={3}
        title="店員に提示"
        subtitle="確認コードを見せて、使用を確定してください"
        backHref={
          storeId && productId
            ? `/consume/step-2?storeId=${storeId}&productId=${productId}`
            : "/consume/step-2"
        }
      />
      <ConsumeStep3Client
        storeId={storeId}
        productId={productId}
        units={Number.isFinite(units) ? units : 1}
      />
    </main>
  );
}
