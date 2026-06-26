import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { StoreBenefit, StoreManageSettings, StoreProductManage, StorePurchasePin } from "@/lib/store-manage/types";

type StoreProductRow = {
  id: string;
  store_id: string;
  product_id: string;
  regular_price_jpy: number;
  current_price_jpy: number;
  min_purchase_sets: number;
  max_purchase_sets: number | null;
  validity_days: number;
  is_selling: boolean;
  is_sold_out: boolean;
  is_active: boolean;
  products: {
    name: string;
    category: string;
    unit_label: string;
    bundle_size: number;
    type: "virtual" | "physical";
  } | {
    name: string;
    category: string;
    unit_label: string;
    bundle_size: number;
    type: "virtual" | "physical";
  }[] | null;
};

function mapStoreProduct(row: StoreProductRow): StoreProductManage | null {
  const product = Array.isArray(row.products) ? row.products[0] : row.products;
  if (!product) return null;
  return {
    id: row.id,
    storeId: row.store_id,
    productId: row.product_id,
    productName: product.name,
    category: product.category,
    unitLabel: product.unit_label,
    bundleSize: product.bundle_size,
    type: product.type,
    regularPriceJpy: row.regular_price_jpy,
    mybottlePriceJpy: row.current_price_jpy,
    minPurchaseSets: row.min_purchase_sets,
    maxPurchaseSets: row.max_purchase_sets,
    validityDays: row.validity_days,
    isSelling: row.is_selling,
    isSoldOut: row.is_sold_out,
    isActive: row.is_active,
  };
}

export const getStoreProductsForManage = cache(async (storeId: string): Promise<StoreProductManage[]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("store_products")
    .select(
      "id,store_id,product_id,regular_price_jpy,current_price_jpy,min_purchase_sets,max_purchase_sets,validity_days,is_selling,is_sold_out,is_active,products!inner(name,category,unit_label,bundle_size,type)",
    )
    .eq("store_id", storeId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[getStoreProductsForManage]", error.message);
    return [];
  }

  return (data ?? []).flatMap((row) => {
    const mapped = mapStoreProduct(row as StoreProductRow);
    return mapped ? [mapped] : [];
  });
});

export const getStoreBenefits = cache(async (storeId: string, activeOnly = false): Promise<StoreBenefit[]> => {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("store_benefits")
    .select("id,store_id,title,description,benefit_kind,reward_type,reward_value,conditions,is_active,sort_order")
    .eq("store_id", storeId)
    .order("sort_order", { ascending: false })
    .order("created_at", { ascending: false });

  if (activeOnly) query = query.eq("is_active", true);

  const { data, error } = await query;
  if (error) {
    console.error("[getStoreBenefits]", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id as string,
    storeId: row.store_id as string,
    title: row.title as string,
    description: row.description as string,
    benefitKind: row.benefit_kind as StoreBenefit["benefitKind"],
    rewardType: row.reward_type as StoreBenefit["rewardType"],
    rewardValue: row.reward_value as number,
    conditions: (row.conditions as Record<string, unknown>) ?? {},
    isActive: row.is_active as boolean,
    sortOrder: row.sort_order as number,
  }));
});

export const getStorePurchasePin = cache(async (storeId: string): Promise<StorePurchasePin | null> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("store_staff_pins")
    .select("id,store_id,pin_code,is_active")
    .eq("store_id", storeId)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("[getStorePurchasePin]", error.message);
    return null;
  }

  if (!data) return null;

  return {
    id: data.id as string,
    storeId: data.store_id as string,
    pinCode: data.pin_code as string,
    isActive: data.is_active as boolean,
  };
});

export const getStoreManageSettings = cache(async (storeId: string): Promise<StoreManageSettings | null> => {
  const supabase = await createSupabaseServerClient();
  const [{ data: store }, { data: meta }] = await Promise.all([
    supabase.from("stores").select("id,name,area,phone,address,regular_holiday").eq("id", storeId).maybeSingle(),
    supabase.from("store_ui_meta").select("intro,open_hours").eq("store_id", storeId).maybeSingle(),
  ]);

  if (!store) return null;

  return {
    id: store.id as string,
    name: store.name as string,
    area: store.area as string,
    phone: (store.phone as string | null) ?? null,
    address: (store.address as string | null) ?? null,
    regularHoliday: (store.regular_holiday as string | null) ?? null,
    openHours: (meta?.open_hours as string) ?? "",
    intro: (meta?.intro as string) ?? "",
  };
});

export type StoreDashboardMetrics = {
  activeBottles: number;
  monthlyUses: number;
  monthlySalesJpy: number;
};

export async function getPublicStoreBenefits(): Promise<(StoreBenefit & { storeName: string })[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("store_benefits")
    .select("id,store_id,title,description,benefit_kind,reward_type,reward_value,conditions,is_active,sort_order,stores(name)")
    .eq("is_active", true)
    .order("sort_order", { ascending: false });

  if (error) {
    console.error("[getPublicStoreBenefits]", error.message);
    return [];
  }

  return (data ?? []).map((row) => {
    const store = (row as { stores?: { name: string } | { name: string }[] | null }).stores;
    const storeName = Array.isArray(store) ? store[0]?.name : store?.name;
    return {
      id: row.id as string,
      storeId: row.store_id as string,
      title: row.title as string,
      description: row.description as string,
      benefitKind: row.benefit_kind as StoreBenefit["benefitKind"],
      rewardType: row.reward_type as StoreBenefit["rewardType"],
      rewardValue: row.reward_value as number,
      conditions: (row.conditions as Record<string, unknown>) ?? {},
      isActive: row.is_active as boolean,
      sortOrder: row.sort_order as number,
      storeName: storeName ?? "加盟店",
    };
  });
}

export async function getStoreDashboardMetrics(storeId: string): Promise<StoreDashboardMetrics> {
  const supabase = await createSupabaseServerClient();
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [{ count: activeBottles }, { data: events }] = await Promise.all([
    supabase
      .from("user_stock")
      .select("id", { count: "exact", head: true })
      .eq("store_id", storeId)
      .gt("remaining_units", 0),
    supabase
      .from("stock_events")
      .select("action,units,detail,created_at")
      .eq("store_id", storeId)
      .gte("created_at", monthStart.toISOString()),
  ]);

  const monthlyUses = (events ?? []).filter((e) => e.action === "consume" || e.action === "gift").length;
  const monthlySalesJpy = (events ?? [])
    .filter((e) => e.action === "purchase")
    .reduce((sum, e) => {
      const match = String(e.detail ?? "").match(/(\d[\d,]*)円/);
      if (!match) return sum;
      return sum + Number(match[1].replace(/,/g, ""));
    }, 0);

  return {
    activeBottles: activeBottles ?? 0,
    monthlyUses,
    monthlySalesJpy,
  };
}
