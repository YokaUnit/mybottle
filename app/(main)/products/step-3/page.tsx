import Link from "next/link";
import { MobileStepHeader } from "@/components/mybottle/mobile-step-header";
import { PurchaseProductHero } from "@/components/mybottle/purchase-product-hero";
import { getMasterData } from "@/lib/supabase/mybottle";

type Props = {
  searchParams: Promise<{ storeId?: string; productId?: string }>;
};

export default async function ProductStep3Page({ searchParams }: Props) {
  const params = await searchParams;
  const { products } = await getMasterData();
  const storeId = params.storeId ?? "chigasaki-a";
  const productId = params.productId ?? products[0]?.id;
  const product = products.find((item) => item.id === productId) ?? products[0];
  if (!product) return null;
  const options = [1, 2, 3, 5];
  const formatJpy = (value: number) => `¥${new Intl.NumberFormat("ja-JP").format(value)}`;

  return (
    <main className="space-y-4">
      <MobileStepHeader title="セット数を選択" step={3} />
      <section className="mb-surface space-y-5 p-5">
        <PurchaseProductHero product={product} />
        <div className="rounded-[0.85rem] border border-[var(--mb-ring)] bg-[var(--mb-muted)] p-4">
          <p className="text-sm font-semibold text-[var(--mb-ink)]">セット数の決め方</p>
          <p className="mt-1 text-xs font-medium leading-relaxed text-[var(--mb-forest-light)]">
            1セット = {product.bundleSize}
            {product.unitLabel} / {formatJpy(product.priceJpy)} です。<br />
            何セット購入するかを選ぶと、合計数量と合計金額が次画面で確認できます。
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {options.map((quantity) => (
            <Link
              key={quantity}
              href={`/products/step-4?storeId=${storeId}&productId=${productId}&quantity=${quantity}`}
              className="rounded-[0.9rem] border border-[var(--mb-forest)]/20 bg-[var(--mb-card)] px-4 py-3 text-center ring-1 ring-[var(--mb-ring)] transition active:opacity-90"
            >
              <p className="text-base font-semibold text-[var(--mb-ink)]">{quantity}セット</p>
              <p className="mt-1 text-xs font-medium text-[var(--mb-forest-light)]">
                合計 {product.bundleSize * quantity}
                {product.unitLabel}
              </p>
              <p className="mt-1 text-xs font-semibold text-[var(--mb-ink)]">{formatJpy(product.priceJpy * quantity)}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
