import { env } from "@/lib/env";

const PRODUCT_IMAGE_BUCKET = "product-images";

function encodeStoragePath(path: string): string {
  return path
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

/**
 * Supabase Storage の render エンドポイントを使い、
 * 表示サイズに合わせて配信することで egress を抑える。
 */
export function getProductImageUrl(imagePath: string, width = 320): string {
  const encodedPath = encodeStoragePath(imagePath);
  const base = `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/render/image/public/${PRODUCT_IMAGE_BUCKET}/${encodedPath}`;
  const params = new URLSearchParams({
    width: String(width),
    quality: "78",
    format: "webp",
  });
  return `${base}?${params.toString()}`;
}

/**
 * render/image が環境依存で失敗するケース向けのフォールバックURL。
 */
export function getProductImageObjectUrl(imagePath: string): string {
  const encodedPath = encodeStoragePath(imagePath);
  return `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${PRODUCT_IMAGE_BUCKET}/${encodedPath}`;
}
