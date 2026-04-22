"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { stores } from "@/lib/mybottle/stores";
import { Store } from "@/lib/mybottle/types";

function distanceKm(fromLat: number, fromLng: number, toLat: number, toLng: number) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(toLat - fromLat);
  const dLng = toRad(toLng - fromLng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(fromLat)) *
      Math.cos(toRad(toLat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

export function HomeStoreMap() {
  const [nearest, setNearest] = useState<Store | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [locationError, setLocationError] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);

  const mapQuery = useMemo(
    () => stores.map((store) => `${store.name} ${store.area}`).join(" OR "),
    [],
  );
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=14&output=embed`;

  return (
    <section className="mb-surface p-5">
      <h2 className="text-lg font-semibold tracking-[-0.02em] text-[var(--mb-ink)]">加盟店マップ（茅ヶ崎）</h2>
      <p className="mt-1 text-sm font-medium text-[var(--mb-forest-light)]">現在地から近い加盟店をすぐ探せます</p>

      <div className="mt-4 overflow-hidden rounded-[var(--mb-radius-card)] border border-[var(--mb-ring)]">
        <iframe
          title="加盟店マップ"
          src={mapUrl}
          className="h-56 w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <button
        type="button"
        className="mt-4 w-full rounded-full bg-[var(--mb-accent)] px-4 py-3.5 text-base font-semibold text-[var(--mb-ink)] transition active:opacity-90"
        onClick={() => {
          if (!navigator.geolocation) {
            setLocationError("この端末では現在地機能が使えません。");
            return;
          }
          setLoadingLocation(true);
          setLocationError("");
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const currentLat = position.coords.latitude;
              const currentLng = position.coords.longitude;
              const sorted = [...stores]
                .map((store) => ({
                  store,
                  dist: distanceKm(currentLat, currentLng, store.lat, store.lng),
                }))
                .sort((a, b) => a.dist - b.dist);
              setNearest(sorted[0].store);
              setDistance(sorted[0].dist);
              setLoadingLocation(false);
            },
            () => {
              setLoadingLocation(false);
              setLocationError("位置情報の許可が必要です。ブラウザで許可してください。");
            },
            { enableHighAccuracy: true, timeout: 10000 },
          );
        }}
      >
        {loadingLocation ? "現在地を取得中..." : "現在地から探す"}
      </button>

      {locationError ? <p className="mt-2 text-sm text-rose-600">{locationError}</p> : null}
      {nearest && distance !== null ? (
        <div className="mt-4 rounded-[0.85rem] border border-[var(--mb-accent-dark)]/25 bg-[var(--mb-accent)]/20 p-4">
          <p className="text-base font-semibold text-[var(--mb-ink)]">最寄り加盟店: {nearest.name}</p>
          <p className="mt-1 text-sm font-medium text-[var(--mb-forest-light)]">
            直線距離 約 {distance.toFixed(2)} km / {nearest.area}
          </p>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${nearest.lat},${nearest.lng}&travelmode=walking`}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block text-sm font-semibold text-[var(--mb-accent-dark)]"
          >
            徒歩ルートで開く
          </a>
        </div>
      ) : null}

      <ul className="mt-4 space-y-2">
        {stores.map((store) => (
          <li
            key={store.id}
            className="rounded-[0.85rem] border border-[var(--mb-ring)] bg-[var(--mb-muted)] p-3"
          >
            <p className="text-base font-medium text-[var(--mb-ink)]">{store.name}</p>
            <p className="text-sm font-medium text-[var(--mb-forest-light)]">{store.area}</p>
            <Link
              href={`https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lng}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-sm font-semibold text-[var(--mb-accent-dark)]"
            >
              地図で開く
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
