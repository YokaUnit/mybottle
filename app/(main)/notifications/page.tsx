import type { Metadata } from "next";
import { NotificationsPageClient } from "@/components/mybottle/notifications-page-client";
import { getNotificationSummary } from "@/lib/notifications";

export const metadata: Metadata = {
  title: "お知らせ",
};

export default async function NotificationsPage() {
  const { items } = await getNotificationSummary();
  return <NotificationsPageClient initialItems={items} />;
}
