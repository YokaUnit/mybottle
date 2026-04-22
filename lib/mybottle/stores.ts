import { Store } from "@/lib/mybottle/types";

export const stores: Store[] = [
  {
    id: "chigasaki-a",
    name: "Bar Wave Chigasaki",
    area: "茅ヶ崎駅南口",
    weatherBoost: true,
    lat: 35.3304,
    lng: 139.4062,
  },
  {
    id: "chigasaki-b",
    name: "Shonan Tap Stand",
    area: "サザン通り",
    weatherBoost: false,
    lat: 35.3291,
    lng: 139.4044,
  },
  {
    id: "chigasaki-c",
    name: "Night Harbor",
    area: "鉄砲通り",
    weatherBoost: true,
    lat: 35.3331,
    lng: 139.4016,
  },
];
