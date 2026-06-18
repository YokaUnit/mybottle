import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { MobileStepHeader } from "@/components/mybottle/mobile-step-header";
import { getMasterData } from "@/lib/supabase/mybottle";

export default async function ProductStep1Page() {
  const { stores, storeUiById } = await getMasterData();
  return (
    <main className="space-y-4">
      <MobileStepHeader title="店舗を選択" step={1} />
      <section className="mb-surface space-y-3 p-5">
        <p className="text-sm font-bold text-[var(--mb-forest-light)]">
          ボトルを受け取る店舗を選択してください（お会計は店頭で行います）
        </p>
        {stores.map((store) => (
          <Link
            key={store.id}
            href={`/products/step-2?storeId=${store.id}`}
            className="flex items-center gap-4 rounded-[1rem] border-2 border-[var(--mb-muted-strong)] bg-white p-3 transition active:scale-[0.99] hover:border-[var(--mb-teal)]/40"
          >
            <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-xl bg-[var(--mb-muted)] ring-2 ring-[var(--mb-yellow)]/30">
              <Image
                src={storeUiById[store.id]?.imageSrc ?? "/store/test1.png"}
                alt={`${store.name} 店舗画像`}
                fill
                unoptimized
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-extrabold text-[var(--mb-ink)]">{store.name}</p>
              <span className="mt-1 flex items-center gap-1 text-sm font-bold text-[var(--mb-forest-light)]">
                <MapPin className="h-3.5 w-3.5 text-[var(--mb-teal-dark)]" strokeWidth={2.5} aria-hidden />
                {store.area}
              </span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
