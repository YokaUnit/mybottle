import type { Metadata } from "next";
import { StoreLpClient } from "@/components/mybottle/store-lp/store-lp-client";

export const metadata: Metadata = {
  title: "加盟店のご案内",
  description:
    "mybottleはボトルキープの管理をカンタンにし、来店・リピート・売上向上につなげる店舗向けサービスです。初期費用0円、月額4,980円（税込）。",
  robots: { index: true, follow: true },
  openGraph: {
    title: "mybottle 加盟店のご案内",
    description: "ボトルキープの管理を、もっとカンタンに。もっと売上につなげる。",
  },
};

export default function StaffLandingPage() {
  return <StoreLpClient />;
}
