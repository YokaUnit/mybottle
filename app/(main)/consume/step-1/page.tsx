import { ConsumeFlowHeader } from "@/components/mybottle/consume/consume-flow-header";
import { ConsumeStep1Client } from "@/components/mybottle/consume/consume-step1-client";

type Props = {
  searchParams: Promise<{ storeId?: string; productId?: string }>;
};

export default async function ConsumeStep1Page({ searchParams }: Props) {
  const params = await searchParams;
  const initialKey =
    params.storeId && params.productId ? `${params.storeId}:${params.productId}` : "";
  const preferredStoreId = params.storeId ?? "";

  return (
    <main className="space-y-1">
      <ConsumeFlowHeader
        step={1}
        title="店舗とボトルを選ぶ"
        subtitle="来店したお店を検索して、使うボトルを選んでください"
        backHref="/"
        backLabel="ホーム"
      />
      <ConsumeStep1Client initialKey={initialKey} preferredStoreId={preferredStoreId} />
    </main>
  );
}
