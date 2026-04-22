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
  is_active: boolean;
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

export async function getProductType(productId: string): Promise<ProductType> {
  const data = await getMasterData();
  return data.products.find((item) => item.id === productId)?.type ?? "physical";
}
