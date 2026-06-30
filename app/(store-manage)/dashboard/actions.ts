"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireStoreAccess } from "@/lib/store-manage/access";
import type { BenefitKind, RewardType } from "@/lib/store-manage/types";

function revalidateStorePaths(storeId: string) {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/bottles");
  revalidatePath("/dashboard/benefits");
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/history");
  revalidatePath(`/stores/${storeId}`);
  revalidatePath("/benefits");
  revalidatePath("/products/step-2");
  revalidatePath("/products/step-3");
  revalidatePath("/products/step-4");
}

export async function updateStoreProductAction(formData: FormData) {
  const storeId = String(formData.get("storeId") ?? "");
  const productRowId = String(formData.get("productRowId") ?? "");
  await requireStoreAccess(storeId);

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("store_products")
    .update({
      regular_price_jpy: Number(formData.get("regularPriceJpy")),
      current_price_jpy: Number(formData.get("mybottlePriceJpy")),
      min_purchase_sets: Number(formData.get("minPurchaseSets")),
      max_purchase_sets: formData.get("maxPurchaseSets")
        ? Number(formData.get("maxPurchaseSets"))
        : null,
      validity_days: Number(formData.get("validityDays")),
      is_selling: formData.get("isSelling") === "true",
      updated_at: new Date().toISOString(),
    })
    .eq("id", productRowId)
    .eq("store_id", storeId);

  if (error) throw new Error(error.message);
  revalidateStorePaths(storeId);
}

export async function toggleStoreProductSoldOutAction(formData: FormData) {
  const storeId = String(formData.get("storeId") ?? "");
  const productRowId = String(formData.get("productRowId") ?? "");
  const next = formData.get("isSoldOut") === "true";
  await requireStoreAccess(storeId);

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("store_products")
    .update({ is_sold_out: next, updated_at: new Date().toISOString() })
    .eq("id", productRowId)
    .eq("store_id", storeId);

  if (error) throw new Error(error.message);
  revalidateStorePaths(storeId);
}

export async function toggleStoreProductSellingAction(formData: FormData) {
  const storeId = String(formData.get("storeId") ?? "");
  const productRowId = String(formData.get("productRowId") ?? "");
  const next = formData.get("isSelling") === "true";
  await requireStoreAccess(storeId);

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("store_products")
    .update({ is_selling: next, updated_at: new Date().toISOString() })
    .eq("id", productRowId)
    .eq("store_id", storeId);

  if (error) throw new Error(error.message);
  revalidateStorePaths(storeId);
}

export async function toggleStoreBenefitAction(formData: FormData) {
  const storeId = String(formData.get("storeId") ?? "");
  const benefitId = String(formData.get("benefitId") ?? "");
  const next = formData.get("isActive") === "true";
  await requireStoreAccess(storeId);

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("store_benefits")
    .update({ is_active: next, updated_at: new Date().toISOString() })
    .eq("id", benefitId)
    .eq("store_id", storeId);

  if (error) throw new Error(error.message);
  revalidateStorePaths(storeId);
}

export async function createStoreBenefitAction(formData: FormData) {
  const storeId = String(formData.get("storeId") ?? "");
  await requireStoreAccess(storeId);

  const benefitKind = String(formData.get("benefitKind") ?? "custom") as BenefitKind;
  const rewardType = String(formData.get("rewardType") ?? "amount_off") as RewardType;
  const conditionsRaw = String(formData.get("conditions") ?? "{}");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("store_benefits").insert({
    store_id: storeId,
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    benefit_kind: benefitKind,
    reward_type: rewardType,
    reward_value: Number(formData.get("rewardValue") ?? 0),
    conditions: JSON.parse(conditionsRaw),
    is_active: true,
  });

  if (error) throw new Error(error.message);
  revalidateStorePaths(storeId);
}

export async function deleteStoreBenefitAction(formData: FormData) {
  const storeId = String(formData.get("storeId") ?? "");
  const benefitId = String(formData.get("benefitId") ?? "");
  await requireStoreAccess(storeId);

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("store_benefits").delete().eq("id", benefitId).eq("store_id", storeId);
  if (error) throw new Error(error.message);
  revalidateStorePaths(storeId);
}

export async function updateStorePurchasePinAction(formData: FormData) {
  const storeId = String(formData.get("storeId") ?? "");
  await requireStoreAccess(storeId);

  const pinCode = String(formData.get("pinCode") ?? "").padStart(4, "0").slice(-4);
  if (!/^\d{4}$/.test(pinCode)) {
    throw new Error("PINは4桁の数字で入力してください");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("store_staff_pins").upsert(
    {
      store_id: storeId,
      label: "店舗PIN",
      pin_code: pinCode,
      is_active: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "store_id" },
  );

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  revalidatePath("/products/step-4");
}

export async function updateStoreSettingsAction(formData: FormData) {
  const storeId = String(formData.get("storeId") ?? "");
  await requireStoreAccess(storeId);

  const supabase = await createSupabaseServerClient();
  const [{ error: storeError }, { error: metaError }] = await Promise.all([
    supabase
      .from("stores")
      .update({
        name: String(formData.get("name") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        address: String(formData.get("address") ?? ""),
        regular_holiday: String(formData.get("regularHoliday") ?? ""),
        updated_at: new Date().toISOString(),
      })
      .eq("id", storeId),
    supabase.from("store_ui_meta").upsert({
      store_id: storeId,
      image_src: String(formData.get("imageSrc") ?? "/store/test1.png"),
      intro: String(formData.get("intro") ?? ""),
      features: [],
      open_hours: String(formData.get("openHours") ?? ""),
      updated_at: new Date().toISOString(),
    }),
  ]);

  if (storeError) throw new Error(storeError.message);
  if (metaError) throw new Error(metaError.message);
  revalidateStorePaths(storeId);
}
