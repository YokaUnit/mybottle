import type { MetadataRoute } from "next";
import { stores } from "@/lib/mybottle/stores";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mybottle.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/login",
    "/history",
    "/stores",
    "/benefits",
    "/mypage",
    "/add-bottle",
    "/products/step-1",
    "/products/step-2",
    "/products/step-3",
    "/products/step-4",
    "/consume/step-1",
    "/consume/step-2",
    "/consume/step-3",
    "/consume/step-4",
    "/dashboard",
  ];

  const routes: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const storeRoutes: MetadataRoute.Sitemap = stores.map((store) => ({
    url: `${siteUrl}/stores/${store.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...routes, ...storeRoutes];
}
