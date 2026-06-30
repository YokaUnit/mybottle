"use server";

import { revalidatePath } from "next/cache";
import { getNotificationSummary, markNotificationsSeen } from "@/lib/notifications";

export async function getNotificationSummaryAction() {
  return getNotificationSummary();
}

export async function markNotificationsSeenAction() {
  await markNotificationsSeen();
  revalidatePath("/");
  revalidatePath("/notifications");
}
