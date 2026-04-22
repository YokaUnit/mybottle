export type StoreUiMeta = {
  imageSrc: string;
  intro: string;
  features: string[];
  openHours: string;
};

export const storeUiById: Record<string, StoreUiMeta> = {
  "chigasaki-a": {
    imageSrc: "/store/test1.png",
    intro: "駅南口すぐ。初めてでも入りやすい落ち着いたカウンターバー。",
    features: ["デジタル提示対応", "1杯ギフトに強い", "雨の日特典あり"],
    openHours: "18:00 - 01:00",
  },
  "chigasaki-b": {
    imageSrc: "/store/test2.png",
    intro: "サザン通りのカジュアルスタンド。短時間の1杯利用にも最適。",
    features: ["回転が早い", "サワー系に強い", "友達同士に人気"],
    openHours: "17:00 - 00:00",
  },
  "chigasaki-c": {
    imageSrc: "/store/test3.png",
    intro: "夜景が見える港寄りの店舗。ボトルキープ文化と相性抜群。",
    features: ["静かな雰囲気", "ボトル管理が丁寧", "ウイスキーに強い"],
    openHours: "19:00 - 02:00",
  },
};
