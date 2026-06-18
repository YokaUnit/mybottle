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
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[#e8ecf0] bg-[#f8fafc]/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-md items-center justify-between px-4">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2">
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
            className={`${brandFont.className} text-[1.3rem] font-bold tracking-[-0.02em] text-[#334155]`}
          >
            mybottle
          </span>
        </Link>
        <Link
          href="/benefits"
          className="relative grid h-10 w-10 place-items-center rounded-full text-[#334155] transition active:scale-95"
          aria-label="お知らせ"
        >
          <Bell className="h-[1.2rem] w-[1.2rem]" strokeWidth={2} aria-hidden />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#ef4444] ring-2 ring-[#f8fafc]" />
        </Link>
      </div>
    </header>
  );
}
