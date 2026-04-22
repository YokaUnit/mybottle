import Image from "next/image";
import Link from "next/link";
import { MobileStepHeader } from "@/components/mybottle/mobile-step-header";
import { stores } from "@/lib/mybottle/stores";
import { storeUiById } from "@/lib/mybottle/store-ui";

export default function ProductStep1Page() {
  return (
    <main className="space-y-4">
      <MobileStepHeader title="購入方法" step={1} />
      <section className="mb-surface space-y-3 p-5">
        <p className="text-sm font-medium text-[var(--mb-forest-light)]">【オンラインショップ】を選択</p>
        {stores.map((store) => (
          <Link
            key={store.id}
            href={`/products/step-2?storeId=${store.id}`}
            className="flex items-center gap-4 rounded-[var(--mb-radius-card)] border border-[var(--mb-ring)] bg-[var(--mb-muted)] p-3 text-base font-semibold text-[var(--mb-ink)] transition active:opacity-85"
          >
            <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-[var(--mb-card)] ring-1 ring-[var(--mb-ring)]">
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
              <p className="truncate">{store.name}</p>
              <span className="mt-1 block text-sm font-medium text-[var(--mb-forest-light)]">{store.area}</span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
