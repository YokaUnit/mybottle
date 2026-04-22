import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "mybottle",
    short_name: "mybottle",
    description:
      "mybottleは、店舗のボトルキープをスマホで管理・提示できるデジタルボトルキープサービスです。",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1e3a2f",
    icons: [
      {
        src: "/images/favicon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/favicon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
