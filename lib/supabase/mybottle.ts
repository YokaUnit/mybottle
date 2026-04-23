import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Product, ProductType, Store } from "@/lib/mybottle/types";

export type StoreUiMeta = {
  imageSrc: string;
  intro: string;
  features: string[];
  openHours: string;
};

export type MasterData = {
  stores: Store[];
  products: Product[];
  storeUiById: Record<string, StoreUiMeta>;
};

export type BenefitNewsItem = {
  id: string;
  badgeLabel: string;
  title: string;
  body: string;
  sortOrder: number;
};

type BenefitNewsRow = {
  id: string;
  badge_label: string;
  title: string;
  body: string;
  sort_order: number;
};

function mapBenefitNews(row: BenefitNewsRow): BenefitNewsItem {
  return {
    id: row.id,
    badgeLabel: row.badge_label,
    title: row.title,
    body: row.body,
    sortOrder: row.sort_order,
  };
}

export const getBenefitNews = cache(async (): Promise<BenefitNewsItem[]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("benefit_news")
    .select("id,badge_label,title,body,sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: false });

  if (error) {
    console.error("[getBenefitNews] query failed:", error.message);
    return [];
  }

  return (data ?? []).map((row) => mapBenefitNews(row as BenefitNewsRow));
});

export type StoreDetailData = {
  store: Store | null;
  meta: StoreUiMeta | null;
  heroProducts: Product[];
};

type StoreRow = {
  id: string;
  name: string;
  area: string;
  weather_boost: boolean;
  lat: number;
  lng: number;
  is_active: boolean;
};

type ProductRow = {
  id: string;
  name: string;
  type: ProductType;
  category: string;
  unit_label: string;
  bundle_size: number;
  price_jpy: number;
  description: string;
  image_path: string | null;
  is_active: boolean;
};

type StoreProductJoinedRow = {
  current_price_jpy: number;
  products: ProductRow | ProductRow[] | null;
};

type StoreUiRow = {
  store_id: string;
  image_src: string;
  intro: string;
  features: unknown;
  open_hours: string;
};

function mapStore(row: StoreRow): Store {
  return {
    id: row.id,
    name: row.name,
    area: row.area,
    weatherBoost: row.weather_boost,
    lat: row.lat,
    lng: row.lng,
  };
}

function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    category: row.category,
    unitLabel: row.unit_label,
    bundleSize: row.bundle_size,
    priceJpy: row.price_jpy,
    description: row.description,
    imagePath: row.image_path,
  };
}

function mapStoreUi(row: StoreUiRow): StoreUiMeta {
  return {
    imageSrc: row.image_src,
    intro: row.intro,
    features: Array.isArray(row.features) ? row.features.filter((v): v is string => typeof v === "string") : [],
    openHours: row.open_hours,
  };
}

export const getMasterData = cache(async (): Promise<MasterData> => {
  const supabase = await createSupabaseServerClient();
  const [{ data: storesData }, { data: productsData }, { data: storeUiData }] = await Promise.all([
    supabase.from("stores").select("*").eq("is_active", true).order("name"),
    supabase.from("products").select("*").eq("is_active", true).order("price_jpy"),
    supabase.from("store_ui_meta").select("*"),
  ]);

  const stores = (storesData ?? []).map((row) => mapStore(row as StoreRow));
  const products = (productsData ?? []).map((row) => mapProduct(row as ProductRow));
  const storeUiById = Object.fromEntries(
    (storeUiData ?? []).map((row) => {
      const typed = row as StoreUiRow;
      return [typed.store_id, mapStoreUi(typed)];
    }),
  );

  return { stores, products, storeUiById };
});

export const getStoreDetailById = cache(async (storeId: string): Promise<StoreDetailData> => {
  const supabase = await createSupabaseServerClient();
  const [storeRes, storeUiRes, productsRes] = await Promise.all([
    supabase.from("stores").select("*").eq("id", storeId).eq("is_active", true).maybeSingle(),
    supabase.from("store_ui_meta").select("*").eq("store_id", storeId).maybeSingle(),
    supabase
      .from("store_products")
      .select("current_price_jpy,products!inner(id,name,type,category,unit_label,bundle_size,price_jpy,description,is_active)")
      .eq("store_id", storeId)
      .eq("is_active", true)
      .order("current_price_jpy")
      .limit(3),
  ]);

  if (storeRes.error) {
    console.error("[getStoreDetailById] stores query failed:", storeRes.error.message);
  }
  if (storeUiRes.error) {
    console.error("[getStoreDetailById] store_ui_meta query failed:", storeUiRes.error.message);
  }
  if (productsRes.error) {
    console.error("[getStoreDetailById] store_products query failed:", productsRes.error.message);
  }

  const heroProducts: Product[] = (productsRes.data ?? []).flatMap((row) => {
    const typed = row as StoreProductJoinedRow;
    const productRaw = Array.isArray(typed.products) ? typed.products[0] : typed.products;
    if (!productRaw) return [];
    return [
      mapProduct({
        ...productRaw,
        price_jpy: typed.current_price_jpy,
      }),
    ];
  });

  return {
    store: storeRes.data ? mapStore(storeRes.data as StoreRow) : null,
    meta: storeUiRes.data ? mapStoreUi(storeUiRes.data as StoreUiRow) : null,
    heroProducts,
  };
});

export async function getProductType(productId: string): Promise<ProductType> {
  const data = await getMasterData();
  return data.products.find((item) => item.id === productId)?.type ?? "physical";
}
