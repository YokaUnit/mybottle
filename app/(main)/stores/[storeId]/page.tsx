import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock3, MapPin, Navigation, Sparkles, Wine } from "lucide-react";
import { getStoreDetailById } from "@/lib/supabase/mybottle";

type Props = {
  params: Promise<{ storeId: string }>;
};

export default async function StoreDetailPage({ params }: Props) {
  const { storeId } = await params;
  const { store, meta } = await getStoreDetailById(storeId);
  if (!store) notFound();

  const safeMeta = meta ?? {
    imageSrc: "/store/test1.png",
    intro: "",
    features: [],
    openHours: "-",
  };

  return (
    <main className="space-y-5 pb-6 pt-2">
      <section className="mb-surface overflow-hidden">
        <div className="relative h-48 w-full bg-[var(--mb-muted)]">
          <Image
            src={safeMeta.imageSrc}
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
          <p className="text-sm font-medium leading-relaxed text-[var(--mb-forest-light)]">{safeMeta.intro}</p>

          <div className="rounded-[0.85rem] border border-[var(--mb-ring)] bg-[var(--mb-muted)] p-4">
            <div className="flex items-center gap-2 text-sm text-[var(--mb-ink)]">
              <Clock3 className="h-4 w-4 text-[var(--mb-forest-light)]" aria-hidden />
              <span className="font-medium">営業時間</span>
              <span className="ml-auto text-[var(--mb-forest-light)]">{safeMeta.openHours}</span>
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
              {safeMeta.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm font-medium text-[var(--mb-ink)]">
                  <Sparkles className="h-3.5 w-3.5 shrink-0 text-[var(--mb-accent-dark)]" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 rounded-[0.85rem] border border-[var(--mb-ring)] bg-[var(--mb-card)] p-3">
            <p className="text-xs font-medium text-[var(--mb-forest-light)]">
              お会計は店頭で行い、確認後にマイボトルへ反映されます。
            </p>
            <Link
              href={`/products/step-2?storeId=${store.id}`}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[var(--mb-forest)] py-3.5 text-sm font-semibold text-white shadow-sm transition active:opacity-90"
            >
              <Wine className="h-4 w-4" aria-hidden />
              この店舗で購入を始める
            </Link>
          </div>
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
