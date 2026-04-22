"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/roles";
import { supabaseAdmin } from "@/lib/supabase/admin";

function revalidateAdminTree() {
  revalidatePath("/admin", "layout");
}

function parseFeaturesCsv(raw: string): string[] {
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function updateUserRoleAction(formData: FormData) {
  await requireRole(["admin"]);
  const userId = formData.get("user_id")?.toString();
  const role = formData.get("role")?.toString();
  if (!userId) return;
  if (role !== "user" && role !== "staff" && role !== "admin") return;

  await supabaseAdmin.from("profiles").update({ role }).eq("id", userId);
  revalidateAdminTree();
  revalidatePath("/mypage");
}

export async function toggleStoreActiveAction(formData: FormData) {
  await requireRole(["admin"]);
  const storeId = formData.get("store_id")?.toString();
  const nextActive = formData.get("next_active")?.toString() === "true";
  if (!storeId) return;

  await supabaseAdmin.from("stores").update({ is_active: nextActive }).eq("id", storeId);
  revalidateAdminTree();
  revalidatePath("/stores");
}

export async function updateStoreUiMetaAction(formData: FormData) {
  await requireRole(["admin"]);
  const storeId = formData.get("store_id")?.toString();
  if (!storeId) return;

  const intro = (formData.get("intro")?.toString() ?? "").trim();
  const openHours = (formData.get("open_hours")?.toString() ?? "").trim();
  const imageSrc = (formData.get("image_src")?.toString() ?? "").trim();
  const featuresCsv = (formData.get("features_csv")?.toString() ?? "").trim();

  await supabaseAdmin.from("store_ui_meta").upsert({
    store_id: storeId,
    intro: intro || "",
    open_hours: openHours || "-",
    image_src: imageSrc || "/store/test1.png",
    features: parseFeaturesCsv(featuresCsv),
  });

  revalidateAdminTree();
  revalidatePath(`/stores/${storeId}`);
  revalidatePath("/stores");
}

export async function updateProductAction(formData: FormData) {
  await requireRole(["admin"]);
  const productId = formData.get("product_id")?.toString();
  if (!productId) return;

  const priceJpyRaw = Number(formData.get("price_jpy")?.toString() ?? "0");
  const bundleSizeRaw = Number(formData.get("bundle_size")?.toString() ?? "1");
  const description = (formData.get("description")?.toString() ?? "").trim();
  const isActive = formData.get("is_active")?.toString() === "true";

  const priceJpy = Number.isFinite(priceJpyRaw) ? Math.max(0, Math.round(priceJpyRaw)) : 0;
  const bundleSize = Number.isFinite(bundleSizeRaw) ? Math.max(1, Math.round(bundleSizeRaw)) : 1;

  await supabaseAdmin
    .from("products")
    .update({
      price_jpy: priceJpy,
      bundle_size: bundleSize,
      description,
      is_active: isActive,
    })
    .eq("id", productId);

  revalidateAdminTree();
  revalidatePath("/products/step-1");
  revalidatePath("/products/step-2");
  revalidatePath("/products/step-3");
  revalidatePath("/products/step-4");
}

export async function createBenefitNewsAction(formData: FormData) {
  await requireRole(["admin"]);
  const badgeLabel = (formData.get("badge_label")?.toString() ?? "").trim();
  const title = (formData.get("title")?.toString() ?? "").trim();
  const body = (formData.get("body")?.toString() ?? "").trim();
  const sortOrderRaw = Number(formData.get("sort_order")?.toString() ?? "0");
  const sortOrder = Number.isFinite(sortOrderRaw) ? Math.round(sortOrderRaw) : 0;
  if (!title || !body) return;

  await supabaseAdmin.from("benefit_news").insert({
    badge_label: badgeLabel,
    title,
    body,
    sort_order: sortOrder,
    is_active: true,
  });

  revalidateAdminTree();
  revalidatePath("/benefits");
}

export async function updateBenefitNewsAction(formData: FormData) {
  await requireRole(["admin"]);
  const id = formData.get("id")?.toString();
  if (!id) return;

  const badgeLabel = (formData.get("badge_label")?.toString() ?? "").trim();
  const title = (formData.get("title")?.toString() ?? "").trim();
  const body = (formData.get("body")?.toString() ?? "").trim();
  const sortOrderRaw = Number(formData.get("sort_order")?.toString() ?? "0");
  const sortOrder = Number.isFinite(sortOrderRaw) ? Math.round(sortOrderRaw) : 0;
  const isActive = formData.get("is_active")?.toString() === "true";
  if (!title || !body) return;

  await supabaseAdmin
    .from("benefit_news")
    .update({
      badge_label: badgeLabel,
      title,
      body,
      sort_order: sortOrder,
      is_active: isActive,
    })
    .eq("id", id);

  revalidateAdminTree();
  revalidatePath("/benefits");
}

export async function deleteBenefitNewsAction(formData: FormData) {
  await requireRole(["admin"]);
  const id = formData.get("id")?.toString();
  if (!id) return;

  await supabaseAdmin.from("benefit_news").delete().eq("id", id);
  revalidateAdminTree();
  revalidatePath("/benefits");
}
