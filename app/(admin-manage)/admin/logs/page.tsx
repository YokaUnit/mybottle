import { unstable_noStore as noStore } from "next/cache";
import { Suspense } from "react";
import { AdminManageHeader } from "@/components/mybottle/admin/admin-manage-nav";
import { AdminUsageLogsClient } from "@/components/mybottle/admin/admin-usage-logs-client";
import {
  getAdminUsageLogSummary,
  getAdminUsageLogs,
  type UsageLogActionFilter,
} from "@/lib/admin-manage/usage-logs";
import { supabaseAdmin } from "@/lib/supabase/admin";

type Props = {
  searchParams: Promise<{
    storeId?: string;
    action?: string;
    q?: string;
  }>;
};

const VALID_ACTIONS = new Set<UsageLogActionFilter>([
  "all",
  "purchase",
  "consume",
  "gift_send",
  "gift_receive",
  "other",
]);

function parseAction(value?: string): UsageLogActionFilter {
  if (value && VALID_ACTIONS.has(value as UsageLogActionFilter)) {
    return value as UsageLogActionFilter;
  }
  return "all";
}

async function UsageLogsContent({ searchParams }: Props) {
  const params = await searchParams;
  const storeId = params.storeId && params.storeId !== "all" ? params.storeId : undefined;
  const action = parseAction(params.action);
  const userQuery = params.q?.trim() ?? "";

  const [{ logs, nextCursor }, summary, { data: stores }] = await Promise.all([
    getAdminUsageLogs({
      storeId,
      action,
      userQuery: userQuery || undefined,
    }),
    getAdminUsageLogSummary(),
    supabaseAdmin.from("stores").select("id,name").order("name"),
  ]);

  const summaryItems = [
    { label: "購入", value: summary.last24h.purchase },
    { label: "利用", value: summary.last24h.consume },
    { label: "送信", value: summary.last24h.giftSend },
    { label: "受取", value: summary.last24h.giftReceive },
  ];

  return (
    <>
      <div className="mb-4 grid grid-cols-4 gap-2">
        {summaryItems.map((item) => (
          <div key={item.label} className="rounded-xl bg-[#fffbeb] px-2 py-2.5 text-center ring-1 ring-[#fde68a]">
            <p className="text-[9px] font-bold text-[#78716c]">24h {item.label}</p>
            <p className="mt-0.5 text-base font-extrabold text-[#b45309]">{item.value}</p>
          </div>
        ))}
      </div>

      <AdminUsageLogsClient
        logs={logs}
        nextCursor={nextCursor}
        stores={(stores as { id: string; name: string }[] | null) ?? []}
        initialStoreId={storeId ?? "all"}
        initialAction={action}
        initialQuery={userQuery}
      />
    </>
  );
}

export default async function AdminUsageLogsPage({ searchParams }: Props) {
  noStore();

  return (
    <main className="pt-1">
      <AdminManageHeader
        title="利用ログ"
        subtitle="いつ・誰が・どこで・何を・何杯 — 不正調査の生命線"
      />
      <Suspense
        fallback={
          <p className="text-center text-xs font-bold text-[#a8a29e]">ログを読み込み中…</p>
        }
      >
        <UsageLogsContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
