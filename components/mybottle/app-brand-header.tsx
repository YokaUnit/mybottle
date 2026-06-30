import { NotificationBell } from "@/components/mybottle/notification-bell";
import { getNotificationSummary } from "@/lib/notifications";
import Image from "next/image";
import Link from "next/link";
import { Outfit } from "next/font/google";

const brandFont = Outfit({
  subsets: ["latin"],
  weight: ["600", "700"],
});

export async function AppBrandHeader() {
  const { unreadCount } = await getNotificationSummary();

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[var(--mb-ring)] bg-white/78 backdrop-blur-xl">
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
        <NotificationBell unreadCount={unreadCount} />
      </div>
    </header>
  );
}
