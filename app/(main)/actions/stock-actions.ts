"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ActivityLog, PaymentMethod, StockItem } from "@/lib/mybottle/types";

type StockState = {
  stock: StockItem[];
  logs: ActivityLog[];
};

type ProductRow = {
  id: string;
  name: string;
  type: "virtual" | "physical";
  unit_label: string;
  bundle_size: number;
};
type ProductJoinedRow = Pick<ProductRow, "name" | "type" | "unit_label">;

function requireUserId(userId: string | undefined): string {
  if (!userId) throw new Error("認証が必要です");
  return userId;
}

async function getProduct(productId: string): Promise<ProductRow | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("products")
    .select("id,name,type,unit_label,bundle_size")
    .eq("id", productId)
    .maybeSingle();
  return (data as ProductRow | null) ?? null;
}

async function insertEvent(input: {
  userId: string;
  action: ActivityLog["action"];
  storeId: string;
  product: ProductRow;
  units: number;
  detail: string;
}) {
  const supabase = await createSupabaseServerClient();
  await supabase.from("stock_events").insert({
    user_id: input.userId,
    action: input.action,
    store_id: input.storeId,
    product_id: input.product.id,
    product_name: input.product.name,
    units: input.units,
    unit_label: input.product.unit_label,
    detail: input.detail,
  });
}

export async function getStockStateAction(): Promise<StockState> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { stock: [], logs: [] };

  const [{ data: stockRows }, { data: logRows }] = await Promise.all([
    supabase
      .from("user_stock")
      .select("store_id,product_id,remaining_units,updated_at,products!inner(name,type,unit_label)")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false }),
    supabase
      .from("stock_events")
      .select("id,action,store_id,product_id,product_name,units,unit_label,detail,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(200),
  ]);

  const stock: StockItem[] = (stockRows ?? []).map((row) => {
    const productsField = (row as { products?: unknown }).products;
    const product = Array.isArray(productsField)
      ? ((productsField[0] as ProductJoinedRow | undefined) ?? undefined)
      : ((productsField as ProductJoinedRow | undefined) ?? undefined);
    return {
      storeId: (row as { store_id: string }).store_id,
      productId: (row as { product_id: string }).product_id,
      productName: product?.name ?? "",
      type: product?.type ?? "physical",
      remainingUnits: (row as { remaining_units: number }).remaining_units,
      unitLabel: product?.unit_label ?? "",
      updatedAt: (row as { updated_at: string }).updated_at,
    };
  });

  const logs: ActivityLog[] = (logRows ?? []).map((row) => ({
    id: (row as { id: string }).id,
    action: (row as { action: ActivityLog["action"] }).action,
    storeId: (row as { store_id: string }).store_id,
    productId: (row as { product_id: string }).product_id,
    productName: (row as { product_name: string }).product_name,
    units: (row as { units: number }).units,
    unitLabel: (row as { unit_label: string }).unit_label,
    detail: (row as { detail: string }).detail,
    createdAt: (row as { created_at: string }).created_at,
  }));

  return { stock, logs };
}

export async function purchaseAction(input: {
  storeId: string;
  productId: string;
  paymentMethod: PaymentMethod;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = requireUserId(user?.id);
  const product = await getProduct(input.productId);
  if (!product) throw new Error("商品が見つかりません");

  const { data: existing } = await supabase
    .from("user_stock")
    .select("id,remaining_units")
    .eq("user_id", userId)
    .eq("store_id", input.storeId)
    .eq("product_id", input.productId)
    .maybeSingle();

  const nextRemaining = ((existing as { remaining_units?: number } | null)?.remaining_units ?? 0) + product.bundle_size;
  if (existing && (existing as { id?: string }).id) {
    await supabase
      .from("user_stock")
      .update({ remaining_units: nextRemaining })
      .eq("id", (existing as { id: string }).id);
  } else {
    await supabase.from("user_stock").insert({
      user_id: userId,
      store_id: input.storeId,
      product_id: input.productId,
      remaining_units: nextRemaining,
    });
  }

  await insertEvent({
    userId,
    action: "purchase",
    storeId: input.storeId,
    product,
    units: product.bundle_size,
    detail: input.paymentMethod === "apple_pay" ? "店頭確認（Apple Pay）で登録" : "店頭確認で登録",
  });
}

export async function consumeAction(input: {
  storeId: string;
  productId: string;
  units?: number;
}): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = requireUserId(user?.id);
  const product = await getProduct(input.productId);
  if (!product) return false;

  const requestedUnits = Math.max(1, Math.floor(input.units ?? 1));

  const { data: rows } = await supabase
    .from("user_stock")
    .select("id,remaining_units")
    .eq("user_id", userId)
    .eq("store_id", input.storeId)
    .eq("product_id", input.productId)
    .gte("remaining_units", requestedUnits);

  const candidates = (rows as { id: string; remaining_units: number }[] | null) ?? [];
  const target = candidates[0] ?? null;
  if (!target) return false;

  const next = Math.max(0, target.remaining_units - requestedUnits);
  if (next === 0) {
    await supabase.from("user_stock").delete().eq("id", target.id);
  } else {
    await supabase.from("user_stock").update({ remaining_units: next }).eq("id", target.id);
  }

  await insertEvent({
    userId,
    action: "consume",
    storeId: input.storeId,
    product,
    units: requestedUnits,
    detail: `提示確認で${requestedUnits}${product.unit_label}提供`,
  });
  return true;
}

export async function setRemainingUnitsAction(input: {
  storeId: string;
  productId: string;
  remainingUnits: number;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = requireUserId(user?.id);
  const product = await getProduct(input.productId);
  if (!product) return;

  const { data: existing } = await supabase
    .from("user_stock")
    .select("id")
    .eq("user_id", userId)
    .eq("store_id", input.storeId)
    .eq("product_id", input.productId)
    .maybeSingle();

  const nextUnits = Math.max(0, Math.round(input.remainingUnits));
  if (!existing || !(existing as { id?: string }).id) return;
  if (nextUnits === 0) {
    await supabase.from("user_stock").delete().eq("id", (existing as { id: string }).id);
  } else {
    await supabase
      .from("user_stock")
      .update({ remaining_units: nextUnits })
      .eq("id", (existing as { id: string }).id);
  }

  await insertEvent({
    userId,
    action: "update",
    storeId: input.storeId,
    product,
    units: nextUnits,
    detail: `残量を${nextUnits}${product.unit_label}に更新`,
  });
}

export async function removeBottleAction(input: { storeId: string; productId: string }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = requireUserId(user?.id);
  const product = await getProduct(input.productId);
  if (!product) return;

  const { data: existing } = await supabase
    .from("user_stock")
    .select("id,remaining_units")
    .eq("user_id", userId)
    .eq("store_id", input.storeId)
    .eq("product_id", input.productId)
    .maybeSingle();
  if (!existing || !(existing as { id?: string }).id) return;

  await supabase.from("user_stock").delete().eq("id", (existing as { id: string }).id);
  await insertEvent({
    userId,
    action: "remove",
    storeId: input.storeId,
    product,
    units: (existing as { remaining_units: number }).remaining_units,
    detail: "ボトルを削除しました",
  });
}
