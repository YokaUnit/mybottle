import Link from "next/link";
import { Bell } from "lucide-react";

type Props = {
  unreadCount: number;
};

export function NotificationBell({ unreadCount }: Props) {
  const label =
    unreadCount > 0
      ? `お知らせ（未読${unreadCount > 9 ? "9件以上" : `${unreadCount}件`}）`
      : "お知らせ";

  return (
    <Link
      href="/notifications"
      className="relative grid h-10 w-10 place-items-center rounded-full text-[#334155] transition active:scale-95 active:bg-[#f1f5f9]"
      aria-label={label}
    >
      <Bell className="h-[1.2rem] w-[1.2rem]" strokeWidth={2} aria-hidden />
      {unreadCount > 0 ? (
        <span
          className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#ef4444] ring-2 ring-white"
          aria-hidden
        />
      ) : null}
    </Link>
  );
}
