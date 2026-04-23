import Image from "next/image";
import Link from "next/link";
import { Outfit } from "next/font/google";
import { Bell } from "lucide-react";

const brandFont = Outfit({
  subsets: ["latin"],
  weight: ["600", "700"],
});

export function AppBrandHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[var(--mb-ring)] bg-[var(--mb-card)]">
      <div className="mx-auto flex h-14 w-full max-w-md items-center justify-between px-5">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2.5">
          <div className="relative h-9 w-9 shrink-0">
            <Image
              src="/images/header_logo.png"
              alt="mybottle ロゴ"
              fill
              priority
              unoptimized
              sizes="36px"
              className="object-contain"
            />
          </div>
          <span
            className={`${brandFont.className} text-[1.35rem] font-semibold tracking-[-0.02em] text-[var(--mb-forest)]`}
          >
            mybottle
          </span>
        </Link>
        <Link
          href="/benefits"
          className="grid h-10 w-10 place-items-center rounded-full bg-[var(--mb-muted)] text-[var(--mb-forest)] ring-1 ring-[var(--mb-ring)] active:scale-[0.96] hover:bg-[var(--mb-muted-strong)]"
          aria-label="お知らせ"
        >
          <Bell className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.75} aria-hidden />
        </Link>
      </div>
    </header>
  );
}
