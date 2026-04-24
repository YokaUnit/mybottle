"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Heart, MapPin, Navigation, Search } from "lucide-react";
import { Store } from "@/lib/mybottle/types";
import type { StoreUiMeta } from "@/lib/supabase/mybottle";
import { HorizontalDragScroll } from "@/components/mybottle/horizontal-drag-scroll";
import { useMasterData } from "@/components/mybottle/master-data-provider";

const FAV_KEY = "mb_store_fav_demo";

type StoreCategory = "all" | "bar" | "stand" | "restaurant" | "cafe";

const CHIPS: { id: StoreCategory; label: string }[] = [
  { id: "all", label: "すべて" },
  { id: "bar", label: "バー" },
  { id: "stand", label: "スタンド" },
  { id: "restaurant", label: "レストラン" },
  { id: "cafe", label: "カフェ" },
];

function distanceKm(fromLat: number, fromLng: number, toLat: number, toLng: number) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(toLat - fromLat);
  const dLng = toRad(toLng - fromLng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(fromLat)) * Math.cos(toRad(toLat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function haystack(store: Store, ui: StoreUiMeta | undefined) {
  return [store.name, store.area, ui?.intro ?? "", ...(ui?.features ?? [])].join(" ");
}

function matchesCategory(store: Store, ui: StoreUiMeta | undefined, cat: StoreCategory) {
  if (cat === "all") return true;
  const t = haystack(store, ui);
  switch (cat) {
    case "bar":
      return /バー|bar|バル|pub|Pub/i.test(t);
    case "stand":
      return /スタンド|立ち飲み|立飲|カウンター|standing/i.test(t);
    case "restaurant":
      return /レストラン|食堂|ダイニング|ビストロ|和食|洋食|dining|grill/i.test(t);
    case "cafe":
      return /カフェ|cafe|コーヒー|coffee|喫茶/i.test(t);
    default:
      return true;
  }
}

function genreLabel(store: Store, ui: StoreUiMeta | undefined) {
  const t = haystack(store, ui);
  if (/バー|bar|バル|pub/i.test(t)) return "バー";
  if (/カフェ|cafe|コーヒー|coffee|喫茶/i.test(t)) return "カフェ";
  if (/スタンド|立ち飲み|立飲/i.test(t)) return "スタンド";
  if (/レストラン|食堂|ダイニング|ビストロ|和食|洋食/i.test(t)) return "レストラン";
  return "店舗";
}

export function StoresScreen() {
  const { stores, storeUiById } = useMasterData();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<StoreCategory>("all");
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [locErr, setLocErr] = useState("");
  const [locLoading, setLocLoading] = useState(false);
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

  const requestLocation = useCallback(
    (opts?: { silent?: boolean }) => {
      if (!navigator.geolocation) {
        if (!opts?.silent) setLocErr("位置情報が使えません");
        return;
      }
      setLocLoading(true);
      setLocErr("");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocLoading(false);
        },
        () => {
          setLocLoading(false);
          if (!opts?.silent) setLocErr("位置情報の許可が必要です");
        },
        { timeout: 12000 },
      );
    },
    [],
  );

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return stores.filter((s) => {
      const ui = storeUiById[s.id];
      if (!matchesCategory(s, ui, category)) return false;
      if (!qq) return true;
      return (
        s.name.toLowerCase().includes(qq) ||
        s.area.toLowerCase().includes(qq) ||
        haystack(s, ui).toLowerCase().includes(qq)
      );
    });
  }, [q, stores, category, storeUiById]);

  const list = useMemo(() => {
    if (!userPos) return filtered;
    return [...filtered].sort(
      (a, b) =>
        distanceKm(userPos.lat, userPos.lng, a.lat, a.lng) -
        distanceKm(userPos.lat, userPos.lng, b.lat, b.lng),
    );
  }, [filtered, userPos]);

  if (stores.length === 0) {
    return <div className="text-sm font-medium text-[var(--mb-forest-light)]">店舗データを読み込み中です...</div>;
  }

  return (
    <div className="space-y-5">
      <h1 className="text-[1.35rem] font-semibold tracking-[-0.04em] text-[var(--mb-ink)]">店舗を探す</h1>

      <div className="flex items-center gap-2.5">
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-[1.05rem] w-[1.05rem] -translate-y-1/2 text-[var(--mb-forest-light)]"
            strokeWidth={2}
            aria-hidden
          />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="店舗名・エリアで検索"
            className="w-full rounded-full border border-[rgba(30,58,47,0.08)] bg-white py-3 pl-10 pr-4 text-[0.9375rem] font-medium text-[var(--mb-ink)] shadow-sm outline-none ring-0 transition placeholder:text-[var(--mb-forest-light)]/75 focus:border-[var(--mb-forest)]/25 focus:ring-2 focus:ring-[var(--mb-forest)]/15"
          />
        </div>
        <button
          type="button"
          title="現在地で並べ替え"
          aria-label="現在地で並べ替え"
          onClick={() => requestLocation()}
          disabled={locLoading}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[rgba(30,58,47,0.1)] bg-white text-[var(--mb-forest)] shadow-sm transition active:scale-[0.97] disabled:opacity-60"
        >
          <Navigation className="h-5 w-5" strokeWidth={2} aria-hidden />
        </button>
      </div>

      <HorizontalDragScroll>
        <div className="flex w-max gap-2 pb-0.5">
          {CHIPS.map((chip) => {
            const on = category === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => setCategory(chip.id)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${
                  on
                    ? "bg-[var(--mb-forest)] text-white shadow-sm"
                    : "border border-[rgba(30,58,47,0.08)] bg-white/90 text-[var(--mb-ink)] shadow-sm"
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </HorizontalDragScroll>

      <button
        type="button"
        onClick={() => requestLocation()}
        disabled={locLoading}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--mb-forest)] py-3.5 text-sm font-semibold text-white shadow-md transition active:opacity-90 disabled:opacity-70"
      >
        <MapPin className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
        {locLoading ? "位置を取得中…" : "近くの店舗を探す"}
      </button>
      {locErr ? <p className="text-center text-xs font-medium text-red-600/90">{locErr}</p> : null}

      <ul className="space-y-4">
        {list.map((store) => {
          const ui = storeUiById[store.id];
          const img = ui?.imageSrc ?? "/store/test1.png";
          const genre = genreLabel(store, ui);
          const dist =
            userPos != null
              ? ` · 約 ${distanceKm(userPos.lat, userPos.lng, store.lat, store.lng).toFixed(1)} km`
              : "";
          const subtitle = `${genre} · ${store.area}${dist}`;
          const fav = !!favById[store.id];

          return (
            <li key={store.id} className="relative">
              <Link
                href={`/stores/${store.id}`}
                className="group relative block aspect-[5/3] min-h-[10.5rem] w-full overflow-hidden rounded-[1.15rem] shadow-[0_8px_28px_rgba(30,58,47,0.12)] ring-1 ring-black/10 transition active:opacity-92"
              >
                <Image
                  src={img}
                  alt=""
                  fill
                  unoptimized
                  className="object-cover transition duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 448px) 100vw, 400px"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/35 to-black/10"
                  aria-hidden
                />
                <div className="absolute inset-x-0 bottom-0 p-4 pr-14 pt-12">
                  <p className="text-[1.05rem] font-bold leading-tight tracking-[-0.02em] text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.45)]">
                    {store.name}
                  </p>
                  <p className="mt-1 text-[0.8125rem] font-medium leading-snug text-white/92 [text-shadow:0_1px_8px_rgba(0,0,0,0.4)]">
                    {subtitle}
                  </p>
                </div>
              </Link>
              <button
                type="button"
                aria-pressed={fav}
                aria-label={fav ? "お気に入りを解除" : "お気に入りに追加"}
                onClick={(e) => {
                  e.preventDefault();
                  toggleFav(store.id);
                }}
                className="absolute bottom-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-[2px] transition hover:bg-black/45 active:scale-95"
              >
                <Heart
                  className={`h-5 w-5 ${fav ? "fill-white stroke-white" : "stroke-white"}`}
                  strokeWidth={2}
                  aria-hidden
                />
              </button>
            </li>
          );
        })}
      </ul>

      {list.length === 0 ? (
        <p className="py-6 text-center text-sm font-medium text-[var(--mb-forest-light)]">
          条件に合う店舗がありません。検索やカテゴリを変えてみてください。
        </p>
      ) : null}

      <p className="text-center text-[11px] font-medium text-[var(--mb-forest-light)]">
        お気に入りはこの端末に保存されます（デモ）。
      </p>
    </div>
  );
}
