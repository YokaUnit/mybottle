import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { requireRole } from "@/lib/auth/roles";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cancelPriceChangeRequestAction, submitPriceChangeRequestAction } from "@/app/(main)/dashboard/pricing/actions";

type StoreProductRow = {
  store_id: string;
  product_id: string;
  current_price_jpy: number;
  stores: { name: string } | { name: string }[] | null;
  products: { name: string } | { name: string }[] | null;
};

type RequestRow = {
  id: string;
  store_id: string;
  product_id: string;
  requested_price_jpy: number;
  reason: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  created_at: string;
  review_note: string | null;
  stores: { name: string } | { name: string }[] | null;
  products: { name: string } | { name: string }[] | null;
};

function unwrapName(value: { name: string } | { name: string }[] | null): string {
  if (!value) return "-";
  return Array.isArray(value) ? (value[0]?.name ?? "-") : value.name;
}

export default async function DashboardPricingPage() {
  noStore();
  const { role, user } = await requireRole(["staff", "admin"]);
  const supabase = await createSupabaseServerClient();

  const membershipsQuery =
    role === "admin"
      ? supabase.from("staff_store_memberships").select("store_id").eq("is_active", true)
      : supabase.from("staff_store_memberships").select("store_id").eq("user_id", user.id).eq("is_active", true);
  const { data: memberships } = await membershipsQuery;
  const storeIds = [...new Set((memberships ?? []).map((row) => row.store_id))];

  const storeProductsQuery = supabase
    .from("store_products")
    .select("store_id,product_id,current_price_jpy,stores(name),products(name)")
    .eq("is_active", true)
    .order("current_price_jpy", { ascending: false });
  const { data: storeProducts } =
    storeIds.length > 0 ? await storeProductsQuery.in("store_id", storeIds) : { data: [] as StoreProductRow[] };

  const requestsQuery = supabase
    .from("store_product_price_change_requests")
    .select("id,store_id,product_id,requested_price_jpy,reason,status,created_at,review_note,stores(name),products(name)")
    .order("created_at", { ascending: false })
    .limit(100);
  const { data: requestRows } =
    storeIds.length > 0 ? await requestsQuery.in("store_id", storeIds) : { data: [] as RequestRow[] };

  return (
    <main className="space-y-4 pb-4 pt-2">
      <header className="mb-surface p-5">
        <h1 className="mb-screen-title">価格変更申請</h1>
        <p className="mt-1 text-sm font-medium text-[var(--mb-forest-light)]">
          店舗別の価格は申請後、運営承認で反映されます。
        </p>
      </header>

      {storeIds.length === 0 ? (
        <section className="mb-surface p-5 text-sm font-medium text-[var(--mb-forest-light)]">
          担当店舗が未設定です。運営に店舗紐付けを依頼してください。
        </section>
      ) : (
        <section className="mb-surface space-y-3 p-5">
          <h2 className="text-base font-semibold text-[var(--mb-ink)]">申請フォーム</h2>
          <div className="space-y-3">
            {(storeProducts as StoreProductRow[]).map((row) => (
              <form key={`${row.store_id}-${row.product_id}`} action={submitPriceChangeRequestAction} className="rounded-lg border border-[var(--mb-ring)] bg-[var(--mb-muted)] p-3">
                <input type="hidden" name="store_id" value={row.store_id} />
                <input type="hidden" name="product_id" value={row.product_id} />
                <p className="text-xs font-medium text-[var(--mb-forest-light)]">{unwrapName(row.stores)}</p>
                <p className="text-sm font-semibold text-[var(--mb-ink)]">{unwrapName(row.products)}</p>
                <p className="mt-1 text-xs font-medium text-[var(--mb-forest-light)]">現在価格: {row.current_price_jpy.toLocaleString("ja-JP")}円</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <input
                    name="requested_price_jpy"
                    type="number"
                    min={100}
                    max={1000000}
                    required
                    className="rounded-md border border-[var(--mb-ring)] bg-white px-3 py-2 text-sm"
                    placeholder="申請価格"
                  />
                  <button type="submit" className="rounded-full bg-[var(--mb-forest)] px-3 py-2 text-xs font-semibold text-white">
                    価格変更を申請
                  </button>
                </div>
                <textarea
                  name="reason"
                  rows={2}
                  required
                  className="mt-2 w-full rounded-md border border-[var(--mb-ring)] bg-white px-3 py-2 text-sm"
                  placeholder="変更理由（必須）"
                />
              </form>
            ))}
          </div>
        </section>
      )}

      <section className="mb-surface p-5">
        <h2 className="text-base font-semibold text-[var(--mb-ink)]">申請履歴</h2>
        <div className="mt-3 space-y-2">
          {((requestRows as RequestRow[] | null) ?? []).map((row) => (
            <article key={row.id} className="rounded-lg border border-[var(--mb-ring)] bg-[var(--mb-muted)] p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-[var(--mb-ink)]">
                  {unwrapName(row.stores)} / {unwrapName(row.products)}
                </p>
                <span className="text-xs font-semibold text-[var(--mb-forest-light)]">{row.status}</span>
              </div>
              <p className="mt-1 text-xs font-medium text-[var(--mb-forest-light)]">
                申請価格: {row.requested_price_jpy.toLocaleString("ja-JP")}円
              </p>
              <p className="mt-1 text-xs font-medium text-[var(--mb-forest-light)]">理由: {row.reason}</p>
              {row.status === "pending" ? (
                <form action={cancelPriceChangeRequestAction} className="mt-2">
                  <input type="hidden" name="request_id" value={row.id} />
                  <button type="submit" className="text-xs font-semibold text-red-700 underline-offset-2 hover:underline">
                    申請を取り下げる
                  </button>
                </form>
              ) : row.review_note ? (
                <p className="mt-2 text-xs font-medium text-[var(--mb-forest-light)]">審査コメント: {row.review_note}</p>
              ) : null}
            </article>
          ))}
          {((requestRows as RequestRow[] | null) ?? []).length === 0 ? (
            <p className="text-sm font-medium text-[var(--mb-forest-light)]">申請履歴はありません。</p>
          ) : null}
        </div>
      </section>

      <Link href="/dashboard" className="block text-center text-sm font-semibold text-[var(--mb-accent-dark)]">
        ダッシュボードへ戻る
      </Link>
    </main>
  );
}
