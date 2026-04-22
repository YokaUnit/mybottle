"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { LocateFixed, Navigation, Store as StoreIcon } from "lucide-react";
import { Circle, CircleMarker, MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { stores } from "@/lib/mybottle/stores";
import { storeUiById } from "@/lib/mybottle/store-ui";

type LatLng = { lat: number; lng: number };

const pinIcon = L.divIcon({
  html: '<span class="mb-map-pin store" />',
  className: "",
  iconSize: [28, 40],
  iconAnchor: [14, 38],
  popupAnchor: [0, -34],
});

const userPinPulseIcon = L.divIcon({
  html: '<span class="mb-user-dot-pulse" />',
  className: "",
  iconSize: [42, 42],
  iconAnchor: [21, 21],
});

function distanceKm(from: LatLng, to: LatLng) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function MapControls({
  locating,
  locateError,
  nearestStoreName,
  onLocate,
  onReset,
}: {
  locating: boolean;
  locateError: string;
  nearestStoreName: string;
  onLocate: () => void;
  onReset: () => void;
}) {
  const map = useMap();

  return (
    <div className="pointer-events-none absolute right-3 top-3 z-[1000] flex w-[min(72vw,260px)] flex-col gap-2">
      <div className="pointer-events-auto ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={onLocate}
          className="inline-flex h-10 items-center gap-1.5 rounded-full bg-[var(--mb-card)]/95 px-3 text-xs font-semibold text-[var(--mb-ink)] shadow-lg ring-1 ring-[var(--mb-ring)] backdrop-blur"
        >
          <Navigation className={`h-4 w-4 ${locating ? "animate-pulse text-[var(--mb-accent-dark)]" : ""}`} />
          {locating ? "測位中" : "現在地"}
        </button>
        <button
          type="button"
          onClick={() => {
            onReset();
            map.flyTo([35.331, 139.404], 14, { duration: 0.8 });
          }}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[var(--mb-ink)] shadow-lg ring-1 ring-black/10 backdrop-blur"
          aria-label="地図を初期位置に戻す"
        >
          <LocateFixed className="h-4 w-4" />
        </button>
      </div>

      {nearestStoreName ? (
        <div className="pointer-events-auto ml-auto inline-flex items-center gap-1.5 rounded-full bg-[var(--mb-forest)]/95 px-3 py-1.5 text-[11px] font-bold text-white shadow-md">
          <StoreIcon className="h-3.5 w-3.5" />
          最寄り: {nearestStoreName}
        </div>
      ) : null}

      {locateError ? (
        <p className="pointer-events-auto ml-auto max-w-[230px] rounded-lg bg-red-50 px-2.5 py-1.5 text-[11px] font-bold text-red-700 shadow-sm ring-1 ring-red-200">
          {locateError}
        </p>
      ) : null}
    </div>
  );
}

function MapEffects({ userPosition }: { userPosition: LatLng | null }) {
  const map = useMap();
  useEffect(() => {
    if (!userPosition) return;
    map.flyTo([userPosition.lat, userPosition.lng], 15, { duration: 0.8 });
  }, [map, userPosition]);
  return null;
}

export function StoresMapView() {
  const [userPosition, setUserPosition] = useState<LatLng | null>(null);
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState("");

  const nearestStoreName = useMemo(() => {
    if (!userPosition) return "";
    const ranked = [...stores].sort(
      (a, b) =>
        distanceKm(userPosition, { lat: a.lat, lng: a.lng }) -
        distanceKm(userPosition, { lat: b.lat, lng: b.lng }),
    );
    return ranked[0]?.name ?? "";
  }, [userPosition]);

  function handleLocate() {
    if (!navigator.geolocation) {
      setLocateError("この端末では位置情報が使えません");
      return;
    }
    setLocating(true);
    setLocateError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setLocateError("位置情報の許可が必要です");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-white">
      <MapContainer
        center={[35.331, 139.404]}
        zoom={14}
        scrollWheelZoom
        zoomControl={false}
        className="h-full w-full"
      >
        <MapEffects userPosition={userPosition} />
        <MapControls
          locating={locating}
          locateError={locateError}
          nearestStoreName={nearestStoreName}
          onLocate={handleLocate}
          onReset={() => {
            setLocateError("");
            setUserPosition(null);
          }}
        />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {userPosition ? (
          <>
            <Circle
              center={[userPosition.lat, userPosition.lng]}
              radius={60}
              pathOptions={{ color: "#38bdf8", fillColor: "#38bdf8", fillOpacity: 0.15, weight: 1 }}
            />
            <Marker position={[userPosition.lat, userPosition.lng]} icon={userPinPulseIcon} interactive={false} />
            <CircleMarker
              center={[userPosition.lat, userPosition.lng]}
              radius={7}
              pathOptions={{ color: "#ffffff", weight: 2, fillColor: "#38bdf8", fillOpacity: 1 }}
            >
              <Popup>あなたの現在地</Popup>
            </CircleMarker>
          </>
        ) : null}

        {stores.map((store) => (
          <Marker key={store.id} position={[store.lat, store.lng]} icon={pinIcon}>
            <Popup minWidth={230}>
              <div className="w-[232px] overflow-hidden rounded-lg">
                <div className="relative h-24 w-full bg-[var(--mb-muted)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={storeUiById[store.id]?.imageSrc ?? "/store/test1.png"}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-1.5 p-2.5">
                  <p className="text-sm font-semibold tracking-[-0.02em] text-[var(--mb-ink)]">{store.name}</p>
                  <p className="text-xs text-[var(--mb-forest-light)]">{store.area}</p>
                  <p className="line-clamp-2 text-xs text-[var(--mb-forest-light)]">{storeUiById[store.id]?.intro}</p>
                  <div className="flex gap-1.5 pt-1">
                    <Link
                      href={`/stores/${store.id}`}
                      className="inline-flex rounded-md bg-[var(--mb-forest)] px-2.5 py-1 text-xs font-semibold text-white"
                    >
                      店舗ページ
                    </Link>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${store.name} ${store.area}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex rounded-md border border-[var(--mb-ring)] bg-[var(--mb-card)] px-2.5 py-1 text-xs font-semibold text-[var(--mb-ink)]"
                    >
                      ルート
                    </a>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
