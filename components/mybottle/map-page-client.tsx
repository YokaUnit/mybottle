"use client";

import dynamic from "next/dynamic";

const StoresMapView = dynamic(
  () => import("@/components/mybottle/stores-map-view").then((m) => m.StoresMapView),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-full w-full place-items-center bg-[var(--mb-card)] text-sm font-medium text-[var(--mb-forest-light)]">
        地図を読み込み中...
      </div>
    ),
  },
);

export function MapPageClient() {
  return (
    <main className="fixed inset-x-0 top-14 bottom-[calc(6.25rem+env(safe-area-inset-bottom))] z-10">
      <StoresMapView />
    </main>
  );
}
