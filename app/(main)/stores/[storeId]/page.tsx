import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock3, Heart, MapPin, Navigation, Phone, Wine } from "lucide-react";
import { AppErrorScreen } from "@/components/mybottle/app-error-screen";
import { getStorePageState } from "@/lib/supabase/mybottle";

type Props = {
  params: Promise<{ storeId: string }>;
};

export default async function StoreDetailPage({ params }: Props) {
  const { storeId } = await params;
  const state = await getStorePageState(storeId);

  if (state.kind === "not_found") notFound();
  if (state.kind === "inactive") {
    return (
      <main className="space-y-4 pb-6 pt-2">
        <AppErrorScreen variant="store-unavailable" storeName={state.storeName} />
      </main>
    );
  }

  const { store, meta } = state;

  const safeMeta = meta ?? {
    imageSrc: "/store/test1.png",
    intro: "",
    features: [],
    openHours: "-",
  };

  const tags = [
    ...(safeMeta.features.slice(0, 2) ?? []),
    store.area.includes("茅ヶ崎") ? "茅ヶ崎駅" : store.area,
  ].slice(0, 3);

  return (
    <main className="space-y-5 pb-6 pt-2">
      <section className="mb-surface overflow-hidden">
        <div className="relative h-52 w-full bg-[var(--mb-muted)]">
          <Image
            src={safeMeta.imageSrc}
            alt={`${store.name} 店舗イメージ`}
            fill
            unoptimized
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 420px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        </div>

        <div className="space-y-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-[1.5rem] font-extrabold leading-tight tracking-[-0.03em] text-[var(--mb-ink)]">
                {store.name}
              </h1>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[var(--mb-teal)]/12 px-2.5 py-1 text-[11px] font-extrabold text-[var(--mb-teal-dark)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <button
              type="button"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--mb-pink)]/15 text-[var(--mb-pink-dark)] ring-1 ring-[var(--mb-pink)]/25"
              aria-label="お気に入りに追加"
            >
              <Heart className="h-5 w-5" strokeWidth={2.25} aria-hidden />
            </button>
          </div>

          <p className="text-sm font-medium leading-relaxed text-[var(--mb-forest-light)]">
            {safeMeta.intro || `${store.area}エリアの人気店。ボトルキープが利用できます。`}
          </p>

          <div className="space-y-3 rounded-[1rem] bg-[var(--mb-muted)] p-4">
            <div className="flex items-center gap-3 text-sm">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-white text-[var(--mb-teal-dark)] shadow-sm">
                <MapPin className="h-4 w-4" strokeWidth={2.25} aria-hidden />
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--mb-forest-light)]">住所</p>
                <p className="font-bold text-[var(--mb-ink)]">{store.area}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-white text-[var(--mb-teal-dark)] shadow-sm">
                <Clock3 className="h-4 w-4" strokeWidth={2.25} aria-hidden />
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--mb-forest-light)]">営業時間</p>
                <p className="font-bold text-[var(--mb-ink)]">{safeMeta.openHours}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-white text-[var(--mb-teal-dark)] shadow-sm">
                <Phone className="h-4 w-4" strokeWidth={2.25} aria-hidden />
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--mb-forest-light)]">電話</p>
                <p className="font-bold text-[var(--mb-ink)]">店舗にお問い合わせ</p>
              </div>
            </div>
          </div>

          <Link
            href={`/products/step-2?storeId=${store.id}`}
            className="mb-btn-primary flex w-full items-center justify-center gap-2 py-4 text-base"
          >
            <Wine className="h-5 w-5" strokeWidth={2.25} aria-hidden />
            この店舗で使えるボトルを見る
          </Link>
        </div>
      </section>

      <a
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${store.name} ${store.area}`)}`}
        target="_blank"
        rel="noreferrer"
        className="mb-btn-secondary flex w-full items-center justify-center gap-2 py-3.5 text-sm"
      >
        <Navigation className="h-4 w-4" strokeWidth={2.25} aria-hidden />
        地図で開く
      </a>

      <Link
        href="/stores"
        className="block text-center text-sm font-extrabold text-[var(--mb-teal-dark)]"
      >
        店舗一覧へ戻る
      </Link>
    </main>
  );
}
