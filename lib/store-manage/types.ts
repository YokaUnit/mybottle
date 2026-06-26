export type BenefitKind =
  | "first_visit_discount"
  | "visit_milestone"
  | "birthday"
  | "rainy_day"
  | "weekday_only"
  | "time_window"
  | "female_only"
  | "student_only"
  | "custom";

export type RewardType = "amount_off" | "percent_off" | "free_drink";

export type StoreBenefit = {
  id: string;
  storeId: string;
  title: string;
  description: string;
  benefitKind: BenefitKind;
  rewardType: RewardType;
  rewardValue: number;
  conditions: Record<string, unknown>;
  isActive: boolean;
  sortOrder: number;
};

export type StoreProductManage = {
  id: string;
  storeId: string;
  productId: string;
  productName: string;
  category: string;
  unitLabel: string;
  bundleSize: number;
  type: "virtual" | "physical";
  regularPriceJpy: number;
  mybottlePriceJpy: number;
  minPurchaseSets: number;
  maxPurchaseSets: number | null;
  validityDays: number;
  isSelling: boolean;
  isSoldOut: boolean;
  isActive: boolean;
};

export type StorePurchasePin = {
  id: string;
  storeId: string;
  pinCode: string;
  isActive: boolean;
};

export type StoreManageSettings = {
  id: string;
  name: string;
  area: string;
  phone: string | null;
  address: string | null;
  regularHoliday: string | null;
  openHours: string;
  intro: string;
};

export const BENEFIT_KIND_LABELS: Record<BenefitKind, string> = {
  first_visit_discount: "初回割引",
  visit_milestone: "来店回数特典",
  birthday: "誕生日クーポン",
  rainy_day: "雨の日特典",
  weekday_only: "平日限定",
  time_window: "時間帯限定",
  female_only: "女性限定",
  student_only: "学生限定",
  custom: "カスタム",
};

export const BENEFIT_KIND_PRESETS: {
  kind: BenefitKind;
  title: string;
  rewardType: RewardType;
  rewardValue: number;
  conditions: Record<string, unknown>;
}[] = [
  { kind: "first_visit_discount", title: "初回100円OFF", rewardType: "amount_off", rewardValue: 100, conditions: {} },
  { kind: "visit_milestone", title: "10回来店で1杯無料", rewardType: "free_drink", rewardValue: 1, conditions: { visit_count: 10 } },
  { kind: "birthday", title: "誕生日クーポン", rewardType: "free_drink", rewardValue: 1, conditions: {} },
  { kind: "rainy_day", title: "雨の日100円OFF", rewardType: "amount_off", rewardValue: 100, conditions: { requires_rain: true } },
  { kind: "weekday_only", title: "平日限定", rewardType: "amount_off", rewardValue: 100, conditions: { weekdays: [1, 2, 3, 4, 5] } },
  { kind: "time_window", title: "18〜20時限定", rewardType: "amount_off", rewardValue: 100, conditions: { time_start: "18:00", time_end: "20:00" } },
  { kind: "female_only", title: "女性限定", rewardType: "amount_off", rewardValue: 100, conditions: { audience: "female" } },
  { kind: "student_only", title: "学生限定", rewardType: "amount_off", rewardValue: 100, conditions: { audience: "student" } },
];
