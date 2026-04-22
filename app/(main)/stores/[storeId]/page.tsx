import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { catalog } from "@/lib/mybottle/catalog";
import { bottleImageCandidates } from "@/lib/mybottle/bottle-images";
import { Bolt, Clock3, MapPin, Navigation, Sparkles, Wine } from "lucide-react";
import { stores } from "@/lib/mybottle/stores";
import { storeUiById } from "@/lib/mybottle/store-ui";

type Props = {
  params: Promise<{ storeId: string }>;
};

export default async function StoreDetailPage({ params }: Props) {
  const { storeId } = await params;
  const store = stores.find((s) => s.id === storeId);
  if (!store) notFound();

  const meta = storeUiById[store.id] ?? storeUiById["chigasaki-a"];
  const heroProducts = catalog.slice(0, 3);

  return (
    <main className="space-y-5 pb-6 pt-2">
      <section className="mb-surface overflow-hidden">
        <div className="relative h-48 w-full bg-[var(--mb-muted)]">
          <Image
            src={meta.imageSrc}
            alt={`${store.name} 店舗イメージ`}
            fill
            unoptimized
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 420px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 space-y-2">
            <p className="text-[1.65rem] font-semibold leading-none tracking-[-0.03em] text-white">{store.name}</p>
            <p className="inline-flex rounded-full bg-black/30 px-3 py-1 text-[11px] font-medium text-white/95 backdrop-blur-sm">
              {store.area}
            </p>
          </div>
        </div>

        <div className="space-y-4 p-5">
          <p className="text-sm font-medium leading-relaxed text-[var(--mb-forest-light)]">{meta.intro}</p>

          <div className="rounded-[0.85rem] border border-[var(--mb-ring)] bg-[var(--mb-muted)] p-4">
            <div className="flex items-center gap-2 text-sm text-[var(--mb-ink)]">
              <Clock3 className="h-4 w-4 text-[var(--mb-forest-light)]" aria-hidden />
              <span className="font-medium">営業時間</span>
              <span className="ml-auto text-[var(--mb-forest-light)]">{meta.openHours}</span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-[var(--mb-ink)]">
              <MapPin className="h-4 w-4 text-[var(--mb-forest-light)]" aria-hidden />
              <span className="font-medium">エリア</span>
              <span className="ml-auto text-[var(--mb-forest-light)]">{store.area}</span>
            </div>
          </div>

          <div className="rounded-[0.85rem] border border-[var(--mb-ring)] bg-[var(--mb-muted)] p-4">
            <p className="mb-label-caps">店舗の特徴</p>
            <ul className="mt-3 space-y-2">
              {meta.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm font-medium text-[var(--mb-ink)]">
                  <Sparkles className="h-3.5 w-3.5 shrink-0 text-[var(--mb-accent-dark)]" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[var(--mb-ring)] bg-[var(--mb-card)] py-3.5 text-sm font-semibold text-[var(--mb-forest)] shadow-sm transition active:opacity-90"
            >
              <Bolt className="h-4 w-4" aria-hidden />
              お店で即払う
            </button>
            <Link
              href={`/products/step-2?storeId=${store.id}`}
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[var(--mb-forest)] py-3.5 text-sm font-semibold text-white shadow-sm transition active:opacity-90"
            >
              <Wine className="h-4 w-4" aria-hidden />
              3品買う
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-surface p-5">
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="text-[1.25rem] font-semibold tracking-[-0.03em] text-[var(--mb-ink)]">ボトル商品・登録</h2>
          <Link
            href={`/products/step-2?storeId=${store.id}`}
            className="shrink-0 text-sm font-medium text-[var(--mb-accent-dark)]"
          >
            すべて見る
          </Link>
        </div>
        <div className="space-y-3">
          {heroProducts.map((product) => (
            <article
              key={product.id}
              className="flex items-center gap-3 rounded-[0.85rem] border border-[var(--mb-ring)] bg-[var(--mb-muted)] p-3"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[var(--mb-card)] ring-1 ring-[var(--mb-ring)]">
                <Image
                  src={bottleImageCandidates(product.id)[0]}
                  alt={product.name}
                  fill
                  unoptimized
                  className="object-contain p-1"
                  sizes="56px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[var(--mb-ink)]">{product.name}</p>
                <p className="text-xs font-medium text-[var(--mb-forest-light)]">
                  {product.bundleSize}
                  {product.unitLabel} / {new Intl.NumberFormat("ja-JP").format(product.priceJpy)}円
                </p>
              </div>
              <Link
                href={`/products/step-3?storeId=${store.id}&productId=${product.id}`}
                className="shrink-0 rounded-full bg-[var(--mb-forest)] px-3 py-1.5 text-xs font-semibold text-white transition active:opacity-90"
              >
                この店で
              </Link>
            </article>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${store.name} ${store.area}`)}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--mb-forest)] px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition active:opacity-90"
        >
          <Navigation className="h-4 w-4" aria-hidden />
          地図で開く
        </a>
        <Link
          href={`/products/step-2?storeId=${store.id}`}
          className="inline-flex items-center justify-center rounded-full border border-[var(--mb-forest)]/25 bg-[var(--mb-card)] px-4 py-3.5 text-sm font-semibold text-[var(--mb-forest)] ring-1 ring-[var(--mb-ring)] transition active:opacity-90"
        >
          この店舗で購入
        </Link>
      </div>

      <Link href="/stores" className="block text-center text-sm font-semibold text-[var(--mb-accent-dark)]">
        店舗一覧へ戻る
      </Link>
    </main>
  );
}
