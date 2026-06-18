"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Heart, MapPin, Star } from "lucide-react";
import { useMasterData } from "@/components/mybottle/master-data-provider";

const FAV_KEY = "mb_store_fav_demo";

function genreLabel(intro: string, features: string[], area: string) {
  const t = [intro, ...features, area].join(" ");
  if (/バー|bar|バル|pub/i.test(t)) return "バー";
  if (/カフェ|cafe|コーヒー|coffee|喫茶/i.test(t)) return "カフェ";
  if (/スタンド|立ち飲み|立飲/i.test(t)) return "スタンド";
  if (/レストラン|食堂|ダイニング|ビストロ|和食|洋食/i.test(t)) return "レストラン";
  return "店舗";
}

export function FavoritesScreen() {
  const { stores, storeUiById } = useMasterData();
  const [favById, setFavById] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(FAV_KEY);
      if (raw) setFavById(JSON.parse(raw) as Record<string, boolean>);
    } catch {
      /* ignore */
    }
  }, []);

  const persistFav = useCallback((next: Record<string, boolean>) => {
    try {
      window.sessionStorage.setItem(FAV_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const toggleFav = useCallback(
    (storeId: string) => {
      setFavById((prev) => {
        const next = { ...prev, [storeId]: !prev[storeId] };
        persistFav(next);
        return next;
      });
    },
    [persistFav],
  );

  const favorites = useMemo(
    () => stores.filter((store) => favById[store.id]),
    [stores, favById],
  );

  return (
    <div className="space-y-5">
      <h1 className="mb-screen-title">お気に入り店舗</h1>

      {favorites.length === 0 ? (
        <div className="mb-surface px-5 py-12 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[var(--mb-pink)]/15">
            <Heart className="h-7 w-7 text-[var(--mb-pink-dark)]" fill="currentColor" strokeWidth={2} aria-hidden />
          </div>
          <p className="mt-4 text-base font-extrabold text-[var(--mb-ink)]">お気に入り店舗がありません</p>
          <p className="mt-2 text-sm font-medium text-[var(--mb-forest-light)]">
            店舗一覧でハートをタップして保存できます。
          </p>
          <Link href="/stores" className="mb-btn-primary mt-6 inline-flex px-6 py-3 text-sm">
            店舗を探す
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {favorites.map((store) => {
            const ui = storeUiById[store.id];
            const img = ui?.imageSrc ?? "/store/test1.png";
            const genre = genreLabel(ui?.intro ?? "", ui?.features ?? [], store.area);
            const rating = 4.5 + (store.id.charCodeAt(0) % 5) / 10;

            return (
              <li key={store.id}>
                <Link
                  href={`/stores/${store.id}`}
                  className="mb-surface flex gap-3 overflow-hidden p-3 transition active:scale-[0.99]"
                >
                  <div className="relative h-[4.5rem] w-[5.5rem] shrink-0 overflow-hidden rounded-xl bg-[var(--mb-muted)]">
                    <Image
                      src={img}
                      alt=""
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="88px"
                    />
                  </div>
                  <div className="min-w-0 flex-1 py-0.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-1 text-[0.9375rem] font-extrabold text-[var(--mb-ink)]">
                        {store.name}
                      </p>
                      <button
                        type="button"
                        aria-pressed
                        aria-label="お気に入りを解除"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFav(store.id);
                        }}
                        className="shrink-0 rounded-full p-1 text-[var(--mb-pink-dark)] transition active:scale-95"
                      >
                        <Heart className="h-5 w-5" fill="currentColor" strokeWidth={2} aria-hidden />
                      </button>
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-xs font-medium leading-relaxed text-[var(--mb-forest-light)]">
                      {ui?.intro || `${genre} · ${store.area}`}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] font-bold text-[var(--mb-forest-light)]">
                      <span className="inline-flex items-center gap-0.5 text-[var(--mb-yellow-dark)]">
                        <Star className="h-3.5 w-3.5 fill-current" strokeWidth={0} aria-hidden />
                        {rating.toFixed(1)}
                      </span>
                      <span className="inline-flex items-center gap-0.5">
                        <MapPin className="h-3 w-3" strokeWidth={2.5} aria-hidden />
                        {store.area}
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <p className="text-center text-[11px] font-medium text-[var(--mb-forest-light)]">
        お気に入りはこの端末に保存されます（デモ）。
      </p>
    </div>
  );
}
