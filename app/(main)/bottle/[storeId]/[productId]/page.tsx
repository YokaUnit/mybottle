import { BottleDetailClient } from "@/components/mybottle/bottle-detail-client";

type Props = {
  params: Promise<{ storeId: string; productId: string }>;
};

export default async function BottleDetailPage({ params }: Props) {
  const { storeId, productId } = await params;

  return (
    <main className="pb-4 pt-2">
      <BottleDetailClient storeId={storeId} productId={productId} />
    </main>
  );
}
