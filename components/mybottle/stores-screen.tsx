"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronRight, Footprints, Heart, MapPin, Sparkles, Star } from "lucide-react";
import { Store } from "@/lib/mybottle/types";
import { useMasterData } from "@/components/mybottle/master-data-provider";

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

export function StoresScreen() {
  const { stores, storeUiById } = useMasterData();
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"visited" | "fav">("visited");
  const [nearest, setNearest] = useState<{ store: Store; km: number } | null>(null);
  const [locErr, setLocErr] = useState("");
  const [loading, setLoading] = useState(false);

  const mapUrl = useMemo(
    () =>
      `https://maps.google.com/maps?q=${encodeURIComponent(
        stores.map((s) => `${s.name} ${s.area}`).join(" OR "),
      )}&z=14&output=embed`,
    [stores],
  );

  const list = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return stores.filter(
      (s) =>
        !qq ||
        s.name.toLowerCase().includes(qq) ||
        s.area.toLowerCase().includes(qq),
    );
  }, [q, stores]);

  if (stores.length === 0) {
    return <div className="text-sm font-medium text-[var(--mb-forest-light)]">店舗データを読み込み中です...</div>;
  }

  return (
    <div className="space-y-5">
      <h1 className="mb-screen-title">店舗</h1>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="店舗名で検索"
        className="w-full rounded-full border border-[var(--mb-ring)] bg-[var(--mb-card)] px-5 py-3.5 text-[0.9375rem] font-medium text-[var(--mb-ink)] shadow-[var(--mb-shadow-card)] outline-none ring-0 transition placeholder:text-[var(--mb-forest-light)]/70 focus:border-[var(--mb-accent-dark)]/40 focus:ring-2 focus:ring-[var(--mb-accent)]/35"
      />

      <div className="flex gap-1 rounded-full border border-[var(--mb-ring)] bg-[var(--mb-muted)] p-1">
        <button
          type="button"
          onClick={() => setTab("visited")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 text-xs font-semibold transition ${
            tab === "visited"
              ? "bg-[var(--mb-card)] text-[var(--mb-forest)] shadow-sm ring-1 ring-[var(--mb-ring)]"
              : "text-[var(--mb-forest-light)] hover:text-[var(--mb-ink)]"
          }`}
        >
          <Footprints className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden />
          来店した店
        </button>
        <button
          type="button"
          onClick={() => setTab("fav")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 text-xs font-semibold transition ${
            tab === "fav"
              ? "bg-[var(--mb-card)] text-[var(--mb-forest)] shadow-sm ring-1 ring-[var(--mb-ring)]"
              : "text-[var(--mb-forest-light)] hover:text-[var(--mb-ink)]"
          }`}
        >
          <Heart className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden />
          お気に入り
        </button>
      </div>

      <div className="overflow-hidden rounded-[var(--mb-radius-card)] border border-[var(--mb-ring)] bg-[var(--mb-card)] shadow-[var(--mb-shadow-card)]">
        <iframe title="地図" src={mapUrl} className="h-48 w-full" loading="lazy" />
      </div>

      <div className="flex gap-3">
        <Link
          href="/map"
          className="flex-1 rounded-full bg-[var(--mb-forest)] py-3.5 text-center text-sm font-semibold text-white transition active:opacity-90"
        >
          地図で探す
        </Link>
        <button
          type="button"
          className="flex-1 rounded-full bg-[var(--mb-accent)] py-3.5 text-center text-sm font-semibold text-[var(--mb-ink)] transition active:opacity-90"
          onClick={() => {
            if (!navigator.geolocation) {
              setLocErr("位置情報が使えません");
              return;
            }
            setLoading(true);
            setLocErr("");
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                const ranked = stores
                  .map((store) => ({ store, km: distanceKm(lat, lng, store.lat, store.lng) }))
                  .sort((a, b) => a.km - b.km);
                setNearest(ranked[0] ?? null);
                setLoading(false);
              },
              () => {
                setLoading(false);
                setLocErr("位置情報の許可が必要です");
              },
              { timeout: 10000 },
            );
          }}
        >
          {loading ? "取得中…" : "現在地から探す"}
        </button>
      </div>
      {locErr ? <p className="text-sm font-medium text-[var(--mb-accent-dark)]">{locErr}</p> : null}
      {nearest ? (
        <p className="rounded-full bg-[var(--mb-accent)]/35 px-4 py-2.5 text-sm font-medium text-[var(--mb-ink)] ring-1 ring-[var(--mb-accent-dark)]/20">
          最寄り: {nearest.store.name}（約 {nearest.km.toFixed(2)} km）
        </p>
      ) : null}

      <ul className="space-y-3">
        {list.map((store) => (
          <li key={store.id}>
            <Link
              href={`/stores/${store.id}`}
              className="mb-surface block overflow-hidden transition active:opacity-80"
            >
              <article className="flex items-center gap-4 p-4">
                <div className="relative h-[4.25rem] w-[5.25rem] shrink-0 overflow-hidden rounded-[0.85rem] bg-[var(--mb-muted)] ring-1 ring-[var(--mb-ring)]">
                  <Image
                    src={storeUiById[store.id]?.imageSrc ?? "/store/test1.png"}
                    alt={`${store.name} 店舗写真`}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.95rem] font-semibold tracking-[-0.02em] text-[var(--mb-ink)]">
                    {store.name}
                  </p>
                  <p className="text-xs font-medium text-[var(--mb-forest-light)]">{store.area}</p>
                  <p className="mt-1 line-clamp-1 text-xs font-medium leading-snug text-[var(--mb-forest-light)]">
                    {storeUiById[store.id]?.intro ?? "デジタルボトル提示に対応しています。"}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-amber-500" aria-hidden>
                    <Star className="h-5 w-5 fill-amber-400 text-amber-500" strokeWidth={1.5} />
                  </span>
                  <ChevronRight className="h-4 w-4 text-[var(--mb-forest-light)]" aria-hidden />
                </div>
              </article>
              <div className="flex items-center gap-2 border-t border-[var(--mb-ring)] bg-[var(--mb-muted)] px-4 py-2.5 text-[11px] font-medium text-[var(--mb-forest-light)]">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                店舗ページを見る
                <span className="ml-auto inline-flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-[var(--mb-accent-dark)]" aria-hidden />
                  mybottle対応
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <p className="text-center text-xs font-medium text-[var(--mb-forest-light)]">
        お気に入りはデモ表示です（保存は未接続）。
      </p>

      <Link href="/" className="block text-center text-sm font-semibold text-[var(--mb-accent-dark)]">
        ホームへ
      </Link>
    </div>
  );
}
