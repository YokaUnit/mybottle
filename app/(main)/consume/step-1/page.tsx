import { MobileStepHeader } from "@/components/mybottle/mobile-step-header";
import { ConsumeStep1Client } from "@/components/mybottle/consume-step1-client";

type Props = {
  searchParams: Promise<{ storeId?: string; productId?: string }>;
};

export default async function ConsumeStep1Page({ searchParams }: Props) {
  const params = await searchParams;
  const initialKey =
    params.storeId && params.productId ? `${params.storeId}:${params.productId}` : "";
  const preferredStoreId = params.storeId ?? "";

  return (
    <main className="space-y-4">
      <MobileStepHeader title="使用するボトルを選択" step={1} />
      <ConsumeStep1Client initialKey={initialKey} preferredStoreId={preferredStoreId} />
    </main>
  );
}
