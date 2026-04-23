import Link from "next/link";
import { MobileStepHeader } from "@/components/mybottle/mobile-step-header";
import { getMasterData } from "@/lib/supabase/mybottle";

type Props = {
  searchParams: Promise<{ storeId?: string; productId?: string }>;
};

export default async function ConsumeStep2Page({ searchParams }: Props) {
  const params = await searchParams;
  const { stores, products } = await getMasterData();
  const storeId = params.storeId ?? stores[0]?.id ?? "";
  const productId = params.productId ?? products[0]?.id ?? "";
  const store = stores.find((s) => s.id === storeId) ?? stores[0];
  const product = products.find((p) => p.id === productId) ?? products[0];
  if (!store || !product) return null;

  return (
    <main className="space-y-4">
      <MobileStepHeader title="使用内容を確認" step={2} />
      <section className="mb-surface space-y-5 p-5">
        <div className="rounded-[0.85rem] border border-[var(--mb-ring)] bg-[var(--mb-muted)] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--mb-forest-light)]">店舗</p>
          <p className="mt-1 text-lg font-semibold tracking-[-0.02em] text-[var(--mb-ink)]">{store.name}</p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[var(--mb-forest-light)]">
            使用ボトル
          </p>
          <p className="mt-1 text-lg font-semibold tracking-[-0.02em] text-[var(--mb-ink)]">{product.name}</p>
        </div>
        <ul className="space-y-2 text-sm font-medium leading-relaxed text-[var(--mb-forest-light)]">
          <li>1. 先に使用する杯数を選びます</li>
          <li>2. 店員さんに提示画面を見せます</li>
          <li>3. 口頭確認後に使用を確定します</li>
        </ul>
        <Link
          href={`/consume/step-3?storeId=${storeId}&productId=${productId}`}
          className="block rounded-full bg-[var(--mb-forest)] px-4 py-4 text-center text-base font-semibold text-white transition active:opacity-90"
        >
          杯数を選ぶ
        </Link>
      </section>
    </main>
  );
}
