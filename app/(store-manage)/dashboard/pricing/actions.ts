"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/roles";

const MIN_PRICE_JPY = 100;
const MAX_PRICE_JPY = 1000000;

export async function submitPriceChangeRequestAction(formData: FormData) {
  const { role, user } = await requireRole(["staff", "admin"]);
  const supabase = await createSupabaseServerClient();

  const storeId = formData.get("store_id")?.toString();
  const productId = formData.get("product_id")?.toString();
  const reason = (formData.get("reason")?.toString() ?? "").trim();
  const requestedPriceRaw = Number(formData.get("requested_price_jpy")?.toString() ?? "0");
  const requestedPriceJpy = Number.isFinite(requestedPriceRaw) ? Math.round(requestedPriceRaw) : 0;

  if (!storeId || !productId) throw new Error("店舗または商品が不正です。");
  if (requestedPriceJpy < MIN_PRICE_JPY || requestedPriceJpy > MAX_PRICE_JPY) {
    throw new Error(`価格は${MIN_PRICE_JPY}〜${MAX_PRICE_JPY}円で入力してください。`);
  }
  if (!reason) throw new Error("変更理由を入力してください。");

  if (role === "staff") {
    const { data: membership } = await supabase
      .from("staff_store_memberships")
      .select("id")
      .eq("user_id", user.id)
      .eq("store_id", storeId)
      .eq("is_active", true)
      .maybeSingle();
    if (!membership) throw new Error("この店舗の価格申請権限がありません。");
  }

  const { data: storeProduct } = await supabase
    .from("store_products")
    .select("id")
    .eq("store_id", storeId)
    .eq("product_id", productId)
    .eq("is_active", true)
    .maybeSingle();
  if (!storeProduct) throw new Error("対象の店舗商品が見つかりません。");

  const { error } = await supabase.from("store_product_price_change_requests").insert({
    store_id: storeId,
    product_id: productId,
    requested_price_jpy: requestedPriceJpy,
    reason,
    status: "pending",
    requested_by: user.id,
  });

  if (error?.code === "23505") {
    throw new Error("この商品には未処理の申請が既にあります。承認/却下後に再申請してください。");
  }
  if (error) throw new Error("価格変更申請に失敗しました。時間をおいて再試行してください。");

  revalidatePath("/dashboard/pricing");
  revalidatePath("/admin", "layout");
}

export async function cancelPriceChangeRequestAction(formData: FormData) {
  const { role, user } = await requireRole(["staff", "admin"]);
  const supabase = await createSupabaseServerClient();
  const requestId = formData.get("request_id")?.toString();
  if (!requestId) return;

  let query = supabase
    .from("store_product_price_change_requests")
    .update({ status: "cancelled", reviewed_at: new Date().toISOString(), reviewed_by: user.id, review_note: "申請者キャンセル" })
    .eq("id", requestId)
    .eq("status", "pending");

  if (role !== "admin") {
    query = query.eq("requested_by", user.id);
  }

  await query;
  revalidatePath("/dashboard/pricing");
  revalidatePath("/admin", "layout");
}
