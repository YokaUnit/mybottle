export type ProductType = "virtual" | "physical";
export type PaymentMethod = "apple_pay" | "card";
export type ActionType = "purchase" | "consume" | "gift" | "transfer" | "remove" | "update";

export type Product = {
  id: string;
  name: string;
  type: ProductType;
  category: string;
  unitLabel: string;
  bundleSize: number;
  priceJpy: number;
  description: string;
  imagePath?: string | null;
};

export type Store = {
  id: string;
  name: string;
  area: string;
  weatherBoost: boolean;
  lat: number;
  lng: number;
};

export type StockItem = {
  storeId: string;
  productId: string;
  productName: string;
  type: ProductType;
  remainingUnits: number;
  unitLabel: string;
  updatedAt: string;
};

export type ActivityLog = {
  id: string;
  action: ActionType;
  storeId: string;
  productId: string;
  productName: string;
  units: number;
  unitLabel: string;
  detail: string;
  createdAt: string;
};
