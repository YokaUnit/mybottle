import Link from "next/link";
import { MobileStepHeader } from "@/components/mybottle/mobile-step-header";
import { PurchaseProductHero } from "@/components/mybottle/purchase-product-hero";
import { catalog } from "@/lib/mybottle/catalog";

type Props = {
  searchParams: Promise<{ storeId?: string; productId?: string }>;
};

export default async function ProductStep3Page({ searchParams }: Props) {
  const params = await searchParams;
  const storeId = params.storeId ?? "chigasaki-a";
  const productId = params.productId ?? catalog[0].id;
  const product = catalog.find((item) => item.id === productId) ?? catalog[0];

  return (
    <main className="space-y-4">
      <MobileStepHeader title="本数を選択" step={3} />
      <section className="mb-surface space-y-5 p-5">
        <PurchaseProductHero product={product} />
        <p className="text-sm font-medium text-[var(--mb-forest-light)]">セット数量を選んでください</p>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 5].map((quantity) => (
            <Link
              key={quantity}
              href={`/products/step-4?storeId=${storeId}&productId=${productId}&quantity=${quantity}`}
              className="rounded-full bg-[var(--mb-forest)] px-4 py-5 text-center text-2xl font-semibold tabular-nums text-white transition active:opacity-90"
            >
              {quantity}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
