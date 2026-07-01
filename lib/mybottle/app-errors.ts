import type { LucideIcon } from "lucide-react";
import {
  Construction,
  MapPinOff,
  PackageX,
  SearchX,
  WifiOff,
} from "lucide-react";

export type AppErrorVariant =
  | "not-found"
  | "maintenance"
  | "network"
  | "store-unavailable"
  | "product-unavailable";

export type AppErrorAction = {
  label: string;
  href: string;
  primary?: boolean;
};

export type AppErrorConfig = {
  code: string;
  title: string;
  description: string;
  Icon: LucideIcon;
  tone: "teal" | "amber" | "rose" | "slate";
  actions: AppErrorAction[];
};

const HOME: AppErrorAction = { label: "ホームへ", href: "/", primary: true };
const STORES: AppErrorAction = { label: "店舗一覧へ", href: "/stores", primary: true };
const RETRY: AppErrorAction = { label: "もう一度試す", href: "/", primary: true };

export function getAppErrorConfig(
  variant: AppErrorVariant,
  context?: { storeName?: string; productName?: string; storeId?: string },
): AppErrorConfig {
  switch (variant) {
    case "not-found":
      return {
        code: "404",
        title: "ページが見つかりません",
        description: "URLが変わったか、削除された可能性があります。ホームからやり直してください。",
        Icon: SearchX,
        tone: "slate",
        actions: [HOME, { label: "店舗を探す", href: "/stores" }],
      };
    case "maintenance":
      return {
        code: "MAINTENANCE",
        title: "メンテナンス中です",
        description: "現在、サービスを一時停止しています。しばらくしてから再度アクセスしてください。",
        Icon: Construction,
        tone: "amber",
        actions: [{ label: "再読み込み", href: "/", primary: true }],
      };
    case "network":
      return {
        code: "NETWORK",
        title: "通信できませんでした",
        description: "インターネット接続を確認して、もう一度お試しください。",
        Icon: WifiOff,
        tone: "slate",
        actions: [RETRY, { label: "店舗一覧へ", href: "/stores" }],
      };
    case "store-unavailable":
      return {
        code: "STORE",
        title: "この店舗は現在ご利用いただけません",
        description: context?.storeName
          ? `「${context.storeName}」は一時的に公開を停止しています。別の店舗をお探しください。`
          : "店舗の公開が停止されています。別の店舗をお探しください。",
        Icon: MapPinOff,
        tone: "amber",
        actions: [STORES, HOME],
      };
    case "product-unavailable":
      return {
        code: "PRODUCT",
        title: "このボトルは現在購入できません",
        description: context?.productName
          ? `「${context.productName}」は販売停止または在庫切れのため、今は選べません。`
          : "販売停止または在庫切れのため、今は購入できません。",
        Icon: PackageX,
        tone: "rose",
        actions: [
          {
            label: "ボトル一覧へ",
            href: context?.storeId ? `/products/step-2?storeId=${context.storeId}` : "/products/step-1",
            primary: true,
          },
          STORES,
        ],
      };
  }
}

export const TONE_STYLES = {
  teal: {
    iconBg: "bg-gradient-to-br from-[#ecfdf5] to-[#d1faf0]",
    iconText: "text-[#0d9488]",
    ring: "ring-[#99f6e4]/40",
    code: "text-[#0d9488]",
  },
  amber: {
    iconBg: "bg-gradient-to-br from-[#fffbeb] to-[#fef3c7]",
    iconText: "text-[#b45309]",
    ring: "ring-[#fde68a]/50",
    code: "text-[#b45309]",
  },
  rose: {
    iconBg: "bg-gradient-to-br from-[#fff1f2] to-[#ffe4e6]",
    iconText: "text-[#e11d48]",
    ring: "ring-[#fecdd3]/50",
    code: "text-[#e11d48]",
  },
  slate: {
    iconBg: "bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9]",
    iconText: "text-[#64748b]",
    ring: "ring-[#e2e8f0]",
    code: "text-[#64748b]",
  },
} as const;
