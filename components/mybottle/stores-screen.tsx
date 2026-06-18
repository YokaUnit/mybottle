"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown, Heart, MapPin, Navigation, Search, Star } from "lucide-react";
import { Store } from "@/lib/mybottle/types";
import type { StoreUiMeta } from "@/lib/supabase/mybottle";
import { useMasterData } from "@/components/mybottle/master-data-provider";

const FAV_KEY = "mb_store_fav_demo";

type StoreCategory = "all" | "bar" | "stand" | "restaurant" | "cafe";

const AREAS = ["すべて", "茅ヶ崎", "藤沢", "平塚", "湘南"] as const;

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

function mockRating(storeId: string) {
  return 4.5 + (storeId.charCodeAt(0) % 5) / 10;
}

export function StoresScreen() {
  const { stores, storeUiById } = useMasterData();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<StoreCategory>("all");
  const [areaFilter, setAreaFilter] = useState<(typeof AREAS)[number]>("すべて");
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

  const requestLocation = useCallback((opts?: { silent?: boolean }) => {
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
  }, []);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return stores.filter((s) => {
      const ui = storeUiById[s.id];
      if (!matchesCategory(s, ui, category)) return false;
      if (areaFilter !== "すべて" && !s.area.includes(areaFilter)) return false;
      if (!qq) return true;
      return (
        s.name.toLowerCase().includes(qq) ||
        s.area.toLowerCase().includes(qq) ||
        haystack(s, ui).toLowerCase().includes(qq)
      );
    });
  }, [q, stores, category, areaFilter, storeUiById]);

  const list = useMemo(() => {
    if (!userPos) return filtered;
    return [...filtered].sort(
      (a, b) =>
        distanceKm(userPos.lat, userPos.lng, a.lat, a.lng) -
        distanceKm(userPos.lat, userPos.lng, b.lat, b.lng),
    );
  }, [filtered, userPos]);

  if (stores.length === 0) {
    return <div className="text-sm font-bold text-[var(--mb-forest-light)]">店舗データを読み込み中です...</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="mb-screen-title">店舗を探す</h1>

      <div className="relative">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-[1.05rem] w-[1.05rem] -translate-y-1/2 text-[var(--mb-teal-dark)]"
          strokeWidth={2.5}
          aria-hidden
        />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="店舗名・エリアで検索"
          className="mb-search-input"
        />
      </div>

      <div className="relative">
        <select
          value={areaFilter}
          onChange={(e) => setAreaFilter(e.target.value as (typeof AREAS)[number])}
          className="mb-search-input appearance-none pr-10 font-bold"
          aria-label="エリア・駅で絞り込み"
        >
          {AREAS.map((area) => (
            <option key={area} value={area}>
              {area === "すべて" ? "エリア・駅で絞り込み" : area}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--mb-forest-light)]"
          strokeWidth={2.5}
          aria-hidden
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {(
          [
            { id: "all", label: "すべて" },
            { id: "bar", label: "バー" },
            { id: "stand", label: "スタンド" },
            { id: "restaurant", label: "レストラン" },
            { id: "cafe", label: "カフェ" },
          ] as const
        ).map((chip) => {
          const on = category === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => setCategory(chip.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-extrabold transition active:scale-95 ${
                on
                  ? "bg-[var(--mb-teal)] text-white shadow-[0_3px_10px_rgba(13,148,136,0.35)]"
                  : "border-2 border-[var(--mb-muted-strong)] bg-white text-[var(--mb-ink)]"
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => requestLocation()}
        disabled={locLoading}
        className="mb-btn-primary flex w-full items-center justify-center gap-2 py-3.5 text-sm disabled:opacity-70"
      >
        <Navigation className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
        {locLoading ? "位置を取得中…" : "近くの店舗を探す"}
      </button>
      {locErr ? <p className="text-center text-xs font-bold text-red-500">{locErr}</p> : null}

      <ul className="space-y-3">
        {list.map((store) => {
          const ui = storeUiById[store.id];
          const img = ui?.imageSrc ?? "/store/test1.png";
          const genre = genreLabel(store, ui);
          const distKm =
            userPos != null ? distanceKm(userPos.lat, userPos.lng, store.lat, store.lng) : null;
          const distLabel =
            distKm != null
              ? distKm < 1
                ? `徒歩 ${Math.max(1, Math.round(distKm * 1000 / 80))} 分`
                : `約 ${distKm.toFixed(1)} km`
              : `${store.area}駅`;
          const rating = mockRating(store.id);
          const fav = !!favById[store.id];

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
                      aria-pressed={fav}
                      aria-label={fav ? "お気に入りを解除" : "お気に入りに追加"}
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFav(store.id);
                      }}
                      className={`shrink-0 rounded-full p-1 transition active:scale-95 ${
                        fav ? "text-[var(--mb-pink-dark)]" : "text-[var(--mb-forest-light)]"
                      }`}
                    >
                      <Heart
                        className="h-5 w-5"
                        fill={fav ? "currentColor" : "none"}
                        strokeWidth={2}
                        aria-hidden
                      />
                    </button>
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-xs font-medium leading-relaxed text-[var(--mb-forest-light)]">
                    {ui?.intro || `${genre} · 落ち着いた雰囲気の人気店`}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] font-bold">
                    <span className="inline-flex items-center gap-0.5 text-[var(--mb-yellow-dark)]">
                      <Star className="h-3.5 w-3.5 fill-current" strokeWidth={0} aria-hidden />
                      {rating.toFixed(1)}
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-[var(--mb-forest-light)]">
                      <MapPin className="h-3 w-3" strokeWidth={2.5} aria-hidden />
                      {distLabel}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {list.length === 0 ? (
        <p className="py-6 text-center text-sm font-bold text-[var(--mb-forest-light)]">
          条件に合う店舗がありません。検索や絞り込みを変えてみてください。
        </p>
      ) : null}
    </div>
  );
}
