export default function SendLoading() {
  return (
    <main className="pb-8 pt-2" aria-busy="true" aria-label="読み込み中">
      <div className="mb-4 h-8 w-24 animate-pulse rounded-lg bg-[var(--mb-muted)]" />

      <div className="flex animate-pulse rounded-full bg-[var(--mb-muted)] p-1">
        <div className="h-10 flex-1 rounded-full bg-white/80" />
        <div className="h-10 flex-1" />
      </div>

      <div className="mt-3 h-11 animate-pulse rounded-2xl bg-[var(--mb-muted)]" />

      <ul className="mt-3 space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i} className="mb-surface flex items-center gap-3 p-4">
            <div className="h-10 w-10 shrink-0 rounded-full bg-[var(--mb-muted)]" />
            <div className="h-4 flex-1 rounded bg-[var(--mb-muted)]" />
          </li>
        ))}
      </ul>
    </main>
  );
}
