import type { Product, ProductType } from "@/lib/mybottle/types";

export const catalog: Product[] = [  {
    id: "beer-5",
    name: "生ビール（ジョッキ）",
    type: "virtual",
    category: "ビール",
    unitLabel: "杯",
    bundleSize: 5,
    priceJpy: 3000,
    description: "ジョッキ1杯分を1ユニットとした5杯セット。友達へのギフトにも対応。",
  },
  {
    id: "sour-5",
    name: "レモンサワー",
    type: "virtual",
    category: "サワー",
    unitLabel: "杯",
    bundleSize: 5,
    priceJpy: 2500,
    description: "ハシゴ酒向けの定番セット。まとめ買いで都度会計を削減。",
  },
  {
    id: "kagetsu-1",
    name: "鏡月 1本キープ",
    type: "physical",
    category: "焼酎ボトル",
    unitLabel: "本",
    bundleSize: 1,
    priceJpy: 3500,
    description: "実物ボトルの在庫をデジタルで管理する基本プラン。",
  },
  {
    id: "whisky-1",
    name: "角瓶 1本キープ",
    type: "physical",
    category: "ウイスキー",
    unitLabel: "本",
    bundleSize: 1,
    priceJpy: 5200,
    description:
      "角瓶タイプのハウスウイスキーを1本単位でキープ。ストレート・水割り・ロックなどの飲み方は店舗の提供ルールに従います（アプリ上は「1本」の在庫として管理）。",
  },
];

export function getProductType(productId: string): ProductType {
  return catalog.find((p) => p.id === productId)?.type ?? "physical";
}